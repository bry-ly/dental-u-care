/**
 * Cleanup script to remove orphaned appointments
 * 
 * Orphaned appointments are appointments that reference non-existent:
 * - patients (patientId doesn't exist in User table)
 * - dentists (dentistId doesn't exist in User table)
 * - services (serviceId doesn't exist in Service table)
 * 
 * Run with: npx ts-node --project prisma/tsconfig.json prisma/cleanup-orphaned-appointments.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupOrphanedAppointments() {
  console.log("🔍 Starting cleanup of orphaned appointments...\n");

  try {
    // Get all appointments
    const allAppointments = await prisma.appointment.findMany({
      select: {
        id: true,
        patientId: true,
        dentistId: true,
        serviceId: true,
        date: true,
        status: true,
      },
    });

    console.log(`📊 Found ${allAppointments.length} total appointments\n`);

    // Get all valid IDs
    const [validPatientIds, validDentistIds, validServiceIds] = await Promise.all([
      prisma.user.findMany({
        select: { id: true },
        where: { role: "patient" },
      }),
      prisma.user.findMany({
        select: { id: true },
        where: { role: "dentist" },
      }),
      prisma.service.findMany({
        select: { id: true },
      }),
    ]);

    const validPatientIdSet = new Set(validPatientIds.map((u) => u.id));
    const validDentistIdSet = new Set(validDentistIds.map((u) => u.id));
    const validServiceIdSet = new Set(validServiceIds.map((s) => s.id));

    // Find orphaned appointments
    const orphanedAppointments = allAppointments.filter(
      (apt) =>
        !validPatientIdSet.has(apt.patientId) ||
        !validDentistIdSet.has(apt.dentistId) ||
        !validServiceIdSet.has(apt.serviceId)
    );

    if (orphanedAppointments.length === 0) {
      console.log("✅ No orphaned appointments found. Database is clean!\n");
      return;
    }

    console.log(`⚠️  Found ${orphanedAppointments.length} orphaned appointments:\n`);

    // Log details
    orphanedAppointments.forEach((apt) => {
      const issues: string[] = [];
      if (!validPatientIdSet.has(apt.patientId)) {
        issues.push(`invalid patientId: ${apt.patientId}`);
      }
      if (!validDentistIdSet.has(apt.dentistId)) {
        issues.push(`invalid dentistId: ${apt.dentistId}`);
      }
      if (!validServiceIdSet.has(apt.serviceId)) {
        issues.push(`invalid serviceId: ${apt.serviceId}`);
      }
      console.log(`  - Appointment ${apt.id}: ${issues.join(", ")} (Status: ${apt.status}, Date: ${apt.date.toISOString()})`);
    });

    console.log("\n🗑️  Deleting orphaned appointments...\n");

    // Delete orphaned appointments
    const orphanedIds = orphanedAppointments.map((apt) => apt.id);
    
    const result = await prisma.appointment.deleteMany({
      where: {
        id: { in: orphanedIds },
      },
    });

    console.log(`✅ Successfully deleted ${result.count} orphaned appointment(s)\n`);
    console.log("🎉 Cleanup complete!\n");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run cleanup
cleanupOrphanedAppointments();

