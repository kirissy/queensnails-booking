import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveGoogleAuthCode } from "@/lib/google-calendar";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/admin?google=missing_code", request.url));
  }

  try {
    await saveGoogleAuthCode(code);
    return NextResponse.redirect(new URL("/admin?google=connected", request.url));
  } catch (err) {
    console.error("[google callback]", err);
    return NextResponse.redirect(new URL("/admin?google=error", request.url));
  }
}
