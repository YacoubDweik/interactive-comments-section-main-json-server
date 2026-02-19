import App from "@/components/App";
import { createClient } from "@/utils/supabase/server";

// Stop caching
export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const [usersRes, commentsRes, votesRes] = await Promise.all([
    supabase.from("users").select(),
    supabase
      .from("comments")
      .select(
        `id, content, createdAt:created_at, score, userId:user_id, parentId:parent_id, replyingToUserId:replying_to_user_id`,
      )
      .order("created_at", { ascending: true }),
    supabase.from("votes").select(`id, userId:user_id, commentId:comment_id`),
  ]);

  const users = usersRes.data || [];
  const comments = commentsRes.data || [];
  const votes = votesRes.data || [];

  // Now I am setting the user manually but later I will use Supabase auth system
  const currentUser = users.find((user) => user.username === "Franklin Clinton");
  return (
    <>
      <App users={users} comments={comments} votes={votes} currentUser={currentUser} />
    </>
  );
}
