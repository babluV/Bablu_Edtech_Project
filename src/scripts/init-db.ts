import { getPool } from '../lib/db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function initializeDatabase() {
  const pool = getPool();
  try {
    console.log('Initializing database...');
    
    // Read and execute schema
    const schemaPath = join(process.cwd(), 'src/lib/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    await pool.query(schema);
    
    console.log('Database initialized successfully!');
    await pool.end();
  } catch (error) {
    console.error('Error initializing database:', error);
    await pool.end();
    process.exit(1);
  }
}

initializeDatabase();

