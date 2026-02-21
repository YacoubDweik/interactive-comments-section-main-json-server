export default async function deleteComment(id) {
  const res = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    // We throw the specific error message sent from the API
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}
