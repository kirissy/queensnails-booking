"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/auth/confirm?next=/admin/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send reset email.");
    } finally {
      setSubmitting(false);
    }
  }

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
            Reset your password
          </p>
        </div>

        {sent ? (
          <p className="font-sans text-sm text-charcoal/70">
            If an account exists for {email}, a password reset link has been
            sent. Check your inbox and follow the link to set a new password.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="font-sans text-sm text-charcoal">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-nude/60 bg-cream px-4 py-2.5 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
              />
            </label>

            {error && <p className="font-sans text-sm text-burgundy">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-rose-gold px-6 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <Link
          href="/admin/login"
          className="text-center font-sans text-sm text-charcoal/60 underline hover:text-burgundy"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
