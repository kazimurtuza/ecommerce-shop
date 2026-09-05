"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/product/ProductCard";
import QuickViewModal, { QuickViewProduct } from "@/components/product/QuickViewModal";

const PRODUCTS_LIST: QuickViewProduct[] = [
  {
    id: 1,
    name: "Red Santa Christmas Tree Print Matching Family Christmas Pajamas",
    price: "$38.99",
    category: "Family Matching",
    tag: "Family Matching",
    slug: "santa-family-pajamas",
    image: "/images/products/christmas_mom_pajama.jpg",
    availableColors: [
      { name: "Hot Pink", hex: "#f43f5e", image: "/images/products/christmas_mom_pajama.jpg" },
      { name: "Crimson Red", hex: "#dc2626", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop&q=80" },
      { name: "Navy Blue", hex: "#1e3a8a", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&h=800&fit=crop&q=80" },
      { name: "Dark Forest", hex: "#166534", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&q=80" }
    ],
    availableTypes: ["Women", "Men", "Kids", "Baby"],
    availableSizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 2,
    name: "Cream Gingerbread Print Matching Family Christmas Pajamas",
    price: "$23.99",
    category: "Family Matching",
    tag: "Family Matching",
    slug: "gingerbread-family-pajamas",
    image: "/images/products/christmas_kid_pajama.jpg",
    availableColors: [
      { name: "Khaki", hex: "#c3b091", image: "/images/products/christmas_kid_pajama.jpg" },
      { name: "Cream White", hex: "#fef3c7", image: "https://images.unsplash.com/photo-1519725392663-8a30ef1d15ca?w=600&h=800&fit=crop&q=80" },
      { name: "Gingerbread Brown", hex: "#854d0e", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=800&fit=crop&q=80" }
    ],
    availableTypes: ["Kids", "Toddler", "Baby"],
    availableSizes: ["12-18M", "2Y", "3Y", "4Y", "5Y", "6Y"]
  },
  {
    id: 3,
    name: "Baby Bear Graphic Print Long-sleeve Onesie Romper",
    price: "$16.50",
    category: "Baby & Toddler",
    tag: "Baby & Toddler",
    slug: "baby-bear-onesie",
    image: "/images/products/baby_bear_onesie.jpg",
    availableColors: [
      { name: "Sky Blue", hex: "#38bdf8", image: "/images/products/baby_bear_onesie.jpg" },
      { name: "Oatmeal", hex: "#e2e8f0" }
    ],
    availableSizes: ["0-3M", "3-6M", "6-9M", "9-12M"]
  },
  {
    id: 4,
    name: "Winter Wonderland Snowflake Thermal Sleep Set",
    price: "$32.00",
    category: "Sleepwear",
    tag: "Sleepwear",
    slug: "snowflake-thermal-set",
    image: "/images/products/winter_thermal_set.jpg",
    availableColors: [
      { name: "Icy Grey", hex: "#94a3b8", image: "/images/products/winter_thermal_set.jpg" },
      { name: "Midnight Navy", hex: "#0f172a" }
    ],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Classic Plaid Reindeer Ears Hooded Family Robe",
    price: "$42.50",
    category: "Loungewear",
    tag: "Loungewear",
    slug: "plaid-reindeer-robe",
    image: "/images/products/plaid_hooded_robe.jpg",
    availableColors: [
      { name: "Buffalo Red", hex: "#b91c1c", image: "/images/products/plaid_hooded_robe.jpg" },
      { name: "Evergreen Plaid", hex: "#14532d" }
    ],
    availableSizes: ["M", "L", "XL", "2XL"]
  },
  {
    id: 6,
    name: "Minimalist Leather Backpack",
    price: "$120.00",
    category: "Accessories",
    tag: "Accessories",
    slug: "minimalist-leather-backpack",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop&q=80",
    availableColors: [
      { name: "Cognac Brown", hex: "#854d0e" },
      { name: "Charcoal Black", hex: "#1e293b" }
    ],
    availableSizes: ["Standard"]
  }
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<QuickViewProduct | null>(null);

  const categories = ["All", "Family Matching", "Baby & Toddler", "Sleepwear", "Loungewear", "Accessories"];

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return PRODUCTS_LIST;
    return PRODUCTS_LIST.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200/70">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Explore Products
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Discover quality apparel & essentials crafted for comfort and style.
            </p>
          </div>
          <div className="text-xs font-bold text-slate-400 mt-4 md:mt-0 uppercase tracking-wider">
            Showing {filteredProducts.length} Items
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs h-fit space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categories.map((c) => {
                  const isActive = selectedCategory === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-accent/10 text-accent font-extrabold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{c}</span>
                      {isActive && (
                        <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quality Badge */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Guaranteed</span>
              <p className="text-xs font-bold text-slate-800">30-Day Easy Returns</p>
              <p className="text-[11px] text-slate-500">Free shipping on orders over $50 USD</p>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
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
