"use client";
import axios from "axios";
import { useEffect } from "react";

const ManageOrders = () => {
  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await axios.get("/api/admin/get_orders");
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    getOrders();
  }, []);

  return <div>page</div>;
};

export default ManageOrders;
