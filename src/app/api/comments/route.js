import { NextResponse } from "next/server";

// Function to handle GET request to show the comments
export async function GET() {
  const res = await fetch("http://localhost:4000/comments");

  const comments = await res.json();

  return NextResponse.json(comments, {
    status: 200,
  });
}

// Function to handle POST request to add a new comment (comment/reply)
// This function "catches" the request from the frontend and passes it to the real API
// Real API here is the json-server (port 4000)
export async function POST(request) {
  // The frontend sent a string. This line "unpacks" that string
  // and turns it back into a JavaScript object so we can use it.
  // We call it 'comment' because that's what's inside the request.
  const { comment, userId } = await request.json();

  // Check the user & the comment
  if (!comment || !userId) {
    return NextResponse.json({ error: "Missing comment or userId" }, { status: 400 });
  }

  const userRes = await fetch(`http://localhost:4000/users/${userId}`);
  const user = await userRes.json();

  if (!user.id) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ✅ Add the userId from verified user to the comment just to be sure
  comment.userId = user.id;

  // 1. Talk to the database
  // Now your server (the middleman) acts like a frontend and sends
  // the same data to the actual database (json-server on port 4000).
  const res = await fetch("http://localhost:4000/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // We turn it back into a string to send it to the database
    body: JSON.stringify(comment),
  });

  // 2. CHECK: Did the database actually save it?
  if (!res.ok) {
    // If NOT okay, tell the frontend immediately
    return NextResponse.json(
      { error: "Database failed to save comment" },
      {
        status: res.status, // Send the real error code (e.g., 500 or 404)
      },
    );
  }

  // 3. If we got here, everything is fine!
  // The real database or API here (port 4000) says "Done! I saved it and gave it ID: 99."
  // This line catches that confirmation and turns it into a JS object.
  const newComment = await res.json();

  // Finally, your server (the middleman) sends that confirmed comment (with the ID)
  // back to your Frontend (page.jsx).
  return NextResponse.json(newComment, {
    status: 201,
  });
}
