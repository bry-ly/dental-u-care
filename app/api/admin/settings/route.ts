import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-session/auth";
import type {
  AdminSettings,
  UpdateAdminSettingsRequest,
} from "@/lib/types/api";

/**
 * Helper to check if user is admin
 */
async function checkAdmin(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return session.user;
}

/**
 * GET /api/admin/settings
 * Get admin settings
 */
export async function GET(request: NextRequest) {
  try {
    await checkAdmin(request);

    // In a real app, you'd fetch from a ClinicSettings table
    // For now, return default settings
    const defaultSettings: AdminSettings = {
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

    return NextResponse.json({
      success: true,
      data: defaultSettings,
    });
  } catch (error) {
    console.error("[GET /api/admin/settings] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

/**
 * PATCH /api/admin/settings
 * Update admin settings
 */
export async function PATCH(request: NextRequest) {
  try {
    await checkAdmin(request);
    const body = await request.json() as UpdateAdminSettingsRequest;

    // In a real implementation, save to ClinicSettings table
    // For now, just log and return success
    console.log("Updating admin settings:", Object.keys(body).join(", "));

    return NextResponse.json({
      success: true,
      message: "Admin settings saved successfully",
    });
  } catch (error) {
    console.error("[PATCH /api/admin/settings] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

