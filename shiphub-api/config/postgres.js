import pg from 'pg';

const { Pool } = pg;

export const postgresPool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: Number(process.env.PG_PORT || 5432),
    database: process.env.PG_DATABASE || 'shiphub',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || '1234',

});

postgresPool.on('error', (error) => {
    console.error('Unexpected PostgreSQL pool error:', error);
});