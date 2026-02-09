"use client";
import { ArrowLeft, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const CartPage = () => {
  const { cartData } = useSelector((state: RootState) => state.cart);

  return (
    <div className="w-[955] sm:w-[90%] md:[80%] mx-auto mt-8 mb-24 relative">
      <Link
        href={"/"}
        className="absolute -top-2 left-0 flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-all"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <motion.h2
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        🛒 Your Shoppping Cart
      </motion.h2>

      {cartData.length == 0 ? (
        <motion.div
          className="text-center py-20 bg-white rounded-2xl shadow-md"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <ShoppingBasket />
          <p>Your cart is empty. Add some groceries to continue shopping!</p>
          <Link
            href={"/"}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all inline-block font-medium"
          >
            Continue Shopping
          </Link>
        </motion.div>
      ) : null}
    </div>
  );
};

export default CartPage;
