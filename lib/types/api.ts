/**
 * API Response Types
 * Standard response shapes for all API endpoints
 */

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Admin Appointment Operations
 */
export interface ConfirmAppointmentsRequest {
  appointmentIds: string[];
}

export interface CancelAppointmentsRequest {
  appointmentIds: string[];
  cancelReason?: string;
}

export interface CompleteAppointmentsRequest {
  appointmentIds: string[];
}

export interface DeleteAppointmentsRequest {
  appointmentIds: string[];
}

export interface UpdateAppointmentRequest {
  status?: string;
  cancelReason?: string;
  date?: string;
  timeSlot?: string;
  notes?: string;
  [key: string]: unknown;
}

/**
 * Admin Dentist Operations
 */
export interface UpdateDentistAvailabilityRequest {
  dentistIds: string[];
  isAvailable: boolean;
}

/**
 * Admin Patient Operations
 */
export interface DeletePatientsRequest {
  patientIds: string[];
}

/**
 * Admin Service Operations
 */
export interface UpdateServiceStatusRequest {
  serviceIds: string[];
  isActive: boolean;
}

export interface DeleteServicesRequest {
  serviceIds: string[];
}

/**
 * Admin User Operations
 */
export interface UpdateUserEmailVerificationRequest {
  userIds: string[];
  emailVerified: boolean;
}

export interface DeleteUsersRequest {
  userIds: string[];
}

/**
 * User Profile Operations
 */
export interface UpdateUserProfileRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface UploadProfileImageRequest {
  imageUrl: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * User Settings Operations
 */
export interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  promotionalEmails: boolean;
  reminderTiming: string;
  profileVisibility: string;
  shareData: boolean;
  twoFactorAuth: boolean;
}

export interface UpdateUserSettingsRequest {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  appointmentReminders?: boolean;
  promotionalEmails?: boolean;
  reminderTiming?: string;
  profileVisibility?: string;
  shareData?: boolean;
  twoFactorAuth?: boolean;
}

/**
 * Admin Settings Operations
 */
export interface AdminSettings {
  clinicName: string;
  clinicEmail: string;
  clinicPhone: string;
  clinicAddress: string;
  timezone: string;
  appointmentDuration: string;
  bufferTime: string;
  maxAdvanceBooking: string;
  cancellationDeadline: string;
  autoConfirmAppointments: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  reminderHoursBefore: string;
  newBookingNotifications: boolean;
  cancellationNotifications: boolean;
  requirePaymentUpfront: boolean;
  allowPartialPayment: boolean;
  depositPercentage: string;
  acceptCash: boolean;
  acceptCard: boolean;
  acceptEWallet: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: string;
  passwordExpiry: string;
  loginAttempts: string;
}

export interface UpdateAdminSettingsRequest {
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
}

