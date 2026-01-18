"use client";
import { motion } from "motion/react";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <motion.div
        initial={{
          opacity: 0,
          y:-20
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 2,
        }}
      >
        hello
      </motion.div>
    </div>
  );
};

export default Welcome;
