"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, saveProducts, Product } from "@/lib/db";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  const categories = ["All", "Family Matching", "Mickey & Friends", "Outwear", "Accessories"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.tag === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/30";
    }
    if (stock <= 5) {
      return "bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30";
    }
    return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30";
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Products Catalog</h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm mt-1.5">Manage products, stock levels, and store pricing details.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-all select-none self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
          <div className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Catalog Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4.5 px-6 font-semibold">Product info</th>
                <th className="py-4.5 px-6 font-semibold">Category</th>
                <th className="py-4.5 px-6 font-semibold">Price</th>
                <th className="py-4.5 px-6 font-semibold text-center">Stock</th>
                <th className="py-4.5 px-6 font-semibold text-center">Status</th>
                <th className="py-4.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                        />
                        <span className="font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 max-w-xs sm:max-w-sm">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-500 dark:text-slate-400">{product.tag}</td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{product.price}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border ${getStockBadge(product.stock)}`}>
                        {product.stock === 0 ? "Out of Stock" : `${product.stock} items`}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border ${
                        product.status === "Published" 
                          ? "bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-900/30" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3.5">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
