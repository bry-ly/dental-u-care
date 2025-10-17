import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import { PrismaClient } from "@prisma/client";
import VerificationEmail from "@/components/emails/email";

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
          from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "onboarding@resend.dev"}>`,
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
        const { data, error } = await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "onboarding@resend.dev"}>`,
          to: user.email,
          subject: "Verify your email",
          react: VerificationEmail({ username: user.name, verificationUrl: url }),
        });

        if (error) {
          console.error("❌ Email verification error:", error);
          throw error;
        }

        console.log("✅ Verification email sent successfully:", data);
      } catch (error) {
        console.error("❌ Failed to send verification email:", error);
        throw error;
      }
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
  plugins: [
    nextCookies(), // This must be the last plugin in the array
  ],
});
