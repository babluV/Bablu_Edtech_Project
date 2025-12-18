import sequelize from '@/lib/sequelize';
// Import models to ensure they're registered and associations are set up
import '@/models/index';

async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Synchronizing database models...');
    // Sync all models - this will create tables if they don't exist
    // force: false means it won't drop existing tables
    // alter: true means it will update tables to match the model definitions
    await sequelize.sync({ force: false, alter: true });
    console.log('Database models synchronized successfully.');

    console.log('Database initialization completed!');
  } catch (error) {
    console.error('Unable to initialize database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the initialization
initializeDatabase();

