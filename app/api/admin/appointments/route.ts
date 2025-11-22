import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import { Resend } from "resend";
import { createElement } from "react";
import AppointmentConfirmation from "@/components/emails/email-confirmation";
import AppointmentCancellation from "@/components/emails/email-cancellation";
import type {
  ConfirmAppointmentsRequest,
  CancelAppointmentsRequest,
  CompleteAppointmentsRequest,
  DeleteAppointmentsRequest,
} from "@/lib/types/api";

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

      // Get appointments with relations for email
      const appointments = await prisma.appointment.findMany({
        where: { id: { in: appointmentIds } },
        include: {
          patient: true,
          dentist: true,
          service: true,
        },
      });

      await prisma.appointment.updateMany({
        where: { id: { in: appointmentIds } },
        data: { status: "confirmed" },
      });

      // Send confirmation emails
      for (const appointment of appointments) {
        try {
          const appointmentDate = formatDate(appointment.date);
          const appointmentTime = formatTime12Hour(appointment.timeSlot);
          const reasonForVisit = appointment.service.name;

          await resend.emails.send({
            from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "send@dentalucare.tech"}>`,
            to: appointment.patient.email,
            subject: `Appointment Confirmed - ${appointmentDate}`,
            react: createElement(AppointmentConfirmation, {
              patientName: appointment.patient.name,
              appointmentDate,
              appointmentTime,
              doctorName: appointment.dentist.name,
              appointmentDuration: "60 minutes", // Default duration
              reasonForVisit,
              bookingId: appointment.id,
              patientEmail: appointment.patient.email,
              patientPhone: appointment.patient.phone || undefined,
              clinicPhone: process.env.CLINIC_PHONE || "(043) 756-1234",
              clinicEmail: process.env.CLINIC_EMAIL || "info@dentalucare.com",
              clinicAddress: process.env.CLINIC_ADDRESS || "Baltan Street, Puerto Princesa City, Palawan",
            }),
          });
        } catch (emailError) {
          console.error(`Error sending confirmation email for appointment ${appointment.id}:`, emailError);
        }
      }

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

      // Get appointments with relations for email
      const appointments = await prisma.appointment.findMany({
        where: { id: { in: appointmentIds } },
        include: {
          patient: true,
          dentist: true,
          service: true,
        },
      });

      await prisma.appointment.updateMany({
        where: { id: { in: appointmentIds } },
        data: {
          status: "cancelled",
          cancelReason: cancelReason || "Cancelled by admin",
        },
      });

      // Send cancellation emails
      for (const appointment of appointments) {
        try {
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
              cancelReason: cancelReason || "Cancelled by admin",
              bookingId: appointment.id,
              patientEmail: appointment.patient.email,
              clinicPhone: process.env.CLINIC_PHONE || "(043) 756-1234",
              clinicEmail: process.env.CLINIC_EMAIL || "info@dentalucare.com",
              clinicAddress: process.env.CLINIC_ADDRESS || "Baltan Street, Puerto Princesa City, Palawan",
            }),
          });
        } catch (emailError) {
          console.error(`Error sending cancellation email for appointment ${appointment.id}:`, emailError);
        }
      }

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

