import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point for the password-reset email link. Supabase's PKCE flow
 * appends `?code=...` to the redirectTo URL passed to
 * resetPasswordForEmail; exchanging it here (server-side, so the session
 * cookie can actually be written) turns it into a real recovery session
 * before handing off to the page that sets the new password.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/admin/reset-password";

  if (!code) {
    return NextResponse.redirect(new URL("/admin/login?error=reset_link_invalid", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/admin/login?error=reset_link_invalid", request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
