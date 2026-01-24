import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId; //? Optional ID field
  name: string;
  email: string;
  password?: string;
  mobile?: string; //? optional mobile field
  role: "user" | "admin" | "deliveryBoy";
  image?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    mobile: { type: String, required: false },
    role: {
      type: String,
      enum: ["user", "admin", "deliveryBoy"],
      default: "user",
    },
    image: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
