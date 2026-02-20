"use client";
import { motion } from "motion/react";

const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-linear-to-b from-green-50 to-white ">
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-green-700 mt-6"
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
        }}
      >
        Order Placed Successfully
      </motion.h1>
      <motion.p>
        Thank you for shopping with us! Your order has been placed and is being
        processed. You can track its progress in your{" "}
        <span className="font-semibold text-green-700">My Orders</span> section
      </motion.p>
    </div>
  );
};

export default OrderSuccess;
