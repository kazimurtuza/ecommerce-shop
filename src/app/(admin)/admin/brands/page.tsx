"use client";

import React, { useState } from "react";

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

const INITIAL_BRANDS: Brand[] = [
  { id: 1, name: "Carter's", slug: "carters", description: "Premium baby clothing brand", productCount: 64 },
  { id: 2, name: "Disney", slug: "disney", description: "Official licensed Disney characters wear", productCount: 42 },
  { id: 3, name: "GapKids", slug: "gapkids", description: "Casual and denim kidswear", productCount: 28 },
  { id: 4, name: "H&M", slug: "hm", description: "Trendy and sustainable kids fashion", productCount: 55 },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    const newBrand: Brand = {
      id: Date.now(),
      name,
      slug,
      description,
      productCount: 0,
    };

    setBrands([...brands, newBrand]);
    setName("");
    setSlug("");
    setDescription("");
    alert(`Brand "${name}" successfully created!`);
  };

  const handleDelete = (id: number, brandName: string) => {
    if (confirm(`Are you sure you want to delete the brand "${brandName}"?`)) {
      setBrands(brands.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Brands</h1>
        <p className="text-slate-550 dark:text-slate-400 text-sm mt-1.5">Manage and categorize products by their manufacturer/brand names.</p>
      </div>

      {/* Grid: Brands List + Add Brand Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Brand List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 overflow-hidden">
          <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Active Brands</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Existing brand portfolios list.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Brand Name</th>
                  <th className="py-4 px-6 font-semibold">Slug</th>
                  <th className="py-4 px-6 font-semibold">Description</th>
                  <th className="py-4 px-6 font-semibold text-center">Products</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{brand.name}</td>
                    <td className="py-4 px-6 font-semibold text-slate-550 dark:text-slate-400">{brand.slug}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500 dark:text-slate-400">{brand.description || "-"}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-900 dark:text-white">{brand.productCount}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(brand.id, brand.name)}
                        className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-rose-400 dark:hover:text-rose-350 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Brand Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-fit">
          <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Create Brand</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Add a new manufacturer brand.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Brand Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Carter's"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Brand Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. carters"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Premium baby clothing"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3.5 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer"
            >
              Add Brand
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
