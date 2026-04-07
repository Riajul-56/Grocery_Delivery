"use client";
import { IUser } from "@/models/user.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import mongoose from "mongoose";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { getSocket } from "@/lib/socket";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-125 flex items-center justify-center bg-gray-100 rounded-xl">
      <p className="text-gray-500">Map loading...</p>
    </div>
  ),
});

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

interface ILocation {
  latitude: number;
  longitude: number;
}

const TrackOrder = ({ params }: { params: { orderId: string } }) => {
  const { userData } = useSelector((state: RootState) => state.user);
  const { orderId } = useParams();
  const [order, setOrder] = useState<IOrder>();
  const router = useRouter();

  // ================= user location update functionality start ================== //

  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  // ================= user location update  functionality end ================== //

  // ================= delivery location update functionality start ================== //

  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  // ================= delivery location update  functionality end ================== //

  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get_order/${orderId}`);
        setOrder(result.data);
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude,
        });
        if (result.data.assignedDeliveryBoy?.location?.coordinates) {
          setDeliveryBoyLocation({
            latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
            longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getOrder();
  }, [userData?._id]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update_deliveryBoy_location", (data) => {
      console.log(location);
      setDeliveryBoyLocation({
        latitude: data.location.coordinates?.[1] ?? data.location.latitude,
        longitude:
          data.data.location.coordinates?.[0] ?? data.location.longitude,
      });
    });

    return () => socket.off("update_deliveryBoy_location");
  }, [order]);

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white ">
      <div className="max-w-2xl mx-auto pb-24">
        {/* ================== header part start ===================== */}

        <div className="sticky top-0 bg-white/80 backdrop:blur-xl p-4 border-b shadow flex gap-3 items-center z-999 ">
          <button
            className="p-2 bg-green-100 rounded-full cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="text-green-700" size={20} />
          </button>

          <div>
            <h2 className="text-xl font-bold">Track Order</h2>
            <p className="text-sm text-gray-600">
              order#{order?._id?.toString().slice(-6)} {""}
              <span className="text-green-700 font-semibold">
                {order?.status}{" "}
              </span>{" "}
            </p>
          </div>
        </div>

        {/* ================== header part end ===================== */}

        {/* ================== map part start ===================== */}
        <div className="px-4 mt-6">
          <div className="rounded-3xl overflow-hidden border shadow">
            {/* ✅ valid location না আসা পর্যন্ত Map render হবে না */}
            {userLocation.latitude !== 0 && userLocation.longitude !== 0 ? (
              <LiveMap
                userLocation={userLocation}
                deliveryBoyLocation={deliveryBoyLocation}
              />
            ) : (
              <div className="w-full h-125 flex items-center justify-center bg-gray-100 rounded-xl">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}
          </div>
        </div>
        {/* ================== map part end ===================== */}
      </div>
    </div>
  );
};
export default TrackOrder;
