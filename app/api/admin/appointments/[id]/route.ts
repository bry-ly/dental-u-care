import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import type { Prisma } from "@prisma/client";
import type { UpdateAppointmentRequest } from "@/lib/types/api";

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
 * PATCH /api/admin/appointments/[id]
 * Update a single appointment
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdmin(request);
    const { id } = await params;
    const body = await request.json() as UpdateAppointmentRequest;

    const updateData: Prisma.AppointmentUpdateInput = {};

    if (body.status) updateData.status = body.status as Prisma.AppointmentUpdateInput["status"];
    if (body.cancelReason) updateData.cancelReason = body.cancelReason;
    if (body.date) updateData.date = new Date(body.date);
    if (body.timeSlot) updateData.timeSlot = body.timeSlot;
    if (body.notes !== undefined) updateData.notes = body.notes;

    await prisma.appointment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    console.error("[PATCH /api/admin/appointments/[id]] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

/**
 * DELETE /api/admin/appointments/[id]
 * Delete a single appointment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdmin(request);
    const { id } = await params;

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/admin/appointments/[id]] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

