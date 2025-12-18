import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/data";
import { RegisterData } from "@/types/user";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    
    const { email, password, name, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields (email, password, name)" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !["admin", "instructor", "student"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be admin, instructor, or student" },
        { status: 400 }
      );
    }

    const newUser = await createUser({
      email,
      password,
      name,
      role: role || "student",
    });

    return NextResponse.json(
      { user: newUser, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    console.error("Error stack:", error.stack);
    
    // Always return valid JSON, even on errors
    const errorMessage = error?.message || error?.toString() || "Failed to register user. Please check database connection.";
    
    if (errorMessage.includes("already exists") || errorMessage === "User with this email already exists") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    // Return the actual error message for debugging
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

