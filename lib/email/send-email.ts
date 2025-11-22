import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import VerificationEmail from "@/components/emails/email-verification";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface SendEmailOptions {
  type: "verification" | "reset-password";
  to: string;
  username?: string;
  url: string;
  userEmail?: string;
}

/**
 * Centralized email sending utility
 * Can be used by auth.ts and API routes
 * Can be adapted to use MCP server if needed
 */
export async function sendAuthEmail(options: SendEmailOptions) {
  const { type, to, username, url, userEmail } = options;

  if (!type || !to || !url) {
    throw new Error("Missing required fields: type, to, url");
  }

  const from = `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "send@dentalucare.tech"}>`;

  let subject: string;
  let react: React.ReactElement;

  if (type === "verification") {
    subject = "Verify your email";
    react = React.createElement(VerificationEmail, {
      username: username || "User",
      verificationUrl: url,
    });
  } else if (type === "reset-password") {
    subject = "Reset your password";
    react = React.createElement(ForgotPasswordEmail, {
      username: username || "User",
      resetUrl: url,
      userEmail: userEmail || to,
    });
  } else {
    throw new Error("Invalid email type");
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    react,
  });

  if (error) {
    console.error("Resend API error:", error);
    throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
  }

  return data;
}

