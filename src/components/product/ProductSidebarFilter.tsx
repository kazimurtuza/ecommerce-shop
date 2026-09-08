"use client";

import React, { useState } from "react";

export interface ColorSwatchItem {
  id: string;
  name: string;
  hex: string;
  isRainbow?: boolean;
}

export const SIDEBAR_SIZES = [
  "0-3M", "3-6M", "6-9M", "9-12M",
  "12-18M", "18-24M", "2T", "3T", "4T",
  "5T", "6T", "8Y", "9Y", "10Y", "11Y",
  "12Y", "XS", "S", "M", "L", "XL",
  "2XL", "3XL", "4XL", "Pet", "S(Pets)",
  "L(Pets)", "Drool Bibs"
];

export const SIDEBAR_COLORS: ColorSwatchItem[] = [
  { id: "salmon", name: "Salmon", hex: "#f47280" },
  { id: "orange", name: "Orange", hex: "#fb923c" },
  { id: "pink", name: "Pink", hex: "#f472b6" },
  { id: "tan", name: "Tan", hex: "#d4a373" },
  { id: "yellow", name: "Yellow", hex: "#fde047" },
  { id: "lightblue", name: "Light Blue", hex: "#93c5fd" },
  { id: "sage", name: "Sage Green", hex: "#86efac" },
  { id: "charcoal", name: "Charcoal Black", hex: "#27272a" },
  { id: "grey", name: "Grey", hex: "#71717a" },
  { id: "white", name: "White", hex: "#ffffff" },
  { id: "rainbow", name: "Rainbow / Multi", hex: "", isRainbow: true }
];

export const SIDEBAR_FABRICS = [
  "Bamboo", "Coral Fleece", "Cotton",
  "Polar Fleece", "Satin", "Others"
];

export const SIDEBAR_CATEGORIES = [
  "Pajamas", "Kurti Tunic And Tops", "3pc Salwar Kameez",
  "2pc Salwar Kameez", "Palazzo", "T-Shirt", "Comfy Trouser",
  "Hoodie", "Denim Pants", "Co-ords"
];

