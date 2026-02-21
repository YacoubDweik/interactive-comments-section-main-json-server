"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/app/(auth)/AuthForm";
import { createClient } from "@/utils/supabase/client";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();
    setError("");

    const supabase = createClient(); // No need for await here on the client client

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // We don't strictly need emailRedirectTo anymore since there's no email,
      // but keeping it doesn't hurt.
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Since confirmation is OFF, "data.session" will exist immediately!
    if (data.user) {
      // 1. Optional: You could show a quick "Success!" message
      // 2. Redirect straight to the dashboard
      router.push("/");
      
      // Refresh to ensure the Middleware/Layout catches the new session
      router.refresh(); 
    }
  };

  return (
    <section>
      <h2 className="text-center">Sign up</h2>
      {error && <p className="error-message text-red-500 text-center">{error}</p>}
      <AuthForm handleSubmit={handleSubmit} />
    </section>
  );
}
