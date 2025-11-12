import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import { PrismaClient } from "@prisma/client";
import VerificationEmail from "@/components/emails/email-verification";

const resend = new Resend(process.env.RESEND_API_KEY!);
const prisma = new PrismaClient();

export const auth = betterAuth({

  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "send@dentalucare.tech"}>`,
          to: user.email,
          subject: "Reset your password",
          react: ForgotPasswordEmail({ username: user.name, resetUrl: url }),
        });
        if (error) {
          console.error("❌ Password reset email error:", error);
          throw error;
        }
        console.log("✅ Password reset email sent successfully:", data);
      } catch (error) {
        console.error("❌ Failed to send password reset email:", error);
        throw error;
      }
    },
    onPasswordReset: async ({ user }) => {
      // Your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        console.log(`[AUTH] Sending verification email to: ${user.email}`);
        const { data, error } = await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "send@dentalucare.tech"}>`,
          to: user.email,
          subject: "Verify your email",
          react: VerificationEmail({
            username: user.name,
            verificationUrl: url,
          }),
        });

        if (error) {
          console.error("❌ Verification email error:", error);
          throw error;
        }

        console.log("✅ Verification email sent successfully:", data);
      } catch (error) {
        console.error("❌ Failed to send verification email:", error);
        throw error;
      }
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback/google`,
    },
  },
  plugins: [nextCookies()], // This must be the last plugin in the array
});

