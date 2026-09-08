"use client";

import React from "react";

export interface SubCategoryBadge {
  name: string;
  count: number;
}

export const WOMEN_SUBCATEGORIES: SubCategoryBadge[] = [
  { name: "T-Shirt", count: 28 },
  { name: "Comfy Trouser", count: 19 },
  { name: "Kurti Tunic And Tops", count: 65 },
  { name: "Pajamas", count: 12 },
  { name: "Pants", count: 5 },
  { name: "Palazzo", count: 7 },
  { name: "Leggings", count: 7 },
  { name: "Hoodie", count: 1 },
  { name: "Sweatshirt", count: 2 },
  { name: "Cargo Pants", count: 1 },
  { name: "Shrug", count: 5 },
  { name: "Co-ords", count: 12 },
  { name: "Tops", count: 4 },
  { name: "Kurti", count: 13 },
  { name: "2pc Salwar Kameez", count: 8 },
  { name: "3pc Salwar Kameez", count: 15 },
  { name: "Denim Pants", count: 1 }
];

export const MEN_SUBCATEGORIES: SubCategoryBadge[] = [
  { name: "T-Shirt", count: 42 },
  { name: "Polo Shirt", count: 24 },
  { name: "Panjabi", count: 35 },
  { name: "Casual Shirt", count: 18 },
  { name: "Denim Jeans", count: 22 },
  { name: "Pajamas", count: 15 },
  { name: "Trouser & Chino", count: 16 },
  { name: "Hoodie", count: 8 },
  { name: "Sweatshirt", count: 6 },
  { name: "Cargo Pants", count: 9 },
  { name: "Jackets", count: 5 }
];

export const KIDS_SUBCATEGORIES: SubCategoryBadge[] = [
  { name: "Baby Onesies", count: 26 },
  { name: "Matching Outfits", count: 31 },
  { name: "T-Shirt", count: 18 },
  { name: "Frocks & Dresses", count: 22 },
  { name: "Pajamas & Sleepwear", count: 14 },
  { name: "Shorts & Pants", count: 12 },
  { name: "Sweaters & Hoodies", count: 7 }
];

export const TEENS_SUBCATEGORIES: SubCategoryBadge[] = [
  { name: "Graphic T-Shirts", count: 20 },
  { name: "Oversized Hoodies", count: 15 },
  { name: "Cargo Pants", count: 11 },
  { name: "Denim Jackets", count: 8 },
  { name: "Co-ords", count: 9 },
  { name: "Sweatpants", count: 14 }
];

export type DepartmentType = "Men" | "Women" | "Kids" | "Teens";

interface ProductFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment: DepartmentType;
  onDepartmentChange: (department: DepartmentType) => void;
  selectedSubcategory: string | null;
  onSubcategoryChange: (subCategory: string | null) => void;
}

