import getData from "../components/getData";
import getCurrentUser from "@/components/getCurrentUser";
import App from "@/components/App";

export default async function Home() {
  const comments = await getData();
  const currentUser = await getCurrentUser();
  return (
    <>
      <App initialComments={comments} currentUser={currentUser} />
    </>
  );
}
