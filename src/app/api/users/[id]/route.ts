import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { prisma } from "@/lib/prisma";
import { AppLogger } from "@/lib/logger";

// GET - Get user by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        role: true,
        memberships: {
          orderBy: { createdAt: "desc" },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        eventRegistrations: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT - Update user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const { isActive, roleId } = body;

    const updateData: any = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (roleId) updateData.roleId = roleId;

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      include: {
        role: true,
      },
    });

    await AppLogger.log({
      userId: auth.payload.id || auth.payload.userId,
      action: "update_user",
      entityType: "user",
      entityId: params.id,
      message: `User ${params.id} updated by admin`,
      data: updateData,
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

