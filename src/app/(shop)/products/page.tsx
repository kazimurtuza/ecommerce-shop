"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/product/ProductCard";
import QuickViewModal, { QuickViewProduct } from "@/components/product/QuickViewModal";
import ProductFilterBar, { DepartmentType } from "@/components/product/ProductFilterBar";
import ProductSidebarFilter from "@/components/product/ProductSidebarFilter";

const PRODUCTS_LIST: QuickViewProduct[] = [
  // --- WOMEN PRODUCTS ---
  {
    id: 101,
    name: "Embroidered Floral A-Line Kurti Tunic",
    price: "$34.50",
    category: "Kurti Tunic And Tops",
    subCategory: "Kurti Tunic And Tops",
    department: "Women",
    fabric: "Cotton",
    tag: "Bestseller",
    slug: "embroidered-floral-kurti-tunic",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Pink", hex: "#f472b6", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop&q=80" },
      { name: "Sage Green", hex: "#86efac", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80" },
      { name: "Yellow", hex: "#fde047", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop&q=80" }
    ],
    availableTypes: ["Women"],
    availableSizes: ["XS", "S", "M", "L", "XL", "2XL"]
  },
  {
    id: 102,
    name: "Pastel Silk Georgette 3pc Salwar Kameez Set",
    price: "$68.00",
    category: "3pc Salwar Kameez",
    subCategory: "3pc Salwar Kameez",
    department: "Women",
    fabric: "Satin",
    tag: "Festive Pick",
    slug: "pastel-silk-3pc-salwar-kameez",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Salmon", hex: "#f47280", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80" },
      { name: "Sage Green", hex: "#86efac", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop&q=80" }
    ],
    availableTypes: ["Women"],
    availableSizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 103,
    name: "Block Printed Pure Cotton 2pc Salwar Kameez",
    price: "$45.00",
    category: "2pc Salwar Kameez",
    subCategory: "2pc Salwar Kameez",
    department: "Women",
    fabric: "Cotton",
    tag: "Trending",
    slug: "cotton-printed-2pc-salwar-kameez",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Light Blue", hex: "#93c5fd", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop&q=80" },
      { name: "Salmon", hex: "#f47280" }
    ],
    availableTypes: ["Women"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 104,
    name: "Flared Rayon Pleated Palazzo Pants",
    price: "$24.99",
    category: "Palazzo",
    subCategory: "Palazzo",
    department: "Women",
    fabric: "Bamboo",
    tag: "Essential",
    slug: "flared-rayon-pleated-palazzo",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "White", hex: "#ffffff", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop&q=80" },
      { name: "Charcoal Black", hex: "#27272a" },
      { name: "Tan", hex: "#d4a373" }
    ],
    availableTypes: ["Women"],
    availableSizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 105,
    name: "Everyday Comfy Stretch Cotton Trouser",
    price: "$28.00",
    category: "Comfy Trouser",
    subCategory: "Comfy Trouser",
    department: "Women",
    fabric: "Cotton",
    tag: "Comfort Fit",
    slug: "everyday-comfy-stretch-trouser",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Tan", hex: "#d4a373", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop&q=80" },
      { name: "Grey", hex: "#71717a" }
    ],
    availableTypes: ["Women"],
    availableSizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 106,
    name: "Red Santa Christmas Matching Family Pajamas",
    price: "$38.99",
    category: "Pajamas",
    subCategory: "Pajamas",
    department: "Women",
    fabric: "Cotton",
    tag: "Family Matching",
    slug: "santa-family-pajamas",
    image: "/images/products/christmas_mom_pajama.jpg",
    availableColors: [
      { name: "Pink", hex: "#f472b6", image: "/images/products/christmas_mom_pajama.jpg" },
      { name: "Salmon", hex: "#f47280", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop&q=80" },
      { name: "Light Blue", hex: "#93c5fd", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&h=800&fit=crop&q=80" }
    ],
    availableTypes: ["Women", "Men", "Kids", "Baby"],
    availableSizes: ["0-3M", "3-6M", "12-18M", "2T", "3T", "S", "M", "L", "XL", "2XL", "3XL"]
  },
  {
    id: 107,
    name: "Relaxed Fit Organic Cotton Graphic T-Shirt",
    price: "$22.00",
    category: "T-Shirt",
    subCategory: "T-Shirt",
    department: "Women",
    fabric: "Cotton",
    tag: "Summer Fresh",
    slug: "relaxed-organic-cotton-tshirt",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "White", hex: "#ffffff", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop&q=80" },
      { name: "Pink", hex: "#f472b6" },
      { name: "Sage Green", hex: "#86efac" }
    ],
    availableTypes: ["Women", "Teens"],
    availableSizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 108,
    name: "Cozy Fleece Drop-Shoulder Hoodie",
    price: "$46.00",
    category: "Hoodie",
    subCategory: "Hoodie",
    department: "Women",
    fabric: "Coral Fleece",
    tag: "Winter Cozy",
    slug: "cozy-fleece-drop-shoulder-hoodie",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Salmon", hex: "#f47280", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=800&fit=crop&q=80" },
      { name: "Grey", hex: "#71717a" }
    ],
    availableTypes: ["Women", "Teens"],
    availableSizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 109,
    name: "High-Rise Straight Leg Denim Pants",
    price: "$49.99",
    category: "Denim Pants",
    subCategory: "Denim Pants",
    department: "Women",
    fabric: "Cotton",
    tag: "Denim Classic",
    slug: "high-rise-straight-denim-pants",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Light Blue", hex: "#93c5fd", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&q=80" },
      { name: "Charcoal Black", hex: "#27272a" }
    ],
    availableTypes: ["Women"],
    availableSizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 110,
    name: "Linen Blend Relaxed 2pc Co-ords Set",
    price: "$56.00",
    category: "Co-ords",
    subCategory: "Co-ords",
    department: "Women",
    fabric: "Bamboo",
    tag: "Trending",
    slug: "linen-blend-relaxed-coords-set",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Orange", hex: "#fb923c", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&q=80" },
      { name: "Sage Green", hex: "#86efac" }
    ],
    availableTypes: ["Women"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 111,
    name: "Open-Front Lightweight Longline Shrug",
    price: "$29.50",
    category: "Shrug",
    subCategory: "Shrug",
    department: "Women",
    fabric: "Satin",
    tag: "Layering",
    slug: "open-front-longline-shrug",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Tan", hex: "#d4a373", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop&q=80" },
      { name: "Charcoal Black", hex: "#27272a" }
    ],
    availableTypes: ["Women"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 112,
    name: "Short Sleeves Peplum Floral Top",
    price: "$26.00",
    category: "Tops",
    subCategory: "Tops",
    department: "Women",
    fabric: "Cotton",
    tag: "Floral Delight",
    slug: "short-sleeves-peplum-top",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Pink", hex: "#f472b6", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop&q=80" },
      { name: "Light Blue", hex: "#93c5fd" }
    ],
    availableTypes: ["Women"],
    availableSizes: ["XS", "S", "M", "L"]
  },

  // --- MEN PRODUCTS ---
  {
    id: 201,
    name: "Classic Semi-Fitting Cotton Panjabi",
    price: "$48.00",
    category: "Panjabi",
    subCategory: "Panjabi",
    department: "Men",
    fabric: "Cotton",
    tag: "Festive",
    slug: "classic-semi-fitting-cotton-panjabi",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Charcoal Black", hex: "#27272a", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop&q=80" },
      { name: "White", hex: "#ffffff" }
    ],
    availableTypes: ["Men"],
    availableSizes: ["M", "L", "XL", "2XL"]
  },
  {
    id: 202,
    name: "Men's Premium Heavyweight Crewneck T-Shirt",
    price: "$24.00",
    category: "T-Shirt",
    subCategory: "T-Shirt",
    department: "Men",
    fabric: "Cotton",
    tag: "Essential",
    slug: "mens-heavyweight-crewneck-tshirt",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Light Blue", hex: "#93c5fd", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&h=800&fit=crop&q=80" },
      { name: "Charcoal Black", hex: "#27272a" },
      { name: "Grey", hex: "#71717a" }
    ],
    availableTypes: ["Men"],
    availableSizes: ["M", "L", "XL", "2XL", "3XL"]
  },
  {
    id: 203,
    name: "Classic Plaid Reindeer Ears Hooded Robe",
    price: "$42.50",
    category: "Pajamas",
    subCategory: "Pajamas",
    department: "Men",
    fabric: "Polar Fleece",
    tag: "Family Matching",
    slug: "plaid-reindeer-robe",
    image: "/images/products/plaid_hooded_robe.jpg",
    availableColors: [
      { name: "Salmon", hex: "#f47280", image: "/images/products/plaid_hooded_robe.jpg" },
      { name: "Sage Green", hex: "#86efac" }
    ],
    availableTypes: ["Men", "Women"],
    availableSizes: ["M", "L", "XL", "2XL"]
  },
  {
    id: 204,
    name: "Pique Cotton Breathable Polo Shirt",
    price: "$32.00",
    category: "Polo Shirt",
    subCategory: "Polo Shirt",
    department: "Men",
    fabric: "Cotton",
    tag: "Smart Casual",
    slug: "pique-cotton-breathable-polo",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Sage Green", hex: "#86efac", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=800&fit=crop&q=80" },
      { name: "Salmon", hex: "#f47280" }
    ],
    availableTypes: ["Men"],
    availableSizes: ["M", "L", "XL", "2XL"]
  },

  // --- KIDS PRODUCTS ---
  {
    id: 301,
    name: "Cream Gingerbread Print Matching Family Christmas Pajamas",
    price: "$23.99",
    category: "Pajamas",
    subCategory: "Matching Outfits",
    department: "Kids",
    fabric: "Cotton",
    tag: "Family Matching",
    slug: "gingerbread-family-pajamas",
    image: "/images/products/christmas_kid_pajama.jpg",
    availableColors: [
      { name: "Tan", hex: "#d4a373", image: "/images/products/christmas_kid_pajama.jpg" },
      { name: "White", hex: "#ffffff", image: "https://images.unsplash.com/photo-1519725392663-8a30ef1d15ca?w=600&h=800&fit=crop&q=80" }
    ],
    availableTypes: ["Kids", "Toddler", "Baby"],
    availableSizes: ["0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "2T", "3T", "4T", "5T", "6T"]
  },
  {
    id: 302,
    name: "Baby Bear Graphic Print Long-sleeve Onesie Romper",
    price: "$16.50",
    category: "Pajamas",
    subCategory: "Baby Onesies",
    department: "Kids",
    fabric: "Bamboo",
    tag: "Soft Touch",
    slug: "baby-bear-onesie",
    image: "/images/products/baby_bear_onesie.jpg",
    availableColors: [
      { name: "Light Blue", hex: "#93c5fd", image: "/images/products/baby_bear_onesie.jpg" },
      { name: "Grey", hex: "#71717a" }
    ],
    availableTypes: ["Baby"],
    availableSizes: ["0-3M", "3-6M", "6-9M", "9-12M", "Drool Bibs"]
  },
  {
    id: 303,
    name: "Floral Cotton Ruffle Dress for Girls",
    price: "$28.00",
    category: "Frocks & Dresses",
    subCategory: "Frocks & Dresses",
    department: "Kids",
    fabric: "Cotton",
    tag: "Adorable",
    slug: "floral-cotton-ruffle-dress",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Yellow", hex: "#fde047", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop&q=80" },
      { name: "Pink", hex: "#f472b6" }
    ],
    availableTypes: ["Kids"],
    availableSizes: ["2T", "3T", "4T", "5T", "6T", "8Y"]
  },

  // --- TEENS PRODUCTS ---
  {
    id: 401,
    name: "Oversized Streetwear Anime Graphic Hoodie",
    price: "$39.99",
    category: "Hoodie",
    subCategory: "Oversized Hoodies",
    department: "Teens",
    fabric: "Coral Fleece",
    tag: "Viral Style",
    slug: "oversized-anime-graphic-hoodie",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Charcoal Black", hex: "#27272a", image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&h=800&fit=crop&q=80" },
      { name: "Grey", hex: "#71717a" }
    ],
    availableTypes: ["Teens"],
    availableSizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 402,
    name: "Multi-Pocket Utility Relaxed Cargo Pants",
    price: "$44.50",
    category: "Cargo Pants",
    subCategory: "Cargo Pants",
    department: "Teens",
    fabric: "Cotton",
    tag: "Street Trend",
    slug: "multi-pocket-relaxed-cargo-pants",
    image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Sage Green", hex: "#86efac", image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&h=800&fit=crop&q=80" },
      { name: "Tan", hex: "#d4a373" }
    ],
    availableTypes: ["Teens"],
    availableSizes: ["S", "M", "L", "XL", "2XL"]
  }
];

