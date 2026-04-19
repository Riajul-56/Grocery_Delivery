"use client";
import { IUser } from "@/models/user.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft, Loader, Send, Sparkle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { getSocket } from "@/lib/socket";
import { AnimatePresence, motion } from "motion/react";
import { IMassage } from "@/models/message.model";

interface IOrder {
  _id?: string;
  user: string;
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
  assignment?: string;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-125 flex items-center justify-center bg-gray-100 rounded-xl">
      <p className="text-gray-500">Map loading...</p>
    </div>
  ),
});

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
        const result = await axios.get(`/api/user/get-order/${orderId}`);
        setOrder(result.data);
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude,
        });
        setDeliveryBoyLocation({
          latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
          longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
        });
      } catch (error) {
        console.log(error);
      }
    };
    getOrder();
  }, [userData?._id]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", (data) => {
      console.log(location);
      setDeliveryBoyLocation({
        latitude: data.location.coordinates?.[1] ?? data.location.latitude,
        longitude: data.location.coordinates?.[0] ?? data.location.longitude,
      });
    });
    return () => socket.off("update-deliveryBoy-location");
  }, [order]);

  // =================== send message to the server start ===================//

  const [newMessage, setNewMessage] = useState("");

  // =================== send message to the server end ===================//

  // =================== send message fetch start ===================//

  const [messages, setMessages] = useState<IMassage[]>();
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const result = await axios.post("/api/chat/messages", {
          roomId: orderId,
        });
        setMessages(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMessages();
  }, []);

  // =================== send message fetch end ===================//

  useEffect(() => {
    const socket = getSocket();
    socket.emit("joinRoom", orderId);

    socket.on("sendMessage", (message) => {
      if (message.roomId === orderId) {
        setMessages((prev) => [...prev!, message]);
      }
    });
    return () => {
      socket.off("sendMessage");
    };
  }, []);

  // =================== send message to the server start ===================//

  const sendMsg = () => {
    const socket = getSocket();

    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: userData?._id,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("sendMessage", message);

    setNewMessage("");
  };

  // =================== send message to the server end ===================//

  // =================== Auto scroll message start ===================//

  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // =================== Auto scroll message end ===================//

  // =================== AI message fetch start ===================//

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const lastMessage = messages
        ?.filter((m) => m.senderId !== userData?._id)
        ?.at(-1);

      const result = await axios.post("/api/chat/ai_suggestions", {
        message: lastMessage?.text,
        role: "user",
      });

      setSuggestions(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // =================== AI message fetch end ===================//

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white ">
      <div className="max-w-2xl mx-auto pb-24">
        {/* ================== header part start ===================== */}

        <div className="sticky top-10 bg-white/80 backdrop:blur-xl p-4 border-b shadow flex gap-3 items-center z-999 ">
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
        <div className="px-4 mt-20 ">
          <div className="rounded-3xl overflow-hidden border shadow">
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

        {/* ============= message box start ================== */}

        <div className="bg-white rounded-2xl shadow-lg border p-4 h-107.5 flex flex-col mt-4">
          {/* ================= AI suggestion start ==================== */}

          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700 text-sm">
              Quick Replies
            </span>

            <motion.button
              className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer"
              onClick={getSuggestions}
              whileTap={{ scale: 0.9 }}
              disabled={loading}
            >
              <Sparkle size={14} />{" "}
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                "AI Suggest"
              )}
            </motion.button>
          </div>

          <div className="flex gap-2 flex-wrap mb-3">
            {suggestions.map((s, i) => (
              <motion.div
                key={s}
                whileTap={{ scale: 0.9 }}
                className="px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full cursor-pointer shadow-sm"
                onClick={() => setNewMessage(s)}
              >
                {s}
              </motion.div>
            ))}
          </div>
          {/* =================  AI suggestion end ==================== */}

          {/* ================= show messages start ==================== */}

          <div
            className="flex-1 overflow-y-auto p-2 space-y-3 "
            ref={chatBoxRef}
          >
            <AnimatePresence>
              {messages?.map((msg, index) => (
                <motion.div
                  className={`flex ${msg.senderId == userData?._id ? "justify-end" : "justify-start"}`}
                  key={msg._id?.toString()}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                ${
                  msg.senderId === userData?._id
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }
                `}
                  >
                    <p>{msg.text}</p>

                    <p className="text-[10px] opacity-70 mt-1 text-right ">
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* ================= show messages end ==================== */}

          <div className="flex gap-2 mt-3 border-t pt-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500 "
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />

            <button
              className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white "
              onClick={sendMsg}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* ============= message box start ================== */}
      </div>
    </div>
  );
};
export default TrackOrder;
