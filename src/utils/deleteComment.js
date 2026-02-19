export default async function deleteComment(id, userId) {
  const res = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }), // <-- send current user
  });

  if (!res.ok) throw new Error("Failed to delete comment");

  return res.json();
}
