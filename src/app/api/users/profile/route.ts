import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { prisma } from "@/lib/prisma";
import { AppLogger } from "@/lib/logger";
import { z } from "zod";

const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  profileImage: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const data = updateProfileSchema.parse(body);

    // Update user
    const userId = auth.payload.id || auth.payload.userId;
    const updateData: any = {};
    
    // Check if email is being updated and if it's already taken
    if (data.email !== undefined && data.email.trim() !== "") {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
      updateData.email = data.email;
    }
    
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) {
      updateData.lastName = data.lastName;
      // Get current firstName if not being updated
      const currentUser = await prisma.user.findUnique({ where: { id: userId } });
      const firstName = data.firstName || currentUser?.firstName || "";
      updateData.fullName = `${firstName} ${data.lastName}`.trim();
    } else if (data.firstName) {
      // If only firstName is updated, update fullName
      const currentUser = await prisma.user.findUnique({ where: { id: userId } });
      const lastName = currentUser?.lastName || "";
      updateData.fullName = `${data.firstName} ${lastName}`.trim();
    }
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.profileImage !== undefined)
      updateData.profileImage = data.profileImage;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    // Log the update
    await AppLogger.log({
      userId: userId,
      action: "update_profile",
      entityType: "user",
      entityId: userId,
      message: "User profile updated",
      data: { fields: Object.keys(updateData) },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

