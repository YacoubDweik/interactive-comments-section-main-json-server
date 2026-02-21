import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Function to handle PATCH request to change score or edit content
export async function PATCH(request, { params }) {
  const { id } = await params; // The Comment ID from the URL
  const { action, payload } = await request.json();
  const supabase = await createClient();

  // 0. SECURE GATE: Get the real user from the session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const commentId = Number(id);
  const secureUserId = user.id; // This is our source of truth

  if (action === "vote") {
    // 1. CHECK: Does a vote already exist for this user & comment?
    const { data: existingVote } = await supabase
      .from("votes")
      .select("id")
      .eq("user_id", secureUserId)
      .eq("comment_id", commentId)
      .maybeSingle(); // Returns the object if found, or null if not.

    // 2. GET CURRENT SCORE: We need the current score to do the math
    const { data: comment } = await supabase.from("comments").select("score").eq("id", commentId).single();
    let currentScore = comment?.score || 0;

    // ✅ USER CLICKED UP (ADD VOTE)
    if (payload === "up") {
      if (existingVote) {
        // Already voted? Do nothing, just return current state
        return NextResponse.json(comment);
      }

      // 1. Add the vote to the 'votes' table
      await supabase.from("votes").insert({ user_id: secureUserId, comment_id: commentId });

      // 2. Update the score in 'comments' table (+1)
      const { data: updatedComment } = await supabase
        .from("comments")
        .update({ score: currentScore + 1 })
        .eq("id", commentId)
        .select()
        .single();

      return NextResponse.json(updatedComment);
    }

    // ✅ USER CLICKED DOWN (REMOVE VOTE)
    if (payload === "down") {
      if (!existingVote) {
        // Nothing to remove? Do nothing.
        return NextResponse.json(comment);
      }

      // 1. Remove the vote from the 'votes' table
      await supabase.from("votes").delete().eq("user_id", secureUserId).eq("comment_id", commentId);

      // 2. Update the score in 'comments' table (-1)
      const { data: updatedComment } = await supabase
        .from("comments")
        .update({ score: currentScore - 1 })
        .eq("id", commentId)
        .select()
        .single();

      return NextResponse.json(updatedComment);
    }
  }

  // Handle other actions (like 'edit' content) here...
  if (action === "edit") {
    // 1. Fetch the comment to check ownership (The Security Gate)
    const { data: comment, error: fetchError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (fetchError || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 2. Compare the owner with the person trying to edit
    if (comment.user_id !== secureUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 3. Update the content
    // We use payload.content because you send { content: body } from the frontend
    const { data: updatedComment, error: updateError } = await supabase
      .from("comments")
      .update({ content: payload.content })
      .eq("id", commentId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedComment, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// Function to handle DELETE request
export async function DELETE(_, { params }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. SECURE GATE: Get the real user from the session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secureUserId = user.id; // This is our source of truth

  // 2. Fetch the comment to see who owns it
  // We use .single() to get just one object, not an array
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("user_id") // We only need the user_id to check ownership
    .eq("id", id)
    .single();

  if (fetchError || !comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // 3. Check Ownership
  if (comment.user_id !== secureUserId) {
    return NextResponse.json({ error: "You are not authorized to delete this comment." }, { status: 403 });
  }

  // 4. Delete the comment
  const { error: deleteError } = await supabase.from("comments").delete().eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
