"use client";
import { Search, ShoppingCartIcon, User } from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence, scale } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";

interface IUser {
  _id?: mongoose.Types.ObjectId; //? Optional ID field
  name: string;
  email: string;
  password?: string;
  mobile?: string; //? optional mobile field
  role: "user" | "admin" | "deliveryBoy";
  image?: string;
}

const Navbar = ({ user }: { user: IUser }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50">
      <Link
        href={"/"}
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform "
      >
        Snapcart
      </Link>

      <form className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md">
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search groceries..."
          className="w-full outline-none text-gray-700 placeholder-gray-400"
        />
      </form>

      <div className="flex items-center gap-3 md:gap-4 relative">
        <Link
          href={""}
          className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition"
        >
          <ShoppingCartIcon className="text-green-600 w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">
            0
          </span>
        </Link>

        <div className="relative">
          <div
            className="bg-white rounded-full w-11 h-11 items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform "
            onClick={() => setOpen((prev) => !prev)}
          >
            {user.image ? (
              <Image
                src={user.image}
                alt="user"
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <User />
            )}
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.6,
                }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999 "
              ></motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
