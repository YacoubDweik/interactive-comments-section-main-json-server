import CommentsList from "@/components/CommentsList";
import getData from "../components/getData";
import TextBox from "@/components/TextBox";
import getCurrentUser from "@/components/getCurrentUser";

export default async function Home() {
  const comments = await getData();
  const currentUser = await getCurrentUser();
  return (
    <>
      <CommentsList comments={comments} currentUser={currentUser} />
      <TextBox currentUser={currentUser} type="new" />
    </>
  );
}
