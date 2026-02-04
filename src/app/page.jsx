import getData from "../components/getData";
import getCurrentUser from "@/components/getCurrentUser";
import App from "@/components/App";

export default async function Home() {
  // Fetch comments & current user from the db
  const data = await getData();
  const currentUser = await getCurrentUser();
  return (
    <>
      <App comments={data} currentUser={currentUser} />
    </>
  );
}
