// src/routes/order.routes.js
import { Router } from 'express';
import { logger } from '../libs/logger.js';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder
} from '../stores/order-store.js';

import {
  isValidObject,
  isValidString,
  isValidOrderId,
  isValidPatchFields,
  isValidStatus
} from '../libs/validation.js';

import { HttpError } from '../libs/http-error.js';

const orderRoutes = Router();

// Get all orders
orderRoutes.get('/', (req, res) => {
  const filters = {
    status: req.query.status,
    searchQuery: req.query.search
  };

  const orders = getAllOrders(filters);

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// Get order by id
orderRoutes.get('/:id', (req, res, next) => {
  const orderId = req.params.id;
  const order = getOrderById(orderId);

  if (!order) {
    logger.debug(`Error finding order ${orderId}`);
    return next(new HttpError(404, 'Order not found'));
  }

  res.status(200).json({ success: true, data: order });
});

// Create new order
orderRoutes.post('/', (req, res, next) => {
  if (!isValidObject(req.body)) {
    return next(new HttpError(400, 'Invalid request body'));
  }

  const { customer, product } = req.body;

  if (!customer || !product) {
    return next(new HttpError(400, 'Missing required fields'));
  }

  if (!isValidString(customer) || !isValidString(product)) {
    return next(new HttpError(400, 'Invalid field types'));
  }

  const order = createOrder(customer.trim(), product.trim());

  res.status(201).json({ success: true, data: order });
});

// Patch an order
orderRoutes.patch('/:id', (req, res, next) => {
  const orderId = req.params.id;
  const updates = req.body;

  
  if (!isValidOrderId(orderId)) {
    return next(new HttpError(400, 'Invalid order ID format'));
  }

  if (!isValidObject(updates)) {
    return next(new HttpError(400, 'Invalid request body'));
  }

  if (!isValidPatchFields(updates)) {
    return next(new HttpError(400, 'Unknown or invalid fields'));
  }

  if (updates.status && !isValidStatus(updates.status)) {
    return next(new HttpError(400, 'Invalid status'));
  }

  const updatedOrder = updateOrder(orderId, updates);

  if (!updatedOrder) {
    return next(new HttpError(404, 'Order not found'));
  }

  res.status(200).json({ success: true, data: updatedOrder });
});

export default orderRoutes;