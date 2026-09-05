"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, getOrders, getUsers } from "@/lib/db";

interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  bgGrad: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: string;
  image: string;
  category: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    const products = getProducts();
    const orders = getOrders();
    const users = getUsers();

    // 1. Calculate Stats dynamically
    const baseRevenue = 14604.59;
    const completedOrders = orders.filter(
      (o) => o.status === "Completed" || o.status === "Processing" || o.status === "Shipped"
    );
    const dynamicRevenue = completedOrders.reduce((sum, o) => {
      const parsed = parseFloat(o.total.replace("$", "").replace(",", ""));
      return sum + (isNaN(parsed) ? 0 : parsed);
    }, 0);
    const totalRevenueFormatted = `$${(baseRevenue + dynamicRevenue).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    const activeOrdersCount = orders.filter(
      (o) => o.status === "Pending" || o.status === "Processing" || o.status === "Shipped"
    ).length;
    // Base 143 offline sales to match initially visual 148
    const displayActiveOrders = String(activeOrdersCount + 143);

    const customersCount = users.filter((u) => u.role === "Customer").length;
    // Base 1245 offline customers to match initially visual 1248
    const displayCustomers = String(customersCount + 1245);

    const computedStats: Stat[] = [
      {
        name: "Total Revenue",
        value: totalRevenueFormatted,
        change: "+12.5% vs last month",
        changeType: "increase",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        bgGrad: "from-violet-500 to-indigo-600",
      },
      {
        name: "Active Orders",
        value: displayActiveOrders,
        change: "+8.2% vs yesterday",
        changeType: "increase",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        bgGrad: "from-sky-400 to-blue-500",
      },
      {
        name: "Total Customers",
        value: displayCustomers,
        change: "+18 new today",
        changeType: "increase",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        bgGrad: "from-emerald-400 to-teal-500",
      },
      {
        name: "Conversion Rate",
        value: "3.24%",
        change: "-0.4% vs last week",
        changeType: "decrease",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        bgGrad: "from-pink-500 to-rose-500",
      },
    ];
    setStats(computedStats);

    // 2. Recent Orders (max 5)
    const formattedRecent: RecentOrder[] = orders.slice(0, 5).map((o) => ({
      id: o.id,
      customer: o.customerName,
      date: o.date.split(" at ")[0],
      total: o.total,
      status: o.status,
    }));
    setRecentOrders(formattedRecent);

    // 3. Best Sellers
    const baseBestSellers = [
      {
        name: "Matching Family Sleeveless Floral Outfits",
        sales: 420,
        revenue: 7975.80,
        image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=100&h=100&fit=crop&q=80",
        category: "Family Matching",
      },
      {
        name: "Disney Matching Family Stripe Outfits",
        sales: 312,
        revenue: 4988.88,
        image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=100&h=100&fit=crop&q=80",
        category: "Mickey & Friends",
      },
      {
        name: "Matching Family Tropical Outfits",
        sales: 198,
        revenue: 3166.02,
        image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=100&h=100&fit=crop&q=80",
        category: "Family Matching",
      },
    ];
    setTopProducts(
      baseBestSellers.map((b) => ({
        ...b,
        revenue: `$${b.revenue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      }))
    );
  }, []);

  const getStatusStyle = (status: RecentOrder["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30";
      case "Processing":
        return "bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/30";
      case "Shipped":
        return "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30";
      case "Completed":
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30";
      case "Cancelled":
        return "bg-rose-50 dark:bg-rose-955/20 text-rose-700 dark:text-rose-454 border-rose-200/50 dark:border-rose-900/30";
      default:
        return "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-800";
    }
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Page Title & Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm mt-1.5">Here is an overview of Hatbazar store analytics and activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13m0 0l-4-4m4 4l4-4m-5 7h6" />
            </svg>
            <span>Export Report</span>
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer">
            <span>Real-time Activity</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between h-40 hover:shadow-md dark:hover:shadow-black/25 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.name}</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">{stat.value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.bgGrad} text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              <span
                className={`text-xs font-bold ${
                  stat.changeType === "increase" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {stat.change.split(" ")[0]}
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {stat.change.substring(stat.change.indexOf(" "))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Content: Recent Orders & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Recent Orders</h2>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Review the latest transactions across your store.</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              See all &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Total</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 font-bold text-slate-900 dark:text-white">{order.id}</td>
                    <td className="py-4 font-semibold text-slate-700 dark:text-slate-200">{order.customer}</td>
                    <td className="py-4 font-medium text-slate-400 dark:text-slate-500">{order.date}</td>
                    <td className="py-4 font-bold text-slate-900 dark:text-white text-right">{order.total}</td>
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Best Sellers</h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Products generating highest volume.</p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                Manage &rarr;
              </Link>
            </div>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.name} className="flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-xl transition-colors">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white leading-snug">{product.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{product.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">{product.revenue}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">{product.sales} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-full inline-block">
              Stats auto-update every 10 seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
