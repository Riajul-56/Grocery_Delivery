import React from "react";
import AdminDashBoardClient from "./AdminDashBoardClient";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import Grocery from "@/models/grocery.model";

async function AdminDashBoard() {
  await connectDb();
  const orders = await Order.find({});
  const users = await User.find({ role: "user" });
  const groceries = await Grocery.find({});

  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const pendingDeliveries = orders.filter((o) => {
    o.status === "pending";
  }).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <>
      <AdminDashBoardClient />
    </>
  );
}

export default AdminDashBoard;
