"use client";

import React, { useState } from "react";
import Link from "next/link";

// ==========================================
// Interfaces
// ==========================================

interface WishlistItem {
  id: string;
  title: string;
  image: string;
  price: string;
  slug: string;
  inStock: boolean;
}

// ==========================================
// Mock Data
// ==========================================

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: "w1",
    title: "Premium Heart Pearl Gift Set – Necklace & Rose Edition H0408",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&q=80",
    price: "1,450 BDT",
    slug: "premium-heart-pearl-gift-set",
    inStock: true
  },
  {
    id: "w2",
    title: "Star Master Projection Night Lamp",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop&q=80",
    price: "350 BDT",
    slug: "star-master-projection-night-lamp",
    inStock: true
  }
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST);

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddToBag = (item: WishlistItem) => {
    alert(`Added "${item.title}" to bag!`);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow duration-200 max-w-2xl mx-auto font-sans">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
        My Wishlist
      </h2>
      <p className="text-xs text-slate-400 font-medium mb-6">
        Keep track of items you want to buy later.
      </p>

      {items.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-slate-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-700 text-sm">Your wishlist is empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-normal">
            Explore our categories and add products to your wishlist to buy them later.
          </p>
          <Link 
            href="/"
            className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-3 px-6 rounded-xl mt-6 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100/80">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group first:pt-0 last:pb-0"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 text-sm leading-snug line-clamp-1 group-hover:text-violet-600 transition-colors">
                    {item.title}
                  </span>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    {item.price}
                  </p>
                  <p className="text-[10px] text-emerald-500 font-bold mt-0.5">
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto h-11">
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="w-11 h-11 flex items-center justify-center border border-slate-100 hover:border-red-100 bg-slate-50/50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl shadow-sm hover:shadow active:scale-95 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer shrink-0"
                  aria-label="Remove item"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => handleAddToBag(item)}
                  disabled={!item.inStock}
                  className="h-11 px-6 whitespace-nowrap flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition-all duration-300 ease-out shadow-sm shadow-violet-600/10 hover:shadow-md hover:shadow-violet-600/20 active:scale-[0.98] hover:-translate-y-0.5 cursor-pointer"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
