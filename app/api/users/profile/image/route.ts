import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import type { UploadProfileImageRequest } from "@/lib/types/api";

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
 * POST /api/users/profile/image
 * Upload profile image
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const body = await request.json() as UploadProfileImageRequest;
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "imageUrl is required" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        image: imageUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile image updated successfully",
    });
  } catch (error) {
    console.error("[POST /api/users/profile/image] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

