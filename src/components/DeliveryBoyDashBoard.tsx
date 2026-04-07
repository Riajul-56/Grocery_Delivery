"use client";

import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LiveMap from "./LiveMap";

interface ILocation {
  latitude: number;
  longitude: number;
}

const DeliveryBoyDashBoard = () => {
  const [assignment, setAssignment] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);

  const [activeOrder, setActiveOrder] = useState<any>(null);

  // ================= user location update functionality start ================== //

  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  // ================= user location update  functionality end ================== //

  const fetchAssignment = async () => {
    try {
      const result = await axios.get("./api/delivery/get_assignment");
      setAssignment(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= delivery location update functionality start ================== //

  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  // ================= delivery location update  functionality end ================== //

  // ================= geo update functionality start ================== //
  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setDeliveryBoyLocation({
          latitude: lat,
          longitude: lon,
        });

        socket.emit("update-location", {
          userId: userData?._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  // ================= geo update functionality start ================== //

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
          longitude: result.data.assignment.order.address.longitude,
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
      <div className="p-4 min-h-screen bg-gray-50 pt-37.5">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Active Delivery
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            order {""}
            <span className="text-green-600 text-semibold">
              #{activeOrder.order._id.slice(-6)}
            </span>
          </p>

          {/* ================live map Start ============================*/}

          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>

          {/* ================live map Start ============================ */}
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
