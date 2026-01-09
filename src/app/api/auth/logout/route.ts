import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.delete("admin_token");
  return response;
}

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */

