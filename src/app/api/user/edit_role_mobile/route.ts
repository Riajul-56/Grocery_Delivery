import { auth } from "@/auth";
import connectdb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectdb();
    const { role, mobile } = await req.json();
    const session = await auth();
    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      { role, mobile },
      { new: true },
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `edit role and mobile error ${error}` },
      { status: 500 },
    );
  }
}