// Helper to extract numeric price from "$38.99"
function getNumericPrice(price: string | number): number {
  if (typeof price === "number") return price;
  const match = price.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export default function ProductsPage() {
  // Top Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType>("Women");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Left Sidebar Filter States
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(72);
  const [sidebarCategory, setSidebarCategory] = useState<string | null>(null);

  // QuickView modal state
  const [selectedProduct, setSelectedProduct] = useState<QuickViewProduct | null>(null);

  // Toggle handlers for multi-select sidebar filters
  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleFabricToggle = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const handleClearAllSidebar = () => {
    setSelectedSizes([]);
    setSelectedColor(null);
    setSelectedFabrics([]);
    setMinPrice(0);
    setMaxPrice(72);
    setSidebarCategory(null);
  };

  const handleResetAllFilters = () => {
    setSearchQuery("");
    setSelectedSubcategory(null);
    handleClearAllSidebar();
  };

  const hasActiveSidebarFilters =
    selectedSizes.length > 0 ||
    selectedColor !== null ||
    selectedFabrics.length > 0 ||
    minPrice > 0 ||
    maxPrice < 72 ||
    sidebarCategory !== null;

  // Multi-tier filtering
  const filteredProducts = useMemo(() => {
    return PRODUCTS_LIST.filter((product) => {
      // 1. Department match
      if (product.department && product.department !== selectedDepartment) {
        return false;
      }

      // 2. Top Bar Subcategory match
      if (selectedSubcategory) {
        const itemCategory = product.subCategory || product.category || "";
        const matchesCategory =
          itemCategory.toLowerCase().trim() === selectedSubcategory.toLowerCase().trim() ||
          product.name.toLowerCase().includes(selectedSubcategory.toLowerCase());
        if (!matchesCategory) return false;
      }

      // 3. Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCategory = (product.category || "").toLowerCase().includes(q);
        const matchesSubCategory = (product.subCategory || "").toLowerCase().includes(q);
        const matchesTag = (product.tag || "").toLowerCase().includes(q);

        if (!matchesName && !matchesCategory && !matchesSubCategory && !matchesTag) {
          return false;
        }
      }

      // 4. Sidebar Size match
      if (selectedSizes.length > 0) {
        const prodSizes = (product.availableSizes || []).map((s) =>
          typeof s === "string" ? s : s.value
        );
        const hasMatchingSize = selectedSizes.some((s) => prodSizes.includes(s));
        if (!hasMatchingSize) return false;
      }

      // 5. Sidebar Color match
      if (selectedColor) {
        // Find if product has matching color
        const prodColors = (product.availableColors || []).map((c) => c.name.toLowerCase());
        const hasColor = prodColors.some((c) => c.includes(selectedColor.toLowerCase()));
        if (!hasColor && selectedColor !== "rainbow") return false;
      }

      // 6. Sidebar Fabric match
      if (selectedFabrics.length > 0) {
        if (!product.fabric || !selectedFabrics.includes(product.fabric)) {
          return false;
        }
      }

      // 7. Sidebar Price match
      const numericPrice = getNumericPrice(product.price);
      if (numericPrice < minPrice || numericPrice > maxPrice) {
        return false;
      }

      // 8. Sidebar Category match
      if (sidebarCategory) {
        const cat = (product.category || "").toLowerCase();
        const sub = (product.subCategory || "").toLowerCase();
        const target = sidebarCategory.toLowerCase();
        if (!cat.includes(target) && !sub.includes(target)) {
          return false;
        }
      }

      return true;
    });
  }, [
    selectedDepartment,
    selectedSubcategory,
    searchQuery,
    selectedSizes,
    selectedColor,
    selectedFabrics,
    minPrice,
    maxPrice,
    sidebarCategory
  ]);

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="mb-6 pb-4 border-b border-slate-200/70 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Explore Products
            </h1>
            <p className="text-slate-500 mt-1 text-xs md:text-sm font-medium">
              Find the perfect styles tailored for comfort, celebration, and everyday life.
            </p>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Showing {filteredProducts.length} Items
          </div>
        </div>

        {/* Top Search & Department Filter Bar */}
        <ProductFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={(dept) => {
            setSelectedDepartment(dept);
            setSelectedSubcategory(null);
          }}
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={setSelectedSubcategory}
        />

        {/* Active Filters Bar */}
        {(selectedSubcategory ||
          searchQuery ||
          hasActiveSidebarFilters) && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Filters:
              </span>

              {/* Department */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-100/70 text-[#e0006c]">
                {selectedDepartment}
              </span>

              {/* Subcategory */}
              {selectedSubcategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e0006c] text-white">
                  {selectedSubcategory}
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className="hover:text-pink-200 cursor-pointer"
                    aria-label="Remove category filter"
                  >
                    &times;
                  </button>
                </span>
              )}

              {/* Search query */}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-white">
                  &ldquo;{searchQuery}&rdquo;
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-slate-300 cursor-pointer"
                    aria-label="Remove search filter"
                  >
                    &times;
                  </button>
                </span>
              )}

              {/* Selected Sizes */}
              {selectedSizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800"
                >
                  Size: {s}
                  <button
                    onClick={() => handleSizeToggle(s)}
                    className="hover:text-slate-500 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}

              {/* Selected Color */}
              {selectedColor && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 capitalize">
                  Color: {selectedColor}
                  <button
                    onClick={() => setSelectedColor(null)}
                    className="hover:text-slate-500 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              )}

              {/* Selected Fabrics */}
              {selectedFabrics.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800"
                >
                  Fabric: {f}
                  <button
                    onClick={() => handleFabricToggle(f)}
                    className="hover:text-slate-500 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}

              {/* Price Filter Tag */}
              {(minPrice > 0 || maxPrice < 72) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                  ${minPrice} - ${maxPrice}
                  <button
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(72);
                    }}
                    className="hover:text-slate-500 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              )}

              {/* Sidebar Category */}
              {sidebarCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                  {sidebarCategory}
                  <button
                    onClick={() => setSidebarCategory(null)}
                    className="hover:text-slate-500 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              )}

              <button
                onClick={handleResetAllFilters}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline ml-2 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

        {/* Main Content Layout: Left Sidebar + Right Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Filter Sidebar (Matching Reference Image) */}
          <div className="lg:col-span-1">
            <ProductSidebarFilter
              selectedSizes={selectedSizes}
              onSizeToggle={handleSizeToggle}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              selectedFabrics={selectedFabrics}
              onFabricToggle={handleFabricToggle}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
              selectedCategory={sidebarCategory}
              onCategorySelect={setSidebarCategory}
              onClearAll={handleClearAllSidebar}
              hasActiveFilters={hasActiveSidebarFilters}
            />
          </div>

          {/* Right Column: Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.name}
                    price={typeof product.price === "number" ? `$${product.price.toFixed(2)}` : product.price}
                    tag={product.tag || product.category || "General"}
                    image={product.image}
                    slug={product.slug || "product"}
                    onAddToBag={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs max-w-lg mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-pink-50 text-[#e0006c] mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">No products found</h3>
                <p className="text-sm text-slate-500 mt-1.5 mb-6">
                  We couldn&apos;t find any items matching your selected criteria.
                </p>
                <button
                  onClick={handleResetAllFilters}
                  className="px-6 py-2.5 rounded-full bg-[#e0006c] hover:bg-[#c80060] text-white text-xs font-bold transition-all shadow-md shadow-pink-500/20 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Customizer Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
