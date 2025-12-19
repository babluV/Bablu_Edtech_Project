import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    const poolConfig: any = {
      connectionString: process.env.DATABASE_URL,
    };

    // Add SSL configuration if DATABASE_URL is provided (typically needed for cloud databases)
    if (process.env.DATABASE_URL) {
      poolConfig.ssl = {
        rejectUnauthorized: false,
      };
    }

    pool = new Pool(poolConfig);

    // Test the connection
    pool.on('connect', () => {
      console.log('Connected to PostgreSQL database');
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  return pool;
}

