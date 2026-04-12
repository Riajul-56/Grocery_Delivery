import { getSocket } from "@/lib/socket";
import { IMassage } from "@/models/message.model";
import axios from "axios";
import { Send } from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

type props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};

const DeliveryChat = ({ orderId, deliveryBoyId }: props) => {
  const [newMessage, setNewMessage] = useState("");

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
      senderId: deliveryBoyId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("sendMessage", message);

    setNewMessage("");
  };

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

  // =================== send messagefetch end ===================//

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-4 h-107.5 flex flex-col">
      {/* ================= show messages start ==================== */}

      <div className="flex-1 overflow-y-auto p-2 space-y-3 ">
        <AnimatePresence>
          {messages?.map((msg, index) => (
            <motion.div
              className={`flex ${msg.senderId == deliveryBoyId ? "justify-end" : "justify-start"}`}
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
                  msg.senderId === deliveryBoyId
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
  );
};

export default DeliveryChat;
