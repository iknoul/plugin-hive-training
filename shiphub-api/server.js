//## Day two
import express from 'express';
import cors from 'cors';
import { getAllOrders, getOrderById, createOrder, updateOrder } from './order-store.js'; 
import { isValidObject, isValidString, isValidOrderId, isValidPatchFields, isValidStatus } from './libs/validation.js';


const app = express();         
app.use(cors());                
app.use(express.json());        

app.get('/orders', (req, res) => {
  const filters = { status: req.query.status};
  const orders = getAllOrders(filters);
  res.status(200).json({success: true, count: orders.length, data: orders });
});


app.get('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const order = getOrderById(orderId);
 
  if (!order) {
    return res.status(404).json({            // 'return' stops the handler
      error: 'Order not found',
      details: 'No order exists with ID ' + orderId,
    });
  }
  res.status(200).json({success: true, data: order });
});


app.post('/orders', (req, res) => {
  if (!isValidObject(req.body)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  const { customer, product } = req.body;
  if (!customer || !product) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!isValidString(customer) || !isValidString(product)) {
    return res.status(400).json({ error: 'Invalid field types' });
  }
  const order = createOrder(customer.trim(), product.trim());
  res.status(201).json({success: true, data: order });
});

app.patch('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const updates = req.body;

  if(!isValidOrderId(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID format' });
  }
  if (!isValidObject(updates)) { //
    return res.status(400).json({ error: 'Invalid request body' });
  }

  if (!isValidPatchFields(updates)) {  // Reject unknown fields
    return res.status(400).json({ error: 'Invalid fields in request body' });
  }

  if(updates.status && !isValidStatus(updates.status)) {
    return res.status(400).json({error: 'Invalid Status'})
  }

  const updatedOrder = updateOrder(orderId, updates);
  if (!updatedOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.status(200).json({success: true, data: updatedOrder });

}) 

// JSON body, but no Content-Type header
app.get('/test/no-content-type', (req, res) => {
  res.status(200).end(JSON.stringify({ success: true, data: [] }));
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'ShipHub API is running' });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Malformed JSON in request body' });
  }
  next(err);
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} does not exist`
  });
});
 
const PORT = 3000;
app.listen(PORT, () => {        // start accepting requests
  console.log('ShipHub API running at http://localhost:' + PORT);
});
