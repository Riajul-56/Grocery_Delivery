import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    await connectDb();
    const { orderId } = await context.params;
    const { status } = await req.json();

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }
    order.status = status;

    let deliveryBoysPayload: any = [];

    if (status === "out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;

      if (!latitude || !longitude) {
        return NextResponse.json(
          { message: "Location not found" },
          { status: 400 },
        );
      }

      const nearByDeliveryBoys = await User.find({
        role: "delivery",
        location: {
          //location gives us some operator
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000, //10 km
          },
        },
      });

      const nearById = nearByDeliveryBoys.map((b) => b._id);

      //when delivery boy busy with other order it find by id
      const busyId = await DeliveryAssignment.find({
        assignedTo: { $in: nearById },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const bysuIdSet = new Set(busyId.map((b) => String(b)));

      const avilableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !bysuIdSet.has(String(b._id)),
      );

      const candidates = avilableDeliveryBoys.map((b) => b._id);

      if (candidates.length == 0) {
        await order.save();

        await emitEventHandler("order-status-update", {
          orderId: order._id,
          status: order.status,
        });

        return NextResponse.json(
          { message: "There are no available delivery boys." },
          { status: 200 },
        );
      }

      // notification give to candidates
      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });

      //==================  status for delivery boy start =================== //

      await deliveryAssignment.populate("order");
      for (const boyId of candidates) {
        const boy = await User.findById(boyId);
        if (boy.socketId) {
          await emitEventHandler(
            "new-assignment",
            deliveryAssignment,
            boy.socketId,
          );
        }
      }
      //==================  status for delivery boy end =================== //

      order.assignment = deliveryAssignment._id;
      deliveryBoysPayload = avilableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));
      await deliveryAssignment.populate("order");
    }

    await order.save();
    await order.populate("user");
    await emitEventHandler("order-status-update", {
      orderId: order._id,
      status: order.status,
    });

    return NextResponse.json(
      {
        assignment: order.assignment?._id,
        availableBoys: deliveryBoysPayload,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `update status error ${error}`,
      },
      { status: 500 },
    );
  }
}
