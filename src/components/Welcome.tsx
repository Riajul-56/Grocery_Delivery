"use client";

import { ArrowRight, BikeIcon, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";

// Props type for the component
type propType = {
  nextStep: (step: number) => void;
};

// Welcome screen component
const Welcome = ({ nextStep }: propType) => {
  return (
    // Main container with gradient background
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6  bg-linear-to-b from-green-100 to-white">
      
      {/* App logo and title section */}
      <motion.div
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
        className="flex items-center gap-3"
      >
        <ShoppingBasket className="w-10 h-10 text-green-600" />

        {/* Application name */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
          Snapcart
        </h1>
      </motion.div>

      {/* Introductory description */}
      <motion.p
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.3,
        }}
        className="mt-4 text-gray-700 text-lg md:text-xl max-w-lg"
      >
        Your one-stop destination for fresh groceries, organic produce, and
        daily essentials delivered right to your doorstep.
      </motion.p>

      {/* Illustration icons section */}
      <motion.div
        initial={{
          opacity: 0,
          y: 0.9,
        }}
        animate={{
          opacity: 1,
          y: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.5,
        }}
        className="flex items-center justify-center gap-10 mt-10"
      >
        {/* Grocery icon */}
        <ShoppingBasket className="w-24 h-24 md:w-32 md:h-32 text-green-600 drop-shadow-md" />

        {/* Delivery bike icon */}
        <BikeIcon className="w-24 h-24 md:w-32 md:h-32 text-orange-500 drop-shadow-md" />
      </motion.div>

      {/* Button to move to next onboarding step */}
      <motion.button
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.8,
        }}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-2xl shadow-md transition-all duration-200 mt-10 cursor-pointer"
        onClick={() => nextStep(2)}
      >
        Next
        <ArrowRight />
      </motion.button>
    </div>
  );
};

export default Welcome;