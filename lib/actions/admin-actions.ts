"use server";

import { revalidatePath } from "next/cache";
import { apiPost, apiPatch, apiDelete } from "@/lib/utils/api-client";
import type { Prisma } from "@prisma/client";

// ==================== APPOINTMENT ACTIONS ====================

export async function confirmAppointments(appointmentIds: string[]) {
  try {
    const response = await apiPost("/api/admin/appointments", {
      action: "confirm",
      appointmentIds,
    });

    if (!response.success) {
      return { success: false, message: response.error || "Failed to confirm appointments" };
    }

    // Revalidate all relevant paths
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/admin/appointment-management");
    revalidatePath("/dashboard/patient/appointments");
    revalidatePath("/dashboard/dentist/appointments");

    return {
      success: true,
      message: response.message || `${appointmentIds.length} appointment(s) confirmed`,
    };
  } catch (error) {
    console.error("[confirmAppointments] Error:", error);
    return { success: false, message: "Failed to confirm appointments" };
  }
}

export async function cancelAppointments(appointmentIds: string[], cancelReason?: string) {
  try {
    const response = await apiPost("/api/admin/appointments", {
      action: "cancel",
      appointmentIds,
      cancelReason,
    });

    if (!response.success) {
      return { success: false, message: response.error || "Failed to cancel appointments" };
    }

    // Revalidate all relevant paths
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/admin/appointment-management");
    revalidatePath("/dashboard/patient/appointments");
    revalidatePath("/dashboard/dentist/appointments");

    return {
      success: true,
      message: response.message || `${appointmentIds.length} appointment(s) cancelled`,
    };
  } catch (error) {
    console.error("[cancelAppointments] Error:", error);
    return { success: false, message: "Failed to cancel appointments" };
  }
}

export async function completeAppointments(appointmentIds: string[]) {
  try {
    const response = await apiPost("/api/admin/appointments", {
      action: "complete",
      appointmentIds,
    });

    if (!response.success) {
      return { success: false, message: response.error || "Failed to complete appointments" };
    }

    // Revalidate all relevant paths
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/admin/appointment-management");
    revalidatePath("/dashboard/patient/appointments");
    revalidatePath("/dashboard/dentist/appointments");

    return {
      success: true,
      message: response.message || `${appointmentIds.length} appointment(s) marked as completed`,
    };
  } catch (error) {
    console.error("[completeAppointments] Error:", error);
    return { success: false, message: "Failed to complete appointments" };
  }
}

export async function deleteAppointments(appointmentIds: string[]) {
  try {
    const response = await apiPost("/api/admin/appointments", {
      action: "delete",
      appointmentIds,
    });

    if (!response.success) {
      return { success: false, message: response.error || "Failed to delete appointments" };
    }

    revalidatePath("/dashboard/admin");
    return {
      success: true,
      message: response.message || `${appointmentIds.length} appointment(s) deleted`,
    };
  } catch (error) {
    console.error("[deleteAppointments] Error:", error);
    return { success: false, message: "Failed to delete appointments" };
  }
}

export async function deleteAppointment(appointmentId: string) {
  try {
    const response = await apiDelete(`/api/admin/appointments/${appointmentId}`);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to delete appointment" };
    }

    revalidatePath("/dashboard/admin");
    return { success: true, message: response.message || "Appointment deleted successfully" };
  } catch (error) {
    console.error("[deleteAppointment] Error:", error);
    return { success: false, message: "Failed to delete appointment" };
  }
}

export async function updateAppointment(
  appointmentId: string,
  data: Prisma.AppointmentUpdateInput
) {
  try {
    // Convert Prisma update input to API request format
    const updateData: Record<string, unknown> = {};
    if (data.status) updateData.status = data.status;
    if (data.cancelReason !== undefined) updateData.cancelReason = data.cancelReason;
    if (data.date) updateData.date = data.date instanceof Date ? data.date.toISOString() : data.date;
    if (data.timeSlot !== undefined) updateData.timeSlot = data.timeSlot;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const response = await apiPatch(`/api/admin/appointments/${appointmentId}`, updateData);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to update appointment" };
    }

    // Revalidate all relevant paths
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/admin/appointment-management");
    revalidatePath("/dashboard/patient/appointments");
    revalidatePath("/dashboard/dentist/appointments");

    return { success: true, message: response.message || "Appointment updated successfully" };
  } catch (error) {
    console.error("[updateAppointment] Error:", error);
    return { success: false, message: "Failed to update appointment" };
  }
}

// ==================== DENTIST ACTIONS ====================

export async function updateDentistAvailability(
  dentistIds: string[],
  isAvailable: boolean
) {
  try {
    const response = await apiPatch("/api/admin/dentists", {
      dentistIds,
      isAvailable,
    });

    if (!response.success) {
      return { success: false, message: response.error || "Failed to update dentist availability" };
    }

    revalidatePath("/dashboard/admin/dentist-management");
    return {
      success: true,
      message: response.message || `${dentistIds.length} dentist(s) updated`,
    };
  } catch (error) {
    console.error("[updateDentistAvailability] Error:", error);
    return { success: false, message: "Failed to update dentist availability" };
  }
}

