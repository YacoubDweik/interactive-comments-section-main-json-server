export default async function getData() {
  await new Promise((res) => setTimeout(res, 500)); // Delay
  const res = await fetch("http://localhost:4000/comments", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
