import mongoose from "mongoose";

interface IChatRoom {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  deliverBoyId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const chatRoomSchema = new mongoose.Schema<IChatRoom>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliverBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true },
);

const ChatRoom =
  mongoose.models.ChatRoom || mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
