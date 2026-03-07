import mongoose from "mongoose";

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];

  isPaid?: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    city: string;
    state: string;
    country: string;
    postCode: string;
    fullAddress: string;
    mobile: string;
    latitude: number;
    longitude: number;
  };

  assignedDeliveryBoy?: mongoose.Types.ObjectId;
  assignment?: mongoose.Types.ObjectId;
  status: "pending" | "out for delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        grocery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: String,
        price: String,
        unit: String,
        image: String,
        quantity: Number,
      },
    ],

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    address: {
      fullName: String,
      city: String,
      state: String,
      country: String,
      postCode: String,
      fullAddress: String,
      mobile: String,
      latitude: Number,
      longitude: Number,
    },
    totalAmount: Number,

    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "out for delivery", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
