import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import type {
  ConfirmAppointmentsRequest,
  CancelAppointmentsRequest,
  CompleteAppointmentsRequest,
  DeleteAppointmentsRequest,
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
 * POST /api/admin/appointments/confirm
 * Confirm multiple appointments
 */
export async function POST(request: NextRequest) {
  try {
    await checkAdmin(request);
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "confirm") {
      const { appointmentIds } = data as ConfirmAppointmentsRequest;

      if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
        return NextResponse.json(
          { success: false, error: "appointmentIds array is required" },
          { status: 400 }
        );
      }

      await prisma.appointment.updateMany({
        where: { id: { in: appointmentIds } },
        data: { status: "confirmed" },
      });

      return NextResponse.json({
        success: true,
        message: `${appointmentIds.length} appointment(s) confirmed`,
      });
    }

    if (action === "cancel") {
      const { appointmentIds, cancelReason } = data as CancelAppointmentsRequest;

      if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
        return NextResponse.json(
          { success: false, error: "appointmentIds array is required" },
          { status: 400 }
        );
      }

      await prisma.appointment.updateMany({
        where: { id: { in: appointmentIds } },
        data: {
          status: "cancelled",
          cancelReason: cancelReason || "Cancelled by admin",
        },
      });

      return NextResponse.json({
        success: true,
        message: `${appointmentIds.length} appointment(s) cancelled`,
      });
    }

    if (action === "complete") {
      const { appointmentIds } = data as CompleteAppointmentsRequest;

      if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
        return NextResponse.json(
          { success: false, error: "appointmentIds array is required" },
          { status: 400 }
        );
      }

      await prisma.appointment.updateMany({
        where: { id: { in: appointmentIds } },
        data: { status: "completed" },
      });

      return NextResponse.json({
        success: true,
        message: `${appointmentIds.length} appointment(s) marked as completed`,
      });
    }

    if (action === "delete") {
      const { appointmentIds } = data as DeleteAppointmentsRequest;

      if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
        return NextResponse.json(
          { success: false, error: "appointmentIds array is required" },
          { status: 400 }
        );
      }

      await prisma.appointment.deleteMany({
        where: { id: { in: appointmentIds } },
      });

      return NextResponse.json({
        success: true,
        message: `${appointmentIds.length} appointment(s) deleted`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Must be: confirm, cancel, complete, or delete" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[POST /api/admin/appointments] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

