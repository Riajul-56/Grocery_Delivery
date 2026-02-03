"use client";
import {
  Boxes,
  ClipboardCheckIcon,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  Search,
  ShoppingCartIcon,
  User,
  X,
} from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence, scale } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";

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
  const profileDropDown = useRef<HTMLDivElement>(null);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ======================== Side Bar for admin Start ===================== //

  const sideBar = menuOpen
    ? createPortal(
        <AnimatePresence>
          <motion.div
            className="fixed top-0 h-full w-[75%] sm:w-[60%] z-9999 bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900/90 backdrop-blur-xl border-r border-green-400/20 shadow-[0_0_50px_-10px_rgba(0,255,100,.3)] flex flex-col p-6 text-white"
            initial={{
              opacity: 0,
              x: -100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 14,
            }}
            exit={{ x: -100 }}
          >
            <div className="flex justify-between items-center mb-2">
              <h1 className="font-extrabold text-2xl tracking-wide text-white/90 ">
                Admin Panel
              </h1>
              <button
                className="text-white/80 hover:text-red-400 text-2xl font-bold transition"
                onClick={() => setMenuOpen(false)}
              >
                <X />
              </button>
            </div>

            {/* =========================== admin side bar profile Image start ====================== */}

            <div className="flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-green-400/60 shadow-lg">
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
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {user.name}
                </h2>
                <p className="text-xs text-green-200 capitalize tracking-wide">
                  {user.role}
                </p>
              </div>
            </div>

            {/* =========================== admin side bar profile Image End ====================== */}

            {/* =========================== admin side bar Cart Item Start ====================== */}

            <div className="flex flex-col gap-3 font-medium mt-6">
              <Link
                href={"/admin/add_grocery"}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                Add Grocery
              </Link>

              <Link
                href={""}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <Boxes className="w-5 h-5" />
                View Grocery
              </Link>

              <Link
                href={""}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <ClipboardCheckIcon className="w-5 h-5" />
                Manage Orders
              </Link>
            </div>

            {/* =========================== admin side bar Cart Item End ====================== */}

            <div className="my-5 border-t border-white/20"></div>

            <div
              className="flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all"
              onClick={async () => await signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-5 h-5 text-red-300" />
              Log Out
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )
    : null;

  //  ======================== Side Bar for admin End ===================== //

  return (
    <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50">
      {/* ============== Snapcart Icon for Navbar ========================== */}

      <Link
        href={"/"}
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform "
      >
        Snapcart
      </Link>

      {/* ============== search bar for user ========================== */}

      {user.role == "user" && (
        <form className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md">
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search groceries..."
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </form>
      )}

      {/* ============== Search icon for small device and user ========================== */}

      <div className="flex items-center gap-3 md:gap-4 relative">
        {user.role == "user" && (
          <>
            <div
              className=" bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition md:hidden"
              onClick={() => setSearchBarOpen((prev) => !prev)}
            >
              <Search className="text-green-600 w-6 h-6" />
            </div>

            {/* ============== Cart Icon for user  ========================== */}

            <Link
              href={""}
              className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition"
            >
              <ShoppingCartIcon className="text-green-600 w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">
                0
              </span>
            </Link>
          </>
        )}

        {/* ============== Cart Icon for admin Start ========================== */}

        {user.role == "admin" && (
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href={"/admin/add_grocery"}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all hover:scale-105"
              >
                <PlusCircle className="w-5 h-5" />
                Add Grocery
              </Link>

              <Link
                href={""}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all hover:scale-105"
              >
                <Boxes className="w-5 h-5" />
                View Grocery
              </Link>

              <Link
                href={""}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all hover:scale-105 "
              >
                <ClipboardCheckIcon className="w-5 h-5" />
                Manage Orders
              </Link>
            </div>

            {/*================== menu bar for admin ================*/}
            <div
              className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md "
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <Menu className="text-green-600 w-6 h-6" />
            </div>
          </>
        )}

        {/* ============== Cart Icon for admin End  ========================== */}

        <div className="relative" ref={profileDropDown}>
          {/* ============== User Profile Image Start ========================== */}
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

          {/* ============== User Profile Image End ========================== */}

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
                  duration: 0.4,
                }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999 "
              >
                <div className="flex items-center gap-3 px-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
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

                  <div className="text-gray-800 font-semibold">{user.name}</div>

                  <div className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </div>
                </div>

                {/* ================ My Oder for user Start ========================= */}

                {user.role == "user" && (
                  <Link
                    href={""}
                    className="flex items-center gap-2 px-3 py-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    <Package className="w-5 h-5 text-green-600" />
                    My Orders
                  </Link>
                )}

                {/* ================ My Oder for user End ========================= */}

                {/* ================ Log in button for Start ========================= */}

                <button
                  className="flex items-center gap-2 w-full text-left px-2 py-3 hover:bg-red-100 rounded-lg text-gray-700 font-medium "
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  Log Out
                </button>

                {/* ================ Log in button for End ========================= */}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {searchBarOpen && (
              <motion.div
                className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 flex items-center px-4 py-2"
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
                  duration: 0.4,
                }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
              >
                <Search className="text-gray-500 w-5 h-5 mr-2" />
                <form className="grow">
                  <input
                    type="text"
                    placeholder="Search groceries..."
                    className="w-full outline-none text-gray-700"
                  />
                </form>

                <button onClick={() => setSearchBarOpen(false)}>
                  <X className="text-gray-500 w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {sideBar}
    </div>
  );
};

export default Navbar;
