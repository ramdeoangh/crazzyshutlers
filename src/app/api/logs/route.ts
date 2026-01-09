import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { prisma } from "@/lib/prisma";

// GET - Get application logs (admin only)
export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const level = searchParams.get("level");
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const entityType = searchParams.get("entityType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};

    if (level) {
      where.level = level;
    }
    if (action) {
      where.action = action;
    }
    if (userId) {
      where.userId = userId;
    }
    if (entityType) {
      where.entityType = entityType;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [logs, total] = await Promise.all([
      prisma.appLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.appLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get application logs (Admin only)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logs retrieved
 */

