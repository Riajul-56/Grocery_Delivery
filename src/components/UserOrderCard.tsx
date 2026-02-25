"use client";
import { IOrder } from "@/models/order.model";
import { motion } from "motion/react";

function UserOrderCard({ order }: { order: IOrder }) {
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
            className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(order.status)}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      
    </motion.div>
  );
}

export default UserOrderCard;
