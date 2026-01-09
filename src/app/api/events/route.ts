import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  categories: z.string().optional(),
  matchFormat: z.string().optional(),
  schedule: z.string().optional(),
});

// GET - Get all events (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get("featured");
    const active = searchParams.get("active");

    const where: any = {};
    if (featured === "true") {
      where.isFeatured = true;
    }
    if (active === "true") {
      where.isActive = true;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: "asc" }, // Show upcoming events first (earliest first)
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        registrationUrl: true,
        registrationStart: true,
        registrationEnd: true,
        isActive: true,
        isFeatured: true,
        categories: true,
        matchFormat: true,
        schedule: true,
        city: true,
        state: true,
        venue: true,
        registrationFee: true,
        currentParticipants: true,
        maxParticipants: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST - Create event (admin only)
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const data = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        registrationUrl: data.registrationUrl || null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of events
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Events]
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
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               registrationUrl:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               categories:
 *                 type: string
 *               matchFormat:
 *                 type: string
 *               schedule:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created
 *       401:
 *         description: Unauthorized
 */

