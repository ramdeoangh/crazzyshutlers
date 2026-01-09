import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const userId = auth.payload.id || auth.payload.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        memberships: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        fullName: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        profileImage: true,
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        memberships: {
          select: {
            id: true,
            membershipType: true,
            amount: true,
            status: true,
            paidAt: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

