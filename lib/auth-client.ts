import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // You can pass client configuration here
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

/**
 * Sign in with email and password
 * @param email - User's email address
 * @param password - User's password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const data = await authClient.signIn.email(
    {
      email,
      password,
    },
    {
      onError: (ctx) => {
        // Handle the error
        if (ctx.error.status === 403) {
          throw new Error("Please verify your email address");
        }
        throw new Error(ctx.error.message);
      },
    }
  );
  return data;
};

/**
 * Sign in with Google using OAuth
 * This will redirect the user to Google's consent screen
 */
export const signInWithGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
  return data;
};

/**
 * Sign in with Google using ID Token
 * Useful when you already have the Google ID Token from client-side
 * @param token - Google ID Token
 * @param accessToken - Google Access Token (optional)
 */
export const signInWithGoogleIdToken = async (
  token: string,
  accessToken?: string
) => {
  const data = await authClient.signIn.social({
    provider: "google",
    idToken: {
      token,
      accessToken,
    },
  });
  return data;
};

/**
 * Request additional Google scopes (e.g., Google Drive, Gmail)
 * @param scopes - Array of Google API scopes to request
 */
export const requestAdditionalGoogleScopes = async (scopes: string[]) => {
  await authClient.linkSocial({
    provider: "google",
    scopes,
  });
};
