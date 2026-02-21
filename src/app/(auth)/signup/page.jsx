"use client";

// hooks
import { useRouter } from "next/navigation";
import { useState } from "react";

// components
import AuthForm from "@/app/(auth)/AuthForm";
import { createClient } from "@/utils/supabase/client";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();
    setError("");

    // Initiate Supabase:
    const supabase = await createClient();

    // Check conditionals:
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      console.log(error);
    }
    if (!error) {
      // This is because email confirmation is enabled in my Supabase project
      router.push("/verify");
    }
  };

  return (
    <section>
      <h2 className="text-center">Sign up</h2>
      <AuthForm handleSubmit={handleSubmit} />
    </section>
  );
}
