import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema.ts';

const { Pool } = pkg;

export const createPool = () => {
  const connectionString = process.env.DATABASE_URL;
  const host = process.env.SQL_HOST;
  const user = process.env.SQL_USER;
  const password = process.env.SQL_PASSWORD;
  const database = process.env.SQL_DB_NAME;

  if (connectionString) {
    return new Pool({
      connectionString,
      connectionTimeoutMillis: 15000,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  }

  if (!host || !user || !password || !database) {
    console.warn('Database environment variables are not fully configured. Database connection is deferred.');
  }

  return new Pool({
    host: host || 'localhost',
    user: user || 'postgres',
    password: password || 'postgres',
    database: database || 'studycal',
    connectionTimeoutMillis: 15000,
  });
};

const pool = createPool();

pool.on('error', (err) => {
  console.error('Unexpected error on idle SQL pool client:', err);
});

export const db = drizzle(pool, { schema });
export { schema };
