"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface OfferCardProps {
  id: string | number;
  brand: string;
  title: string;
  subtitle: string;
  image: string;
  price: string;
  discountText?: string;
  buttonText?: string;
  buttonLink?: string;
  gradientClass?: string;
  circleBgClass?: string;
  onAction?: () => void;
}

export default function OfferCard({
  brand,
  title,
  subtitle,
  image,
  price,
  discountText = "49% OFF",
  buttonText = "SHOP NOW",
  buttonLink = "/products",
  gradientClass = "bg-gradient-to-b from-primary via-[#006f6c] to-[#004f4d]",
  circleBgClass = "bg-black/15",
  onAction
}: OfferCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onAction) {
      e.preventDefault();
      onAction();
    }
  };

  return (
    <div
      className={`group relative rounded-tl-[48px] sm:rounded-tl-[54px] md:rounded-tl-[60px] rounded-br-[48px] sm:rounded-br-[54px] md:rounded-br-[60px] rounded-tr-[16px] sm:rounded-tr-[20px] rounded-bl-[16px] sm:rounded-bl-[20px] overflow-hidden p-3 sm:p-3.5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md min-h-[265px] sm:min-h-[280px] md:min-h-[295px] select-none ${gradientClass}`}
    >
      {/* Subtle ambient lighting inside card */}
      <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-white/15 blur-lg pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full bg-black/15 blur-lg pointer-events-none" />

      {/* Top Section: Brand, Title, Subtitle */}
      <div className="relative z-10 w-full flex flex-col items-center pt-0.5">
        <span className="text-[8.5px] sm:text-[9px] font-extrabold tracking-[0.2em] text-white/90 uppercase mb-0.5 drop-shadow-xs">
          {brand}
        </span>
        <h3 className="text-xs sm:text-[13.5px] font-black tracking-wider text-white uppercase drop-shadow-xs leading-tight">
          {title}
        </h3>
        <p className="text-[9px] sm:text-[9.5px] text-white/80 font-medium max-w-[150px] mx-auto line-clamp-1 mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Center Section: Circular backdrop & Product Image */}
      <div className="relative my-1 sm:my-1.5 flex items-center justify-center w-full">
        {/* Circular disc backdrop */}
        <div
          className={`w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full flex items-center justify-center relative transition-transform duration-500 group-hover:scale-105 shadow-inner ${circleBgClass}`}
        >
          {/* Product Image */}
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full overflow-hidden flex items-center justify-center p-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`${brand} ${title}`}
              className="w-full h-full object-cover rounded-full drop-shadow-lg transform transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Discount Text & Action Button */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center gap-1 pb-0.5">
        {discountText && (
          <span className="text-white font-black text-[10px] sm:text-[11px] tracking-wider uppercase drop-shadow-sm">
            {discountText}
          </span>
        )}
        <Link
          href={buttonLink}
          onClick={handleClick}
          className="inline-block bg-[#1e232a] hover:bg-black text-white rounded-full font-black text-[9px] sm:text-[10px] tracking-wider uppercase px-4 sm:px-5 py-1.5 sm:py-2 shadow-md shadow-black/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
