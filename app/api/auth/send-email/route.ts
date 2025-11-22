import { NextRequest, NextResponse } from "next/server";
import { sendAuthEmail } from "@/lib/email/send-email";

interface SendEmailRequest {
  type: "verification" | "reset-password";
  to: string;
  username?: string;
  url: string;
  userEmail?: string;
}

/**
 * POST /api/auth/send-email
 * Centralized email sending endpoint for authentication emails
 * Uses the shared sendAuthEmail utility
 * Can be adapted to use MCP server if needed
 */
export async function POST(req: NextRequest) {
  try {
    const body: SendEmailRequest = await req.json();
    const { type, to, username, url, userEmail } = body;

    if (!type || !to || !url) {
      return NextResponse.json(
        { error: "Missing required fields: type, to, url" },
        { status: 400 }
      );
    }

    const data = await sendAuthEmail({
      type,
      to,
      username,
      url,
      userEmail,
    });

    return NextResponse.json(
      { message: "Email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { 
        error: "Failed to send email", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

