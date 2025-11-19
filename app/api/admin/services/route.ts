import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import type {
  UpdateServiceStatusRequest,
  DeleteServicesRequest,
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
 * PATCH /api/admin/services
 * Update service status or delete services
 */
export async function PATCH(request: NextRequest) {
  try {
    await checkAdmin(request);
    const body = await request.json() as UpdateServiceStatusRequest;
    const { serviceIds, isActive } = body;

    if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "serviceIds array is required" },
        { status: 400 }
      );
    }

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "isActive boolean is required" },
        { status: 400 }
      );
    }

    await prisma.service.updateMany({
      where: { id: { in: serviceIds } },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      message: `${serviceIds.length} service(s) updated`,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/services] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

/**
 * DELETE /api/admin/services
 * Delete multiple services
 */
export async function DELETE(request: NextRequest) {
  try {
    await checkAdmin(request);
    const body = await request.json() as DeleteServicesRequest;
    const { serviceIds } = body;

    if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "serviceIds array is required" },
        { status: 400 }
      );
    }

    await prisma.service.deleteMany({
      where: { id: { in: serviceIds } },
    });

    return NextResponse.json({
      success: true,
      message: `${serviceIds.length} service(s) deleted`,
    });
  } catch (error) {
    console.error("[DELETE /api/admin/services] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

