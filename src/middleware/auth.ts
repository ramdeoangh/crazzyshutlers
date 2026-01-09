import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  
  // Also check cookies (admin_token or user_token)
  const adminToken = request.cookies.get("admin_token")?.value;
  const userToken = request.cookies.get("user_token")?.value;
  return adminToken || userToken || null;
}

export function requireAuth(
  request: NextRequest
): { payload: any } | { error: NextResponse } {
  const token = getAuthToken(request);

  if (!token) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      error: NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      ),
    };
  }

  return { payload };
}

