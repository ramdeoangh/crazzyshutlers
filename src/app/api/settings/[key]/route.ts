import { NextRequest, NextResponse } from "next/server";
import { SettingsManager } from "@/lib/settings";
import { z } from "zod";

// GET - Get single setting (public if isPublic=true)
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const setting = await SettingsManager.get(params.key);

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    return NextResponse.json({ key: params.key, value: setting });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch setting" },
      { status: 500 }
    );
  }
}

// DELETE - Delete setting (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const { requireAuth } = await import("@/middleware/auth");
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    await SettingsManager.delete(params.key);
    return NextResponse.json({ message: "Setting deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete setting" },
      { status: 500 }
    );
  }
}

