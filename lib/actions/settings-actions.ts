"use server";

import { prisma } from "@/lib/types/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth-session/auth";

// Helper to get current user
async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user) {
    throw new Error("Unauthorized: Please login");
  }

  return session.user;
}

// ==================== USER PROFILE ACTIONS ====================

export async function updateUserProfile(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}) {
  const user = await getCurrentUser();

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/patient/settings");
    revalidatePath("/dentist/settings");
    revalidatePath("/admin/settings");

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
}

export async function uploadProfileImage(imageUrl: string) {
  const user = await getCurrentUser();

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        image: imageUrl,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/patient/settings");
    revalidatePath("/dentist/settings");
    revalidatePath("/admin/settings");

    return { success: true, message: "Profile image updated successfully" };
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return { success: false, message: "Failed to upload profile image" };
  }
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  await getCurrentUser();

  try {
    // In a real implementation, you would:
    // 1. Verify the current password against data.currentPassword
    // 2. Hash the new password (data.newPassword)
    // 3. Update the password in the account table

    // For now, we'll just simulate success
    // You'll need to implement proper password hashing with bcrypt or similar

    console.log(
      "Password change requested for:",
      data.currentPassword ? "***" : ""
    );

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, message: "Failed to change password" };
  }
} // ==================== USER SETTINGS ACTIONS ====================

export async function getUserSettings(userId: string) {
  try {
    // For now, return default settings since we don't have a settings table
    // In a real app, you'd fetch from a UserSettings table using userId
    console.log("Fetching settings for user:", userId);

    return {
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      promotionalEmails: false,
      reminderTiming: "24",
      profileVisibility: "private",
      shareData: false,
      twoFactorAuth: false,
    };
  } catch (error) {
    console.error("Error getting user settings:", error);
    return null;
  }
}

export async function updateUserSettings(data: {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  appointmentReminders?: boolean;
  promotionalEmails?: boolean;
  reminderTiming?: string;
  profileVisibility?: string;
  shareData?: boolean;
  twoFactorAuth?: boolean;
}) {
  await getCurrentUser();

  try {
    // In a real implementation, you would save these to a UserSettings table
    // For now, we'll just log and return success
    console.log("Updating user settings:", Object.keys(data).join(", "));

    return { success: true, message: "Settings saved successfully" };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, message: "Failed to save settings" };
  }
} // ==================== ADMIN SETTINGS ACTIONS ====================

export async function getAdminSettings() {
  const user = await getCurrentUser();

  if (user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    // In a real app, you'd fetch from a ClinicSettings table
    // For now, return default settings
    return {
      clinicName: "Dental U-Care",
      clinicEmail: "info@dentalucare.com",
      clinicPhone: "+1 (555) 123-4567",
      clinicAddress: "123 Medical Plaza, Suite 100",
      timezone: "America/New_York",
      appointmentDuration: "60",
      bufferTime: "15",
      maxAdvanceBooking: "90",
      cancellationDeadline: "24",
      autoConfirmAppointments: false,
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      reminderHoursBefore: "24",
      newBookingNotifications: true,
      cancellationNotifications: true,
      requirePaymentUpfront: false,
      allowPartialPayment: true,
      depositPercentage: "50",
      acceptCash: true,
      acceptCard: true,
      acceptEWallet: true,
      twoFactorAuth: false,
      sessionTimeout: "60",
      passwordExpiry: "90",
      loginAttempts: "5",
    };
  } catch (error) {
    console.error("Error getting admin settings:", error);
    return null;
  }
}

export async function updateAdminSettings(data: {
  clinicName?: string;
  clinicEmail?: string;
  clinicPhone?: string;
  clinicAddress?: string;
  timezone?: string;
  appointmentDuration?: string;
  bufferTime?: string;
  maxAdvanceBooking?: string;
  cancellationDeadline?: string;
  autoConfirmAppointments?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  appointmentReminders?: boolean;
  reminderHoursBefore?: string;
  newBookingNotifications?: boolean;
  cancellationNotifications?: boolean;
  requirePaymentUpfront?: boolean;
  allowPartialPayment?: boolean;
  depositPercentage?: string;
  acceptCash?: boolean;
  acceptCard?: boolean;
  acceptEWallet?: boolean;
  twoFactorAuth?: boolean;
  sessionTimeout?: string;
  passwordExpiry?: string;
  loginAttempts?: string;
}) {
  const user = await getCurrentUser();

  if (user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    // In a real implementation, save to ClinicSettings table
    // For now, just log and return success
    console.log("Updating admin settings:", Object.keys(data).join(", "));

    revalidatePath("/admin/settings");
    return { success: true, message: "Admin settings saved successfully" };
  } catch (error) {
    console.error("Error updating admin settings:", error);
    return { success: false, message: "Failed to save admin settings" };
  }
}

export async function deleteUserAccount() {
  const user = await getCurrentUser();

  if (user.role === "admin") {
    return { success: false, message: "Cannot delete admin accounts" };
  }

  try {
    await prisma.user.delete({
      where: { id: user.id },
    });

    return { success: true, message: "Account deleted successfully" };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, message: "Failed to delete account" };
  }
}

export async function exportUserData() {
  const user = await getCurrentUser();

  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        appointmentsAsPatient: true,
        appointmentsAsDentist: true,
        payments: true,
        notifications: true,
      },
    });

    if (!userData) {
      return { success: false, message: "User data not found" };
    }

    // Convert to JSON
    const dataExport = JSON.stringify(userData, null, 2);

    return {
      success: true,
      message: "Data exported successfully",
      data: dataExport,
    };
  } catch (error) {
    console.error("Error exporting data:", error);
    return { success: false, message: "Failed to export data" };
  }
}
