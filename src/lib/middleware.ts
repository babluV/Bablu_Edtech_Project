import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest, JWTPayload } from "./auth";
import { getUserById } from "./data";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload & { id: string; role: string };
}

export async function authenticate(
  request: NextRequest
): Promise<{ user: JWTPayload; error: null } | { user: null; error: NextResponse }> {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      ),
    };
  }

  // Verify user still exists in database
  const user = await getUserById(payload.userId);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      ),
    };
  }

  return { user: payload, error: null };
}

export function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest): Promise<{ user: JWTPayload; error: null } | { user: null; error: NextResponse }> => {
    const authResult = await authenticate(request);
    
    if (authResult.error) {
      return authResult;
    }

    if (!allowedRoles.includes(authResult.user.role)) {
      return {
        user: null,
        error: NextResponse.json(
          { error: "Forbidden - Insufficient permissions" },
          { status: 403 }
        ),
      };
    }

    return authResult;
  };
}

