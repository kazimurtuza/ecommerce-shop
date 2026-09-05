"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getOrders, Order } from "@/lib/db";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const statuses = ["All", "Pending", "Processing", "Shipped", "Completed", "Cancelled"];

  const filteredOrders = orders.filter((order) => {
    return statusFilter === "All" || order.status === statusFilter;
  });

  const getStatusStyle = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30";
      case "Processing":
        return "bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/30";
      case "Shipped":
        return "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30";
      case "Completed":
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30";
      case "Cancelled":
        return "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30";
      default:
        return "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-800";
    }
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Orders Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">Track storefront transactions, fulfillment statuses, and invoices.</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl flex flex-wrap gap-1 shadow-sm max-w-2xl">
        {statuses.map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`py-2 px-4 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/15"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4.5 px-6 font-semibold">Order ID</th>
                <th className="py-4.5 px-6 font-semibold">Customer</th>
                <th className="py-4.5 px-6 font-semibold">Date</th>
                <th className="py-4.5 px-6 font-semibold text-center">Items</th>
                <th className="py-4.5 px-6 font-semibold text-right">Total Price</th>
                <th className="py-4.5 px-6 font-semibold text-center">Status</th>
                <th className="py-4.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{order.id}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-400 dark:text-slate-500">{order.date}</td>
                    <td className="py-4 px-6 text-center font-semibold text-slate-700 dark:text-slate-300">{order.itemsCount}</td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white text-right">{order.total}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    No orders found matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
