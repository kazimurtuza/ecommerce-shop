"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  id: number;
  bgClass: string;
  themeColor: string;
  badgeText: string;
  badgeBg: string;
  offerText: string;
  discountNumber: string;
  discountLabel: string;
  rightImage: string;
  leftProducts: {
    name: string;
    image: string;
    bgColor: string;
    textColor: string;
  }[];
}

const SLIDES_DATA: Slide[] = [
  {
    id: 1,
    bgClass: "bg-[#fff0f2]", // Soft pink matching screenshot
    themeColor: "text-rose-600",
    badgeText: "SPECIAL DISCOUNT",
    badgeBg: "bg-amber-400 text-slate-900",
    offerText: "UP TO",
    discountNumber: "35%",
    discountLabel: "OFF",
    rightImage: "https://images.unsplash.com/photo-1544126592-807adc26909d?auto=format&fit=crop&w=500&h=400&q=80", // Mother holding baby
    leftProducts: [
      {
        name: "PediaSure",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop&q=80", // Milk/bottle
        bgColor: "bg-violet-700",
        textColor: "text-white"
      },
      {
        name: "Huggies",
        image: "https://images.unsplash.com/photo-1598136490941-30d885318abd?w=150&h=150&fit=crop&q=80", // Diapers
        bgColor: "bg-red-600",
        textColor: "text-white"
      },
      {
        name: "Meril Baby",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&h=150&fit=crop&q=80", // Baby soap
        bgColor: "bg-sky-400",
        textColor: "text-white"
      }
    ]
  },
  {
    id: 2,
    bgClass: "bg-[#f0f9f9]", // Soft teal
    themeColor: "text-teal-600",
    badgeText: "HEALTHCARE SAVINGS",
    badgeBg: "bg-primary text-white",
    offerText: "FLAT",
    discountNumber: "20%",
    discountLabel: "OFF",
    rightImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&h=400&q=80", // Doctor / wellness
    leftProducts: [
      {
        name: "BP Monitor",
        image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=150&h=150&fit=crop&q=80", // Medical device
        bgColor: "bg-slate-700",
        textColor: "text-white"
      },
      {
        name: "Vitamins",
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&h=150&fit=crop&q=80", // Supplements
        bgColor: "bg-primary",
        textColor: "text-white"
      }
    ]
  },
  {
    id: 3,
    bgClass: "bg-[#fdf6f0]", // Soft peach
    themeColor: "text-orange-600",
    badgeText: "GLOWING SKINCARE",
    badgeBg: "bg-amber-600 text-white",
    offerText: "UP TO",
    discountNumber: "40%",
    discountLabel: "OFF",
    rightImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=500&h=400&q=80", // Beauty model
    leftProducts: [
      {
        name: "Serum",
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=150&h=150&fit=crop&q=80", // Face serum
        bgColor: "bg-orange-800",
        textColor: "text-white"
      },
      {
        name: "Cream",
        image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=150&h=150&fit=crop&q=80", // Moisture cream
        bgColor: "bg-rose-700",
        textColor: "text-white"
      }
    ]
  }
];

export default function PromoBanner() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDES_DATA.length);
    }, 5000); // Autoplay every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? SLIDES_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  const currentSlide = SLIDES_DATA[currentSlideIndex];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 group select-none">
      {/* Banner Container */}
      <div className={`relative w-full h-[220px] md:h-[320px] rounded-3xl overflow-hidden transition-colors duration-500 shadow-md ${currentSlide.bgClass} flex items-center justify-between`}>
        
        {/* Left Section: Overlapping product images */}
        <div className="hidden lg:flex items-center justify-center w-1/4 h-full relative pl-8">
          <div className="relative w-full h-[80%] flex items-center justify-start gap-4">
            {currentSlide.leftProducts.map((prod, idx) => {
              // Create overlapping/stacked layout similar to screenshot
              const offsets = [
                "translate-x-0 z-10 rotate-[-8deg] scale-100",
                "translate-x-8 translate-y-4 z-20 rotate-[4deg] scale-105",
                "translate-x-16 translate-y-[-8px] z-30 rotate-[-4deg] scale-110",
              ];
              return (
                <div
                  key={prod.name}
                  className={`absolute left-0 w-28 h-40 md:w-36 md:h-48 rounded-2xl overflow-hidden shadow-lg border border-white/60 bg-white p-2 flex flex-col justify-between transition-transform duration-500 ${offsets[idx] || ""}`}
                >
                  <div className="w-full h-[70%] rounded-xl overflow-hidden relative bg-slate-50 border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`w-full text-center py-1 rounded-lg text-[10px] md:text-xs font-extrabold ${prod.bgColor} ${prod.textColor} truncate`}>
                    {prod.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Section: Stylized Text (Matches screenshot perfectly) */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 z-10">
          {/* Badge */}
          <div className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase mb-3 md:mb-4 shadow-sm shadow-black/5 ${currentSlide.badgeBg}`}>
            {currentSlide.badgeText}
          </div>

          {/* Offer text grid matching the layout */}
          <div className="flex items-center gap-2 md:gap-4 justify-center">
            {/* "UP TO" / "FLAT" stacked vertically */}
            <span className="text-sm md:text-2xl font-black text-slate-800 tracking-wider leading-none text-right">
              {currentSlide.offerText.split(" ").map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </span>

            {/* Huge Number "35%" */}
            <span className={`text-6xl md:text-9xl font-black tracking-tighter leading-none ${currentSlide.themeColor} drop-shadow-sm`}>
              {currentSlide.discountNumber}
            </span>

            {/* "OFF" stacked vertically */}
            <span className="text-xl md:text-4xl font-black text-slate-800 tracking-widest leading-none text-left">
              {currentSlide.discountLabel}
            </span>
          </div>
        </div>

        {/* Right Section: Model Image with Floating Heart */}
        <div className="w-1/3 md:w-1/4 h-full relative overflow-hidden flex items-end">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSlide.rightImage}
            alt="Offer Banner"
            className="w-full h-full object-cover object-center translate-y-2 transform scale-105"
          />
          {/* Floating Heart Icon Overlay */}
          <div className="absolute top-8 right-8 w-10 h-10 md:w-12 md:h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg border border-slate-100 z-10 animate-bounce">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2.5 md:left-4 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-200/60 bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 shadow-md hover:bg-white hover:scale-105 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2.5 md:right-4 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-200/60 bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 shadow-md hover:bg-white hover:scale-105 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Slide dots indicators */}
      <div className="flex justify-center gap-2.5 mt-4">
        {SLIDES_DATA.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(index)}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-primary border-primary scale-110"
                  : "bg-transparent border-slate-300 hover:border-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
