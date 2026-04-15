"use client";
import axios from "axios";
import { ArrowLeft, Package, PackageSearch, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import UserOrderCard from "@/components/UserOrderCard";
import { getSocket } from "@/lib/socket";
import mongoose from "mongoose";
import { IUser } from "@/models/user.model";

interface IOrder {
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

  assignedDeliveryBoy?: IUser;
  assignment?: mongoose.Types.ObjectId;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

const MyOrder = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get("/api/user/my_orders");
        setOrders(result.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getMyOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      setOrders((prev) =>
        prev?.map((o) =>
          o._id === orderId ? { ...o, assignedDeliveryBoy } : o,
        ),
      );
    });
    return () => {
      socket.off("order-assigned");
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-600">
        Loading Your Orders...
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-white to-gray-100 min-h-screen w-full">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative">
        {/* ==================== Heading Part Start ==================== */}

        <div className="fixed top-0 left-0 w-full backdrop:blur-lg bg-white/70 shadow-sm border-b z-50">
          <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
            <button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition cursor-pointer "
              onClick={() => router.push("/")}
            >
              <ArrowLeft size={24} className="text-green-700 " />
            </button>

            <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
          </div>
        </div>
        {/* ==================== Heading Part End ==================== */}

        {/* ==================== Order Items Start ==================== */}

        {orders?.length === 0 ? (
          <div className="pt-20 flex flex-col items-center test-center">
            <PackageSearch size={70} className="text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              No Orders Found
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              It seems you haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {orders.map((order: any, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                <UserOrderCard order={order} />
              </motion.div>
            ))}
          </div>
        )}
        {/* ====================  Order Items End ==================== */}
      </div>
    </div>
  );
};

export default MyOrder;
