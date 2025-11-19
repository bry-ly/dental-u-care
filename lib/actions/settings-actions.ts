"use server";

import { revalidatePath } from "next/cache";
import { apiPatch, apiPost, apiGet, apiDelete } from "@/lib/utils/api-client";
import type {
  UpdateUserProfileRequest,
  UploadProfileImageRequest,
  ChangePasswordRequest,
  UpdateUserSettingsRequest,
  UpdateAdminSettingsRequest,
  UserSettings,
  AdminSettings,
} from "@/lib/types/api";

// ==================== USER PROFILE ACTIONS ====================

export async function updateUserProfile(data: UpdateUserProfileRequest) {
  try {
    const response = await apiPatch("/api/users/profile", data);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to update profile" };
    }

    revalidatePath("/patient/settings");
    revalidatePath("/dentist/settings");
    revalidatePath("/admin/settings");

    return { success: true, message: response.message || "Profile updated successfully" };
  } catch (error) {
    console.error("[updateUserProfile] Error:", error);
    return { success: false, message: "Failed to update profile" };
  }
}

export async function uploadProfileImage(imageUrl: string) {
  try {
    const data: UploadProfileImageRequest = { imageUrl };
    const response = await apiPost("/api/users/profile/image", data);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to upload profile image" };
    }

    revalidatePath("/patient/settings");
    revalidatePath("/dentist/settings");
    revalidatePath("/admin/settings");

    return { success: true, message: response.message || "Profile image updated successfully" };
  } catch (error) {
    console.error("[uploadProfileImage] Error:", error);
    return { success: false, message: "Failed to upload profile image" };
  }
}

export async function changePassword(data: ChangePasswordRequest) {
  try {
    const response = await apiPost("/api/users/account/change-password", data);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to change password" };
    }

    return { success: true, message: response.message || "Password changed successfully" };
  } catch (error) {
    console.error("[changePassword] Error:", error);
    return { success: false, message: "Failed to change password" };
  }
}

// ==================== USER SETTINGS ACTIONS ====================

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    const response = await apiGet<UserSettings>("/api/users/settings");

    if (!response.success) {
      console.error("[getUserSettings] Error:", response.error);
      return null;
    }

    if (!response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("[getUserSettings] Error:", error);
    return null;
  }
}

export async function updateUserSettings(data: UpdateUserSettingsRequest) {
  try {
    const response = await apiPatch("/api/users/settings", data);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to save settings" };
    }

    return { success: true, message: response.message || "Settings saved successfully" };
  } catch (error) {
    console.error("[updateUserSettings] Error:", error);
    return { success: false, message: "Failed to save settings" };
  }
}

// ==================== ADMIN SETTINGS ACTIONS ====================

export async function getAdminSettings(): Promise<AdminSettings | null> {
  try {
    const response = await apiGet<AdminSettings>("/api/admin/settings");

    if (!response.success) {
      console.error("[getAdminSettings] Error:", response.error);
      return null;
    }

    if (!response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("[getAdminSettings] Error:", error);
    return null;
  }
}

export async function updateAdminSettings(data: UpdateAdminSettingsRequest) {
  try {
    const response = await apiPatch("/api/admin/settings", data);

    if (!response.success) {
      return { success: false, message: response.error || "Failed to save admin settings" };
    }

    revalidatePath("/admin/settings");
    return { success: true, message: response.message || "Admin settings saved successfully" };
  } catch (error) {
    console.error("[updateAdminSettings] Error:", error);
    return { success: false, message: "Failed to save admin settings" };
  }
}

export async function deleteUserAccount() {
  try {
    const response = await apiDelete("/api/users/account");

    if (!response.success) {
      return { success: false, message: response.error || "Failed to delete account" };
    }

    return { success: true, message: response.message || "Account deleted successfully" };
  } catch (error) {
    console.error("[deleteUserAccount] Error:", error);
    return { success: false, message: "Failed to delete account" };
  }
}

export async function exportUserData() {
  try {
    const response = await apiGet<string>("/api/users/account/export");

    if (!response.success) {
      return { success: false, message: response.error || "User data not found" };
    }

    if (!response.data) {
      return { success: false, message: "User data not found" };
    }

    return {
      success: true,
      message: response.message || "Data exported successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("[exportUserData] Error:", error);
    return { success: false, message: "Failed to export data" };
  }
}
