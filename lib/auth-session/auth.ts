import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import { PrismaClient } from "@prisma/client";
import VerificationEmail from "@/components/emails/email-verification";

const resend = new Resend(process.env.RESEND_API_KEY!);
const prisma = new PrismaClient();

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "",
    process.env.NEXT_PUBLIC_APP_URL || "",
    "http://localhost:3000",
  ],
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  hooks: {
    // Before hooks run before an endpoint is executed
    before: createAuthMiddleware(async (ctx) => {
      // Log all authentication attempts for security monitoring
      if (ctx.path.startsWith("/sign-in")) {
        console.log(
          `[AUTH] Sign-in attempt for: ${ctx.body?.email || "unknown"}`
        );
      }

      // Validate email format for dental care staff (optional domain restriction)
      // Uncomment if you want to restrict staff signups to specific domains
      /*
      if (ctx.path === "/sign-up/email" && ctx.body?.role === "dentist") {
        const email = ctx.body?.email;
        if (!email.endsWith("@dentalucare.com")) {
          throw new APIError("BAD_REQUEST", {
            message: "Staff accounts must use an authorized email domain",
          });
        }
      }
      */

      // Rate limiting check (example - implement your own rate limiting logic)
      if (ctx.path.startsWith("/sign-in") || ctx.path.startsWith("/sign-up")) {
        // Add your rate limiting logic here
        // e.g., check Redis for too many attempts from this IP
      }
    }),

    // After hooks run after an endpoint is executed
    after: createAuthMiddleware(async (ctx) => {
      // Send welcome notification after successful signup
      if (ctx.path.startsWith("/sign-up")) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          console.log(
            `[AUTH] New user registered: ${newSession.user.name} (${newSession.user.email})`
          );

          // Here you could:
          // - Send a welcome email
          // - Create default patient records
          // - Notify admin of new registrations
          // - Track analytics
        }
      }

      // Log successful sign-ins for audit trail
      if (ctx.path.startsWith("/sign-in")) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          console.log(`[AUTH] User signed in: ${newSession.user.email}`);

          // Update last login timestamp
          await prisma.user
            .update({
              where: { id: newSession.user.id },
              data: {
                // Add a lastLoginAt field to your schema if needed
                // lastLoginAt: new Date(),
              },
            })
            .catch((err) => {
              console.error("[AUTH] Failed to update last login:", err);
            });
        }
      }

      // Track password reset completions
      if (ctx.path === "/reset-password") {
        console.log("[AUTH] Password reset completed");
      }
    }),
  },
  account: {
    accountLinking: {
      enabled: true,
    },
    onCreateAccount: async ({ user }: { user: { id: string } }) => {
      // Set default role to "patient" for new accounts
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "patient" },
      });
    },
  },
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
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
