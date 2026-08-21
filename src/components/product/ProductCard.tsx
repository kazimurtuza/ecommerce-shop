"use client";

import React from "react";
import Link from "next/link";

interface ProductCardProps {
  title: string;
  price: string;
  tag: string;
  image: string;
  slug: string;
  onAddToBag?: () => void;
}

export default function ProductCard({
  title,
  price,
  tag,
  image,
  slug,
  onAddToBag
}: ProductCardProps) {
  const handleAddToBagClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToBag) {
      onAddToBag();
    }
  };

  return (
    <div className="group block w-full bg-transparent font-sans relative">
      {/* Product Image & Hover Action Container */}
      <div className="relative aspect-[4/5] w-full rounded-[24px] bg-[#f2f4f6] overflow-hidden shadow-sm transition-transform duration-300 group-hover:shadow-md">
        <Link
          href={`/products/${slug}`}
          className="block w-full h-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Hover Glassmorphic Add to Bag Banner */}
        <div
          onClick={handleAddToBagClick}
          className="absolute bottom-4 left-4 right-4 bg-white/75 backdrop-blur-md border border-white/40 shadow-lg rounded-full pl-5 pr-1.5 py-1.5 flex items-center justify-between transition-all duration-300 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 cursor-pointer hover:bg-white/90 z-10"
        >
          <span className="text-xs font-bold text-slate-800 tracking-wide uppercase select-none">
            Add to Bag
          </span>
          <div
            className="w-8 h-8 rounded-full bg-accent hover:bg-accent-hover text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer animate-pulse-subtle"
            role="button"
            aria-label="Add product to bag"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Product Info below the image container */}
      <Link href={`/products/${slug}`} className="block cursor-pointer">
        <div className="pt-3.5 pb-2 px-1 flex flex-col justify-start">
          {/* Tag Pill */}
          <div className="flex">
            <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100/90 border border-slate-200/40 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              {tag}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[13px] md:text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 min-h-[36px] group-hover:text-accent transition-colors">
            {title}
          </h3>

          {/* Price */}
          <p className="text-[11px] md:text-xs text-slate-400 font-bold tracking-wide mt-1 uppercase">
            From <span className="text-slate-900 text-sm md:text-[13px] ml-0.5">{price}</span>
          </p>
        </div>
      </Link>
    </div>
  );
}
