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

    // Generate user ID (MongoDB ObjectId format)
    const userId = crypto.randomUUID();

    // Create user with emailVerified: true (skip verification)
    // Better Auth will handle password hashing when the user logs in
    const user = await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        emailVerified: true, // Skip email verification
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

    // Create account with plain password (Better Auth will hash it when used)
    await prisma.account.create({
      data: {
        id: `${user.id}:credential`,
        userId: user.id,
        accountId: `${user.id}:credential`,
        providerId: "credential",
        password: password, // Plain password - Better Auth handles hashing
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Dentist created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
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
