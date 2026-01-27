import { auth } from "@/auth";
import EditRoleMobile from "@/components/EditRoleMobile";
import Navbar from "@/components/Navbar";
import connectdb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

async function Home() {
  await connectdb();
  const session = await auth(); //auth.ts have auth parameter so it access session data
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }

  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role == "user");
  if (inComplete) {
    return <EditRoleMobile />;
  }
  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <>
      <Navbar user={plainUser} />
    </>
  );
}

export default Home;
