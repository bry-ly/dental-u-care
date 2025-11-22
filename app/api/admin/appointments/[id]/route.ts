import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import { Resend } from "resend";
import { createElement } from "react";
import AppointmentReschedule from "@/components/emails/email-reschedule";
import AppointmentCancellation from "@/components/emails/email-cancellation";
import type { Prisma } from "@prisma/client";
import type { UpdateAppointmentRequest } from "@/lib/types/api";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to format time to 12-hour format
function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Helper function to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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

    // Get appointment before update for email
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        dentist: true,
        service: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    const updateData: Prisma.AppointmentUpdateInput = {};

    if (body.status) updateData.status = body.status as Prisma.AppointmentUpdateInput["status"];
    if (body.cancelReason) updateData.cancelReason = body.cancelReason;
    if (body.date) updateData.date = new Date(body.date);
    if (body.timeSlot) updateData.timeSlot = body.timeSlot;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        dentist: true,
        service: true,
      },
    });

    // Send emails based on what was updated
    try {
      if (body.status === "cancelled") {
        // Send cancellation email
        const appointmentDate = formatDate(appointment.date);
        const appointmentTime = formatTime12Hour(appointment.timeSlot);
        const reasonForVisit = appointment.service.name;

        await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "send@dentalucare.tech"}>`,
          to: appointment.patient.email,
          subject: `Appointment Cancelled - ${appointmentDate}`,
          react: createElement(AppointmentCancellation, {
            patientName: appointment.patient.name,
            appointmentDate,
            appointmentTime,
            doctorName: appointment.dentist.name,
            reasonForVisit,
            cancelReason: body.cancelReason || "Cancelled by admin",
            bookingId: appointment.id,
            patientEmail: appointment.patient.email,
            clinicPhone: process.env.CLINIC_PHONE || "(043) 756-1234",
            clinicEmail: process.env.CLINIC_EMAIL || "info@dentalucare.com",
            clinicAddress: process.env.CLINIC_ADDRESS || "Baltan Street, Puerto Princesa City, Palawan",
          }),
        });
      } else if (body.date || body.timeSlot) {
        // Send reschedule email
        const oldDate = formatDate(appointment.date);
        const oldTime = formatTime12Hour(appointment.timeSlot);
        const newDate = formatDate(updatedAppointment.date);
        const newTime = formatTime12Hour(updatedAppointment.timeSlot);
        const reasonForVisit = appointment.service.name;

        await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "send@dentalucare.tech"}>`,
          to: appointment.patient.email,
          subject: `Appointment Rescheduled - ${newDate}`,
          react: createElement(AppointmentReschedule, {
            patientName: appointment.patient.name,
            oldAppointmentDate: oldDate,
            oldAppointmentTime: oldTime,
            newAppointmentDate: newDate,
            newAppointmentTime: newTime,
            doctorName: appointment.dentist.name,
            reasonForVisit,
            bookingId: appointment.id,
            patientEmail: appointment.patient.email,
            patientPhone: appointment.patient.phone || undefined,
            clinicPhone: process.env.CLINIC_PHONE || "(043) 756-1234",
            clinicEmail: process.env.CLINIC_EMAIL || "info@dentalucare.com",
            clinicAddress: process.env.CLINIC_ADDRESS || "Baltan Street, Puerto Princesa City, Palawan",
          }),
        });
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the update if email fails
    }

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

