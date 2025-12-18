import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    const result = await pool.query("SELECT NOW() as current_time, version() as version");
    
    // Check if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'courses')
      ORDER BY table_name
    `);
    
    // Check user count
    let userCount = 0;
    try {
      const userResult = await pool.query("SELECT COUNT(*) as count FROM users");
      userCount = parseInt(userResult.rows[0].count);
    } catch (e) {
      // Table might not exist
    }
    
    return NextResponse.json({
      connected: true,
      timestamp: result.rows[0].current_time,
      version: result.rows[0].version,
      tables: tablesResult.rows.map(row => row.table_name),
      userCount: userCount,
      message: "Database connection successful"
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json({
      connected: false,
      error: error.message,
      code: error.code,
      message: "Database connection failed"
    }, { status: 500 });
  }
}

