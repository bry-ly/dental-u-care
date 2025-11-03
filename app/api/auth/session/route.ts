import { auth } from "@/lib/auth-session/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/types/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // Fetch the full user object from database to get the role
    // This is necessary because session cache doesn't include additional fields
    if (session.user) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      });

      if (dbUser) {
        // Merge the role from database into the session user object
        session.user = {
          ...session.user,
          role: dbUser.role || "patient", // Default to patient if no role set
        };
      } else {
        // Fallback if user not found in database
        session.user.role = "patient";
      }
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
