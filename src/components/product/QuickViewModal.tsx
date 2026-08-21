"use client";

import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  tag: string;
  slug: string;
  image: string;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose
}: QuickViewModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("Roseo");
  const [selectedSize, setSelectedSize] = useState<string>("6-7Y");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Reset states when a new product is selected or modal opens
  useEffect(() => {
    if (product) {
      setSelectedColor("Roseo");
      setSelectedSize("6-7Y");
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  // Mock colors matching screenshot swatch styles
  const COLORS_DATA = [
    {
      name: "Mustard",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop&q=80"
    },
    {
      name: "Lavande",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=80&h=80&fit=crop&q=80"
    },
    {
      name: "Roseo",
      image: product.image // Use current product image as primary color swatch
    }
  ];

  // Mock sizes matching layout
  const SIZES_DATA = [
    { value: "3-4Y", available: false },
    { value: "4-5Y", available: false },
    { value: "5-6Y", available: false },
    { value: "6-7Y", available: true },
    { value: "7-8Y", available: true },
    { value: "8-9Y", available: false },
    { value: "9-10Y", available: true }
  ];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleNextImage = () => {
    // Just toggle between product image and a color image for demo slideshow
    setActiveImageIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const displayImage = activeImageIndex === 0 ? product.image : COLORS_DATA[0].image;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Container */}
      <div className="bg-white rounded-[32px] w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[92vh] md:max-h-[600px] border border-slate-100 animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-100 transition-all cursor-pointer focus:outline-none"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Column: Product Image Gallery */}
        <div className="w-full md:w-1/2 bg-[#f2f4f6] relative flex items-center justify-center p-4 md:p-8 min-h-[220px] md:min-h-[500px] h-[35vh] md:h-auto">
          {/* Main Image */}
          <div className="w-full h-full max-h-[200px] md:max-h-[440px] rounded-2xl overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Next Slider Arrow */}
          <button
            onClick={handleNextImage}
            className="absolute right-4 md:right-6 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-100 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer focus:outline-none"
            aria-label="Next image"
          >
            <svg className="w-5.5 h-5.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Right Column: Customizer Details */}
        <div className="w-full md:w-1/2 p-5 md:p-8 flex flex-col justify-between overflow-y-auto bg-white flex-1">
          <div className="space-y-4 md:space-y-6">
            
            {/* Product Header */}
            <div>
              <h2 className="text-2xl md:text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h2>
              {/* Star Ratings */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-amber-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </span>
                <span className="text-sm font-black text-slate-800">4.8</span>
                <span className="text-xs text-slate-400 font-semibold">11 verified reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {product.price}
            </div>

            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Color
                </span>
                <span className="text-xs font-extrabold text-slate-900">
                  {selectedColor}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3.5 mt-1.5 md:mt-2.5">
                {COLORS_DATA.map((col) => {
                  const isSelected = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      onClick={() => {
                        setSelectedColor(col.name);
                        // Also show a brief image shift
                        handleNextImage();
                      }}
                      className={`w-10 h-10 rounded-full p-[3px] border-2 transition-all cursor-pointer focus:outline-none ${
                        isSelected ? "border-slate-900 scale-105" : "border-transparent hover:border-slate-300"
                      }`}
                      aria-label={`Select color ${col.name}`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={col.image}
                          alt={col.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Options Grid */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Size
                </span>
                <span className="text-xs font-extrabold text-slate-900">
                  {selectedSize}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-1.5 md:mt-2.5">
                {SIZES_DATA.map((sz) => {
                  const isSelected = selectedSize === sz.value;
                  const isAvailable = sz.available;
                  return (
                    <button
                      key={sz.value}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(sz.value)}
                      className={`relative flex items-center justify-center py-2.5 border rounded-xl text-[11px] font-black tracking-wide transition-all select-none focus:outline-none ${
                        !isAvailable
                          ? "border-slate-200 text-slate-300 bg-slate-50/50 cursor-not-allowed"
                          : isSelected
                          ? "border-slate-900 text-slate-900 bg-white font-extrabold"
                          : "border-slate-200 text-slate-800 bg-white hover:border-slate-400 cursor-pointer"
                      }`}
                    >
                      {sz.value}
                      {/* Diagonal Cross-out line matching screenshot perfectly using SVG */}
                      {!isAvailable && (
                        <svg
                          className="absolute inset-0 w-full h-full text-slate-200/90"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Interactive Actions */}
          <div className="flex items-center gap-3 mt-5 md:mt-8 pt-3 md:pt-4 border-t border-slate-100">
            {/* Quantity Pill Box */}
            <div className="flex items-center border border-slate-200 rounded-full px-3 py-1.5 md:px-4.5 md:py-2.5 bg-white shrink-0">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="text-slate-400 hover:text-slate-700 font-extrabold text-sm md:text-base focus:outline-none w-4 md:w-5 cursor-pointer"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-6 md:w-8 text-center text-xs md:text-sm font-extrabold text-slate-800">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="text-slate-400 hover:text-slate-700 font-extrabold text-sm md:text-base focus:outline-none w-4 md:w-5 cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Black Checkout/Add Button */}
            <button
              onClick={() => {
                alert(`Added ${quantity} of ${product.name} (Size: ${selectedSize}, Color: ${selectedColor}) to bag!`);
                onClose();
              }}
              className="flex-1 bg-accent hover:bg-accent-hover text-white font-extrabold text-[11px] md:text-xs uppercase tracking-widest py-3.5 md:py-4.5 px-4 md:px-6 rounded-full shadow-lg shadow-accent/10 active:scale-[0.99] transition-all cursor-pointer text-center"
            >
              ADD TO BAG - {product.price} USD
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
