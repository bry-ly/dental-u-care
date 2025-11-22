import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import VerificationEmail from "@/components/emails/email-verification";
import { prisma } from "@/lib/types/prisma";

const resend = new Resend(process.env.RESEND_API_KEY!);

/**
 * Better Auth Configuration
 *
 * Best practices:
 * - Use environment variables for secrets and URLs
 * - Enable secure cookies in production
 * - Use rolling sessions for better UX
 * - Cache sessions to reduce database calls
 */
export const auth = betterAuth({
  // Core configuration
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache for 5 minutes
    },
  },

  // Advanced security settings
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "better-auth",
    crossSubDomainCookies: {
      enabled: true, // Works across www and non-www
    },
    defaultCookieAttributes: {
      sameSite: "lax", // CSRF protection while allowing normal navigation
      path: "/",
      // httpOnly is automatically set by Better Auth
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
    },
  },
  // Database adapter
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),

  // Email & Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false, // Don't auto sign-in until email verified
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "send@dentalucare.tech"}>`,
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({ username: user.name, resetUrl: url }),
      });
    },
  },

  // Email verification
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME || "Dental U Care"} <${process.env.EMAIL_SENDER_ADDRESS || "send@dentalucare.tech"}>`,
        to: user.email,
        subject: "Verify your email",
        react: VerificationEmail({
          username: user.name,
          verificationUrl: url,
        }),
      });
    },
  },
  // User model configuration
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "patient",
        input: false, // Don't allow direct input
      },
    },
  },

  // Social authentication providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account", // Always show account selector
      
    },
  },

  // Lifecycle hooks
  onAfterSignUp: async ({ user }: { user: { id: string; role?: string } }) => {
    // Ensure new users have a role
    if (!user.role) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "patient" },
      });
    }
  },

  // Plugins (nextCookies must be last)
  plugins: [nextCookies()],
});
