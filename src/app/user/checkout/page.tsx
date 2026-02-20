"use client";
import { RootState } from "@/redux/store";
import {
  ArrowLeft,
  Building,
  CreditCard,
  CreditCardIcon,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  Truck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// =========================== Marker Icon funcitionality start ======================= //
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});
// =========================== Marker Icon funcitionality end ======================= //

// =========================== find user data start ======================= //
const Checkout = () => {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, deliveryCharge, finalTotal, cartData } = useSelector(
    (state: RootState) => state.cart,
  );
  const [address, setAddress] = useState({
    fullName: userData?.name || "",
    mobile: userData?.mobile || "",
    city: "",
    state: "",
    postCode: "",
    fullAddress: "",
  });
  // =========================== find user data end ======================= //

  // =========================== map search functionality start ======================= //
  const [searching, setSearching] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSeachQuery = async () => {
    setSearching(true);
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    if (results) {
      setSearching(false);
      setPosition([results[0].y, results[0].x]);
    }
  };
  // =========================== map search functionality end ======================= //

  const [position, setPosition] = useState<[number, number] | null>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.log("location error", err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({ ...prev, fullName: userData?.name || "" }));
      setAddress((prev) => ({ ...prev, mobile: userData?.mobile || "" }));
    }
  }, [userData]);

  const DraggableMarker: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position as LatLngExpression, 15, { animate: true });
    });
    return (
      <Marker
        icon={markerIcon}
        position={position as LatLngExpression}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      />
    );
  };

  // =========================== auto address add functionality start ======================= //
  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        );
        console.log(result.data);
        setAddress((prev) => ({
          ...prev,
          city: result.data.address.state_district,
          state: result.data.address.state,
          postCode: result.data.address.postcode,
          fullAddress: result.data.display_name,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddress();
  }, [position]);
  // =========================== auto address add functionality end ======================= //

  // =========================== current location functionality start ======================= //
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.log("location error", err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }
  };
  // =========================== auto address add functionality end ======================= //

  // =========================== Payment method functionality start ======================= //
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  // =========================== Payment method functionality end ======================= //

  // =========================== Place order functionality start ======================= //
  const handleCod = async () => {
    if (!position) {
      return null;
    }
    try {
      const result = await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          city: address.city,
          state: address.state,
          postCode: address.postCode,
          fullAddress: address.fullAddress,
          mobile: address.mobile,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod,
      });
      router.push("/user/order_success");
    } catch (error) {
      console.log(error);
    }
  };
  // =========================== Place order  functionality end ======================= //

  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative ">
      <motion.button
        className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold cursor-pointer "
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push("/user/cart")}
      >
        <ArrowLeft size={16} />
        <span>Back to Cart</span>
      </motion.button>

      <motion.h1
        className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* =================== left side content start ================ */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-700" /> Delivery Address
          </h2>

          <div className="space-y-4">
            {/* ================================ name input ====================== */}

            <div className="relative">
              <User
                className="absolute left-3 top-3 text-green-600 "
                size={18}
              />
              <input
                type="text"
                value={address.fullName || ""}
                placeholder="Full Name"
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            {/* ================================ mobile input ====================== */}
            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-green-600 "
                size={18}
              />
              <input
                type="text"
                value={address.mobile || ""}
                placeholder="Mobile Number"
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, mobile: e.target.value }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            {/* ================================ full address ====================== */}
            <div className="relative">
              <Home
                className="absolute left-3 top-3 text-green-600 "
                size={18}
              />
              <input
                type="text"
                value={address.fullAddress || ""}
                placeholder="Full Address"
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* ================================ city  ====================== */}
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-green-600 "
                  size={18}
                />
                <input
                  type="text"
                  value={address.city || ""}
                  placeholder="City"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>

              {/* ================================ state  ====================== */}
              <div className="relative">
                <Navigation
                  className="absolute left-3 top-3 text-green-600 "
                  size={18}
                />
                <input
                  type="text"
                  value={address.state || ""}
                  placeholder="state"
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>

              {/* ================================ postCode  ====================== */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-green-600 "
                  size={18}
                />
                <input
                  type="text"
                  value={address.postCode || ""}
                  placeholder="Post Code"
                  onChange={(e) =>
                    setAddress({ ...address, postCode: e.target.value })
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>
            </div>

            {/* ================================ Search Bar  ====================== */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Search city or area..."
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium cursor-pointer"
                onClick={handleSeachQuery}
              >
                {searching ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Search"
                )}
              </button>
            </div>

            {/* ================================ Map ====================== */}
            <div className="relative mt-6 h-82.5 rounded-xl overflow-hidden border border-gray-200 shadow-inner ">
              {position && (
                <MapContainer
                  className="w-full h-full"
                  center={position as LatLngExpression}
                  zoom={13}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DraggableMarker />
                </MapContainer>
              )}

              <motion.button
                whileTap={{ scale: 0.8 }}
                className="absolute bottom-4 right-4 bg-green-600 text-whte shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-999 "
                onClick={handleCurrentLocation}
              >
                <LocateFixed size={22} />
              </motion.button>
            </div>
          </div>
        </motion.div>
        {/* =================== left side content end ================ */}

        {/* =================== right side content start ================ */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-gray-100 h-fit"
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <CreditCard className="text-green-600" /> Payment Method{" "}
          </h2>

          <div className="space-y-4 mb-6">
            {/* ==================== online paymnent button start ================= */}
            <button
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                paymentMethod === "online"
                  ? "border-green-600 bg-green-50 shadow-xm"
                  : "hover:bg-gray-50"
              }`}
            >
              <CreditCardIcon className="text-green-600" />{" "}
              <span className="font-medium text-gray-700">
                {" "}
                Pay Online(stripe)
              </span>
            </button>
            {/* ==================== online paymnent button end ================= */}

            {/* ==================== offline paymnent button start ================= */}
            <button
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                paymentMethod === "cod"
                  ? "border-green-600 bg-green-50 shadow-xm"
                  : "hover:bg-gray-50"
              }`}
            >
              <Truck className="text-green-600" />{" "}
              <span className="font-medium text-gray-700">
                {" "}
                Cash On Delivery
              </span>
            </button>
            {/* ==================== offline paymnent button end ================= */}
          </div>

          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base ">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold text-green-600">৳ {subTotal}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Delivery Charge</span>
              <span className="font-semibold text-green-600">
                ৳ {deliveryCharge}
              </span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span className="font-semibold">Final Total</span>
              <span className="font-semibold text-green-600">
                ৳ {finalTotal}
              </span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.93 }}
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold cursor-pointer"
            onClick={() => {
              if (paymentMethod == "cod") {
                handleCod();
              } else null;
            }}
          >
            {paymentMethod == "cod" ? "Place Order" : "Pay & Place order"}
          </motion.button>
        </motion.div>
        {/* =================== right side content end ================ */}
      </div>
    </div>
  );
};

export default Checkout;
