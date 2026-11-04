//## Day two
import express from 'express';
import cors from 'cors';
import {config} from './config.js';
import { logger } from './libs/logger.js';
import { requestLogger } from './middleware/request-logging.js';
import { getAllOrders, getOrderById, createOrder, updateOrder } from './order-store.js'; 
import { isValidObject, isValidString, isValidOrderId, isValidPatchFields, isValidStatus } from './libs/validation.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { HttpError } from './libs/http-error.js';

const app = express();

app.use(requestLogger);  // Register the common middleware globally       
app.use(cors());                
app.use(express.json());        

app.get('/orders', (req, res) => {
  const filters = { status: req.query.status, searchQuery: req.query.search };
  const orders = getAllOrders(filters);
  res.status(200).json({success: true, count: orders.length, data: orders });
});


app.get('/orders/:id', (req, res, next) => {
  const orderId = req.params.id;
  const order = getOrderById(orderId);
 
  if (!order) {
    logger.debug(`Error with finding this order${orderId} with type ${typeof orderId}`)
    return next(new HttpError(404, 'Order not found' ));
  }

  res.status(200).json({success: true, data: order });
});


app.post('/orders', (req, res, next) => {
  if (!isValidObject(req.body)) {
    return next(new HttpError(400, 'Invalid request body' ));
  }
  const { customer, product } = req.body;
  if (!customer || !product) {
    return next(new HttpError(400, 'Missing required fields' ));
  }
  if (!isValidString(customer) || !isValidString(product)) {
    return next(new HttpError(400, 'Invalid field types' ));
  }
  const order = createOrder(customer.trim(), product.trim());
  res.status(201).json({success: true, data: order });
});

app.patch('/orders/:id', (req, res,next) => {
  const orderId = req.params.id;
  const updates = req.body;

  if(!isValidOrderId(orderId)) {
    return next(new HttpError(400, 'Invalid order ID format' ));
  }
  if (!isValidObject(updates)) { 
    return next(new HttpError(400, 'Invalid request body' ));
  }

  if (!isValidPatchFields(updates)) {  // Reject unknown fields
    return next(new HttpError(400, 'Invalid order ID format' ));

  }

  if(updates.status && !isValidStatus(updates.status)) {
    return next(new HttpError(400, 'Invalid Status' ));

  }

  const updatedOrder = updateOrder(orderId, updates);

  if (!updatedOrder) {
    return next(new HttpError(404, 'Order not found' ));
  }

  res.status(200).json({success: true, data: updatedOrder });

}) 

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'ShipHub API is Healthy' });
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'ShipHub API is running' });
});

// Catch-all for unknown routes
app.use(notFound);

// CENTRAL ERROR HANDLER
app.use(errorHandler);
 
const server = app.listen(config.port, () => {        // start accepting requests
  logger.info('ShipHub API running at http://localhost:' + config.port);
});

//Handle server listen errors with a non-zero exit.
server.on('error', (err) => {
  logger.error('Server failed to start, Exiting with code 1')

  process.exit(1)
})