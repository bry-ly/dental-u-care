import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import { Resend } from "resend";
import { createElement } from "react";
import DentalInvoice from "@/components/emails/email-bookings";

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

    // Send confirmation email to patient with professional invoice template
    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const invoiceDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const dueDate = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format appointment date and time
    const formattedAppointmentDate = new Date(
      appointment.date
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Calculate next appointment (6 months from now for regular checkup)
    const nextApptDate = new Date(appointment.date);
    nextApptDate.setMonth(nextApptDate.getMonth() + 6);
    const nextAppointmentDate = nextApptDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Calculate total duration (assuming each service takes 60 minutes)
    const totalDuration = services
      .filter((s) => s.qty > 0)
      .reduce((sum, s) => sum + s.qty * 60, 0);

    // Calculate financial totals
    const subtotal = services
      .filter((s) => s.qty > 0)
      .reduce((sum, s) => sum + s.total, 0);
    const tax = subtotal * 0.12; // 12% tax
    const totalDue = subtotal + tax;

    // Filter services with qty > 0 for email
    const activeServices = services.filter((s) => s.qty > 0);

    try {
      console.log("Attempting to send email to:", personalInfo.email);
      console.log(
        "From address:",
        `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`
      );

      const emailResult = await resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: personalInfo.email,
        subject: `Appointment Confirmation - Invoice #${invoiceNumber}`,
        react: createElement(DentalInvoice, {
          invoiceNumber,
          invoiceDate,
          dueDate,
          patientName: `${personalInfo.firstName} ${personalInfo.lastName}`,
          patientAddress: personalInfo.address || "N/A",
          patientCity: personalInfo.city || "N/A",
          patientPhone: personalInfo.contactNumber || "N/A",
          patientEmail: personalInfo.email,
          bookingId: createdAppointments[0]?.id || "PENDING",
          appointmentDate: formattedAppointmentDate,
          appointmentTime: appointment.time,
          doctorName: appointment.dentistName,
          treatmentRoom: "Room 1",
          appointmentDuration: `${totalDuration} minutes`,
          reasonForVisit:
            specialRequests ||
            services
              .filter((s) => s.qty > 0)
              .map((s) => s.description)
              .join(", "),
          pdfDownloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/patient/appointments`,
          paymentStatus: "Pending Payment",
          nextAppointmentDate,
          nextAppointmentTime: appointment.time,
          nextAppointmentPurpose: "Regular Dental Checkup & Cleaning",
          services: activeServices,
          subtotal,
          tax,
          totalDue,
        }),
      });

      console.log("Email sent successfully:", emailResult);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
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
