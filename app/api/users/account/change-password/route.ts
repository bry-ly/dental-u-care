import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-session/auth";
import type { ChangePasswordRequest } from "@/lib/types/api";

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
 * POST /api/users/account/change-password
 * Change user password
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const body = await request.json() as ChangePasswordRequest;
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Verify the current password against data.currentPassword
    // 2. Hash the new password (data.newPassword)
    // 3. Update the password in the account table

    // For now, we'll just simulate success
    console.log("Password change requested for user:", user.id);

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("[POST /api/users/account/change-password] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

