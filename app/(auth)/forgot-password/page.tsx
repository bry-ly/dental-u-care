import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordForm } from "@/app/(auth)/forgot-password/forgot-password-form";


export default function ForgotPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md p-1">
            <Image
              width={24}
              height={24}
              src={"/tooth.svg"}
              alt="Dental U Care Logo"
              priority
            />
          </div>
          <span>Dental U Care</span>
        </Link>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
