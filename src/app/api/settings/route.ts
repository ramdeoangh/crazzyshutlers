import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { SettingsManager } from "@/lib/settings";
import { AppLogger } from "@/lib/logger";
import { z } from "zod";

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
  category: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  valueType: z.string().optional(),
});

// GET - Get all settings or by category (public settings accessible without auth)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const publicOnly = searchParams.get("public") === "true";

    if (publicOnly) {
      const settings = await SettingsManager.getPublic();
      return NextResponse.json(settings);
    }

    // For non-public settings, require auth
    const auth = requireAuth(request);
    if ("error" in auth) {
      return auth.error;
    }

    if (category) {
      const settings = await SettingsManager.getByCategory(category);
      return NextResponse.json(settings);
    }

    // Get all settings (admin only)
    const { prisma } = await import("@/lib/prisma");
    const settings = await prisma.setting.findMany({
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST - Create or update setting (admin only)
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const data = settingSchema.parse(body);

    await SettingsManager.set(data.key, data.value, {
      category: data.category,
      description: data.description,
      isPublic: data.isPublic,
      valueType: data.valueType,
    });

    await AppLogger.logUserAction(
      auth.payload.id || auth.payload.userId,
      "setting_update",
      `Setting updated: ${data.key}`,
      { key: data.key, category: data.category }
    );

    return NextResponse.json({ message: "Setting saved successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save setting" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get settings
 *     tags: [Settings]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: public
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Settings retrieved
 *   post:
 *     summary: Create or update setting (Admin only)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 */

