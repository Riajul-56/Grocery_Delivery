"use client";
import { Check, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-linear-to-b from-green-50 to-white ">
      <motion.div
        className="relative"
        initial={{
          scale: 0,
          rotate: -180,
        }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
      >
        <CheckCircle className="text-green-600 w-24 h-24 md:w-28 md:h-28" />

        <motion.div
          className="absolute inset-0"
          initial={{
            opacity: 0,
            scale: 0.6,
          }}
          animate={{
            opacity: [0.3, 0, 0.3],
            scale: [1, 0.6, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full rounded-full bg-green-700 blur-4xl"/>
        </motion.div>

      </motion.div>

      <motion.h1
        className="text-3xl md:text-4xl font-bold text-green-700 mt-6"
        initial={{
          opacity: 0,
          y: 30,
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
        Order Placed Successfully
      </motion.h1>

      <motion.p
        className="text-gray-600 mt-3 text-sm md:text-base max-w-md"
        initial={{
          opacity: 0,
          x: 30,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.6,
        }}
      >
        Thank you for shopping with us! Your order has been placed and is being
        processed. You can track its progress in your{" "}
        <span className="font-semibold text-green-700">My Orders</span> section
      </motion.p>

      
    </div>
  );
};

export default OrderSuccess;
