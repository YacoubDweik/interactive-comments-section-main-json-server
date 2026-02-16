import App from "@/components/App";

// Stop caching
export const dynamic = "force-dynamic";

// Function to call the route handler of users
async function getUsers() {
  const res = await fetch("http://localhost:3000/api/users");

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

// Function to call the route handler of comments
async function getComments() {
  const res = await fetch("http://localhost:3000/api/comments");

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return res.json();
}

// Function to call the route handler of votes
async function getVotes() {
  const res = await fetch("http://localhost:3000/api/votes");

  if (!res.ok) {
    throw new Error("Failed to fetch votes");
  }

  return res.json();
}

export default async function Home() {
  // Fetch users, comments, votes & current user from the db
  const users = await getUsers();
  const comments = await getComments();
  const votes = await getVotes();
  // For now the current user will be Franklin until we use Supabase Auth
  const currentUser = users.find((user) => (user.username = "Franklin Clinton"));
  return (
    <>
      <App users={users} comments={comments} votes={votes} currentUser={currentUser} />
    </>
  );
}
