import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import type { UpdateUserProfileRequest } from "@/lib/types/api";

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
 * PATCH /api/users/profile
 * Update user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const body = await request.json() as UpdateUserProfileRequest;
    const { name, email, phone, address, dateOfBirth } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("[PATCH /api/users/profile] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}


