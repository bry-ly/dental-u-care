import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";

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
 * GET /api/users/account/export
 * Export user data
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        appointmentsAsPatient: true,
        appointmentsAsDentist: true,
        payments: true,
        notifications: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User data not found" },
        { status: 404 }
      );
    }

    // Convert to JSON
    const dataExport = JSON.stringify(userData, null, 2);

    return NextResponse.json({
      success: true,
      message: "Data exported successfully",
      data: dataExport,
    });
  } catch (error) {
    console.error("[GET /api/users/account/export] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

