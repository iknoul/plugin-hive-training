
import app from './app.js';
import { config } from './config.js';
import { logger } from './libs/logger.js';

const server = app.listen(config.port, () => {
    logger.info(`ShipHub API running at http://localhost:${config.port}`);
});

server.on('error', (err) => {
    logger.error('Server failed to start:', err);
    process.exit(1);
});
