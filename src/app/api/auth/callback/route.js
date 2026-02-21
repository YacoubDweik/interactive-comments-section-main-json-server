import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    // Initiate Supabase:
    const supabase = await createClient();

    // This swaps the code for a permanent session cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(origin);
    }
  }

  // If something goes wrong, send them to an error page
  return NextResponse.redirect(`${origin}/auth/error`);
}
