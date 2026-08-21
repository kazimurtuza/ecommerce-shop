"use client";

import React, { useState } from "react";
import Link from "next/link";

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  size: string;
  qty: number;
  image: string;
  category: string;
}

export default function CartPage() {
  // Mock shopping cart items with high fidelity details
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Premium Cargo Pant [V Pocket] - Gray",
      price: 1890,
      originalPrice: 2500,
      size: "38",
      qty: 1,
      image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=240&fit=crop&q=80",
      category: "Clothing"
    },
    {
      id: 2,
      name: "Minimalist Leather Backpack - Black",
      price: 1200,
      originalPrice: 1800,
      size: "Regular",
      qty: 1,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=240&fit=crop&q=80",
      category: "Accessories"
    }
  ]);

  // Adjust quantities
  const handleIncreaseQty = (id: number) => {
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
  };

  const handleDecreaseQty = (id: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  // Remove item
  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const originalSubtotal = cartItems.reduce((sum, item) => sum + item.originalPrice * item.qty, 0);
  const estimatedShipping = subtotal > 2000 ? 0 : 60; // Free shipping over 2000 BDT
  const total = subtotal + estimatedShipping;

  return (
    <div className="bg-[#f2f2f7] min-h-screen pb-24 md:py-12 px-4 sm:px-6 lg:px-8 font-['-apple-system',_BlinkMacSystemFont,_'Segoe_UI',_Roboto,_Helvetica,_Arial,_sans-serif] antialiased text-[#1c1c1e]">
      <div className="max-w-5xl mx-auto">
        
        {/* iOS Header */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200/60">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Your Shopping Bag</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-black">Shopping Bag</h1>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 block">Bag Subtotal</span>
            <span className="text-xl font-black text-[#007aff]">৳{subtotal}</span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/50 p-12 text-center shadow-sm space-y-4">
            <div className="text-slate-300 flex justify-center">
              <svg className="w-16 h-16 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-black">Your bag is empty</h2>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">Items you add to your shopping bag will appear here.</p>
            <div className="pt-2">
              <Link href="/" className="inline-block bg-[#007aff] hover:bg-[#0062cc] active:scale-95 text-white text-xs font-bold px-6 py-3 rounded-full transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Cart Items list (Col span 7) */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider pl-4 block">Bag Items ({cartItems.length})</span>
              
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 items-center">
                    
                    {/* Product Image */}
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details and quantity */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.category}</span>
                        <h4 className="text-[13.5px] font-bold text-black leading-snug truncate mt-0.5">
                          {item.name}
                        </h4>
                        <p className="text-[11.5px] text-slate-500 font-medium mt-0.5">
                          Size: {item.size}
                        </p>
                      </div>

                      {/* iOS Quantity Counter */}
                      <div className="flex items-center gap-1.5 mt-2 bg-[#f2f2f7] w-fit rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => handleDecreaseQty(item.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-[#007aff] hover:bg-white active:scale-95 transition-all text-sm select-none cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-black w-4 text-center text-slate-800">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => handleIncreaseQty(item.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-[#007aff] hover:bg-white active:scale-95 transition-all text-sm select-none cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Prices and remove */}
                    <div className="text-right shrink-0 flex flex-col items-end justify-between h-20">
                      <div>
                        {item.originalPrice > item.price && (
                          <span className="text-[11px] text-slate-400 line-through block">
                            ৳{item.originalPrice * item.qty}
                          </span>
                        )}
                        <span className="text-[14px] font-extrabold text-black block mt-0.5">
                          ৳{item.price * item.qty}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[11px] font-bold text-[#ff3b30] hover:text-[#e02b20] active:scale-95 py-1 px-2 rounded-lg hover:bg-[#ff3b30]/10 transition-all flex items-center gap-1"
                        aria-label="Remove item"
                      >
                        <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Price Summary Group (Col span 5) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider pl-4 pb-2 block">Order Details</span>
                <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-5 space-y-4">
                  
                  {/* Summary list details */}
                  <div className="space-y-3.5 text-[13px]">
                    <div className="flex justify-between text-slate-500">
                      <span>Bag Subtotal</span>
                      <span className="font-semibold text-slate-800">৳{subtotal}</span>
                    </div>

                    {originalSubtotal > subtotal && (
                      <div className="flex justify-between text-[#34c759] font-bold bg-[#eefaf0] px-2.5 py-1.5 rounded-lg">
                        <span>Discount Savings</span>
                        <span>-৳{originalSubtotal - subtotal}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-slate-500">
                      <span>Estimated Shipping</span>
                      {estimatedShipping === 0 ? (
                        <span className="text-[#34c759] font-bold">FREE</span>
                      ) : (
                        <span className="font-semibold text-slate-800">৳{estimatedShipping}</span>
                      )}
                    </div>

                    <div className="flex justify-between text-[15px] font-black text-black border-t border-slate-100 pt-3.5">
                      <span>Estimated Total</span>
                      <span className="text-base text-[#007aff]">৳{total}</span>
                    </div>
                  </div>

                  {/* Free shipping progress indicator */}
                  {subtotal < 2000 ? (
                    <div className="bg-[#fff8e6] border border-[#ffeeba] rounded-xl px-4 py-3 text-[11.5px] leading-relaxed text-[#b7791f]">
                      Add <span className="font-bold">৳{2000 - subtotal}</span> more to get <span className="font-bold">FREE Shipping</span>!
                    </div>
                  ) : (
                    <div className="bg-[#eefaf0] border border-[#d2f3db] rounded-xl px-4 py-3 text-[11.5px] leading-relaxed text-[#1e7e34] font-bold flex items-center gap-2">
                      <svg className="w-4.5 h-4.5 stroke-[2.5] text-[#34c759]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Your order qualifies for Free Shipping!
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    className="w-full bg-black hover:bg-slate-900 active:scale-[0.99] text-white font-extrabold py-4 px-6 rounded-2xl tracking-wide transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-[14px] flex items-center justify-center gap-2 select-none cursor-pointer text-center"
                  >
                    Proceed to Checkout
                    <span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>

                </div>
              </div>
            </div>

            {/* STICKY BOTTOM MOBILE BAR */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-white/80 border-t border-slate-200/50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-4 py-3 pb-6 flex items-center justify-between z-40">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
                <span className="text-[18px] font-black text-[#007aff]">৳{total}</span>
              </div>
              <Link
                href="/checkout"
                className="bg-black hover:bg-slate-900 active:scale-95 text-white font-extrabold py-3 px-6 rounded-xl text-xs tracking-wider transition-all flex items-center gap-1.5 select-none cursor-pointer shadow-sm text-center"
              >
                Checkout
                <span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
