import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { orderId: string } }) {
  try {
    await connectDb();
    const orderId = params;
    const order = await Order.findById(orderId).populate("assignedDeliveryBoy");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Get order by id error ${error}` },
      { status: 500 },
    );
  }
}
