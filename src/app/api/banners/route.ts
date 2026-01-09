import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  imageAlt: z.string().optional(),
  type: z.enum(["hero", "tournament", "page-header", "feature-card"]),
  page: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
});

// GET - Get all banners (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const page = searchParams.get("page");
    const active = searchParams.get("active");

    const where: any = {};
    if (type) {
      where.type = type;
    }
    if (page) {
      where.page = page;
    }
    if (active === "true") {
      where.isActive = true;
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// POST - Create banner (admin only)
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const data = bannerSchema.parse(body);

    const banner = await prisma.banner.create({
      data: {
        ...data,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [hero, tournament, page-header, feature-card]
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of banners
 *   post:
 *     summary: Create a new banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - imageUrl
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               imageAlt:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [hero, tournament, page-header, feature-card]
 *               page:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Banner created
 *       401:
 *         description: Unauthorized
 */

