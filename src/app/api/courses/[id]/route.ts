export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  getCourseById,
  updateCourse,
  deleteCourse,
} from "@/lib/data";
import { authenticate, requireRole } from "@/lib/middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Allow any authenticated user to view a course
  const authResult = await authenticate(request);
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const course = await getCourseById(params.id);
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Allow any authenticated user to update courses
  const authResult = await authenticate(request);
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const { title, description, instructor, duration, price } = body;

    const updatedCourse = await updateCourse(params.id, {
      title,
      description,
      instructor,
      duration,
      price: price !== undefined ? Number(price) : undefined,
    });

    if (!updatedCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCourse);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Allow any authenticated user to delete courses
  const authResult = await authenticate(request);
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const deleted = await deleteCourse(params.id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}

