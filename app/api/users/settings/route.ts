import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-session/auth";
import type {
  UserSettings,
  UpdateUserSettingsRequest,
} from "@/lib/types/api";

/**
 * Helper to get current authenticated user
 */
async function getCurrentUser(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    throw new Error("Unauthorized: Please login");
  }

  return session.user;
}

/**
 * GET /api/users/settings
 * Get user settings
 */
export async function GET(request: NextRequest) {
  try {
    await getCurrentUser(request);
    // For now, return default settings since we don't have a settings table
    // In a real app, you'd fetch from a UserSettings table
    const defaultSettings: UserSettings = {
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      promotionalEmails: false,
      reminderTiming: "24",
      profileVisibility: "private",
      shareData: false,
      twoFactorAuth: false,
    };

    return NextResponse.json({
      success: true,
      data: defaultSettings,
    });
  } catch (error) {
    console.error("[GET /api/users/settings] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

/**
 * PATCH /api/users/settings
 * Update user settings
 */
export async function PATCH(request: NextRequest) {
  try {
    await getCurrentUser(request);
    const body = await request.json() as UpdateUserSettingsRequest;

    // In a real implementation, you would save these to a UserSettings table
    // For now, we'll just return success
    console.log("Updating user settings:", Object.keys(body).join(", "));

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("[PATCH /api/users/settings] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

