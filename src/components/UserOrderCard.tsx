"use client";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/user.model";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  PhoneCall,
  Scooter,
  Truck,
  UserCheck,
} from "lucide-react";
import mongoose from "mongoose";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

function UserOrderCard({ order }: { order: IOrder }) {
  // ================== item toggle functionality start ========================//
  const [expended, setExpended] = useState(false);
  // ================== item toggle functionality end ========================//

  // ============== order status change function start ================ //

  const [status, setStatus] = useState(order.status);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("order-status-update", (data) => {
      if (data.orderId.toString() == order?._id!.toString()) {
        setStatus(data.status);
      }
    });
    return () => socket.off("order-status-update");
  }, []);

  // ============== order status change function end ================ //

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "out of delivery":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // ============== Track Order function start ================ //
  const router = useRouter();
  // ============== Track Order function end ================ //

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:item-center gap-3 border-b border-gray-100 px-5 py-4 bg-linear-to-r from-green-50 to-white">
        {/* ===================== Order Id & Date start ========================*/}

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order{" "}
            <span className="text-green-700 font-bold">
              #{order?._id?.toString()?.slice(0, 8)}
            </span>
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
        </div>
        {/* ===================== Order Id & Date end ========================*/}

        {/* ======================== Paid Or Unpaid Start ============================ */}

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-2 text-xs font-semibold rounded-full border ${
              order.isPaid
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>

          <span
            className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(status)}`}
          >
            {status}
          </span>
        </div>
      </div>
      {/* ======================== Paid Or Unpaid End ============================ */}

      <div className="p-5 space-y-4">
        {/* ======================== Payment Method start ============================ */}

        {order.paymentMethod == "cod" ? (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Scooter size={16} className="text-green-600" />
            Cash On Delivery
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <CreditCard size={16} className="text-green-600" />
            Online Payment
          </div>
        )}
        {/* ======================== Payment Method End ============================ */}

        {/* ============== show assigned delivery boy start ============= */}

        {order.assignedDeliveryBoy && (
          <>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <UserCheck className="text-blue-600" size={18} />
                <div className="font-semibold text-gray-800 ">
                  <p className="text-xs text-gray-600">
                    Assigned to : <span>{order.assignedDeliveryBoy.name}</span>
                  </p>
                  <p className="text-xs text-gray-600 flex gap-2 items-center mt-1">
                    <PhoneCall className="text-red-600" /> +880{" "}
                    {order.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              </div>
              <a
                href={`tel:+880${order.assignedDeliveryBoy.mobile}`}
                className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                Call
              </a>
            </div>

            {/* ============== live tracking button start============= */}

            <button
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow hover:bg-green-700 transition cursor-pointer"
              onClick={() =>
                router.push(`/user/track_order/${order._id?.toString()}`)
              }
            >
              <Truck size={18} /> Track Your Order
            </button>

            {/* ============== live tracking button boy end============= */}
          </>
        )}

        {/* ============== show assigned delivery boy end============= */}

        {/* ======================== Address Start ============================ */}

        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <MapPin size={16} className="text-green-600" />
          <span className="truncate">{order.address.fullAddress}</span>
        </div>
        {/* ======================== Address End ============================ */}

        <div className="border-t border-gray-200 pt-3">
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
                  {/* ========================= Left side item details start =========================== */}
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
                  {/* ========================= Left side item details end =========================== */}

                  {/* ========================= Right side item details start =========================== */}
                  <p className="text-sm font-semibold text-gray-800">
                    ৳ {Number(item.price) * item.quantity}
                  </p>
                  {/* ========================= Right side item details end =========================== */}
                </div>
              ))}

              <div></div>
            </div>
          </motion.div>
        </div>

        {/* ================ total amount start ======================== */}
        <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Scooter className="text-green-600" size={16} />
            <span>
              Delivery :{" "}
              <span className="text-green-700 font-semibold">
                ${status}
              </span>{" "}
            </span>
          </div>

          <div>
            Total:{" "}
            <span className="text-green-700 font-bold">
              ৳ {order.totalAmount}
            </span>
          </div>
        </div>
        {/* ================ total amount end ======================== */}
      </div>
    </motion.div>
  );
}

export default UserOrderCard;
