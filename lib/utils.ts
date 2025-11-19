import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format 24-hour time string to 12-hour format with AM/PM
 * @param time24 - Time string in 24-hour format (HH:mm or HH:mm:ss)
 * @returns Formatted time string in 12-hour format (h:mm AM/PM)
 * @example
 * formatTime12Hour("18:30") // "6:30 PM"
 * formatTime12Hour("09:00") // "9:00 AM"
 * formatTime12Hour("00:00") // "12:00 AM"
 */
export function formatTime12Hour(time24: string): string {
  if (!time24) return "";
  
  // Handle time strings that might already be in 12-hour format
  if (time24.includes("AM") || time24.includes("PM")) {
    return time24;
  }
  
  const [hours, minutes] = time24.split(":");
  if (!hours || !minutes) return time24;
  
  const hour = parseInt(hours, 10);
  if (isNaN(hour)) return time24;
  
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  
  return `${displayHour}:${minutes} ${ampm}`;
}
