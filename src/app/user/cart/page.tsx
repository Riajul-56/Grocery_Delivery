"use client";
import { ArrowLeft, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";

const CartPage = () => {
  const { cartData } = useSelector((state: RootState) => state.cart);

  return (
    <div className="w-[95%] sm:w-[90%] md:[80%] mx-auto mt-8 mb-24 relative">
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
          <ShoppingBasket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-6">
            Your cart is empty. Add some groceries to continue shopping!
          </p>
          <Link
            href={"/"}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all inline-block font-medium"
          >
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <AnimatePresence>
              {cartData.map((item, index) => (
                <motion.div
                  className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300 border-gray-100 "
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                  }}
                  key={index}
                >
                  {/* ========================= cart page items image start ========================= */}

                  <div className="relative w-28 h-28 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shirnk-0 rounded-xl overflow-hidden bg-gray-50 ">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-3 transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* ========================= cart page items image end ========================= */}

                  {/* ========================= cart page details start ========================= */}

                  <div className="mt-4 sm:mt-0 sm:ml-4 flex-1 text-center sm:text-left">
                    <h3 className="text-base sm:text-sm font-semibold text-gray-800 line-clamp-1 ">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 ">
                      {item.unit}
                    </p>
                    <p className="text-green-700 font-bold mt-1 text-sm sm:text-base">
                      ৳ {Number(item.price) * item.quantity}
                    </p>
                  </div>

                  {/* ========================= cart page details end ========================= */}

                  {/* ========================= cart page quantity start ========================= */}

                  <div className="">
                    
                  </div>

                  {/* ========================= cart page quantity end ========================= */}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  ); 
};

export default CartPage;