export async function deleteDentist(dentistId: string) {
  try {
    const response = await apiDelete(`/api/admin/dentists/${dentistId}`);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to delete dentist" };
    }

    revalidatePath("/dashboard/admin/dentist-management");
    return { success: true, message: response.message || "Dentist deleted successfully" };
  } catch (error) {
    console.error("[deleteDentist] Error:", error);
    return { success: false, message: "Failed to delete dentist" };
  }
}

// ==================== PATIENT ACTIONS ====================

export async function deletePatients(patientIds: string[]) {
  try {
    const response = await apiDelete("/api/admin/patients", {
      body: { patientIds },
    });

    if (!response.success) {
      return { success: false, message: response.error || "Failed to delete patients" };
    }

    revalidatePath("/dashboard/admin/patient-management");
    return {
      success: true,
      message: response.message || `${patientIds.length} patient(s) deleted`,
    };
  } catch (error) {
    console.error("[deletePatients] Error:", error);
    return { success: false, message: "Failed to delete patients" };
  }
}

export async function deletePatient(patientId: string) {
  try {
    const response = await apiDelete(`/api/admin/patients/${patientId}`);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to delete patient" };
    }

    revalidatePath("/dashboard/admin/patient-management");
    return { success: true, message: response.message || "Patient deleted successfully" };
  } catch (error) {
    console.error("[deletePatient] Error:", error);
    return { success: false, message: "Failed to delete patient" };
  }
}

// ==================== SERVICE ACTIONS ====================

export async function updateServiceStatus(
  serviceIds: string[],
  isActive: boolean
) {
  try {
    const response = await apiPatch("/api/admin/services", {
      serviceIds,
      isActive,
    });

    if (!response.success) {
      return { success: false, message: response.error || "Failed to update service status" };
    }

    revalidatePath("/dashboard/admin/service-management");
    return {
      success: true,
      message: response.message || `${serviceIds.length} service(s) updated`,
    };
  } catch (error) {
    console.error("[updateServiceStatus] Error:", error);
    return { success: false, message: "Failed to update service status" };
  }
}

export async function deleteServices(serviceIds: string[]) {
  try {
    const response = await apiDelete("/api/admin/services", {
      body: { serviceIds },
    });

    if (!response.success) {
      return { success: false, message: response.error || "Failed to delete services" };
    }

    revalidatePath("/dashboard/admin/service-management");
    return {
      success: true,
      message: response.message || `${serviceIds.length} service(s) deleted`,
    };
  } catch (error) {
    console.error("[deleteServices] Error:", error);
    return { success: false, message: "Failed to delete services" };
  }
}

export async function deleteService(serviceId: string) {
  try {
    const response = await apiDelete(`/api/admin/services/${serviceId}`);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to delete service" };
    }

    revalidatePath("/dashboard/admin/service-management");
    return { success: true, message: response.message || "Service deleted successfully" };
  } catch (error) {
    console.error("[deleteService] Error:", error);
    return { success: false, message: "Failed to delete service" };
  }
}

export async function duplicateService(serviceId: string) {
  try {
    const response = await apiPost(`/api/admin/services/${serviceId}/duplicate`);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to duplicate service" };
    }

    revalidatePath("/dashboard/admin/service-management");
    return { success: true, message: response.message || "Service duplicated successfully" };
  } catch (error) {
    console.error("[duplicateService] Error:", error);
    return { success: false, message: "Failed to duplicate service" };
  }
}

// ==================== USER ACTIONS ====================

export async function updateUserEmailVerification(
  userIds: string[],
  emailVerified: boolean
) {
  try {
    const response = await apiPatch("/api/admin/users", {
      userIds,
      emailVerified,
    });

    if (!response.success) {
      return { success: false, message: response.error || "Failed to update email verification" };
    }

    revalidatePath("/dashboard/admin/user-management");
    return { success: true, message: response.message || `${userIds.length} user(s) updated` };
  } catch (error) {
    console.error("[updateUserEmailVerification] Error:", error);
    return { success: false, message: "Failed to update email verification" };
  }
}

export async function deleteUsers(userIds: string[]) {
  try {
    const response = await apiDelete("/api/admin/users", {
      body: { userIds },
    });

    if (!response.success) {
      return { success: false, message: response.error || "Failed to delete users" };
    }

    revalidatePath("/dashboard/admin/user-management");
    return { success: true, message: response.message || `${userIds.length} user(s) deleted` };
  } catch (error) {
    console.error("[deleteUsers] Error:", error);
    return { success: false, message: "Failed to delete users" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const response = await apiDelete(`/api/admin/users/${userId}`);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to delete user" };
    }

    revalidatePath("/dashboard/admin/user-management");
    return { success: true, message: response.message || "User deleted successfully" };
  } catch (error) {
    console.error("[deleteUser] Error:", error);
    return { success: false, message: "Failed to delete user" };
  }
}
