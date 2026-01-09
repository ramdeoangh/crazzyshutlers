import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
  type: z.enum(["hero", "tournament", "page-header", "feature-card"]).optional(),
  page: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
});

// GET - Get single banner (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: params.id },
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// PUT - Update banner (admin only)
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
    const data = bannerSchema.parse(body);

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(banner);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE - Delete banner (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    await prisma.banner.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     summary: Get a single banner
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner details
 *       404:
 *         description: Banner not found
 *   put:
 *     summary: Update a banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Banner updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete a banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner deleted
 *       401:
 *         description: Unauthorized
 */

