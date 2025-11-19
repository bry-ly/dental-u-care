import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import type {
  UpdateUserEmailVerificationRequest,
  DeleteUsersRequest,
} from "@/lib/types/api";

/**
 * Helper to check if user is admin
 */
async function checkAdmin(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return session.user;
}

/**
 * PATCH /api/admin/users
 * Update user email verification status
 */
export async function PATCH(request: NextRequest) {
  try {
    await checkAdmin(request);
    const body = await request.json() as UpdateUserEmailVerificationRequest;
    const { userIds, emailVerified } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "userIds array is required" },
        { status: 400 }
      );
    }

    if (typeof emailVerified !== "boolean") {
      return NextResponse.json(
        { success: false, error: "emailVerified boolean is required" },
        { status: 400 }
      );
    }

    await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { emailVerified },
    });

    return NextResponse.json({
      success: true,
      message: `${userIds.length} user(s) updated`,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/users] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

/**
 * DELETE /api/admin/users
 * Delete multiple users (excluding admins)
 */
export async function DELETE(request: NextRequest) {
  try {
    await checkAdmin(request);
    const body = await request.json() as DeleteUsersRequest;
    const { userIds } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "userIds array is required" },
        { status: 400 }
      );
    }

    // Don't allow deleting admin users
    await prisma.user.deleteMany({
      where: {
        id: { in: userIds },
        role: { not: "admin" },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${userIds.length} user(s) deleted`,
    });
  } catch (error) {
    console.error("[DELETE /api/admin/users] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

