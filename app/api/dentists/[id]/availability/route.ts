import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";

interface WorkingHours {
  [key: string]: {
    start?: string;
    end?: string;
    closed?: boolean;
  };
}

function generateTimeSlots(
  startTime: string,
  endTime: string,
  slotDurationMinutes: number = 30
): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const timeStr = `${currentHour.toString().padStart(2, "0")}:${currentMin
      .toString()
      .padStart(2, "0")}`;
    slots.push(timeStr);

    currentMin += slotDurationMinutes;
    if (currentMin >= 60) {
      currentMin -= 60;
      currentHour += 1;
    }
  }

  return slots;
}

function getDayName(date: Date): string {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[date.getDay()];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const selectedDate = new Date(dateParam);
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Get dentist working hours
    const dentist = await prisma.user.findUnique({
      where: { id, role: "dentist" },
      select: {
        workingHours: true,
        isAvailable: true,
      },
    });

    if (!dentist) {
      return NextResponse.json(
        { error: "Dentist not found" },
        { status: 404 }
      );
    }

    if (!dentist.isAvailable) {
      return NextResponse.json({
        available: false,
        message: "Dentist is currently unavailable",
        timeSlots: [],
      });
    }

    const workingHours = dentist.workingHours as WorkingHours | null;

    if (!workingHours) {
      return NextResponse.json({
        available: false,
        message: "Working hours not configured",
        timeSlots: [],
      });
    }

    const dayName = getDayName(selectedDate);
    const daySchedule = workingHours[dayName];

    if (!daySchedule || daySchedule.closed) {
      return NextResponse.json({
        available: false,
        message: "Dentist is not available on this day",
        timeSlots: [],
      });
    }

    if (!daySchedule.start || !daySchedule.end) {
      return NextResponse.json({
        available: false,
        message: "Working hours not set for this day",
        timeSlots: [],
      });
    }

    // Generate all possible time slots for the day
    const allSlots = generateTimeSlots(daySchedule.start, daySchedule.end);

    // Get existing appointments for this date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        dentistId: id,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: {
          in: ["pending", "confirmed"],
        },
      },
      select: {
        timeSlot: true,
      },
    });

    // Extract booked time slots
    const bookedSlots = new Set(
      existingAppointments.map((apt) => {
        // Handle both "HH:mm" and "HH:mm-HH:mm" formats
        const timeSlot = apt.timeSlot;
        if (timeSlot.includes("-")) {
          return timeSlot.split("-")[0]; // Get start time
        }
        return timeSlot;
      })
    );

    // Filter out booked slots
    const availableSlots = allSlots.filter((slot) => !bookedSlots.has(slot));

    return NextResponse.json({
      available: true,
      timeSlots: availableSlots,
      workingHours: {
        start: daySchedule.start,
        end: daySchedule.end,
      },
    });
  } catch (error) {
    console.error("[GET /api/dentists/[id]/availability] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

