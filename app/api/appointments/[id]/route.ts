import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import { Resend } from "resend";
import { createElement } from "react";
import AppointmentCancellation from "@/components/emails/email-cancellation";
import AppointmentReschedule from "@/components/emails/email-reschedule";

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, cancelReason, date, timeSlot } = body;
    const { id } = await params;

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
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(cancelReason && { cancelReason }),
        ...(date && { date: new Date(date) }),
        ...(timeSlot && { timeSlot }),
      },
      include: {
        patient: true,
        dentist: true,
        service: true,
      },
    });

    // Send emails and create notifications based on action
    if (status === "cancelled") {
      // Send cancellation email
      try {
        const oldDate = formatDate(appointment.date);
        const oldTime = formatTime12Hour(appointment.timeSlot);
        const reasonForVisit = appointment.service.name;

        await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "send@dentalucare.tech"}>`,
          to: appointment.patient.email,
          subject: `Appointment Cancelled - ${oldDate}`,
          react: createElement(AppointmentCancellation, {
            patientName: appointment.patient.name,
            appointmentDate: oldDate,
            appointmentTime: oldTime,
            doctorName: appointment.dentist.name,
            reasonForVisit,
            cancelReason: cancelReason || "Cancelled by request",
            bookingId: appointment.id,
            patientEmail: appointment.patient.email,
            clinicPhone: process.env.CLINIC_PHONE || "(043) 756-1234",
            clinicEmail: process.env.CLINIC_EMAIL || "info@dentalucare.com",
            clinicAddress: process.env.CLINIC_ADDRESS || "Baltan Street, Puerto Princesa City, Palawan",
          }),
        });
        console.log("Cancellation email sent to:", appointment.patient.email);
      } catch (emailError) {
        console.error("Error sending cancellation email:", emailError);
      }

      // Create notifications
      await prisma.notification.create({
        data: {
          userId: appointment.patientId,
          title: "Appointment Cancelled",
          message: `Your appointment for ${appointment.service.name} on ${new Date(appointment.date).toLocaleDateString()} has been cancelled.`,
          type: "email",
        },
      });

      await prisma.notification.create({
        data: {
          userId: appointment.dentistId,
          title: "Appointment Cancelled",
          message: `Appointment with ${appointment.patient.name} on ${new Date(appointment.date).toLocaleDateString()} has been cancelled.`,
          type: "email",
        },
      });
    } else if (status === "confirmed") {
      // Create notification for confirmation
      await prisma.notification.create({
        data: {
          userId: appointment.patientId,
          title: "Appointment Confirmed",
          message: `Your appointment for ${appointment.service.name} on ${new Date(appointment.date).toLocaleDateString()} has been confirmed.`,
          type: "email",
        },
      });
    } else if (date || timeSlot) {
      // Send reschedule email
      try {
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
        console.log("Reschedule email sent to:", appointment.patient.email);
      } catch (emailError) {
        console.error("Error sending reschedule email:", emailError);
      }

      // Create notifications
      await prisma.notification.create({
        data: {
          userId: appointment.patientId,
          title: "Appointment Rescheduled",
          message: `Your appointment has been rescheduled to ${new Date(updatedAppointment.date).toLocaleDateString()} at ${updatedAppointment.timeSlot}.`,
          type: "email",
        },
      });

      await prisma.notification.create({
        data: {
          userId: appointment.dentistId,
          title: "Appointment Rescheduled",
          message: `Appointment with ${appointment.patient.name} has been rescheduled to ${new Date(updatedAppointment.date).toLocaleDateString()} at ${updatedAppointment.timeSlot}.`,
          type: "email",
        },
      });
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
