"use client";
import { ArrowLeft, PlusCircle, Upload } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChangeEvent, useState } from "react";
import Image from "next/image";

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care",
];

const units = ["kg", "g", "liter", "ml", "piece", "pack"];

const AddGrocery = () => {
  const [name, SetName] = useState("");
  const [categroy, SetCategory] = useState("");
  const [unit, SetUnit] = useState("");
  const [price, SetPrice] = useState("");
  const [frontendImage, SetFrontendImage] = useState<string | null>();
  const [backendImage, SetBackendImage] = useState<File | null>();
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length == 0) return;
    const file = files[0];
    SetBackendImage(file);
    SetFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white py-16 px-4 relative">
      {/* ============================ Back to Home Button Start================== */}

      <Link
        href={"/"}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden md:flex">Back to Home</span>
      </Link>

      {/* ============================ Back to Home Button End================== */}

      <motion.div
        className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className="flex items-center gap-3">
            <PlusCircle className="text-green-600 w-8 h-8 cursor-pointer" />
            Add Your Grocery
          </h1>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Fill out the details below to add a new grocery item.
          </p>
        </div>

        <form className="flex flex-col gap-6 w-full ">
          {/* ======================Grocery Name start ======================== */}

          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Grocery Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="eg. Sweets,Milk ..."
              onChange={(e) => SetName(e.target.value)}
              value={name}
              className="border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all w-full border mt-2"
            />
          </div>

          {/* ====================== Grocery Name End  ======================== */}

          {/* ====================== Select Category Start  ======================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category<span className="text-red-500">*</span>
              </label>

              <select
                name="categroy"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white mt-2"
                onChange={(e) => SetCategory(e.target.value)}
                value={categroy}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* ====================== Select Category End  ======================== */}

            {/* ====================== Select Unit Start  ======================== */}

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Unit<span className="text-red-500">*</span>
              </label>

              <select
                name="unit "
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white mt-2"
                onChange={(e) => SetUnit(e.target.value)}
                value={unit}
              >
                <option value="">Select Unit</option>
                {units.map((cat) => (
                  <option value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ====================== Select Unit End  ======================== */}

          {/* ====================== Price start ======================== */}

          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Price<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="name"
              placeholder="eg. 120"
              className="border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all w-full border mt-2"
              onChange={(e) => SetPrice(e.target.value)}
              value={price}
            />
          </div>

          {/* ====================== Price End  ======================== */}

          {/* ====================== Upload image start ======================== */}

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <label
              htmlFor="image"
              className="cursor-pointer flex items-center justify-center gap-2 bg-green-50 px-6 py-3 hover:bg-green-100 transition-all w-full sm:w-auto "
            >
              <Upload className="w-5 h-5" /> Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              id="image"
              hidden
              onChange={handleImageChange}
            />
            {frontendImage && (
              <Image
                src={frontendImage}
                width={100}
                height={100}
                alt="image"
                className="rounded-xl shadow-md border border-gray-200 object-cover"
              />
            )}
          </div>

          {/* ====================== Upload image End  ======================== */}
        </form>
      </motion.div>
    </div>
  );
};

export default AddGrocery;
