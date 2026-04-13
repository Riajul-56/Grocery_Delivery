import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, otp } = await req.json();
    if (!orderId || !otp) {
      return NextResponse.json(
        {
          message: "OrderId or OTP not found",
        },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        { status: 400 },
      );
    }

    if (order.deliveryOtp !== otp) {
      return NextResponse.json(
        {
          message: "Incorrect or expired OTP",
        },
        { status: 400 },
      );
    }

    order.status = "delivered";
    order.deliveryOtpVerification = true;
    order.deliverAt = new Date();
    await order.save();

    await DeliveryAssignment.updateOne(
      {
        order: orderId,
      },
      { $set: { assignedTo: null, status: "completed" } },
    );

    return NextResponse.json(
      {
        message: "Delivery successfully completed",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `verify OTP error${error}`,
      },
      { status: 500 },
    );
  }
}
