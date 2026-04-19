"use client";

import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LiveMap from "./LiveMap";
import DeliveryChat from "./DeliveryChat";
import { Loader } from "lucide-react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ILocation {
  latitude: number;
  longitude: number;
}

const DeliveryBoyDashBoard = ({ earning }: { earning: number }) => {
  const [assignment, setAssignment] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);

  const [activeOrder, setActiveOrder] = useState<any>(null);

  //? ================= user location update functionality start ================== //

  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  //? ================= user location update  functionality end ================== //

  const fetchAssignment = async () => {
    try {
      const result = await axios.get("./api/delivery/get_assignment");
      setAssignment(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  //? ================= delivery location update functionality start ================== //

  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  //? ================= delivery location update  functionality end ================== //

  //? ================= geo update functionality start ================== //
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

  //? ================= geo update functionality start ================== //

  //? ================= status change functionality start ================== //

  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-assignment", ({ deliveryAssignment }) => {
      setAssignment((prev) => [...prev, deliveryAssignment]);
    });
    return () => socket.off("new-assignment");
  }, []);

  //? ================= status change functionality end ================== //

  //? ================ accept order start ============================//

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(
        `/api/delivery/assignment/${id}/accept_assignment`,
      );
      fetchCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };

  //? ================ accept order end ============================//

  //? ================ current order start ============================//

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

  //? ================ current order end ============================//

  //? ================ delivery boy OTP function Start ============================ //

  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  const sendOtp = async () => {
    setSendOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/send", {
        orderId: activeOrder.order._id,
      });
      console.log(result.data);
      setShowOtpBox(true);
      setSendOtpLoading(false);
    } catch (error) {
      console.log(error);
      setSendOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setVerifyOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/verify", {
        orderId: activeOrder.order._id,
        otp,
      });
      console.log(result.data);
      setActiveOrder(null);
      setVerifyOtpLoading(false);
      await fetchCurrentOrder();
      window.location.reload();
    } catch (error) {
      setOtpError("OTP verification Error");
      setVerifyOtpLoading(false);
    }
  };
  //? ================ delivery boy OTP function End ============================ //

  useEffect(() => {
    fetchCurrentOrder();
    fetchAssignment();
  }, [userData]);

  // ================== delivery boy Dashboard start ==================//

  if (!activeOrder && assignment.length === 0) {
    const todayEarning = [{ name: "Today", earning, deliveries: earning / 40 }];
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white to-green-50 p-6 ">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            No Active Deliveries 🚛
          </h2>

          <p className="text-gray-500 mb-5">
            Stay online to receive new orders
          </p>

          <div className="bg-white border rounded-xl shadow-xl p-6">
            <h2 className="font-medium text-green-700 mb-2">
              Today's Performance
            </h2>
            {/* ===================== orders reviews start =================== */}

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={todayEarning}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="earning" name="Earning (৳)" />
                <Bar dataKey="deliveries" name="Deliveries" />
              </BarChart>
            </ResponsiveContainer>

            <p className="mt-4 text-lg font-bold text-green-700">
              {earning || 0}৳ Earned Today
            </p>
            <button
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Refresh Earning
            </button>

            {/* ===================== orders reviews start =================== */}
          </div>
        </div>
      </div>
    );
  }

  // ================== delivery boy Dashboard end ==================//

  if (activeOrder && userLocation) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 mt-37.5">
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

          {/* ================live map End ============================ */}

          {/* ================ delivery boy chat start ============================ */}

          <DeliveryChat
            orderId={activeOrder.order._id}
            deliveryBoyId={userData?._id?.toString()!}
          />

          {/* ================ delivery boy chat End ============================ */}

          {/* ================ delivery boy OTP Start ============================ */}

          <div className="mt-6 bg-white rounded-xl border shadow p-6">
            {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
              <button
                className="w-full py-4 bg-green-600 text-center text-white cursor-pointer rounded-lg flex items-center justify-center"
                onClick={sendOtp}
              >
                {sendOtpLoading ? (
                  <Loader size={16} className="animate-spin text-white" />
                ) : (
                  "Mark as Delivered"
                )}
              </button>
            )}

            {showOtpBox && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enfer OTP"
                  maxLength={4}
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  className="w-full py-3 border rounded-lg text-center"
                />
                <button
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg cursor-pointer  flex items-center justify-center"
                  onClick={verifyOtp}
                >
                  {verifyOtpLoading ? (
                    <Loader size={16} className="animate-spin text-white " />
                  ) : (
                    "Verify OTP"
                  )}{" "}
                </button>

                {otpError && (
                  <div className="text-red-600 mt-2">{otpError}</div>
                )}
              </div>
            )}

            {activeOrder.order.deliveryOtpVerification && (
              <div className="text-green-700 text-center font-bold">
                Delivery Completed!
              </div>
            )}
          </div>

          {/* ================ delivery boy OTP End ============================ */}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mt-30 mb-7.5">Delivery Assignment</h2>
        {assignment.map((a, index) => (
          <div
            className="p-5 bg-white rounded-xl shadow mb-4 border"
            key={index}
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
