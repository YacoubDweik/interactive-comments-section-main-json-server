"use client";

// hooks
import { useState } from "react";
import { useRouter } from "next/navigation";

// components
import AuthForm from "@/app/(auth)/AuthForm";
import { createClient } from "@/utils/supabase/client";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();
    setError("");

    // Initiate Supabase:
    const supabase = await createClient();

    // Check conditionals:
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      console.log(error);
    }
    if (!error) {
      router.push("/");
    }
  };
  return (
    <section>
      <h2 className="text-center">Login</h2>
      <AuthForm handleSubmit={handleSubmit} />
    </section>
  );
}
