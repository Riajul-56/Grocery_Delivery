"use client";
import { IUser } from "@/models/user.model";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Phone,
  PhoneCall,
  Scooter,
  Timer,
  User,
  UserCheck,
} from "lucide-react";
import mongoose, { set } from "mongoose";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

//========== delivery boy assigned show fuction start ===============//

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
//========== delivery boy assigned show fuction end ===============//

const AdminOrderCard = ({ order }: { order: IOrder }) => {
  const statusOptions = ["pending", "out of delivery"];
  const [expended, setExpended] = useState(false);

  //========== Update order status functionality start ===============//

  const [status, setStatus] = useState<string>("pending");

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const result = await axios.post(
        `/api/admin/update_order_status/${orderId}`,
        { status },
      );
      console.log(result.data);
      setStatus(status);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setStatus(order.status);
  }, [order]);

  //========== Update order status functionality end ===============//

  return (
    <motion.div
      key={order._id?.toString()}
      className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all "
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
        delay: 0.3,
      }}
    >
      {/* ============================= Card header Start =================================== */}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* ================ card header left start ======================= */}

        <div className="space-y-1">
          {/*================ Order ID =============*/}

          <p className="text-lg font-bold flex items-center gap-2 text-green-700">
            <Package size={20} />
            Order #{order._id?.toString().slice(-6)}
          </p>

          {/*================ Paid Or Unpaid =============*/}

          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mt-2 ${
              order.isPaid
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {order.isPaid ? "paid" : "Unpaid"}
          </span>

          {/*================ Time =============*/}

          <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
            <Timer size={16} className="text-green-600" />
            {new Date(order.createdAt!).toLocaleString()}
          </p>

          <div className="nt-3 space-y-1 text-gray-700 text-sm">
            {/*================ Full Name =============*/}

            <p className="flex items-center gap-2 font-semibold">
              <User size={16} className="text-green-600" />
              <span>{order?.address.fullName}</span>
            </p>

            {/*================ Mobile Number =============*/}

            <p className="flex items-center gap-2 font-semibold">
              <Phone size={16} className="text-green-600" />
              <span>{order?.address.mobile}</span>
            </p>

            {/*================ Address =============*/}

            <p className="flex items-center gap-2 font-semibold">
              <MapPin size={16} className="text-green-600" />
              <span>{order?.address.fullAddress}</span>
            </p>
          </div>

          





          {/* ================== Status End =============== */}
        </div>
        {/* ================ card header Right End ======================= */}
      </div>

      {/* ============================= Card header End =================================== */}

      {/* =========================  Item details start =========================== */}

      <div className="border-t border-gray-200 mt-3 pt-3">
        <button
          onClick={() => setExpended((prev) => !prev)}
          className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-600 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Package size={16} className="text-green-600" />
            {expended ? "Hide Order Item" : `View ${order.items.length} Item`}
          </span>
          {expended ? (
            <ChevronUp size={16} className="text-green-600" />
          ) : (
            <ChevronDown size={16} className="text-green-600" />
          )}
        </button>

        <motion.div
          className="overflow-hidden"
          initial={{
            opacity: 0,
            height: 0,
          }}
          animate={{
            opacity: expended ? 1 : 0,
            height: expended ? "auto" : 0,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <div className="nt-3 space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition mt-3"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className=" rounded-lg object-cover border border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} x {item.unit}
                    </p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-gray-800">
                  ৳ {Number(item.price) * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      




      
      {/* ================ total amount end ======================== */}
    </motion.div>
  );
};

export default AdminOrderCard;







