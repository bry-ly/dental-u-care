import Image from "next/image"
import { Metadata } from "next"
import { LoginForm } from "@/app/(auth)/sign-in/sign-in-form"
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex justify-center md:justify-start flex-shrink-0 mb-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <div className=" text-primary-foreground flex size-10 items-center justify-center rounded-lg p-2">
              <Image src="/tooth.svg" alt="Dental U Care" width={24} height={24} />
            </div>
            Dental U Care
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/dentist.jpg"
          alt="Dental clinic interior"
          fill
          className="object-cover dark:brightness-80"
          priority
        />
      </div>
    </div>
  )
}
