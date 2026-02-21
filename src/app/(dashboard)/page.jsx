import App from "@/components/App";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // Directly talk to the DB. No extra fetch() calls.
  const supabase = await createClient();

  // 1. Get the SECURE user from Supabase Auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Safety check (even though middleware handles this, it's good practice)
  if (authError || !user) {
    redirect("/login");
  }

  // 2. Fetch all data + the specific profile of the logged-in user
  const [usersRes, commentsRes, votesRes, currentUserRes] = await Promise.all([
    supabase.from("users").select(),
    supabase
      .from("comments")
      .select(
        `id, content,
         createdAt:created_at,
         score, userId:user_id,
         parentId:parent_id,
         replyingToUserId:replying_to_user_id`,
      )
      .order("created_at", { ascending: true }),
    supabase.from("votes").select(`id, userId:user_id, commentId:comment_id`),
    // Fetch ONLY the row for the logged-in person
    supabase.from("users").select().eq("id", user.id).single(),
  ]);

  // Check if any major request failed
  const responses = [usersRes, commentsRes, votesRes, currentUserRes];
  // Find the first response that has an error
  const firstError = responses.find((res) => res.error)?.error;

  if (firstError) {
    console.error("Database Fetch Error:", firstError);
    throw new Error(`Failed to load data: ${firstError.message}`);
  }

  const users = usersRes.data || [];
  const comments = commentsRes.data || [];
  const votes = votesRes.data || [];
  const currentUser = currentUserRes.data; // This is now the REAL person logged in

  return (
    <>
      <App users={users} comments={comments} votes={votes} currentUser={currentUser} />
    </>
  );
}
