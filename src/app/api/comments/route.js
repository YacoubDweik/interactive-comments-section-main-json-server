import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET Comments from Supabase
export async function GET() {
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from("comments")
    .select(
      `id, content, createdAt:created_at, score, userId:user_id, parentId:parent_id, replyingToUserId:replying_to_user_id`,
    )
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(comments, { status: 200 });
}

// POST new comment to Supabase
export async function POST(request) {
  // 1. RECEIVE: The server gets a request object.
  // You run .json() to parse the body text into a JavaScript object.
  const { comment } = await request.json();

  // 2. CONNECT: You create a bridge to Supabase using your API keys.
  const supabase = await createClient();

  // 3. Get the secure user from the JWT cookie
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 4. VALIDATE (Basic): You check if the data exists.
  if (!comment) {
    return NextResponse.json({ error: "Missing comment data" }, { status: 400 });
  }

  // 4. INSERT (The Security Hole):
  // Before You took the 'comment' object EXACTLY as the frontend sent it.
  // This object contains: { content: "yo", user_id: 1, ... }
  // But now we only take the content after we grabbed user_id from the db
  const { data, error } = await supabase
    .from("comments")
    .insert([{ ...comment, user_id: user.id }]) // THE SOURCE OF TRUTH
    .select()
    .single();

  // ... error handling and return
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
