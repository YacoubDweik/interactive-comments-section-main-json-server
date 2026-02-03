export default async function getCurrentUser() {
  await new Promise((res) => setTimeout(res, 500)); // Delay
  const res = await fetch("http://localhost:4000/currentUser");

  if (!res.ok) {
    throw new Error("Failed to fetch data"); // Throwing an error is better for Next.js error boundaries
  }

  return res.json();
}
