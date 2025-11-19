/**
 * API Client Utility
 * Helper functions for making API requests from server actions
 */

import { cookies } from "next/headers";
import type { ApiResponse } from "@/lib/types/api";

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * Get the base URL for API requests
 */
function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
}

/**
 * Make an authenticated API request from a server action
 * Cookies are automatically passed from the server action context
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const { body, headers = {}, ...fetchOptions } = options;

  // Get cookies from server action context
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(cookieHeader && { Cookie: cookieHeader }),
    ...headers,
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      success: false,
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));
    return errorData as ApiResponse<T>;
  }

  return response.json() as Promise<ApiResponse<T>>;
}

/**
 * Make a GET request
 */
export async function apiGet<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: "GET" });
}

/**
 * Make a POST request
 */
export async function apiPost<T = unknown>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: "POST", body });
}

/**
 * Make a PATCH request
 */
export async function apiPatch<T = unknown>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: "PATCH", body });
}

/**
 * Make a DELETE request
 */
export async function apiDelete<T = unknown>(
  endpoint: string,
  options?: { body?: unknown }
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: "DELETE", body: options?.body });
}

