import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { AppLogger } from "@/lib/logger";
import { SettingsManager } from "@/lib/settings";
import { generateToken } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
}).refine(
  (data) => {
    // At least one of email or phone must be provided
    const hasEmail = data.email && data.email.trim() !== "";
    const hasPhone = data.phone && data.phone.trim() !== "";
    return hasEmail || hasPhone;
  },
  {
    message: "Either email or phone number must be provided",
    path: ["email"], // This will show error on email field
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Check if phone is provided and if user exists by phone
    if (data.phone && data.phone.trim() !== "") {
      const existingUserByPhone = await prisma.user.findFirst({
        where: { phone: data.phone },
      });

      if (existingUserByPhone) {
        await AppLogger.logSystem(
          "register",
          `Registration attempt with existing phone: ${data.phone}`,
          "warn"
        );
        return NextResponse.json(
          { error: "Phone number already registered" },
          { status: 400 }
        );
      }
    }

    // Check if email is provided and if user exists by email
    if (data.email && data.email.trim() !== "") {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUserByEmail) {
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

    // Ensure at least email or phone is provided (validation should catch this, but double-check)
    const hasEmail = data.email && data.email.trim() !== "";
    const hasPhone = data.phone && data.phone.trim() !== "";
    
    if (!hasEmail && !hasPhone) {
      return NextResponse.json(
        { error: "Either email or phone number must be provided" },
        { status: 400 }
      );
    }

    // Create user - email can be null if phone is provided
    const user = await prisma.user.create({
      data: {
        email: hasEmail ? data.email : null,
        password: hashedPassword, // Store hashed password
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        phone: hasPhone ? data.phone : null,
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

    // Generate token (use email or phone as fallback)
    const token = generateToken({
      id: user.id,
      email: user.email || user.phone || `user_${user.id}@temp.local`,
      name: user.fullName,
    });

    // Log registration
    await AppLogger.logRegistration(user.id, user.email || user.phone || `user_${user.id}`, {
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
        needsProfileCompletion: !hasEmail || !hasPhone || !user.email || !user.phone,
      },
      token,
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

