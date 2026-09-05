"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrders, saveOrders, Order, OrderItem } from "@/lib/db";

interface OrderDetail {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  subtotal: string;
  shipping: string;
  discount: string;
  total: string;
  status: "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: "Paid" | "Unpaid" | "Refunded";
  items: OrderItem[];
}

const MOCK_ORDER_DETAILS: Record<string, OrderDetail> = {
  "ORD-9482": {
    id: "ORD-9482",
    customerName: "Farhan Rahman",
    customerEmail: "farhan@example.com",
    customerPhone: "+880 1712 345678",
    date: "Aug 23, 2026 at 10:14 PM",
    subtotal: "$37.98",
    shipping: "$18.99",
    discount: "$0.00",
    total: "$56.97",
    status: "Processing",
    shippingAddress: "House 45, Road 11, Banani, Dhaka, Bangladesh",
    paymentMethod: "Credit Card (Visa ending in 4242)",
    paymentStatus: "Paid",
    items: [
      {
        id: 1,
        name: "Matching Family Sleeveless Floral Outfits Black",
        price: "$18.99",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=100&h=100&fit=crop&q=80",
      },
    ],
  },
  "ORD-9481": {
    id: "ORD-9481",
    customerName: "Tasmia Islam",
    customerEmail: "tasmia@example.com",
    customerPhone: "+880 1812 765432",
    date: "Aug 23, 2026 at 3:30 PM",
    subtotal: "$109.50",
    shipping: "$15.00",
    discount: "$0.00",
    total: "$124.50",
    status: "Completed",
    shippingAddress: "Flat 4B, Building 12, Gulshan 2, Dhaka, Bangladesh",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Paid",
    items: [
      {
        id: 2,
        name: "Matching Family Polo Collar Sleeveless Floral Outfits",
        price: "$18.99",
        quantity: 5,
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=100&h=100&fit=crop&q=80",
      },
    ],
  },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderDetail["status"]>("Pending");
  const [paymentStatus, setPaymentStatus] = useState<OrderDetail["paymentStatus"]>("Paid");
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    params.then((p) => setUnwrappedParams(p));
  }, [params]);

  useEffect(() => {
    if (unwrappedParams) {
      const orders = getOrders();
      const matchedOrder = orders.find((o) => o.id === unwrappedParams.id);
      if (matchedOrder) {
        const details: OrderDetail = {
          id: matchedOrder.id,
          customerName: matchedOrder.customerName,
          customerEmail: matchedOrder.customerEmail,
          customerPhone: matchedOrder.customerPhone || "N/A",
          date: matchedOrder.date,
          subtotal: matchedOrder.subtotal || matchedOrder.total,
          shipping: matchedOrder.shipping || "$0.00",
          discount: matchedOrder.discount || "$0.00",
          total: matchedOrder.total,
          status: matchedOrder.status,
          shippingAddress: matchedOrder.shippingAddress || "In-store Pickup (POS)",
          paymentMethod: matchedOrder.paymentMethod || "Cash",
          paymentStatus: matchedOrder.paymentStatus || "Paid",
          items: matchedOrder.items || [],
        };
        setOrder(details);
        setOrderStatus(details.status);
        setPaymentStatus(details.paymentStatus);
      } else {
        const details = MOCK_ORDER_DETAILS[unwrappedParams.id] || MOCK_ORDER_DETAILS["ORD-9482"];
        setOrder(details);
        setOrderStatus(details.status);
        setPaymentStatus(details.paymentStatus);
      }
    }
  }, [unwrappedParams]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !unwrappedParams) return;

    const orders = getOrders();
    const exists = orders.some((o) => o.id === unwrappedParams.id);
    
    let updatedOrders;
    if (exists) {
      updatedOrders = orders.map((o) => {
        if (o.id === unwrappedParams.id) {
          return {
            ...o,
            status: orderStatus,
            paymentStatus: paymentStatus,
          };
        }
        return o;
      });
    } else {
      const newOrderFromMock: Order = {
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        date: order.date,
        total: order.total,
        status: orderStatus,
        itemsCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: order.subtotal,
        shipping: order.shipping,
        discount: order.discount,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: paymentStatus,
        items: order.items,
      };
      updatedOrders = [newOrderFromMock, ...orders];
    }
    
    saveOrders(updatedOrders);
    alert(`Order #${order?.id} successfully updated to status: ${orderStatus} / ${paymentStatus}!`);
  };

  const getStatusStyle = (status: OrderDetail["status"]) => {
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
        return "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30";
      default:
        return "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-800";
    }
  };

  if (!order) {
    return <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium font-sans">Loading order details...</div>;
  }

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Header & Back */}
      <div className="space-y-2">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>Back to orders list</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Order {order.id}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">Placed on {order.date}</p>
          </div>
          <span className={`inline-flex items-center rounded-xl px-3.5 py-1.5 text-xs font-bold border self-start sm:self-auto ${getStatusStyle(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Grid: Order details vs Customer panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Area: Order Items & Pricing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-5">
            <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm pb-3 border-b border-slate-100 dark:border-slate-800">Order Items</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">{item.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">Price: {item.price}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Qty: {item.quantity}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">
                      Total: ${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Calculations */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm pb-3 border-b border-slate-100 dark:border-slate-800">Payment Breakdown</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between font-semibold text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-800 dark:text-slate-200">{order.subtotal}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-500 dark:text-slate-400">
                <span>Shipping fee</span>
                <span className="text-slate-800 dark:text-slate-200">{order.shipping}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-500 dark:text-slate-400">
                <span>Discount</span>
                <span className="text-slate-800 dark:text-slate-200">{order.discount}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between font-extrabold text-slate-900 dark:text-white text-sm">
                <span>Total Amount Paid</span>
                <span className="text-violet-600 dark:text-violet-400">{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Customer Details & Fulfillment */}
        <div className="space-y-6">
          {/* Customer Profile */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm pb-3 border-b border-slate-100 dark:border-slate-800">Customer Info</h3>
            <div className="text-xs space-y-2">
              <p className="font-bold text-slate-900 dark:text-white text-sm">{order.customerName}</p>
              <p className="font-semibold text-slate-500 dark:text-slate-400">Email: <span className="text-slate-800 dark:text-slate-200">{order.customerEmail}</span></p>
              <p className="font-semibold text-slate-500 dark:text-slate-400">Phone: <span className="text-slate-800 dark:text-slate-200">{order.customerPhone}</span></p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm pb-3 border-b border-slate-100 dark:border-slate-800">Delivery details</h3>
            <div className="text-xs space-y-2 leading-relaxed">
              <p className="font-semibold text-slate-500 dark:text-slate-400">Shipping Address:</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{order.shippingAddress}</p>
              <p className="font-semibold text-slate-500 dark:text-slate-400 mt-2">Payment Method: <span className="text-slate-800 dark:text-slate-200 font-bold">{order.paymentMethod}</span></p>
            </div>
          </div>

          {/* Fulfillment update Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">Manage Order Status</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Fulfillment Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as OrderDetail["status"])}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as OrderDetail["paymentStatus"])}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer"
              >
                Update Details
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
