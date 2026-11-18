
import app from './app.js';
import { config } from './config/config.js';
import { connectDatabase } from './config/mongodb.js';
import { logger } from './libs/logger.js';


async function start() {
    try {
        
        await connectDatabase();

        const server = app.listen(config.port, () => {
            logger.info(`ShipHub API running at http://localhost:${config.port}`);
        });

        server.on('error', (err) => {
            logger.error('Server failed to start:', err);
            process.exit(1);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

await start();
