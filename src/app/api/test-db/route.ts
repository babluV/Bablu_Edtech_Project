export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  // First, check if DATABASE_URL is set
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const databaseUrlLength = process.env.DATABASE_URL?.length || 0;
  const databaseUrlPreview = process.env.DATABASE_URL 
    ? `${process.env.DATABASE_URL.substring(0, 20)}...` 
    : 'NOT SET';

  if (!hasDatabaseUrl) {
    return NextResponse.json({
      connected: false,
      error: "DATABASE_URL environment variable is not set",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: false,
        allEnvVars: Object.keys(process.env).filter(k => 
          k.includes('DATABASE') || k.includes('DB') || k.includes('POSTGRES')
        ),
      },
      message: "Please set DATABASE_URL in Netlify: Site settings → Environment variables"
    }, { status: 500 });
  }

  try {
    const pool = getPool();
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
      message: "Database connection successful",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: true,
        databaseUrlLength: databaseUrlLength,
        databaseUrlPreview: databaseUrlPreview,
      }
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

