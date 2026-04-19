import { auth } from "@/auth";
import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();
    const { id } = await context.params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorize" }, { status: 400 });
    }

    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment not found." },
        { status: 400 },
      );
    }

    // =============== if delivery already assigned ============== //
    if (assignment.status !== "broadcasted") {
      return NextResponse.json(
        { message: "Assignment expired." },
        { status: 400 },
      );
    }

    //=========== if delivery boy assigned in another usdr delivery ============//
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["broadcasted", "conpleted"] },
    });
    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "Already Assigned to other orders." },
        { status: 400 },
      );
    }

    // =========== if all ok then assigned a delivery boy ============ //

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    //=========== find order which is assiigned ==============//
    const order = await Order.findById(assignment.order);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }
    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    await order.populate("assignedDeliveryBoy");

    await emitEventHandler("order-assigned", {
      orderId: order._id,
      assignedDeliveryBoy: order.assignedDeliveryBoy,
    });

    // =========== when delivery boy assigned any other order then if user orderd new iten then this delivery boy id not show =========== //

    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        broadcastedTo: deliveryBoyId,
        status: "broadcasted",
      },
      {
        $pull: { broadcastedTo: deliveryBoyId },
      },
    );

    return NextResponse.json(
      { message: "Order accepted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Accept assignment Error ${error}` },
      { status: 500 },
    );
  }
}
