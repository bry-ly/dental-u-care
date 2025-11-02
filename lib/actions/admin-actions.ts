"use server";

import { prisma } from "@/lib/types/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth-session/auth";

// Helper to check if user is admin
async function isAdmin() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return session.user;
}

// ==================== APPOINTMENT ACTIONS ====================

export async function confirmAppointments(appointmentIds: string[]) {
  await isAdmin();

  try {
    await prisma.appointment.updateMany({
      where: { id: { in: appointmentIds } },
      data: { status: "confirmed" },
    });

    revalidatePath("/admin");
    return {
      success: true,
      message: `${appointmentIds.length} appointment(s) confirmed`,
    };
  } catch (error) {
    console.error("Error confirming appointments:", error);
    return { success: false, message: "Failed to confirm appointments" };
  }
}

export async function cancelAppointments(appointmentIds: string[]) {
  await isAdmin();

  try {
    await prisma.appointment.updateMany({
      where: { id: { in: appointmentIds } },
      data: { status: "cancelled", cancelReason: "Cancelled by admin" },
    });

    revalidatePath("/admin");
    return {
      success: true,
      message: `${appointmentIds.length} appointment(s) cancelled`,
    };
  } catch (error) {
    console.error("Error cancelling appointments:", error);
    return { success: false, message: "Failed to cancel appointments" };
  }
}

export async function completeAppointments(appointmentIds: string[]) {
  await isAdmin();

  try {
    await prisma.appointment.updateMany({
      where: { id: { in: appointmentIds } },
      data: { status: "completed" },
    });

    revalidatePath("/admin");
    return {
      success: true,
      message: `${appointmentIds.length} appointment(s) marked as completed`,
    };
  } catch (error) {
    console.error("Error completing appointments:", error);
    return { success: false, message: "Failed to complete appointments" };
  }
}

export async function deleteAppointments(appointmentIds: string[]) {
  await isAdmin();

  try {
    await prisma.appointment.deleteMany({
      where: { id: { in: appointmentIds } },
    });

    revalidatePath("/admin");
    return {
      success: true,
      message: `${appointmentIds.length} appointment(s) deleted`,
    };
  } catch (error) {
    console.error("Error deleting appointments:", error);
    return { success: false, message: "Failed to delete appointments" };
  }
}

export async function deleteAppointment(appointmentId: string) {
  await isAdmin();

  try {
    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    revalidatePath("/admin");
    return { success: true, message: "Appointment deleted successfully" };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, message: "Failed to delete appointment" };
  }
}

// ==================== DENTIST ACTIONS ====================

export async function updateDentistAvailability(
  dentistIds: string[],
  isAvailable: boolean
) {
  await isAdmin();

  try {
    await prisma.user.updateMany({
      where: {
        id: { in: dentistIds },
        role: "dentist",
      },
      data: { isAvailable },
    });

    revalidatePath("/admin/dentist-management");
    return {
      success: true,
      message: `${dentistIds.length} dentist(s) updated`,
    };
  } catch (error) {
    console.error("Error updating dentist availability:", error);
    return { success: false, message: "Failed to update dentist availability" };
  }
}

export async function deleteDentist(dentistId: string) {
  await isAdmin();

  try {
    await prisma.user.delete({
      where: {
        id: dentistId,
        role: "dentist",
      },
    });

    revalidatePath("/admin/dentist-management");
    return { success: true, message: "Dentist deleted successfully" };
  } catch (error) {
    console.error("Error deleting dentist:", error);
    return { success: false, message: "Failed to delete dentist" };
  }
}

// ==================== PATIENT ACTIONS ====================

export async function deletePatients(patientIds: string[]) {
  await isAdmin();

  try {
    await prisma.user.deleteMany({
      where: {
        id: { in: patientIds },
        role: "patient",
      },
    });

    revalidatePath("/admin/patient-management");
    return {
      success: true,
      message: `${patientIds.length} patient(s) deleted`,
    };
  } catch (error) {
    console.error("Error deleting patients:", error);
    return { success: false, message: "Failed to delete patients" };
  }
}

export async function deletePatient(patientId: string) {
  await isAdmin();

  try {
    await prisma.user.delete({
      where: {
        id: patientId,
        role: "patient",
      },
    });

    revalidatePath("/admin/patient-management");
    return { success: true, message: "Patient deleted successfully" };
  } catch (error) {
    console.error("Error deleting patient:", error);
    return { success: false, message: "Failed to delete patient" };
  }
}

// ==================== SERVICE ACTIONS ====================

export async function updateServiceStatus(
  serviceIds: string[],
  isActive: boolean
) {
  await isAdmin();

  try {
    await prisma.service.updateMany({
      where: { id: { in: serviceIds } },
      data: { isActive },
    });

    revalidatePath("/admin/service-management");
    return {
      success: true,
      message: `${serviceIds.length} service(s) updated`,
    };
  } catch (error) {
    console.error("Error updating service status:", error);
    return { success: false, message: "Failed to update service status" };
  }
}

export async function deleteServices(serviceIds: string[]) {
  await isAdmin();

  try {
    await prisma.service.deleteMany({
      where: { id: { in: serviceIds } },
    });

    revalidatePath("/admin/service-management");
    return {
      success: true,
      message: `${serviceIds.length} service(s) deleted`,
    };
  } catch (error) {
    console.error("Error deleting services:", error);
    return { success: false, message: "Failed to delete services" };
  }
}

export async function deleteService(serviceId: string) {
  await isAdmin();

  try {
    await prisma.service.delete({
      where: { id: serviceId },
    });

    revalidatePath("/admin/service-management");
    return { success: true, message: "Service deleted successfully" };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, message: "Failed to delete service" };
  }
}

export async function duplicateService(serviceId: string) {
  await isAdmin();

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return { success: false, message: "Service not found" };
    }

    // Generate a unique ID for the duplicated service
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newId = `${service.id}-copy-${timestamp}-${randomSuffix}`;

    await prisma.service.create({
      data: {
        id: newId,
        name: `${service.name} (Copy)`,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        isActive: false, // Duplicated services start as inactive
      },
    });

    revalidatePath("/admin/service-management");
    return { success: true, message: "Service duplicated successfully" };
  } catch (error) {
    console.error("Error duplicating service:", error);
    return { success: false, message: "Failed to duplicate service" };
  }
}

// ==================== USER ACTIONS ====================

export async function updateUserEmailVerification(
  userIds: string[],
  emailVerified: boolean
) {
  await isAdmin();

  try {
    await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { emailVerified },
    });

    revalidatePath("/admin/user-management");
    return { success: true, message: `${userIds.length} user(s) updated` };
  } catch (error) {
    console.error("Error updating email verification:", error);
    return { success: false, message: "Failed to update email verification" };
  }
}

export async function deleteUsers(userIds: string[]) {
  await isAdmin();

  try {
    // Don't allow deleting admin users
    await prisma.user.deleteMany({
      where: {
        id: { in: userIds },
        role: { not: "admin" },
      },
    });

    revalidatePath("/admin/user-management");
    return { success: true, message: `${userIds.length} user(s) deleted` };
  } catch (error) {
    console.error("Error deleting users:", error);
    return { success: false, message: "Failed to delete users" };
  }
}

export async function deleteUser(userId: string) {
  await isAdmin();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role === "admin") {
      return { success: false, message: "Cannot delete admin users" };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/user-management");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user" };
  }
}
