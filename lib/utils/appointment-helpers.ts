import { prisma } from "@/lib/types/prisma";
import type { Prisma } from "@prisma/client";

type AppointmentSelect = {
  id: string;
  patientId: string;
  dentistId: string;
  serviceId: string;
  date: Date;
  timeSlot: string;
  status: string;
  notes: string | null;
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type AppointmentWithRelations<TInclude extends Prisma.AppointmentInclude | undefined> =
  TInclude extends Prisma.AppointmentInclude
    ? Prisma.AppointmentGetPayload<{ include: TInclude }>[]
    : AppointmentSelect[];

/**
 * Safely fetch appointments with relations, filtering out orphaned records
 * This prevents Prisma errors when appointments reference non-existent users
 */
export async function safeFindManyAppointments<
  TInclude extends Prisma.AppointmentInclude | undefined = undefined
>(
  args: {
    where?: Prisma.AppointmentWhereInput;
    include?: TInclude;
    orderBy?: Prisma.AppointmentOrderByWithRelationInput | Prisma.AppointmentOrderByWithRelationInput[];
    take?: number;
    skip?: number;
  }
): Promise<AppointmentWithRelations<TInclude>> {
  try {
    // First, get all appointments without relations
    const appointments = await prisma.appointment.findMany({
      where: args.where,
      select: {
        id: true,
        patientId: true,
        dentistId: true,
        serviceId: true,
        date: true,
        timeSlot: true,
        status: true,
        notes: true,
        cancelReason: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: args.orderBy,
      take: args.take,
      skip: args.skip,
    });

    // Get all unique patient and dentist IDs
    const patientIds = [...new Set(appointments.map((apt) => apt.patientId))];
    const dentistIds = [...new Set(appointments.map((apt) => apt.dentistId))];
    const serviceIds = [...new Set(appointments.map((apt) => apt.serviceId))];

    // Verify that all referenced users and services exist
    const [patients, dentists, services] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: patientIds } },
        select: { id: true },
      }),
      prisma.user.findMany({
        where: { id: { in: dentistIds } },
        select: { id: true },
      }),
      prisma.service.findMany({
        where: { id: { in: serviceIds } },
        select: { id: true },
      }),
    ]);

    const validPatientIds = new Set(patients.map((p) => p.id));
    const validDentistIds = new Set(dentists.map((d) => d.id));
    const validServiceIds = new Set(services.map((s) => s.id));

    // Filter out appointments with invalid references
    const validAppointments = appointments.filter(
      (apt) =>
        validPatientIds.has(apt.patientId) &&
        validDentistIds.has(apt.dentistId) &&
        validServiceIds.has(apt.serviceId)
    );

    // If no include needed, return early
    if (!args.include || validAppointments.length === 0) {
      return validAppointments as AppointmentWithRelations<TInclude>;
    }

    // Now fetch the full appointments with relations for valid ones only
    const validAppointmentIds = validAppointments.map((apt) => apt.id);

    try {
      const fullAppointments = await prisma.appointment.findMany({
        where: {
          id: { in: validAppointmentIds },
        },
        include: args.include,
        orderBy: args.orderBy,
      });

      return fullAppointments as AppointmentWithRelations<TInclude>;
    } catch (error) {
      console.error("[safeFindManyAppointments] Error fetching relations:", error);
      // Return appointments without relations if relation fetch fails
      return validAppointments as AppointmentWithRelations<TInclude>;
    }
  } catch (error) {
    console.error("[safeFindManyAppointments] Error:", error);
    // Return empty array on error instead of crashing
    return [] as AppointmentWithRelations<TInclude>;
  }
}

