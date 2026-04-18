import { auth } from "@/auth";
import AdminDashBoard from "@/components/AdminDashBoard";
import DeliveryBoydb from "@/components/DeliveryBoydb";
import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Navbar from "@/components/Navbar";
import UserDashBoard from "@/components/UserDashBoard";
import connectdb from "@/lib/db";
import Grocery, { IGrocery } from "@/models/grocery.model";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

async function Home(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  const searchParams = await props.searchParams;

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

  let groceryList: IGrocery[] = [];

  if (user.role === "user") {
    if (searchParams.q) {
      groceryList = await Grocery.find({
        $or: [
          { name: { $regex: searchParams?.q || "", $options: "i" } },
          { category: { $regex: searchParams?.q || "", $options: "i" } },
        ],
      });
    } else {
      groceryList = await Grocery.find({});
    }
  }

  return (
    <>
      <Navbar user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      {user.role == "user" ? (
        <UserDashBoard groceryList={groceryList} />
      ) : user.role == "admin" ? (
        <AdminDashBoard />
      ) : (
        <DeliveryBoydb />
      )}
      <Footer />
    </>
  );
}

export default Home;
