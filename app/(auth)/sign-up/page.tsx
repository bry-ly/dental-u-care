import { Metadata } from "next";
import { SignupForm } from "@/app/(auth)/sign-up/sign-up-form";
import Image from "next/image";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <div className="grid h-screen lg:grid-cols-2">
      <div className="flex flex-col p-4 md:p-6 h-screen overflow-hidden">
        <div className="flex justify-center md:justify-start flex-shrink-0 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <div className=" text-primary-foreground flex size-10 items-center justify-center rounded-lg p-2">
              <Image
                src="/tooth.svg"
                alt="Dental U Care"
                width={24}
                height={24}
              />
            </div>
            Dental U Care
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block h-screen">
        <Image
          src="/doctor-image.jpg"
          alt="Doctor"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-80"
          priority
          fill
        />
      </div>
    </div>
  );
}
