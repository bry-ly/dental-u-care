import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";
import { auth } from "@/lib/auth-session/auth";
import { headers } from "next/headers";

/**
 * POST /api/admin/users/create-dentist
 * Creates a new dentist user (admin only)
 * No email verification required
 */
export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualifications,
      experience,
      address,
    } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Use Better Auth's signup API to properly handle password hashing
    // This is the same method used in the signup form
    try {
      await auth.api.signUpEmail({
        body: { email, password, name },
        headers: await headers(),
      });
    } catch (error: unknown) {
      // Better Auth will throw if email already exists or validation fails
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("already exists") || errorMessage.includes("Email")) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
      throw error;
    }

    // Find the newly created user to update with additional fields
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Update user with additional fields and mark email as verified
    // Also set the role to dentist explicitly
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true, // Skip email verification for admin-created users
        role: "dentist",
        phone: phone || null,
        address: address || null,
        specialization: specialization || null,
        qualifications: qualifications || null,
        experience: experience ? parseInt(String(experience)) : null,
        isAvailable: true,
        workingHours: {
          monday: { start: "09:00", end: "17:00" },
          tuesday: { start: "09:00", end: "17:00" },
          wednesday: { start: "09:00", end: "17:00" },
          thursday: { start: "09:00", end: "17:00" },
          friday: { start: "09:00", end: "17:00" },
          saturday: { start: "09:00", end: "13:00" },
          sunday: { closed: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Dentist created successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[create-dentist] Error:", error);
    return NextResponse.json(
      { error: "Failed to create dentist" },
      { status: 500 }
    );
  }
}
