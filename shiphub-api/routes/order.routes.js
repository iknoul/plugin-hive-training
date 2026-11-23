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
  isValidOrderId,
  isValidPatchFields,
  isValidStatus,
  validateNewOrder,
  validatePriorityFilter
} from '../libs/validation.js';

import { HttpError } from '../libs/http-error.js';

const orderRoutes = Router();

// Get all orders
orderRoutes.get('/', async (req, res, next) => {

  const filters = {
    status: req.query.status,
    searchQuery: req.query.search,
    priority: req.query.priority
  };

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const { isValid, error } = validatePriorityFilter(req.query.priority);

  if(!isValid) { return next(new HttpError(400, error))}

  const orders = await getAllOrders({filters, page, limit});

  res.status(200).json({
    success: true,
    ...orders
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
orderRoutes.post('/', async(req, res, next) => {
	if (!isValidObject(req.body)) {
		return next(new HttpError(400, 'Invalid request body'));
	}

	// Validate order data
	const validation = validateNewOrder(req.body);
	
	if (!validation.isValid) {
			const error = new HttpError(400, 'Order validation failed');
			error.details = 'One or more order fields are invalid';
			error.fields = validation.errors;
	
			return next(error);
	}

	const idempotencyKey = req.get('Idempotency-Key');
	
	try {
		const {order, isReplay} = await createOrder(validation.data,  idempotencyKey);

		res.set('Idempotency-Replayed', String(isReplay));
		res.status(201).json({ success: true, data: order });
	} catch (error) {
		next(error)
	}
	
});

// Patch an order
orderRoutes.patch('/:id', async(req, res, next) => {

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


  try {
      const updatedOrder = await updateOrder(orderId, updates);
      if (!updatedOrder) {
      return next(new HttpError(404, 'Order not found'));
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
      return next(new HttpError(500, error.message))
  }

});

export default orderRoutes;