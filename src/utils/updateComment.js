export default async function updateComment(id, userId, action, payload) {
  const res = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload, userId }),
  });
  return res;
}
