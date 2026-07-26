import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 items-center justify-center bg-cream px-6 py-16">
      <div className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-nude/60 bg-cream-dark/30 px-8 py-10">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="queensnails"
            width={1225}
            height={313}
            className="h-8 w-auto"
          />
          <p className="mt-2 font-sans text-sm text-charcoal/60">
            Set a new password
          </p>
        </div>

        {user ? (
          <ResetPasswordForm />
        ) : (
          <>
            <p className="text-center font-sans text-sm text-charcoal/70">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/admin/forgot-password"
              className="text-center font-sans text-sm text-charcoal/60 underline hover:text-burgundy"
            >
              Request a new link
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
