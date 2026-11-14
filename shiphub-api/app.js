
import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/request-logging.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import routes from './routes/index.js';

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'ShipHub API is Healthy' });
});

app.get('/', (req, res) => {
    res.json({ success: true, message: 'ShipHub API is running' });
});

// API routes
app.use('/', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
