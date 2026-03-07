import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId; //? Optional ID field
  name: string;
  email: string;
  password?: string;
  mobile?: string; //? optional mobile field
  role: "user" | "admin" | "deliveryBoy";
  image?: string;
  location: {
    type: {
      type: StringConstructor;
      enum: string[];
      default: string;
    };
    coordinates: {
      type: NumberConstructor[];
      default: number[];
    };
  };
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: String, required: false },
    mobile: { type: String, required: false },
    role: {
      type: String,
      enum: ["user", "admin", "deliveryBoy"],
      default: "user",
    },
    image: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
