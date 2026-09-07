"use client";

import React from "react";
import OfferCard, { OfferCardProps } from "./OfferCard";

const OFFER_CARDS: OfferCardProps[] = [
  {
    id: 1,
    brand: "MOOGLE",
    title: "DAYDREAM TM",
    subtitle: "Active heart & sleep tracking sensors",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop&q=80",
    price: "$599",
    discountText: "49% OFF",
    buttonText: "SHOP NOW",
    buttonLink: "/products",
    // Primary system teal gradient
    gradientClass: "bg-gradient-to-b from-primary via-[#006f6c] to-[#004f4d]",
    circleBgClass: "bg-black/15"
  },
  {
    id: 2,
    brand: "MOOGLE",
    title: "DAYDREAM TM",
    subtitle: "Retina OLED display & 50m waterproof",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&q=80",
    price: "$499",
    discountText: "49% OFF",
    buttonText: "SHOP NOW",
    buttonLink: "/products",
    // Accent system pink gradient (matches the image's vibrant coral/pink)
    gradientClass: "bg-gradient-to-b from-accent via-[#e62055] to-[#c71142]",
    circleBgClass: "bg-black/15"
  },
  {
    id: 3,
    brand: "MOOGLE",
    title: "DAYDREAM TM",
    subtitle: "Titanium chassis with dual GPS",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
    price: "$599",
    discountText: "49% OFF",
    buttonText: "SHOP NOW",
    buttonLink: "/products",
    // Deep slate & system teal blend
    gradientClass: "bg-gradient-to-b from-[#111827] via-[#152a2f] to-[#005250]",
    circleBgClass: "bg-white/10"
  },
  {
    id: 4,
    brand: "MOOGLE",
    title: "DAYDREAM TM",
    subtitle: "Rose gold bezel & ECG sensor",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop&q=80",
    price: "$649",
    discountText: "49% OFF",
    buttonText: "SHOP NOW",
    buttonLink: "/products",
    // Warm Amber & Rose Gold blend
    gradientClass: "bg-gradient-to-b from-[#b45309] via-[#92400e] to-[#78350f]",
    circleBgClass: "bg-black/15"
  },
  {
    id: 5,
    brand: "MOOGLE",
    title: "DAYDREAM TM",
    subtitle: "Tactical edition 100m water resistant",
    image: "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=400&h=400&fit=crop&q=80",
    price: "$549",
    discountText: "49% OFF",
    buttonText: "SHOP NOW",
    buttonLink: "/products",
    // Deep Forest Emerald Teal
    gradientClass: "bg-gradient-to-b from-[#064e3b] via-[#047857] to-[#065f46]",
    circleBgClass: "bg-black/15"
  }
];

export default function OfferSection() {
  return (
    <section className="relative w-full py-3 sm:py-5 md:py-6 bg-white overflow-hidden">
      {/* Subtle dotted background matching the screenshot */}
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1.2px,transparent_1.2px)] [background-size:22px_22px] opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Horizontal Carousel & Desktop 5-Column Grid */}
        <div className="flex sm:grid overflow-x-auto sm:overflow-visible pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x snap-mandatory gap-3 sm:gap-3.5 lg:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {OFFER_CARDS.map((card) => (
            <div key={card.id} className="w-[180px] sm:w-auto shrink-0 snap-start">
              <OfferCard {...card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
