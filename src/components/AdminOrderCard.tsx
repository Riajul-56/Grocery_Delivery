"use client";
import { getSocket } from "@/lib/socket";
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
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

//================ Order Interface (Order Data Structure) =================//

interface IOrder {
  _id?: string;
  user: string;

  // Ordered grocery items
  items: [
    {
      grocery: string;
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

  // Delivery address information
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

  // Assigned delivery boy information
  assignedDeliveryBoy?: IUser;
  assignment?: string;

  // Order status
  status: "pending" | "out of delivery" | "delivered";

  createdAt?: Date;
  updatedAt?: Date;
}

//================ Admin Order Card Component =================//

const AdminOrderCard = ({ order }: { order: IOrder }) => {
  const statusOptions = ["pending", "out of delivery"];

  // Toggle item list expand/collapse
  const [expended, setExpended] = useState(false);

  //================ Order Status Update Logic =================//

  const [status, setStatus] = useState<string>("pending");

  // Update order status from admin panel
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

  // Sync local status with order status
  useEffect(() => {
    setStatus(order.status);
  }, [order]);

  //================ Component UI =================//

  // ============== order status update function start ================ //

  useEffect((): any => {
    const socket = getSocket();
    socket.on("order-status-update", (data) => {
      if (data.orderId.toString() == order?._id!.toString()) {
        setStatus(data.status);
      }
    });
    return () => socket.off("order-status-update");
  }, []);

  // ============== order status update function end ================ //

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
      {/* ================= Card Header ================= */}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* ========= Left Section : Order Information ========= */}

        <div className="space-y-1">
          {/* Order ID */}
          <p className="text-lg font-bold flex items-center gap-2 text-green-700">
            <Package size={20} />
            Order #{order._id?.toString().slice(-6)}
          </p>

          {/* Payment Status */}
          {status !== "delivered" && (
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mt-2 ${
                order.isPaid
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
            >
              {order.isPaid ? "paid" : "Unpaid"}
            </span>
          )}

          {/* Order Creation Time */}
          <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
            <Timer size={16} className="text-green-600" />
            {new Date(order.createdAt!).toLocaleString()}
          </p>

          {/* Customer Information */}
          <div className="nt-3 space-y-1 text-gray-700 text-sm">
            {/* Customer Name */}
            <p className="flex items-center gap-2 font-semibold">
              <User size={16} className="text-green-600" />
              <span>{order?.address.fullName}</span>
            </p>

            {/* Customer Phone */}
            <p className="flex items-center gap-2 font-semibold">
              <Phone size={16} className="text-green-600" />
              <span>{order?.address.mobile}</span>
            </p>

            {/* Delivery Address */}
            <p className="flex items-center gap-2 font-semibold">
              <MapPin size={16} className="text-green-600" />
              <span>{order?.address.fullAddress}</span>
            </p>
          </div>

          {/* Payment Method */}
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-700 ">
            <CreditCard size={16} className="text-green-600" />
            <span>
              {order.paymentMethod == "cod"
                ? "Cash On Delivery"
                : "Online Payment"}
            </span>
          </p>

          {/* Assigned Delivery Boy Info */}
          {order.assignedDeliveryBoy && (
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

              {/* Call Delivery Boy */}
              <a
                href={`tel:+880${order.assignedDeliveryBoy.mobile}`}
                className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                Call
              </a>
            </div>
          )}
        </div>

        {/* ========= Right Section : Order Status ========= */}

        <div className="flex flex-col items-center md:items-end gap-2">
          {/* Status Badge */}
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              status === "delivered"
                ? "bg-green-100 text-green-700"
                : status == "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
            }`}
          >
            {status}
          </span>

          {/* Status Change Dropdown */}
          {status !== "delivered" && (
            <select
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none"
              value={status}
              onChange={(e) =>
                updateStatus(order._id?.toString()!, e.target.value)
              }
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ================= Item List Section ================= */}

      <div className="border-t border-gray-200 mt-3 pt-3">
        {/* Toggle Item List Button */}
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

        {/* Animated Item List */}
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
            {/* Render Ordered Items */}
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition mt-3"
              >
                <div className="flex items-center gap-3">
                  {/* Item Image */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className=" rounded-lg object-cover border border-gray-200"
                  />

                  {/* Item Name & Quantity */}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item.quantity} x {item.unit}
                    </p>
                  </div>
                </div>

                {/* Item Total Price */}
                <p className="text-sm font-semibold text-gray-800">
                  ৳ {Number(item.price) * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ================= Total Amount Section ================= */}

      <div className="border-t mt-3 pt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
        {/* Delivery Status */}
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <Scooter className="text-green-600" size={16} />
          <span>
            Delivery :{" "}
            <span className="text-green-700 font-semibold">{status}</span>{" "}
          </span>
        </div>

        {/* Total Order Amount */}
        <div>
          Total:{" "}
          <span className="text-green-700 font-bold">
            ৳ {order.totalAmount}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOrderCard;
