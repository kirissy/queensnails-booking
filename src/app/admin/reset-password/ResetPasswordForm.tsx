"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm text-charcoal">New password</span>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-nude/60 bg-cream px-4 py-2.5 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm text-charcoal">Confirm new password</span>
        <input
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-xl border border-nude/60 bg-cream px-4 py-2.5 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
        />
      </label>

      {error && <p className="font-sans text-sm text-burgundy">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-rose-gold px-6 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark disabled:opacity-50"
      >
        {submitting ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
