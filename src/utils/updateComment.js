export default async function updateComment(id, userId, action, payload) {
  const res = await fetch(`http://localhost:3000/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload, userId }), // Send userId here
  });
  return res;
}
