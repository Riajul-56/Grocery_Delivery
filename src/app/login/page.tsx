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
        {/* ===================== Email Input========================= */}

        <div className="relative mt-4">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full border border-gray-300 rounded-xl py-3 pl-30 pr-15 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* ===================== Password Input========================= */}

        <div className="relative mt-4">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            className="w-full border border-gray-300 rounded-xl py-3 pl-30 pr-15 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {showPassword ? (
            <EyeOff
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeIcon
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {/* ===================== Confirm Password Input========================= */}

        {(() => {
          const formValidation = email !== "" && password !== "";
          return (
            <button
              type="submit"
              disabled={!formValidation || loading}
              className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 mt-3.5 ${
                formValidation
                  ? "bg-green-500 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
            </button>
          );
        })()}

        {/* =========================== OR Border ========================*/}

        <div className="flex items-center gap-2 text-gray-400 text-sm mt-3.5">
          <span className="flex-1 h-px bg-gray-200"></span>
          OR
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        {/* =========================== Google Sign In Button ========================*/}

        <button
          className="w-full flex iitems-center justify-center gap-3 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 mt-3.5 cursor-pointer"
          onClick={() => signIn("google")}
        >
          <Image src={googleImage} alt="Google" width={20} height={20} />
          Continue with Google
        </button>
      </motion.form>

      <p
        className="text-gray-600 mt-6 text-sm flex items-center gap-1 cursor-pointer"
        onClick={() => router.push("/register")}
      >
        Want to create an account? <LogIn className="w-4 h-4" />{" "}
        <span className="text-green-600 cursor-pointer">Sign Up</span>
      </p>
    </div>
  );
}

export default Login;
