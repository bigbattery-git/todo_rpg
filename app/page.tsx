import { getSession } from "@/lib/session";
import Todo from "./(components)/Todo";

export default async function Home() {
  const session = await getSession();
  return (
    <>
      <Todo session={JSON.stringify(session)} />
    </>
  );
}
