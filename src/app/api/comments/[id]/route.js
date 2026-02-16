import { NextResponse } from "next/server";

// Function to handle PATCH request to change score or edit content
export async function PATCH(req, { params }) {
  const { id } = await params;
  const { action, payload, userId } = await req.json();

  const commentId = Number(id);
  const voterId = Number(userId);

  if (action === "vote") {
    const voteCheckRes = await fetch(`http://localhost:4000/votes?userId=${voterId}&commentId=${commentId}`);

    const existingVotes = await voteCheckRes.json();

    const commentRes = await fetch(`http://localhost:4000/comments/${commentId}`);
    const comment = await commentRes.json();

    let newScore = comment.score;

    // ✅ USER CLICKED UP
    if (payload === "up") {
      if (existingVotes.length > 0) {
        // Already liked → DO NOTHING
        return NextResponse.json(comment);
      }

      newScore += 1;

      await fetch(`http://localhost:4000/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: voterId, commentId }),
      });
    }

    // ✅ USER CLICKED DOWN
    if (payload === "down") {
      if (existingVotes.length === 0) {
        // Nothing to remove → DO NOTHING
        return NextResponse.json(comment);
      }

      newScore -= 1;

      await fetch(`http://localhost:4000/votes/${existingVotes[0].id}`, {
        method: "DELETE",
      });
    }

    const updateRes = await fetch(`http://localhost:4000/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: newScore }),
    });

    const result = await updateRes.json();
    return NextResponse.json(result);
  }

  if (action === "edit") {
    // 1. Fetch the real comment from DB
    const commentRes = await fetch(`http://localhost:4000/comments/${id}`);
    const comment = await commentRes.json();

    if (!comment.id) {
      return NextResponse.json({ error: "comment not found" }, { status: 404 });
    }

    // 2. Check ownership
    if (comment.userId !== userId) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    // 3. Edit
    const res = await fetch(`http://localhost:4000/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Database failed to save comment" },
        {
          status: res.status,
        },
      );
    }
    const newComment = await res.json();
    return NextResponse.json(newComment, {
      status: 201,
    });
  }
}

// Function to handle DELETE request
export async function DELETE(req, { params }) {
  const { id } = await params;
  const { userId } = await req.json(); // frontend sends this

  // 1. Fetch the real comment from DB
  const commentRes = await fetch(`http://localhost:4000/comments/${id}`);
  const comment = await commentRes.json();

  if (!comment.id) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // 2. Check ownership
  if (comment.userId !== userId) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  // 3. Delete
  const res = await fetch(`http://localhost:4000/comments/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: res.status });
  }

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
