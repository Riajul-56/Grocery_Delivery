import connectDb from "@/lib/db";
import ChatRoom from "@/models/chatRoom.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { orderId, userId, deliverBoyId } = await req.json();
    let room = await ChatRoom.findOne({ orderId });

    if (!room) {
      room = await ChatRoom.create({
        orderId,
        userId,
        deliverBoyId,
      });
    }
    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `create room error${error}` },
      { status: 500 },
    );
  }
}
