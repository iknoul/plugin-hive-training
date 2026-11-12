import express from 'express';
import cors from 'cors';
import {config} from './config.js';
import { logger } from './libs/logger.js';
import { requestLogger } from './middleware/request-logging.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import routes from './routes/index.js';


const app = express();

app.use(requestLogger);  // Register the common middleware globally       
app.use(cors());                
app.use(express.json());        

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'ShipHub API is Healthy' });
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'ShipHub API is running' });
});

// All API routes
app.use('/', routes);

// Catch-all for unknown routes
app.use(notFound);

// Central error-handler
app.use(errorHandler);
 
const server = app.listen(config.port, () => { 
  logger.info('ShipHub API running at http://localhost:' + config.port);
});

//Handle server listen errors with a non-zero exit.
server.on('error', (err) => {
  logger.error('Server failed to start, Exiting with code 1')

  process.exit(1)
})