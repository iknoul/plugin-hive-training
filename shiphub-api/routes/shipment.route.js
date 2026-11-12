
import { Router } from 'express';
import { logger } from '../libs/logger.js';
import { HttpError } from '../libs/http-error.js';

import { getOrderById } from '../stores/order-store.js';

import {
  createShipment,
  getShipmentsByOrderId,
  getIdempotencyRecord,
  storeIdempotencyRecord
} from '../stores/shipment-store.js';

import {  validateNewShipment } from '../libs/validation.js';
import { paginate } from '../libs/pagination.js';

const shipmentRoutes = Router();

// Create shipment
shipmentRoutes.post('/:id/shipments', (req, res, next) => {
  try {
    const orderId = req.params.id;

    // Check whether the order exists
    const order = getOrderById(orderId);

    if (!order) {
      return next(new HttpError(404, 'Order not found'));
    }

    // Validate shipment data
    const validation = validateNewShipment(req.body);

    if (!validation.isValid) {
      const error = new HttpError(400, 'Shipment validation failed');
      error.details = 'One or more shipment fields are invalid';
      error.fields = validation.errors;

      return next(error);
    }

    const shipmentData = {
      carrier: req.body.carrier.trim(),
      trackingNumber: req.body.trackingNumber.trim()
    };

    // Read optional idempotency key
    const idempotencyKey = req.get('Idempotency-Key');

    if (idempotencyKey) {
      // Scope the key to the order
      const key = `${orderId}:${idempotencyKey}`;

      const existingRecord = getIdempotencyRecord(key);

      if (existingRecord) {
        const sameRequest =
          existingRecord.requestBody.carrier === shipmentData.carrier &&
          existingRecord.requestBody.trackingNumber === shipmentData.trackingNumber;

        if (!sameRequest) {
          return next(
            new HttpError(
              422,
              'Idempotency key reused with different request data'
            )
          );
        }

        // Replay original response
        res.set('Idempotency-Replayed', 'true');
        res.set('Location', existingRecord.location);

        return res
          .status(existingRecord.status)
          .json(existingRecord.body);
      }
    }

    // Create shipment
    const shipment = createShipment(orderId, shipmentData);

    const location = `/orders/${orderId}/shipments/${shipment.id}`;

    const responseBody = {
      success: true,
      data: shipment
    };

    // Store successful response for future retries
    if (idempotencyKey) {
      const key = `${orderId}:${idempotencyKey}`;

      storeIdempotencyRecord({
        key,
        data: {
          requestBody: shipmentData,
          status: 201,
          body: responseBody,
          location
        }
      });
    }

    res.set('Location', location);

    if (idempotencyKey) {
      res.set('Idempotency-Replayed', 'false');
    }

    return res.status(201).json(responseBody);

  } catch (error) {
    logger.error('Error creating shipment:', error);
    next(error);
  }
});

// Get shipments for an order
shipmentRoutes.get('/:id/shipments', (req, res, next) => {
  try {
    const orderId = req.params.id;

    // Check whether the order exists
    const order = getOrderById(orderId);

    if (!order) {
      return next(new HttpError(404, 'Order not found'));
    }

    // Read pagination parameters
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return next(new HttpError(400, 'Invalid pagination parameters'));
    }

    // Get shipments belonging to this order
    const shipments = getShipmentsByOrderId(orderId);

    // Newest first, then ID descending for equal timestamps
    const sortedShipments = [...shipments].sort((a, b) => {
      const dateDifference =
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime();

      return dateDifference || String(b.id).localeCompare(String(a.id));
    });

    const result = paginate(sortedShipments, page, limit);

    return res.status(200).json(result);

  } catch (error) {
    logger.error('Error retrieving shipments:', error);
    next(error);
  }
});

export default shipmentRoutes;
