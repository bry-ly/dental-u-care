import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, cancelReason, date, timeSlot } = body

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        dentist: true,
        service: true,
      },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
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
    })

    // Create notifications based on action
    if (status === "cancelled") {
      await prisma.notification.create({
        data: {
          userId: appointment.patientId,
          title: "Appointment Cancelled",
          message: `Your appointment for ${appointment.service.name} on ${new Date(appointment.date).toLocaleDateString()} has been cancelled.`,
          type: "email",
        },
      })

      await prisma.notification.create({
        data: {
          userId: appointment.dentistId,
          title: "Appointment Cancelled",
          message: `Appointment with ${appointment.patient.name} on ${new Date(appointment.date).toLocaleDateString()} has been cancelled.`,
          type: "email",
        },
      })
    } else if (status === "confirmed") {
      await prisma.notification.create({
        data: {
          userId: appointment.patientId,
          title: "Appointment Confirmed",
          message: `Your appointment for ${appointment.service.name} on ${new Date(appointment.date).toLocaleDateString()} has been confirmed.`,
          type: "email",
        },
      })
    } else if (date || timeSlot) {
      await prisma.notification.create({
        data: {
          userId: appointment.patientId,
          title: "Appointment Rescheduled",
          message: `Your appointment has been rescheduled to ${new Date(updatedAppointment.date).toLocaleDateString()} at ${updatedAppointment.timeSlot}.`,
          type: "email",
        },
      })

      await prisma.notification.create({
        data: {
          userId: appointment.dentistId,
          title: "Appointment Rescheduled",
          message: `Appointment with ${appointment.patient.name} has been rescheduled to ${new Date(updatedAppointment.date).toLocaleDateString()} at ${updatedAppointment.timeSlot}.`,
          type: "email",
        },
      })
    }

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.appointment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    )
  }
}
