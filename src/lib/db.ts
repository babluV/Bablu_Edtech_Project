import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    // Validate DATABASE_URL is set
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error("DATABASE_URL is missing!");
      console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('DB')));
      throw new Error(
        "DATABASE_URL environment variable is not set. " +
        "Please configure it in Netlify: Site settings → Environment variables → Add variable"
      );
    }

    console.log("Initializing database connection...");
    console.log("DATABASE_URL exists:", !!databaseUrl);
    console.log("DATABASE_URL length:", databaseUrl.length);
    console.log("DATABASE_URL starts with:", databaseUrl.substring(0, 10));

    // Parse the connection string to check for SSL mode
    const connectionString = databaseUrl.toLowerCase();
    const hasSSLMode = connectionString.includes('sslmode=');
    
    // If connection string doesn't have sslmode, add it
    let finalConnectionString = databaseUrl;
    if (!hasSSLMode) {
      // Add sslmode=require to the connection string
      const separator = databaseUrl.includes('?') ? '&' : '?';
      finalConnectionString = `${databaseUrl}${separator}sslmode=require`;
      console.log("Added sslmode=require to connection string");
    }

    // Detect cloud databases (Neon, Supabase, etc.) - these ALWAYS require SSL
    const isCloudDatabase = connectionString.includes('amazonaws.com') ||
                            connectionString.includes('neon.tech') ||
                            connectionString.includes('supabase.co') ||
                            connectionString.includes('railway.app') ||
                            connectionString.includes('render.com') ||
                            connectionString.includes('netlify.app') ||
                            connectionString.includes('planetscale.com') ||
                            connectionString.includes('cockroachlabs.com');

    const poolConfig: any = {
      connectionString: finalConnectionString,
      // Optimize for serverless environments (Netlify functions)
      max: 1, // Limit connections for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

    // ALWAYS enable SSL for cloud databases (Neon, Supabase, etc.) and production
    // Even if sslmode=require is in the connection string, we need to explicitly set SSL config
    if (isCloudDatabase || process.env.NODE_ENV === 'production') {
      poolConfig.ssl = {
        rejectUnauthorized: false,
      };
      console.log("SSL enabled for database connection (cloud database detected)");
    } else if (!hasSSLMode) {
      // For local development, only enable SSL if not specified
      poolConfig.ssl = {
        rejectUnauthorized: false,
      };
      console.log("SSL enabled for database connection");
    }

    try {
      pool = new Pool(poolConfig);

      // Test the connection
      pool.on('connect', () => {
        console.log('✅ Connected to PostgreSQL database');
      });

      pool.on('error', (err) => {
        console.error('❌ Database connection error:', err);
        // Reset pool on error so it can be recreated
        pool = null;
        // Don't exit in production, just log the error
        if (process.env.NODE_ENV !== 'production') {
          process.exit(-1);
        }
      });

      console.log("Database pool created successfully");
    } catch (error: any) {
      console.error("Failed to create database pool:", error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  return pool;
}