export default function ProductFilterBar({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedSubcategory,
  onSubcategoryChange
}: ProductFilterBarProps) {
  // Get subcategories according to currently selected department
  const currentSubcategories: SubCategoryBadge[] = React.useMemo(() => {
    switch (selectedDepartment) {
      case "Men":
        return MEN_SUBCATEGORIES;
      case "Kids":
        return KIDS_SUBCATEGORIES;
      case "Teens":
        return TEENS_SUBCATEGORIES;
      case "Women":
      default:
        return WOMEN_SUBCATEGORIES;
    }
  }, [selectedDepartment]);

  return (
    <div className="w-full bg-white rounded-3xl p-5 md:p-7 border border-slate-100 shadow-xs mb-8 transition-all">
      {/* 1. Full-Width Search Input */}
      {/* <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <svg
            className="w-4 h-4 stroke-[2.2]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.65 11a5.65 5.65 0 11-11.3 0 5.65 5.65 0 0111.3 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search a product"
          className="w-full pl-11 pr-10 py-3 md:py-3.5 bg-white border border-slate-200/90 rounded-2xl text-slate-800 placeholder:text-slate-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#e0006c]/30 focus:border-[#e0006c] shadow-2xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div> */}

      {/* 2. Department / Gender Filter Buttons */}
      <div className="flex items-center gap-2.5 md:gap-3.5 mt-5 flex-wrap">
        {/* Men */}
        <button
          type="button"
          onClick={() => {
            onDepartmentChange("Men");
            onSubcategoryChange(null);
          }}
          className={`flex items-center gap-2 px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer select-none ${selectedDepartment === "Men"
            ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/20 border border-[#2563eb]"
            : "bg-[#eff6ff] text-[#2563eb] border border-blue-200/90 hover:bg-blue-100/70"
            }`}
        >
          {/* Standing Man Icon */}
          <svg
            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${selectedDepartment === "Men" ? "text-white" : "text-[#2563eb]"}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="4" r="2.2" />
            <path d="M14.5 9h-5c-.8 0-1.5.7-1.5 1.5v5c0 .6.4 1 1 1h1v5.5c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V16.5h1c.6 0 1-.4 1-1v-5c0-.8-.7-1.5-1.5-1.5z" />
          </svg>
          <span>Men</span>
        </button>

        {/* Women (Active default matching reference image) */}
        <button
          type="button"
          onClick={() => {
            onDepartmentChange("Women");
            onSubcategoryChange(null);
          }}
          className={`flex items-center gap-2 px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer select-none ${selectedDepartment === "Women"
            ? "bg-[#e0006c] text-white shadow-md shadow-pink-500/25 border border-[#e0006c]"
            : "bg-[#fdf2f8] text-[#e0006c] border border-pink-200/90 hover:bg-pink-100/70"
            }`}
        >
          {/* Standing Woman with dress Icon */}
          <svg
            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${selectedDepartment === "Women" ? "text-white" : "text-[#e0006c]"}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="4" r="2.2" />
            <path d="M14.2 8.5h-4.4c-.6 0-1.1.4-1.2 1l-1.4 7.2c-.1.6.4 1.1 1 1.1h1.8v4.2c0 .6.4 1 1 1h1.8c.6 0 1-.4 1-1v-4.2h1.8c.6 0 1.1-.5 1-1.1l-1.4-7.2c-.1-.6-.6-1-1.2-1z" />
          </svg>
          <span>Women</span>
        </button>

        {/* Kids */}
        <button
          type="button"
          onClick={() => {
            onDepartmentChange("Kids");
            onSubcategoryChange(null);
          }}
          className={`flex items-center gap-2 px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer select-none ${selectedDepartment === "Kids"
            ? "bg-[#059669] text-white shadow-md shadow-emerald-500/20 border border-[#059669]"
            : "bg-[#ecfdf5] text-[#059669] border border-emerald-200/90 hover:bg-emerald-100/70"
            }`}
        >
          {/* Child with raised arms Icon */}
          <svg
            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${selectedDepartment === "Kids" ? "text-white" : "text-[#059669]"}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="4.2" r="2" />
            <path d="M15.8 8.8l1.8-2.6-1.6-1.1-2 2.9a5.5 5.5 0 00-4 0l-2-2.9-1.6 1.1 1.8 2.6c-.9.8-1.4 1.9-1.4 3.2v3.5h1.8v4.5c0 .6.4 1 1 1h2.4c.6 0 1-.4 1-1V15.5h1.8V12c0-1.3-.5-2.4-1.4-3.2z" />
          </svg>
          <span>Kids</span>
        </button>

        {/* Teens */}
        <button
          type="button"
          onClick={() => {
            onDepartmentChange("Teens");
            onSubcategoryChange(null);
          }}
          className={`flex items-center gap-2 px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer select-none ${selectedDepartment === "Teens"
            ? "bg-[#7c3aed] text-white shadow-md shadow-purple-500/20 border border-[#7c3aed]"
            : "bg-[#f5f3ff] text-[#7c3aed] border border-purple-200/90 hover:bg-purple-100/70"
            }`}
        >
          {/* Teen / Youth Icon */}
          <svg
            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${selectedDepartment === "Teens" ? "text-white" : "text-[#7c3aed]"}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="4.5" r="2.2" />
            <path d="M12 9.5c-3 0-5.5 1.5-5.5 3.8v2.2c0 .6.4 1 1 1h1.5v4.5c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-4.5h1.5c.6 0 1-.4 1-1v-2.2c0-2.3-2.5-3.8-5.5-3.8z" />
          </svg>
          <span>Teens</span>
        </button>
      </div>

      {/* 3. Dashed Horizontal Divider Line */}
      <div className="w-full border-b border-dashed border-slate-200/90 my-4 md:my-5" />

      {/* 4. Subcategories Pills with Count Badges */}
      <div className="flex flex-wrap gap-2 md:gap-2.5 items-center">
        {currentSubcategories.map((sub) => {
          const isSelected = selectedSubcategory === sub.name;
          return (
            <button
              key={sub.name}
              type="button"
              onClick={() => {
                // Toggle subcategory selection
                if (isSelected) {
                  onSubcategoryChange(null);
                } else {
                  onSubcategoryChange(sub.name);
                }
              }}
              className={`px-3.5 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-[13px] font-medium transition-all cursor-pointer flex items-center gap-1.5 select-none ${isSelected
                ? "bg-[#fff0f5] border border-[#e0006c] text-[#e0006c] font-bold shadow-xs ring-1 ring-[#e0006c]/30"
                : "bg-white hover:bg-slate-50/80 border border-slate-200/85 text-slate-700 hover:border-slate-300 shadow-2xs"
                }`}
            >
              <span>{sub.name}</span>
              <span
                className={`text-[11px] md:text-xs transition-colors ${isSelected ? "text-[#e0006c]/80 font-bold" : "text-slate-400 font-normal"
                  }`}
              >
                {sub.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
