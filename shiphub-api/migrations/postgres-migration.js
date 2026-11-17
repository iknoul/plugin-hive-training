// scripts/migrate.js
import fs from 'node:fs/promises';
import { postgresPool } from '../config/postgres.js';

const sql = await fs.readFile(new URL('../models/postgres-schemas/schema.sql', import.meta.url), 'utf8');
await postgresPool.query(sql);
console.log('Schema applied');
await postgresPool.end();


