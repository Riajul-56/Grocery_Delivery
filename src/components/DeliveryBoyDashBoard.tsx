"use client";

import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DeliveryBoyDashBoard = () => {
  const [assignment, setAssignment] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);

  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<any>(null);

  const fetchAssignment = async () => {
    try {
      const result = await axios.get("./api/delivery/get_assignment");
      setAssignment(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= status change functionality start ================== //

  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-assignment", ({ deliveryAssignment }) => {
      setAssignment((prev) => [...prev, deliveryAssignment]);
    });
    return () => socket.off("new-assignment");
  }, []);

  // ================= status change functionality end ================== //

  // ================ accept order start ============================//

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(
        `/api/delivery/assignment/${id}/accept_assignment`,
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  // ================ accept order end ============================//

  // ================ current order start ============================//

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current_order");
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          logitude: result.data.assignment.order.address.logitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================ current order end ============================//

  useEffect(() => {
    fetchCurrentOrder();
    fetchAssignment();
  }, [userData]);

  if (activeOrder && userLocation) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 pt-[150px]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Active Delivery
          </h1>

          <p className="text-gray-600 text-sm mb-4">
            order#{activeOrder.order._id.slice(-6)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mt-30 mb-7.5">Delivery Assignment</h2>
        {assignment.map((a) => (
          <div
            className="p-5 bg-white rounded-xl shadow mb-4 border"
            key={a._id}
          >
            {/* ================ order ID start ==================== */}

            <p>
              <b className="text-green-600">Order ID: </b>#
              {a.order._id.slice(-6)}
            </p>

            {/* ================ order ID end ==================== */}

            {/* ================ order address start ==================== */}

            <p className="text-gray-600 m-1">{a.order.address.fullAddress}</p>

            {/* ================ order address end ==================== */}

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-green-600 text-white py-2 rounded-lg cursor-pointer"
                onClick={() => handleAccept(a?._id)}
              >
                Accept
              </button>

              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg cursor-pointer">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryBoyDashBoard;
