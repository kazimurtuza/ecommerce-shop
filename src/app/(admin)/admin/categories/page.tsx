"use client";

import React, { useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: "Family Matching", slug: "family-matching", productCount: 142 },
  { id: 2, name: "Mickey & Friends", slug: "mickey-and-friends", productCount: 48 },
  { id: 3, name: "Outwear", slug: "outwear", productCount: 29 },
  { id: 4, name: "Accessories", slug: "accessories", productCount: 84 },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

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

    const newCategory: Category = {
      id: Date.now(),
      name,
      slug,
      productCount: 0,
    };

    setCategories([...categories, newCategory]);
    setName("");
    setSlug("");
    alert(`Category "${name}" successfully created!`);
  };

  const handleDelete = (id: number, catName: string) => {
    if (confirm(`Are you sure you want to delete the category "${catName}"?`)) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Categories</h1>
        <p className="text-slate-550 dark:text-slate-400 text-sm mt-1.5">Configure store collections and navigation categories.</p>
      </div>

      {/* Grid: Categories List + Add Category Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 overflow-hidden">
          <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Active Categories</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Existing collections display list.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Category Name</th>
                  <th className="py-4 px-6 font-semibold">Slug</th>
                  <th className="py-4 px-6 font-semibold text-center">Products</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{category.name}</td>
                    <td className="py-4 px-6 font-semibold text-slate-550 dark:text-slate-400">{category.slug}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-900 dark:text-white">{category.productCount}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
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

        {/* Add Category Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-fit">
          <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Create Category</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Create a new collection.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Newborn Matching"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Category Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. newborn-matching"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
