"use client";

import React from "react";

// ==========================================
// Interfaces
// ==========================================

interface Product {
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  color: string;
  size: string;
}

interface Order {
  id: string;
  productsCount: number;
  customerName: string;
  time: string;
  status: "On the way" | "Shipped to customer";
  deliveryDate: string;
  deliveryAddress: string;
  total: number;
  products: Product[];
}

// ==========================================
// Mock Data
// ==========================================

const MOCK_ORDERS: Order[] = [
  {
    id: "73262",
    productsCount: 4,
    customerName: "Alex John",
    time: "13:45, Nov 10, 2025",
    status: "On the way",
    deliveryDate: "Fri, 13 Nov, 2025",
    deliveryAddress: "House 24, Road 5, Sector 11, Dhaka, PO: 1230",
    total: 340.00,
    products: [
      {
        name: "Premium Heart Pearl Gift Set – Necklace & Rose Edition H0408",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&q=80",
        quantity: 1,
        unitPrice: 340,
        color: "Silver",
        size: "Large"
      },
      {
        name: "Table lamp for office or bedroom",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop&q=80",
        quantity: 2,
        unitPrice: 76,
        color: "Silver",
        size: "Large"
      }
    ]
  },
  {
    id: "09177",
    productsCount: 4,
    customerName: "Alex John",
    time: "13:45, Nov 10, 2025",
    status: "Shipped to customer",
    deliveryDate: "Fri, 13 Nov, 2025",
    deliveryAddress: "Flat 4B, Building 7, Nasirabad Housing Society, Chattogram",
    total: 461.99,
    products: [
      {
        name: "Star Master Projection Night Lamp",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop&q=80",
        quantity: 1,
        unitPrice: 350,
        color: "Silver",
        size: "Large"
      }
    ]
  }
];

export default function OrdersPage() {
  const handleDownloadInvoice = (orderId: string) => {
    alert(`Downloading invoice for Order #${orderId}...`);
  };

  return (
    <div className="space-y-8 font-sans max-w-2xl mx-auto">
      {MOCK_ORDERS.map((order) => {
        const subtotal = order.products.reduce((acc, p) => acc + (p.unitPrice * p.quantity), 0);
        const shippingCost = 15.00;
        const totalAmount = subtotal + shippingCost;
        return (
          <div 
            key={order.id} 
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 md:p-8 hover:shadow-md transition-shadow duration-200"
          >
          {/* Top Panel: Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100/80">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Order #: {order.id}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {order.productsCount} Products | By {order.customerName} | {order.time}
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button 
                onClick={() => handleDownloadInvoice(order.id)}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:shadow active:scale-95 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
              >
                <svg 
                  className="w-4 h-4 text-slate-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download invoice
              </button>
            </div>
          </div>

          {/* Middle Panel: Delivery Info & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-100/80 text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-400 font-medium">Status:</span>
              <span className={`font-bold ${
                order.status === "On the way" ? "text-amber-500" : "text-emerald-500"
              }`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-400 font-medium">Date of delivery:</span>
              <span className="text-slate-800 font-bold">{order.deliveryDate}</span>
            </div>

            <div className="flex flex-col gap-0.5 sm:col-span-2">
              <span className="text-slate-400 font-medium">Delivered to:</span>
              <span className="text-slate-800 font-medium leading-relaxed">{order.deliveryAddress}</span>
            </div>

            <div className="flex flex-col gap-1.5 pt-4 sm:col-span-2 border-t border-slate-100/60 mt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>Subtotal:</span>
                <span className="text-slate-800">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>Shipping:</span>
                <span className="text-slate-800">৳{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100/80 pt-2.5 mt-1">
                <span>Total:</span>
                <span className="text-violet-600">৳{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bottom Panel: Products List Grid */}
          <div className="divide-y divide-slate-100/60 pt-6">
            {order.products.map((product, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between gap-4 group py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 relative rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1 group-hover:text-violet-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Color: <span className="text-slate-500 font-semibold">{product.color}</span> | Size: <span className="text-slate-500 font-semibold">{product.size}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 font-semibold block">{product.quantity}x @ ৳{product.unitPrice.toFixed(2)}</span>
                  <span className="text-sm font-black text-slate-955 mt-1 block">৳{(product.unitPrice * product.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )})}
    </div>
  );
}
