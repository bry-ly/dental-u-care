"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showVerifyNotice, setShowVerifyNotice] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  function togglePassword(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setShowPassword((s) => !s)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })
      const error = result?.error

      if (error) {
        if (error.status === 403) {
          setShowVerifyNotice(true)
          toast.error("Please verify your email address", {
            description: "Check your inbox for the verification link.",
          })
        } else {
          setShowVerifyNotice(false)
          toast.error("Login failed", {
            description: error.message || "Invalid email or password.",
          })
        }
      } else {
        setShowVerifyNotice(false)
        toast.success("Login successful!", {
          description: "Redirecting to dashboard...",
        })
        // Fetch session to get user role
        try {
          const sessionRes = await fetch("/api/auth/session")
          const session = await sessionRes.json()
          const role = session?.user?.role
          const token = session?.token || session?.accessToken || ""
          if (role === "admin") {
            router.push("/admin")
          } else if (role === "dentist") {
            router.push("/dentist")
          } else if (role === "patient") {
            router.push(`/patient${token ? `?token=${token}` : ""}`)
          } else {
            router.push("/")
          }
        } catch {
          router.push("/")
        }
      }
    } catch {
      toast.error("An unexpected error occurred", {
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  async function handleResendVerification(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setResendLoading(true)
    setResendSuccess(false)
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setResendSuccess(true)
        toast.success("Verification email sent!", {
          description: "Check your inbox for the verification link.",
        })
      } else {
        toast.error("Failed to resend verification email.")
      }
    } catch {
      toast.error("Failed to resend verification email.")
    } finally {
      setResendLoading(false)
    }
  }
  }

  async function handleResendVerification(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setResendLoading(true)
    setResendSuccess(false)
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setResendSuccess(true)
        toast.success("Verification email sent!", {
          description: "Check your inbox for the verification link.",
        })
      } else {
        toast.error("Failed to resend verification email.")
      }
    } catch {
      toast.error("Failed to resend verification email.")
    } finally {
      setResendLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    try {
      setIsGoogleLoading(true)
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // Let the redirect happen here
      })
      // After Google sign-in, fetch session and redirect based on role
      try {
        const sessionRes = await fetch("/api/auth/session")
        const session = await sessionRes.json()
        const role = session?.user?.role
        const token = session?.token || session?.accessToken || ""
        if (role === "admin") {
          router.push("/admin")
        } else if (role === "dentist") {
          router.push("/dentist")
        } else if (role === "patient") {
          router.push(`/patient${token ? `?token=${token}` : ""}`)
        } else {
          router.push("/")
        }
      } catch {
        router.push("/")
      }
    } catch (error) {
      console.error("Google sign-in failed:", error)
      toast.error("Google sign-in failed", {
        description: "Please try again.",
      })
      setIsGoogleLoading(false)
    }
  }

  return (
  <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <FieldGroup>
        {showVerifyNotice && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded p-3 text-center mb-2">
            <div className="mb-2">Your email is not verified. Please check your inbox for the verification link.</div>
            <button
              type="button"
              className="underline text-sm text-blue-700 disabled:opacity-60"
              onClick={handleResendVerification}
              disabled={resendLoading || resendSuccess}
            >
              {resendLoading ? "Resending..." : resendSuccess ? "Verification Sent!" : "Resend Verification Email"}
            </button>
          </div>
        )}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input 
            id="email" 
            type="email" 
            placeholder="e.g m@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required 
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={togglePassword}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-1 text-sm opacity-70 hover:opacity-100"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.97 9.97 0 012.175-5.875M6.343 6.343A9.97 9.97 0 0112 5c5.523 0 10 4.477 10 10 0 1.042-.161 2.045-.463 2.998M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading || isGoogleLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button 
            variant="outline" 
            type="button" 
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
          >
            <svg
              width="800px"
              height="800px"
              viewBox="-3 0 262 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
            {isGoogleLoading ? "Signing in..." : "Login with Google"}
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
