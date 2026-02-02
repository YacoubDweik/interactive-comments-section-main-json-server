export default async function getData() {
  await new Promise((res) => setTimeout(res, 5000)); // Delay
  const res = await fetch("http://localhost:3000/assets/data.json", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch data"); // Throwing an error is better for Next.js error boundaries
  }

  return res.json();
}
