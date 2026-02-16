// This is the old code for API route handler before Supabase DB:

import { NextResponse } from "next/server";

// Function to handle GET request to get votes
export async function GET() {
  const res = await fetch("http://localhost:4000/votes");

  const votes = await res.json();

  return NextResponse.json(votes, {
    status: 200,
  });
}
