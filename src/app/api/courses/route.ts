import { NextRequest, NextResponse } from "next/server";
import {
  getAllCourses,
  createCourse,
} from "@/lib/data";
import { Course } from "@/types/course";
import { authenticate, requireRole } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  // Allow any authenticated user to view courses
  const authResult = await authenticate(request);
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const courses = await getAllCourses();
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Allow any authenticated user to create courses
  const authResult = await authenticate(request);
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const { title, description, instructor, duration, price } = body;

    if (!title || !description || !instructor || !duration || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCourse = await createCourse({
      title,
      description,
      instructor,
      duration,
      price: Number(price),
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

