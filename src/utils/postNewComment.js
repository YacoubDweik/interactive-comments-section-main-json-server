// No more id or createdAt!
export const createComment = (body, userId, parentId = null, replyingToUserId = null) => ({
  content: body,
  user_id: userId,
  parent_id: parentId,
  replying_to_user_id: replyingToUserId,
  score: 0,
});

export async function postNewComment(newComment) {
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: newComment }),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("Failed:", json.error);
    return false;
  }
  return json; // Return the full new comment (with its new ID!)
}
