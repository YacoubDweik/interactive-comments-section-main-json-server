import CommentsList from "@/components/CommentsList";
import getData from "../components/getData";
import AddComment from "@/components/AddComment";

export default async function Home() {
  const { currentUser, comments } = await getData();
  return (
    <>
      <CommentsList comments={comments} />
      <AddComment currentUser={currentUser} />
    </>
  );
}
