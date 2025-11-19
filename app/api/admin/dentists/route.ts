import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import type { UpdateDentistAvailabilityRequest } from "@/lib/types/api";

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
 * PATCH /api/admin/dentists
 * Update dentist availability
 */
export async function PATCH(request: NextRequest) {
  try {
    await checkAdmin(request);
    const body = await request.json() as UpdateDentistAvailabilityRequest;
    const { dentistIds, isAvailable } = body;

    if (!dentistIds || !Array.isArray(dentistIds) || dentistIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "dentistIds array is required" },
        { status: 400 }
      );
    }

    if (typeof isAvailable !== "boolean") {
      return NextResponse.json(
        { success: false, error: "isAvailable boolean is required" },
        { status: 400 }
      );
    }

    await prisma.user.updateMany({
      where: {
        id: { in: dentistIds },
        role: "dentist",
      },
      data: { isAvailable },
    });

    return NextResponse.json({
      success: true,
      message: `${dentistIds.length} dentist(s) updated`,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/dentists] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

