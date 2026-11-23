import pg from 'pg';
import { config } from './config.js';
import { logger } from '../libs/logger.js';

const { Pool } = pg;

export const postgresPool = new Pool({
    connectionString: config.postgresUri
});

postgresPool.on('error', (error) => {
    logger.error(`Unexpected PostgreSQL pool error:, ${error}`);
});