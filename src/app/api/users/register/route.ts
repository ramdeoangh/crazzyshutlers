import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { AppLogger } from "@/lib/logger";
import { SettingsManager } from "@/lib/settings";
import { generateToken } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  payMembershipFee: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      await AppLogger.logSystem(
        "register",
        `Registration attempt with existing email: ${data.email}`,
        "warn"
      );
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Get member role (or create if doesn't exist)
    let memberRole = await prisma.role.findUnique({
      where: { name: "member" },
    });

    if (!memberRole) {
      memberRole = await prisma.role.create({
        data: {
          name: "member",
          description: "Regular member",
        },
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword, // Store hashed password
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        roleId: memberRole.id,
      },
    });

    // Create login record
    const login = await prisma.login.create({
      data: {
        userId: user.id,
        email: user.email,
        loginMethod: "email",
        isSuccessful: true,
        ipAddress: request.headers.get("x-forwarded-for") || 
                   request.headers.get("x-real-ip") || 
                   "unknown",
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.fullName,
    });

    // Handle membership fee payment (if opted)
    let membership = null;
    if (data.payMembershipFee) {
      try {
        const membershipFee = await SettingsManager.getMembershipFee();

        membership = await prisma.membership.create({
          data: {
            userId: user.id,
            amount: membershipFee,
            status: "pending", // User needs to complete payment
          },
        });

        await AppLogger.log({
          userId: user.id,
          action: "membership_created",
          entityType: "membership",
          entityId: membership.id,
          message: `Membership created with pending payment: ${membershipFee} INR`,
          data: {
            membershipId: membership.id,
            amount: Number(membershipFee),
            status: "pending",
            type: "membership_fee",
          },
        });
      } catch (error) {
        // Log error but don't fail registration
        console.error("Error creating membership:", error);
        await AppLogger.logError(
          "register",
          "Failed to create membership during registration",
          error,
          user.id
        );
      }
    }

    // Log registration
    await AppLogger.logRegistration(user.id, user.email, {
      ipAddress: login.ipAddress || undefined,
      userAgent: login.userAgent || undefined,
    });

    // Update login with token
    await prisma.login.update({
      where: { id: login.id },
      data: {
        sessionToken: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Update user last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: memberRole.name,
      },
      token,
      membership: membership
        ? {
            id: membership.id,
            amount: membership.amount,
            status: membership.status,
          }
        : null,
    });

    // Set HTTP-only cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    
    // Try to log the error (but don't fail if logging fails)
    try {
      await AppLogger.logError("register", "Registration failed", error);
    } catch (logError) {
      console.error("Failed to log registration error:", logError);
    }

    // Provide more specific error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Registration failed. Please check your input and try again.";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: User registration
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               payMembershipFee:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Invalid input or email exists
 */

