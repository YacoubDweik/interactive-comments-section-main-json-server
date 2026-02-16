// This is the old code for API route handler before Supabase DB:

import { NextResponse } from "next/server";

// Function to handle GET request to get the users
export async function GET() {
  const res = await fetch("http://localhost:4000/users");

  const users = await res.json();

  return NextResponse.json(users, {
    status: 200,
  });
}
