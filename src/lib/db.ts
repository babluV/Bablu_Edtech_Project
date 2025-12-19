import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    // Validate DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL environment variable is not set. " +
        "Please configure it in your deployment platform's environment variables."
      );
    }

    const poolConfig: any = {
      connectionString: process.env.DATABASE_URL,
    };

    // Add SSL configuration for cloud databases (most production databases require SSL)
    // Check if connection string already has SSL parameters
    const connectionString = process.env.DATABASE_URL.toLowerCase();
    const needsSSL = connectionString.includes('sslmode=require') || 
                     connectionString.includes('sslmode=prefer') ||
                     connectionString.includes('amazonaws.com') ||
                     connectionString.includes('neon.tech') ||
                     connectionString.includes('supabase.co') ||
                     connectionString.includes('railway.app') ||
                     connectionString.includes('render.com');

    if (needsSSL || process.env.NODE_ENV === 'production') {
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
      // Don't exit in production, just log the error
      if (process.env.NODE_ENV !== 'production') {
        process.exit(-1);
      }
    });
  }

  return pool;
}

