import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import { Resend } from "resend";
import { createElement } from "react";
import AppointmentConfirmation from "@/components/emails/email-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentData } = body;

    if (!appointmentData) {
      return NextResponse.json(
        { error: "Appointment data is required" },
        { status: 400 }
      );
    }

    interface ServiceItem {
      qty: number;
      description: string;
      unitPrice: number;
      total: number;
    }

    const { patientId, personalInfo, appointment, services, specialRequests } =
      appointmentData as {
        patientId: string;
        personalInfo: {
          firstName: string;
          lastName: string;
          email: string;
          address?: string;
          city?: string;
          barangay?: string;
          contactNumber?: string;
        };
        appointment: {
          dentistId: string;
          dentistName: string;
          date: string;
          time: string;
        };
        services: ServiceItem[];
        specialRequests: string;
      };

    // Validate required fields
    if (
      !patientId ||
      !appointment.dentistId ||
      !appointment.date ||
      !appointment.time
    ) {
      return NextResponse.json(
        { error: "Missing required appointment fields" },
        { status: 400 }
      );
    }

    // Check if time slot is already booked
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        dentistId: appointment.dentistId,
        date: new Date(appointment.date),
        timeSlot: appointment.time,
        status: {
          in: ["pending", "confirmed"],
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    // Create appointments for each service
    const createdAppointments = [];

    for (const service of services) {
      if (service.qty > 0 && service.description) {
        // Find the service in database
        const dbService = await prisma.service.findFirst({
          where: { name: service.description },
        });

        if (dbService) {
          const newAppointment = await prisma.appointment.create({
            data: {
              patientId,
              dentistId: appointment.dentistId,
              serviceId: dbService.id,
              date: new Date(appointment.date),
              timeSlot: appointment.time,
              notes: specialRequests || null,
              status: "pending",
            },
            include: {
              patient: true,
              dentist: true,
              service: true,
            },
          });

          createdAppointments.push(newAppointment);
        }
      }
    }

    if (createdAppointments.length === 0) {
      return NextResponse.json(
        { error: "No valid services selected" },
        { status: 400 }
      );
    }

    // Send confirmation email to patient
    // Format appointment date and time
    const formattedAppointmentDate = new Date(
      appointment.date
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format time to 12-hour format
    const formatTime12Hour = (time24: string): string => {
      const [hours, minutes] = time24.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    const formattedTime = formatTime12Hour(appointment.time);

    // Calculate total duration (sum of all service durations)
    const totalDuration = services
      .filter((s) => s.qty > 0)
      .reduce((sum, s) => {
        // Try to get duration from service, default to 60 minutes
        const serviceDuration = 60; // Default duration
        return sum + s.qty * serviceDuration;
      }, 0);

    // Get reason for visit
    const reasonForVisit =
      specialRequests ||
      services
        .filter((s) => s.qty > 0)
        .map((s) => s.description)
        .join(", ");

    try {
      console.log("Attempting to send confirmation email to:", personalInfo.email);

      const emailResult = await resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "send@dentalucare.tech"}>`,
        to: personalInfo.email,
        subject: `Appointment Confirmation - ${formattedAppointmentDate}`,
        react: createElement(AppointmentConfirmation, {
          patientName: `${personalInfo.firstName} ${personalInfo.lastName}`,
          appointmentDate: formattedAppointmentDate,
          appointmentTime: formattedTime,
          doctorName: appointment.dentistName,
          appointmentDuration: `${totalDuration} minutes`,
          reasonForVisit,
          bookingId: createdAppointments[0]?.id || "PENDING",
          patientEmail: personalInfo.email,
          patientPhone: personalInfo.contactNumber,
          clinicPhone: process.env.CLINIC_PHONE || "(043) 756-1234",
          clinicEmail: process.env.CLINIC_EMAIL || "info@dentalucare.com",
          clinicAddress: process.env.CLINIC_ADDRESS || "Baltan Street, Puerto Princesa City, Palawan",
        }),
      });

      console.log("Confirmation email sent successfully:", emailResult);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      console.error(
        "Email error details:",
        JSON.stringify(emailError, null, 2)
      );
      // Don't fail the appointment creation if email fails
    }

    // Create notification for patient
    await prisma.notification.create({
      data: {
        userId: patientId,
        title: "Appointment Booked",
        message: `Your appointment with Dr. ${appointment.dentistName} has been booked for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`,
        type: "email",
      },
    });

    // Create notification for dentist
    await prisma.notification.create({
      data: {
        userId: appointment.dentistId,
        title: "New Appointment",
        message: `New appointment request from ${personalInfo.firstName} ${personalInfo.lastName} for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`,
        type: "email",
      },
    });

    return NextResponse.json(
      {
        success: true,
        appointments: createdAppointments,
        message:
          "Appointment booked successfully! Check your email for confirmation.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}