interface ProductSidebarFilterProps {
  selectedSizes: string[];
  onSizeToggle: (size: string) => void;
  selectedColor: string | null;
  onColorSelect: (colorId: string | null) => void;
  selectedFabrics: string[];
  onFabricToggle: (fabric: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export default function ProductSidebarFilter({
  selectedSizes,
  onSizeToggle,
  selectedColor,
  onColorSelect,
  selectedFabrics,
  onFabricToggle,
  minPrice,
  maxPrice,
  onPriceChange,
  selectedCategory,
  onCategorySelect,
  onClearAll,
  hasActiveFilters
}: ProductSidebarFilterProps) {
  // Accordion open/collapse states (initially closed)
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isFabricOpen, setIsFabricOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <aside
      className="w-full bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-2xs"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Sidebar Header matching screenshot (Exact word 'Filter', font-semibold, text-[#212529]) */}
      <div className="pb-4 flex items-center justify-between border-b border-[#eeeeee]">
        <h2 className="text-[24px] md:text-[25px] font-semibold text-[#212529] tracking-[-0.01em] leading-tight">
          Filter
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-[#e0006c] hover:underline cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {/* 1. SIZE SECTION */}
      <div className="py-4 border-b border-[#eeeeee]">
        <button
          type="button"
          onClick={() => setIsSizeOpen((prev) => !prev)}
          className="w-full flex items-center justify-between text-left cursor-pointer group select-none"
        >
          <span className="text-[18px] md:text-[19px] font-semibold text-[#212529] tracking-[-0.01em] leading-snug group-hover:text-slate-700">
            Size
          </span>
          <span className="text-[#212529] font-semibold text-base md:text-lg leading-none">
            {isSizeOpen ? "—" : "+"}
          </span>
        </button>

        {isSizeOpen && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {SIDEBAR_SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeToggle(size)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "bg-[#f4f4f5] text-slate-700 hover:bg-slate-200/80"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. COLOR SECTION */}
      <div className="py-4 border-b border-[#eeeeee]">
        <button
          type="button"
          onClick={() => setIsColorOpen((prev) => !prev)}
          className="w-full flex items-center justify-between text-left cursor-pointer group select-none"
        >
          <span className="text-[18px] md:text-[19px] font-semibold text-[#212529] tracking-[-0.01em] leading-snug group-hover:text-slate-700">
            Color
          </span>
          <span className="text-[#212529] font-semibold text-base md:text-lg leading-none">
            {isColorOpen ? "—" : "+"}
          </span>
        </button>

        {isColorOpen && (
          <div className="mt-3.5 flex flex-wrap gap-3 items-center">
            {SIDEBAR_COLORS.map((col) => {
              const isSelected = selectedColor === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => onColorSelect(isSelected ? null : col.id)}
                  title={col.name}
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full transition-all cursor-pointer relative shadow-2xs border ${
                    col.hex === "#ffffff" ? "border-slate-300" : "border-black/10"
                  } ${
                    isSelected
                      ? "ring-2 ring-offset-2 ring-slate-900 scale-110 shadow-xs"
                      : "hover:scale-105"
                  }`}
                  style={{
                    background: col.isRainbow
                      ? "conic-gradient(from 0deg, #ff4e50, #f9d423, #43e97b, #38f9d7, #fa709a, #ff4e50)"
                      : col.hex
                  }}
                  aria-label={`Select color ${col.name}`}
                >
                  {isSelected && (
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-xs font-black ${
                        col.hex === "#ffffff" || col.hex === "#fde047"
                          ? "text-slate-900"
                          : "text-white"
                      }`}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. FABRIC SECTION */}
      <div className="py-4 border-b border-[#eeeeee]">
        <button
          type="button"
          onClick={() => setIsFabricOpen((prev) => !prev)}
          className="w-full flex items-center justify-between text-left cursor-pointer group select-none"
        >
          <span className="text-[18px] md:text-[19px] font-semibold text-[#212529] tracking-[-0.01em] leading-snug group-hover:text-slate-700">
            Fabric
          </span>
          <span className="text-[#212529] font-semibold text-base md:text-lg leading-none">
            {isFabricOpen ? "—" : "+"}
          </span>
        </button>

        {isFabricOpen && (
          <div className="mt-3.5 flex flex-wrap gap-2">
            {SIDEBAR_FABRICS.map((fabric) => {
              const isSelected = selectedFabrics.includes(fabric);
              return (
                <button
                  key={fabric}
                  type="button"
                  onClick={() => onFabricToggle(fabric)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "bg-[#f4f4f5] text-slate-700 hover:bg-slate-200/80"
                  }`}
                >
                  {fabric}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. PRICE SECTION */}
      <div className="py-4 border-b border-[#eeeeee]">
        <button
          type="button"
          onClick={() => setIsPriceOpen((prev) => !prev)}
          className="w-full flex items-center justify-between text-left cursor-pointer group select-none"
        >
          <span className="text-[18px] md:text-[19px] font-semibold text-[#212529] tracking-[-0.01em] leading-snug group-hover:text-slate-700">
            Price
          </span>
          <span className="text-[#212529] font-semibold text-base md:text-lg leading-none">
            {isPriceOpen ? "—" : "+"}
          </span>
        </button>

        {isPriceOpen && (
          <div className="mt-3.5 space-y-4">
            {/* Min and Max Price Input Boxes */}
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center border border-slate-300 rounded-sm px-3 py-2 bg-white text-sm focus-within:border-slate-800">
                <span className="text-slate-500 font-semibold mr-1.5 select-none">$</span>
                <input
                  type="number"
                  min={0}
                  max={maxPrice}
                  value={minPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    onPriceChange(Math.min(val, maxPrice), maxPrice);
                  }}
                  className="w-full text-right outline-none text-slate-800 font-semibold bg-transparent"
                  aria-label="Minimum price"
                />
              </div>

              <span className="text-slate-500 font-black select-none">–</span>

              <div className="flex-1 flex items-center border border-slate-300 rounded-sm px-3 py-2 bg-white text-sm focus-within:border-slate-800">
                <span className="text-slate-500 font-semibold mr-1.5 select-none">$</span>
                <input
                  type="number"
                  min={minPrice}
                  max={120}
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 71;
                    onPriceChange(minPrice, Math.max(val, minPrice));
                  }}
                  className="w-full text-right outline-none text-slate-800 font-semibold bg-transparent"
                  aria-label="Maximum price"
                />
              </div>
            </div>

            {/* Range Slider Track */}
            <div className="relative pt-2 pb-1">
              <input
                type="range"
                min={0}
                max={120}
                value={maxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onPriceChange(minPrice, val);
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-900"
                aria-label="Price range slider"
              />
            </div>

            {/* Max price hint text matching image */}
            <p className="text-xs md:text-sm text-slate-600 font-medium">
              The highest price is $71.74
            </p>
          </div>
        )}
      </div>

      {/* 5. CATEGORY SECTION */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => setIsCategoryOpen((prev) => !prev)}
          className="w-full flex items-center justify-between text-left cursor-pointer group select-none"
        >
          <span className="text-[18px] md:text-[19px] font-semibold text-[#212529] tracking-[-0.01em] leading-snug group-hover:text-slate-700">
            Category
          </span>
          <span className="text-[#212529] font-semibold text-base md:text-lg leading-none">
            {isCategoryOpen ? "—" : "+"}
          </span>
        </button>

        {isCategoryOpen && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {SIDEBAR_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategorySelect(isSelected ? null : cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "bg-[#f4f4f5] text-slate-700 hover:bg-slate-200/80"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
