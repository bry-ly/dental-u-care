/**
 * Better Auth Hooks Examples
 * Reference file for additional hook patterns you can implement
 */

import { createAuthMiddleware, APIError } from "better-auth/api";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * BEFORE HOOKS EXAMPLES
 */

// 1. Email Domain Restriction Hook
export const emailDomainRestriction = createAuthMiddleware(async (ctx) => {
  if (ctx.path !== "/sign-up/email") {
    return;
  }
  
  const email = ctx.body?.email;
  const allowedDomains = ["dentalucare.com", "example.com"];
  
  const domain = email?.split("@")[1];
  if (!allowedDomains.includes(domain)) {
    throw new APIError("BAD_REQUEST", {
      message: "Please use an authorized email domain",
    });
  }
});

// 2. Auto-fill User Data Hook
export const autoFillUserData = createAuthMiddleware(async (ctx) => {
  if (ctx.path === "/sign-up/email") {
    // Auto-capitalize name if provided
    if (ctx.body?.name) {
      return {
        context: {
          ...ctx,
          body: {
            ...ctx.body,
            name: ctx.body.name
              .split(" ")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" "),
          },
        },
      };
    }
  }
});

// 3. Role-Based Signup Validation
export const roleBasedValidation = createAuthMiddleware(async (ctx) => {
  if (ctx.path === "/sign-up/email") {
    const role = ctx.body?.role;
    
    // Prevent direct dentist/staff signup without invitation
    if (role === "dentist" || role === "staff") {
      throw new APIError("FORBIDDEN", {
        message: "Staff accounts require an invitation code",
      });
    }
  }
});

// 4. Password Strength Validation
export const passwordStrengthCheck = createAuthMiddleware(async (ctx) => {
  if (ctx.path === "/sign-up/email" || ctx.path === "/reset-password") {
    const password = ctx.body?.password;
    
    if (!password) return;
    
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (
      password.length < minLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber
    ) {
      throw new APIError("BAD_REQUEST", {
        message: "Password must be at least 8 characters and include uppercase, lowercase, and numbers",
      });
    }
  }
});

// 5. Request Logging Hook
export const requestLogger = createAuthMiddleware(async (ctx) => {
  console.log(`[${new Date().toISOString()}] ${ctx.path}`, {
    method: ctx.request?.method,
    headers: ctx.headers,
    query: ctx.query,
  });
});

/**
 * AFTER HOOKS EXAMPLES
 */

// 6. Welcome Email Hook
export const sendWelcomeEmail = createAuthMiddleware(async (ctx) => {
  if (ctx.path.startsWith("/sign-up")) {
    const newSession = ctx.context.newSession;
    if (newSession) {
      // Send welcome email via your email service
      // await emailService.sendWelcome(newSession.user.email);
      console.log(`Welcome email should be sent to: ${newSession.user.email}`);
    }
  }
});

// 7. Analytics Tracking Hook
export const trackAuthEvents = createAuthMiddleware(async (ctx) => {
  const newSession = ctx.context.newSession;
  
  if (!newSession) return;
  
  const eventMap: Record<string, string> = {
    "/sign-up": "user_signup",
    "/sign-in": "user_login",
    "/sign-out": "user_logout",
  };
  
  const eventName = Object.entries(eventMap).find(([path]) => 
    ctx.path.startsWith(path)
  )?.[1];
  
  if (eventName) {
    // Track in your analytics service
    // await analytics.track(eventName, { userId: newSession.user.id });
    console.log(`Analytics event: ${eventName}`, {
      userId: newSession.user.id,
      email: newSession.user.email,
    });
  }
});

// 8. Create Default Patient Profile
export const createDefaultProfile = createAuthMiddleware(async (ctx) => {
  if (ctx.path.startsWith("/sign-up")) {
    const newSession = ctx.context.newSession;
    if (newSession && newSession.user.role === "patient") {
      // Create default patient profile
      // Note: Make sure 'patientProfile' model exists in your Prisma schema
      // await prisma.patientProfile.create({
      //   data: {
      //     userId: newSession.user.id,
      //     // Add default fields
      //   },
      // }).catch((err: Error) => {
      //   console.error("Failed to create patient profile:", err);
      // });
      console.log(`Patient profile should be created for user: ${newSession.user.id}`);
    }
  }
});

// 9. Notification to Admin
export const notifyAdminNewUser = createAuthMiddleware(async (ctx) => {
  if (ctx.path.startsWith("/sign-up")) {
    const newSession = ctx.context.newSession;
    if (newSession) {
      // Notify admin of new user registration
      // await notificationService.send({
      //   to: "admin@dentalucare.com",
      //   subject: "New User Registration",
      //   body: `New user: ${newSession.user.name} (${newSession.user.email})`
      // });
    }
  }
});

// 10. Session Extension Hook
export const extendSessionOnActivity = createAuthMiddleware(async (ctx) => {
  if (ctx.context.newSession) {
    // Extend session expiry on user activity
    const session = ctx.context.newSession;
    console.log(`Session activity detected for user: ${session.user.id}`);
    
    // Update session expiry in database if needed
    // await prisma.session.update({
    //   where: { id: session.id },
    //   data: { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    // });
  }
});

/**
 * UTILITY HOOKS
 */

// 11. Cookie Management Example
export const cookieManagement = createAuthMiddleware(async (ctx) => {
  // Set custom cookies
  ctx.setCookie("custom-cookie", "value", {
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  
  // Set signed cookie for sensitive data
  await ctx.setSignedCookie(
    "secure-cookie",
    "sensitive-value",
    ctx.context.secret,
    {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    }
  );
  
  // Read cookies
  const customCookie = ctx.getCookie("custom-cookie");
  const secureCookie = await ctx.getSignedCookie("secure-cookie", ctx.context.secret);
});

// 12. Redirect Example
export const redirectExample = createAuthMiddleware(async (ctx) => {
  if (ctx.path === "/sign-up/email") {
    const role = ctx.body?.role;
    
    // Redirect dentists to complete profile
    if (role === "dentist") {
      throw ctx.redirect("/onboarding/dentist");
    }
  }
});

// 13. Custom Response Example
export const customResponse = createAuthMiddleware(async (ctx) => {
  if (ctx.path === "/custom-endpoint") {
    return ctx.json({
      success: true,
      message: "Custom response from hook",
      data: {
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * COMBINING MULTIPLE HOOKS
 * 
 * You can combine multiple hooks by returning an array:
 * 
 * hooks: {
 *   before: [
 *     requestLogger,
 *     roleBasedValidation,
 *     passwordStrengthCheck,
 *   ],
 *   after: [
 *     sendWelcomeEmail,
 *     trackAuthEvents,
 *     createDefaultProfile,
 *   ],
 * }
 */
