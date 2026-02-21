import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AuthLayout({ children }) {
  // Initiate Supabase:
  const supabase = await createClient();

  // 1. Check if the user is already authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. This is a "Reverse Guard" to kick out logged in users
  // If they are logged in, then they have nothing to do here
  if (user) {
    redirect("/"); //
  }

  return (
    <main className="auth-main">
      <nav>
        <h1>Dojo Helpdesk</h1>
        <Link href="/signup">Sign up</Link>
        <Link href="/login">Login</Link>
      </nav>
      {children}
    </main>
  );
}
