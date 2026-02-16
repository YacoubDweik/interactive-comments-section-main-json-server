// Function to create a new comment (comment/reply)
export const createComment = (body, userId, parentId = null, replyingToUserId = null) => ({
  id: Date.now().toString(),
  content: body,
  createdAt: Date.now(),
  score: 0,
  userId,
  parentId,
  replyingToUserId,
});

// Function to add the new comment to the db
export async function postNewComment(newComment, userId) {
  // 1. You have a new comment object ready to go
  // 2. You send it to YOUR server (the middleman) at /api/comments
  const res = await fetch("http://localhost:3000/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // JSON.stringify turns your JS object into a "string" so it can travel over the internet
    body: JSON.stringify({ comment: newComment, userId }),
  });

  // 3. When the middleman responds, you turn the response back into a JS object
  if (res.status === 201) {
    const json = await res.json(); // "json" is now the saved comment with an ID from the DB

    if (json.error) {
      console.log(json.error.message);
    }

    return res.ok;
  }
}
