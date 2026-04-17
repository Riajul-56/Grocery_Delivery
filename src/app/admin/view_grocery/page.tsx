"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Loader,
  Package,
  Pencil,
  Search,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IGrocery } from "@/models/grocery.model";
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

const ViewGrocery = () => {
  const router = useRouter();
  const [groceries, setGroceries] = useState<IGrocery[]>();
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const getGrocries = async () => {
      try {
        const result = await axios.get("/api/admin/get_groceries");
        setGroceries(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getGrocries();
  }, []);

  useEffect(() => {
    if (editing) {
      setImagePreview(editing.image);
    }
  }, [editing]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    if (!editing) return;
    try {
      const formData = new FormData();
      formData.append("groceryId", editing?._id?.toString()!);
      formData.append("name", editing?.name);
      formData.append("category", editing?.category);
      formData.append("price", editing?.price);
      formData.append("unit", editing?.unit);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post("/api/admin/edit_grocery", formData);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    if (!editing) return;
    try {
      const result = await axios.post("/api/admin/delete_grocery", {
        groceryId: editing._id,
      });
      setDeleteLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-4 w-[95%] md:w-[85%] mx-auto pb-20 ">
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left"
        initial={{
          opacity: 0,
          x: 20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <Link
          href={"/"}
          className="flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all"
        >
          <ArrowLeft size={18} className="w-5 h-5" />
          <span className="hidden md:flex">Back to Home</span>
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2 ">
          <Package size={28} className="text-green-600" /> Manage Groceries
        </h1>
      </motion.div>

      {/* ==================== search form start ======================== */}

      <motion.form
        className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          className="w-full outline-none text-gray-700 placeholder-gray-400"
          placeholder="Search by name or category..."
        />
      </motion.form>

      {/* ==================== search form end ======================== */}

      <div className="space-y-4">
        {groceries?.map((g, i) => (
          <motion.div
            className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all"
            key={i}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {/*===================== Grocery Image start ===================== */}

            <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={g.image}
                alt={g.name}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
              />
            </div>

            {/*===================== Grocery Image end ===================== */}

            {/*===================== Grocery details start ===================== */}

            <div className="flex-1 flex flex-col justify-between w-full">
              {/* left side */}

              <div>
                <h3 className="font-semibold text-gray-800 text-lg truncate">
                  {g.name}
                </h3>

                <p className="text-gray-500 text-sm capitalize ">
                  {g.category}
                </p>
              </div>

              {/* right side */}

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-green-700 font-bold text-lg">
                  ৳{g.price}/
                  <span className="text-gray-500 text-sm font-medium ml-1">
                    {g.unit}
                  </span>
                </p>

                <button
                  className="bg-green-600 text-white pl-3 pr-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all cursor-pointer "
                  onClick={() => setEditing(g)}
                >
                  <Pencil size={15} />
                  Edit
                </button>
              </div>
            </div>

            {/*===================== Grocery details end ===================== */}
          </motion.div>
        ))}

        {/* editing moder */}
        <AnimatePresence>
          {editing && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-green-700">
                    Edit Grocery
                  </h2>

                  <button
                    className="cursor-pointer text-gray-600 hover:text-red-600"
                    onClick={() => setEditing(null)}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4 border border-gray-200 group">
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt={editing.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  <label
                    htmlFor="imageUpload"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity "
                  >
                    <Upload size={28} className="text-green-500" />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="imageUpload"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter Grocery Name"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    className="w-full border border-gray-300
                   rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                  />

                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    className="w-full border border-gray-300
                   rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white cursor-pointer"
                  >
                    <option>Select Catergory</option>
                    {categories.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Price"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({ ...editing, price: e.target.value })
                    }
                    className="w-full border border-gray-300
                   rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                  />

                  <select
                    value={editing.unit}
                    onChange={(e) =>
                      setEditing({ ...editing, unit: e.target.value })
                    }
                    className="w-full border border-gray-300
                   rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white cursor-pointer"
                  >
                    <option>Select Catergory</option>
                    {units.map((u, i) => (
                      <option key={i} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-all cursor-pointer"
                    onClick={handleEdit}
                    disabled={loading}
                  >
                    {loading ? <Loader size={14} /> : "Edit Grocery"}
                  </button>

                  <button
                    className="px-4 py-2 rounded-lg border text-white bg-red-600 hover:bg-red-700 transition cursor-pointer"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? <Loader size={14} /> : "Delete Grocery"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ViewGrocery;
