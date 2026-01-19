import {
  ArrowLeft,
  EyeIcon,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type propType = {
  previousStep: (step: number) => void;
};

const RegisterForm = ({ previousStep }: propType) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <div
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors cursor-pointer"
        onClick={() => previousStep(1)}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </div>

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
        Create Account
      </motion.h1>

      <p className="text-gray-600 mb-8 flex items-center gap-2">
        Join Snapcart today <Leaf className="w-5 h-5 text-green-600" />{" "}
      </p>

      <motion.form
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
        <div className="relative">
          <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter Your Name"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        <div className="relative mt-4">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="relative mt-4">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
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

        {(() => {
          const formValidation = name !== "" && email !== "" && password !== "";
          return (
            <button
              className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex iitems-center justify-center gap-2 mt-3.5 ${
                formValidation
                  ? "bg-green-500 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Register
            </button>
          );
        })()}
      </motion.form>
    </div>
  );
};

export default RegisterForm;
