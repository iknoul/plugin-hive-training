import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

export const postgresPool = new Pool({
    connectionString: config.postgresUri
});

postgresPool.on('error', (error) => {
    console.error('Unexpected PostgreSQL pool error:', error);
});