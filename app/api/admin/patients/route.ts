import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import type { DeletePatientsRequest } from "@/lib/types/api";

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
 * DELETE /api/admin/patients
 * Delete multiple patients
 */
export async function DELETE(request: NextRequest) {
  try {
    await checkAdmin(request);
    const body = await request.json() as DeletePatientsRequest;
    const { patientIds } = body;

    if (!patientIds || !Array.isArray(patientIds) || patientIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "patientIds array is required" },
        { status: 400 }
      );
    }

    await prisma.user.deleteMany({
      where: {
        id: { in: patientIds },
        role: "patient",
      },
    });

    return NextResponse.json({
      success: true,
      message: `${patientIds.length} patient(s) deleted`,
    });
  } catch (error) {
    console.error("[DELETE /api/admin/patients] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

