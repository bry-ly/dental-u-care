import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";

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
 * POST /api/admin/services/[id]/duplicate
 * Duplicate a service
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdmin(request);
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Generate a unique ID for the duplicated service
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newId = `${service.id}-copy-${timestamp}-${randomSuffix}`;

    await prisma.service.create({
      data: {
        id: newId,
        name: `${service.name} (Copy)`,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        isActive: false, // Duplicated services start as inactive
      },
    });

    return NextResponse.json({
      success: true,
      message: "Service duplicated successfully",
    });
  } catch (error) {
    console.error("[POST /api/admin/services/[id]/duplicate] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

