"use client";

import { ArrowRight, BikeIcon, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";

// props type definition
type PropType = {
  nextStep: (step: number) => void;
};

const Welcome = ({ nextStep }: PropType) => {

  // animation config for reuse
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  // handler function for next step
  const handleNext = () => {
    nextStep(2);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-linear-to-b from-green-100 to-white">

      {/* App Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3"
      >
        <ShoppingBasket className="w-10 h-10 text-green-600" />

        {/* App Name */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
          Snapcart
        </h1>
      </motion.div>

      {/* Intro Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-4 text-gray-700 text-lg md:text-xl max-w-lg"
      >
        Your one-stop destination for fresh groceries, organic produce, and
        daily essentials delivered right to your doorstep.
      </motion.p>

      {/* Icon Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex items-center justify-center gap-10 mt-10"
      >
        <ShoppingBasket className="w-24 h-24 md:w-32 md:h-32 text-green-600 drop-shadow-md" />

        <BikeIcon className="w-24 h-24 md:w-32 md:h-32 text-orange-500 drop-shadow-md" />
      </motion.div>

      {/* Next Step Button */}
      <motion.button
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-2xl shadow-md transition-all duration-200 mt-10 cursor-pointer"
        onClick={handleNext}
      >
        Next
        <ArrowRight />
      </motion.button>

    </div>
  );
};

export default Welcome;