-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'student',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "createdBy" VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL
);

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS idx_courses_id ON courses(id);

