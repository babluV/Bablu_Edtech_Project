import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/data";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    let user;
    try {
      user = await getUserByEmail(email);
    } catch (dbError: any) {
      console.error("Database error during login:", dbError);
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 500 }
      );
    }

    if (!user) {
      console.log(`Login attempt failed: User not found for email: ${email}`);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    let isPasswordValid;
    try {
      isPasswordValid = await comparePassword(password, user.password);
    } catch (compareError) {
      console.error("Password comparison error:", compareError);
      return NextResponse.json(
        { error: "Error validating password. Please try again." },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      console.log(`Login attempt failed: Invalid password for email: ${email}`);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to login" },
      { status: 500 }
    );
  }
}

