"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts, saveProducts, Product } from "@/lib/db";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);

  // Unwrap params using React.use style / useEffect hook
  useEffect(() => {
    params.then((p) => setUnwrappedParams(p));
  }, [params]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    price: "",
    stock: "0",
    image: "",
    description: "",
    status: "Published" as "Published" | "Draft",
  });

  useEffect(() => {
    if (unwrappedParams) {
      const products = getProducts();
      const product = products.find((p) => String(p.id) === unwrappedParams.id);
      if (product) {
        setFormData({
          name: product.name,
          slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
          category: product.tag,
          price: product.price.replace("$", ""),
          stock: String(product.stock),
          image: product.image,
          description: product.description || "",
          status: product.status,
        });
      }
    }
  }, [unwrappedParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unwrappedParams) return;
    
    const products = getProducts();
    const priceVal = parseFloat(formData.price.replace("$", ""));
    const priceFormatted = isNaN(priceVal) ? "$0.00" : `$${priceVal.toFixed(2)}`;

    const updated = products.map((p) => {
      if (String(p.id) === unwrappedParams.id) {
        return {
          ...p,
          name: formData.name,
          tag: formData.category,
          price: priceFormatted,
          stock: parseInt(formData.stock) || 0,
          image: formData.image,
          description: formData.description,
          status: formData.status,
        };
      }
      return p;
    });

    saveProducts(updated);
    alert(`Product changes for "${formData.name}" successfully saved!`);
    router.push("/admin/products");
  };

  const categories = ["Family Matching", "Mickey & Friends", "Outwear", "Accessories"];

  if (!unwrappedParams) {
    return <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium font-sans">Loading product data...</div>;
  }

  return (
    <div className="space-y-8 font-sans max-w-3xl mx-auto transition-colors duration-200">
      {/* Header & Back */}
      <div className="space-y-2">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>Back to products catalog</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Edit Product #{unwrappedParams.id}</h1>
        <p className="text-slate-550 dark:text-slate-400 text-sm">Modify existing details, price, and inventory details below.</p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        {/* Name and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                setFormData((prev) => ({ ...prev, name, slug }));
              }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Product Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Category, Price, Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Price ($)</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Stock Inventory</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              min="0"
              required
            />
          </div>
        </div>

        {/* Image Preview & URL */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Product Image</label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {formData.image && (
              <img
                src={formData.image}
                alt="Product Preview"
                className="h-24 w-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-inner"
              />
            )}
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="e.g. https://images.unsplash.com/..."
              className="flex-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs font-semibold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Publish Status</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer select-none">
              <input
                type="radio"
                name="status"
                value="Published"
                checked={formData.status === "Published"}
                onChange={handleChange}
                className="text-violet-600 focus:ring-violet-500"
              />
              <span>Published (Live on storefront)</span>
            </label>
            <label className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer select-none">
              <input
                type="radio"
                name="status"
                value="Draft"
                checked={formData.status === "Draft"}
                onChange={handleChange}
                className="text-violet-600 focus:ring-violet-500"
              />
              <span>Draft (Hidden)</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/admin/products"
            className="rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
