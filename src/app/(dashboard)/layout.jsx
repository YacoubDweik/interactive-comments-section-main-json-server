import { redirect } from "next/navigation";

// components
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({ children }) {
  // Initiate Supabase:
  const supabase = await createClient();

  // 1. Check if the user is already authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. If they are not logged in, they have to login/signup first to see Dashboard pages
  if (!user) {
    redirect("/login"); //
  }

  return (
    <>
      <Navbar user={user} />
      <main>
        <section className="wrapper" id="wrapper">
          {children}
        </section>
      </main>
    </>
  );
}
