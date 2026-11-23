import fs from 'node:fs/promises';

import { postgresPool } from '../config/postgres.js';
import { logger } from '../libs/logger.js'

const client = await postgresPool.connect();

const schemaFiles = ['../models/pg-schemas/sellers.sql', '../models/pg-schemas/pickups.sql']
try {
  await client.query('BEGIN');
  for (const filePath of schemaFiles) {
    const sql = await fs.readFile(new URL(filePath, import.meta.url), 'utf8');
    await client.query(sql);
    logger.info(`Applied: ${filePath}`);
  }
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}

