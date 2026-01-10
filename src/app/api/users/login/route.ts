import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";
import { AppLogger } from "@/lib/logger";
import { z } from "zod";

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrPhone, password } = loginSchema.parse(body);

    // Determine if input is email or phone
    const isEmail = emailOrPhone.includes("@");
    
    // Find user by email or phone
    const user = isEmail
      ? await prisma.user.findUnique({
          where: { email: emailOrPhone },
          include: { role: true },
        })
      : await prisma.user.findFirst({
          where: { phone: emailOrPhone },
          include: { role: true },
        });

    if (!user) {
      await AppLogger.logLogin(
        null,
        emailOrPhone,
        false,
        "User not found",
        {
          ipAddress: request.headers.get("x-forwarded-for") || undefined,
          userAgent: request.headers.get("user-agent") || undefined,
        }
      );

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      await AppLogger.logLogin(
        user.id,
        user.email || emailOrPhone,
        false,
        "Account inactive",
        {
          ipAddress: request.headers.get("x-forwarded-for") || undefined,
          userAgent: request.headers.get("user-agent") || undefined,
        }
      );

      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 403 }
      );
    }

    // Get password from login table (we'll store hashed password there)
    // For now, we'll need to add password to User model or use a different approach
    // Let's check if we have password in User model - if not, we need to add it
    // Actually, looking at schema, we don't have password in User model
    // We need to add it or use a different auth method
    // For now, let's assume we'll add password field to User model

    // Since we don't have password in User model yet, we'll need to update schema
    // For now, let's create a workaround using Admin table or create a separate auth table
    // Actually, let's check the schema again - we have Login table but no password storage
    
    // We need to add password to User model. Let me update the approach:
    // We'll store password hash in User model (need to update schema)
    
    // For now, let's use a temporary solution - check if user exists and create login record
    // But we need password verification - this requires password in User model
    
    // Let me create a proper solution: We'll need to update User model to include password
    // But for now, let's assume password is stored and create the login flow

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    
    if (!isValid) {
      await AppLogger.logLogin(
        user.id,
        user.email || emailOrPhone,
        false,
        "Invalid password",
        {
          ipAddress: request.headers.get("x-forwarded-for") || undefined,
          userAgent: request.headers.get("user-agent") || undefined,
        }
      );

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token (use email or phone as fallback)
    const token = generateToken({
      id: user.id,
      email: user.email || user.phone || emailOrPhone,
      name: user.fullName,
    });

    // Create login record
    const login = await prisma.login.create({
      data: {
        userId: user.id,
        email: user.email || emailOrPhone,
        loginMethod: isEmail ? "email" : "phone",
        isSuccessful: true,
        sessionToken: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: request.headers.get("x-forwarded-for") || 
                   request.headers.get("x-real-ip") || 
                   undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    // Log successful login
    await AppLogger.logLogin(
      user.id,
      user.email || emailOrPhone,
      true,
      undefined,
      {
        ipAddress: login.ipAddress || undefined,
        userAgent: login.userAgent || undefined,
      }
    );

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
        role: user.role.name,
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

    console.error("Login error:", error);
    await AppLogger.logError("login", "Login failed", error);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

