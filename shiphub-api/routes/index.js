import express from 'express';

import orderRoutes from './order.routes.js';
import shipmentRoutes from './shipment.route.js';

const app = express();

app.use(express.json());

// Order routes
app.use('/orders', orderRoutes);

// Shipment routes
app.use('/orders', shipmentRoutes);


export default app;