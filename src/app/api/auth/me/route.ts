export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/middleware";
import { getUserById } from "@/lib/data";

export async function GET(request: NextRequest) {
  const authResult = await authenticate(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const user = await getUserById(authResult.user.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

