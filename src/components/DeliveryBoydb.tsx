import { auth } from "@/auth";
import DeliveryBoyDashBoard from "./DeliveryBoyDashBoard";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";

async function DeliveryBoydb() {
  await connectDb();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;

  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    deliveryOtpVerification: true,
  });

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.deliverAt).toDateString() === today,
  ).length;
  const todaysEarning = todayOrders * 40;

  return (
    <>
      <DeliveryBoyDashBoard earning={todaysEarning} />
    </>
  );
}

export default DeliveryBoydb;
