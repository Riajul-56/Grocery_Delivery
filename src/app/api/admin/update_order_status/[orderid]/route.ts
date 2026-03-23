import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    await connectDb();
    const { orderId } = await params;
    const { status } = await req.json();
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }
    order.status = status;

    let deliveryBoysPayload: any = [];
    if (status === "Out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.adress;

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          //location gives us some operator
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(latitude), Number(longitude)],
            },
            $maxDistance: 10000, //10 km
          },
        },
      });

      const nearById = nearByDeliveryBoys.map((b) => b._id);

      //when delivery boy busy with other order it find by id
      const busyId = await DeliveryAssignment.find({
        assignedTo: { $in: nearById },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const bysuIdSet = new Set(busyId.map((b) => String(b)));

      const avilableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !bysuIdSet.has(String(b._id)),
      );

      const candidates = avilableDeliveryBoys.map((b) => b._id);

      if (candidates.length == 0) {
        await order.save();
        return NextResponse.json(
          { message: "There are no available delivery boys." },
          { status: 200 },
        );
      }

      // notification give to candidates
      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });

      order.assignment = deliveryAssignment._id;
      deliveryBoysPayload = avilableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));
    }
  } catch (error) {
    console.log(error);
  }
}