import { Sequelize } from 'sequelize';

// Initialize Sequelize with environment variables
// Prefer DATABASE_URL if available, otherwise use individual variables
let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL connection string
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Fall back to individual environment variables
  sequelize = new Sequelize(
    process.env.POSTGRES_DATABASE || 'edTech',
    process.env.POSTGRES_USER || 'postgres',
    process.env.POSTGRES_PASSWORD || '',
    {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

export default sequelize;

