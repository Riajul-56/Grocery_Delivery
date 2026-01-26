"use client";
import axios from "axios";
import { ArrowRight, Bike, User, UserCog } from "lucide-react";
import { motion } from "motion/react";
import { redirect } from "next/navigation";
import { useState } from "react";

function EditRoleMobile() {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "delivery", label: "Delivery Boy", icon: Bike },
  ]);
  const [selectedRole, setSelectedRole] = useState(" ");
  const [mobile, setMobile] = useState("");

  const handleEdit = async () => {
    try {
      const result = await axios.post("/api/user/edit_role_mobile", {
        role: selectedRole,
        mobile,
      });
      redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 w-full">
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        Select Your Role
      </motion.h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              key={role.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedRole(role.id)}
              className={`flex flex-col justify-center items-center w-48 h-44 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-green-600 bg-green-100 shadow-lg"
                  : "border-gray-300 bg-white hover:border-green-400"
              }`}
            >
              <Icon />
              <span>{role.label}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="flex flex-col items-center mt-10"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.5,
          duration: 0.6,
        }}
      >
        <label htmlFor="mobile" className="text-gray-700 font-medium mb-2">
          Enter Your Mobile Number
        </label>
        <input
          type="tel"
          id="mobile"
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
          placeholder="eg. +880.."
          onChange={(e) => setMobile(e.target.value)}
        />
      </motion.div>

      <motion.button
        disabled={mobile.length !== 11 || !selectedRole}
        className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 w-[200px] mt-20 ${
          selectedRole && mobile.length == 11
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={handleEdit}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.5,
        }}
      >
        Go to Home <ArrowRight />
      </motion.button>
    </div>
  );
}

export default EditRoleMobile;
