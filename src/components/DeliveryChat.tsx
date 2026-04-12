import { getSocket } from "@/lib/socket";
import { IMassage } from "@/models/message.model";
import axios from "axios";
import { Loader, Send, Sparkle } from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
        ?.filter((m) => m.senderId !== deliveryBoyId)
        ?.at(-1);

      const result = await axios.post("/api/chat/ai_suggestions", {
        message: lastMessage?.text,
        role: "delivery_boy",
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
    <div className="bg-white rounded-2xl shadow-lg border p-4 h-107.5 flex flex-col"></div>