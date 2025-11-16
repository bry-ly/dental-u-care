import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import { safeFindManyAppointments } from "@/lib/utils/appointment-helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { patientId, dentistId, serviceId, date, timeSlot, notes } = body;

    // Validate required fields
    if (!patientId || !dentistId || !serviceId || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if time slot is already booked
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        dentistId,
        date: new Date(date),
        timeSlot,
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

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        dentistId,
        serviceId,
        date: new Date(date),
        timeSlot,
        notes: notes || null,
        status: "pending",
      },
      include: {
        patient: true,
        dentist: true,
        service: true,
      },
    });

    // Create notification for patient
    await prisma.notification.create({
      data: {
        userId: patientId,
        title: "Appointment Booked",
        message: `Your appointment for ${appointment.service.name} has been booked for ${new Date(date).toLocaleDateString()} at ${timeSlot}`,
        type: "email",
      },
    });

    // Create notification for dentist
    await prisma.notification.create({
      data: {
        userId: dentistId,
        title: "New Appointment",
        message: `New appointment request from ${appointment.patient.name} for ${new Date(date).toLocaleDateString()} at ${timeSlot}`,
        type: "email",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    let appointments;

    if (role === "patient") {
      appointments = await safeFindManyAppointments({
        take: 100, // Limit to 100 most recent appointments
        where: {
          patientId: userId || session.user.id,
        },
        include: {
          dentist: true,
          service: true,
          payment: true,
        },
        orderBy: {
          date: "desc",
        },
      });
    } else if (role === "dentist") {
      appointments = await safeFindManyAppointments({
        take: 100, // Limit to 100 most recent appointments
        where: {
          dentistId: userId || session.user.id,
        },
        include: {
          patient: true,
          service: true,
          payment: true,
        },
        orderBy: {
          date: "desc",
        },
      });
    } else {
      // Admin - get all appointments with pagination limit
      // Use safe find to filter out orphaned appointments
      appointments = await safeFindManyAppointments({
        take: 100, // Limit to 100 most recent appointments
        include: {
          patient: true,
          dentist: true,
          service: true,
          payment: true,
        },
        orderBy: {
          date: "desc",
        },
      });
    }

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
