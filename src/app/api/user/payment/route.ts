import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { userId, items, paymentMethod, address, totalAmount } =
      await req.json();
    if (!userId || !items || !paymentMethod || !address || !totalAmount) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      address,
      totalAmount,
    });
  } catch (error) {}
}
