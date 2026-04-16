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

  // Calculate statistics
  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const pendingDeliveries = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Calculate today's and last 7 days' revenue
  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  // Calculate the date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  // Filter orders for today and the last 7 days
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt) >= startOfToday,
  );
  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0,
  );

  // Filter orders for the last 7 days
  const sevenDaysOrders = orders.filter(
    (o) => new Date(o.createdAt) >= sevenDaysAgo,
  );
  const sevenDaysRevenue = sevenDaysOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0,
  );

  // Prepare stats for display
  const stats = [
    { title: "Total Orders", value: totalOrders },
    { title: "Total Customers", value: totalCustomers },
    { title: "Pending Deliveries", value: pendingDeliveries },
    { title: "Total Revenue", value: totalRevenue },
  ];

  const chartData = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const ordersCount = orders.filter(
      (o) => new Date(o.createdAt) >= date && new Date(o.createdAt) < nextDay,
    ).length;

    chartData.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      orders: ordersCount,
    });
  }

  return (
    <>
      <AdminDashBoardClient
        earning={{
          today: todayRevenue,
          sevenDays: sevenDaysRevenue,
          total: totalRevenue,
        }}
        stats={stats}
        chartData={chartData}
      />
    </>
  );
}

export default AdminDashBoard;
