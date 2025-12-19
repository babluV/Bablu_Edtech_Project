import { Course } from "@/types/course";
import { User, UserWithPassword, RegisterData } from "@/types/user";
import pool from "./db";
import { readFileSync } from "fs";
import { join } from "path";
import { hashPassword } from "./auth";
// Import Sequelize models - only used in API routes (server-side only)
import UserModel from "@/models/User";
import sequelize from "@/lib/sequelize";
import "@/models/index";

// Initialize database schema
async function initializeDatabase() {
  try {
    const schemaPath = join(process.cwd(), "src/lib/schema.sql");
    const schema = readFileSync(schemaPath, "utf-8");
    await pool.query(schema);
  } catch (error) {
    // If schema file doesn't exist or table already exists, that's okay
    // Try to create table directly
    try {
      // Create users table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'student',
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      `);
      // Create courses table
      await pool.query(`
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
        CREATE INDEX IF NOT EXISTS idx_courses_id ON courses(id);
      `);
    } catch (err) {
      console.error("Database initialization error:", err);
    }
  }
}

// Initialize on module load
initializeDatabase();

export async function getAllCourses(): Promise<Course[]> {
  try {
    const result = await pool.query(
      'SELECT id, title, description, instructor, duration, price, "createdAt" FROM courses ORDER BY "createdAt" DESC'
    );
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      instructor: row.instructor,
      duration: row.duration,
      price: parseFloat(row.price),
      createdAt: new Date(row.createdAt).toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  try {
    const result = await pool.query(
      'SELECT id, title, description, instructor, duration, price, "createdAt" FROM courses WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return undefined;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      instructor: row.instructor,
      duration: row.duration,
      price: parseFloat(row.price),
      createdAt: new Date(row.createdAt).toISOString(),
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
}

export async function createCourse(
  course: Omit<Course, "id" | "createdAt">
): Promise<Course> {
  try {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    
    await pool.query(
      'INSERT INTO courses (id, title, description, instructor, duration, price, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        id,
        course.title,
        course.description,
        course.instructor,
        course.duration,
        course.price,
        createdAt,
      ]
    );

    return {
      id,
      ...course,
      createdAt,
    };
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}

export async function updateCourse(
  id: string,
  updates: Partial<Omit<Course, "id" | "createdAt">>
): Promise<Course | null> {
  try {
    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.instructor !== undefined) {
      fields.push(`instructor = $${paramIndex++}`);
      values.push(updates.instructor);
    }
    if (updates.duration !== undefined) {
      fields.push(`duration = $${paramIndex++}`);
      values.push(updates.duration);
    }
    if (updates.price !== undefined) {
      fields.push(`price = $${paramIndex++}`);
      values.push(updates.price);
    }

    if (fields.length === 0) {
      // No updates provided, return existing course
      const course = await getCourseById(id);
      return course || null;
    }

    values.push(id);
    const query = `UPDATE courses SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING id, title, description, instructor, duration, price, "createdAt"`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      instructor: row.instructor,
      duration: row.duration,
      price: parseFloat(row.price),
      createdAt: new Date(row.createdAt).toISOString(),
    };
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  try {
    const result = await pool.query("DELETE FROM courses WHERE id = $1", [id]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}

// User functions
export async function getUserByEmail(email: string): Promise<UserWithPassword | undefined> {
  try {
    const result = await pool.query(
      'SELECT id, email, name, password, role, "createdAt" FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    if (result.rows.length === 0) {
      return undefined;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      password: row.password,
      role: row.role,
      createdAt: new Date(row.createdAt).toISOString(),
    };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, "createdAt" FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return undefined;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      createdAt: new Date(row.createdAt).toISOString(),
    };
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
}

export async function createUser(userData: RegisterData): Promise<User> {
  try {
    // Check if user already exists (case-insensitive)
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const id = Date.now().toString();
    const hashedPassword = await hashPassword(userData.password);
    const role = userData.role || "student";

    // Use Sequelize to create the user directly
    // Tables should already exist from initialization script
    const newUser = await UserModel.create({
      id,
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      role: role as 'admin' | 'instructor' | 'student',
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as 'admin' | 'instructor' | 'student',
      createdAt: newUser.createdAt.toISOString(),
    };
  } catch (error: any) {
    // Handle Sequelize unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError' || error.original?.code === "23505") {
      throw new Error("User with this email already exists");
    }
    // Handle connection errors
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeConnectionRefusedError') {
      throw new Error("Database connection failed. Please check your database configuration.");
    }
    // Handle table doesn't exist errors
    if (error.original?.code === "42P01") {
      throw new Error("Database tables not found. Please run 'npm run init-db' to create tables.");
    }
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors?.map((e: any) => e.message).join(', ') || error.message;
      throw new Error(`Validation error: ${messages}`);
    }
    console.error("Error creating user:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.original?.code,
      original: error.original?.message,
    });
    // Re-throw with a more descriptive message
    throw new Error(error.message || "Failed to create user");
  }
}

