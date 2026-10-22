import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || "tester";
      return NextResponse.redirect(
        `${origin}/dashboard/${role === "owner" ? "owner" : "tester"}`
      );
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || "tester";
      return NextResponse.redirect(
        `${origin}/dashboard/${role === "owner" ? "owner" : "tester"}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=confirmation_failed`);
}
