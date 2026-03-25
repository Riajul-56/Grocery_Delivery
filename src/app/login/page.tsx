"use client";
import {
  EyeIcon,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import googleImage from "@/assets/google.png";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const session = useSession();
  console.log(session);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      try {
        await signIn("credentials", {
          email,
          password,
        });
        router.push("/");

        setLoading(false);
      } catch (error) {
        console.log("Login error", error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.h1
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
        Welcome Back
      </motion.h1>

      <motion.p
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.3,
        }}
        className="text-gray-600 mb-8 flex items-center gap-2"
      >
        Login to Snapcart <Leaf className="w-5 h-5 text-green-600" />{" "}
      </motion.p>

      <motion.form
        onSubmit={handleLogin}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.3,
        }}
      >
        // ========================= Helper Functions =========================

// handle email input change
const handleEmailChange = (e) => {
  const { value } = e.target;
  setEmail(value);
};

// handle password input change
const handlePasswordChange = (e) => {
  const { value } = e.target;
  setPassword(value);
};

// toggle password visibility
const togglePasswordVisibility = () => {
  setShowPassword((prev) => !prev);
};

// check form validation
const isFormValid = email !== "" && password !== "";

// button disable logic
const isButtonDisabled = !isFormValid || loading;



{/* ===================== Email Input========================= */}

<div className="relative mt-4">

  {/* email icon */}
  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

  <input
    type="email"
    placeholder="Enter Your Email"
    className="w-full border border-gray-300 rounded-xl py-3 pl-30 pr-15 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
    onChange={handleEmailChange}
    value={email}
  />

</div>



{/* ===================== Password Input========================= */}

<div className="relative mt-4">

  {/* password icon */}
  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter Your Password"
    className="w-full border border-gray-300 rounded-xl py-3 pl-30 pr-15 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
    onChange={handlePasswordChange}
    value={password}
  />

  {/* toggle password icon */}
  {showPassword ? (
    <EyeOff
      className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
      onClick={togglePasswordVisibility}
    />
  ) : (
    <EyeIcon
      className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
      onClick={togglePasswordVisibility}
    />
  )}

</div>



{/* ===================== Login Button ========================== */}

<button
  type="submit"
  disabled={isButtonDisabled}
  className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 mt-3.5 ${
    isFormValid
      ? "bg-green-500 hover:bg-green-700 text-white"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>

  {/* loader or login text */}
  {loading ? (
    <Loader2 className="w-5 h-5 animate-spin" />
  ) : (
    "Login"
  )}

</button>



{/* =========================== OR Border ========================*/}

<div className="flex items-center gap-2 text-gray-400 text-sm mt-3.5">

  <span className="flex-1 h-px bg-gray-200"></span>

  OR

  <span className="flex-1 h-px bg-gray-200"></span>

</div>



{/* =========================== Google Sign In Button ========================*/}

<div
  className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 mt-3.5 cursor-pointer"
  onClick={() => {

    // trigger google authentication
    signIn("google", { callbackUrl: "/" });

  }}
>

  <Image src={googleImage} alt="Google" width={20} height={20} />

  Continue with Google

</div>