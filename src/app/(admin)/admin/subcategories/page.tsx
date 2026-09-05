"use client";

import React, { useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  parentCategoryId: number;
  parentCategoryName: string;
  productCount: number;
  iconKey: string;
}

const CATEGORIES: Category[] = [
  { id: 1, name: "Family Matching" },
  { id: 2, name: "Mickey & Friends" },
  { id: 3, name: "Outwear" },
  { id: 4, name: "Accessories" },
];

const ICON_MAP: Record<string, { icon: React.ReactNode; bgClass: string; textClass: string; name: string }> = {
  cube: {
    name: "Cube",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    bgClass: "bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900/30",
    textClass: "text-violet-600 dark:text-violet-400"
  },
  beaker: {
    name: "Beaker",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    bgClass: "bg-pink-50 dark:bg-pink-950/30 border-pink-100 dark:border-pink-900/30",
    textClass: "text-pink-600 dark:text-pink-400"
  },
  sun: {
    name: "Sun",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707m12.728 0l-.707-.707M6.364 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
    bgClass: "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30",
    textClass: "text-amber-600 dark:text-amber-400"
  },
  tag: {
    name: "Tag",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30",
    textClass: "text-emerald-600 dark:text-emerald-400"
  },
  heart: {
    name: "Heart",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    bgClass: "bg-rose-50 dark:bg-rose-955/20 border-rose-100 dark:border-rose-900/20",
    textClass: "text-rose-600 dark:text-rose-400"
  },
  book: {
    name: "Book",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    bgClass: "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/30",
    textClass: "text-blue-600 dark:text-blue-400"
  }
};

const INITIAL_SUBCATEGORIES: Subcategory[] = [
  { id: 1, name: "Boys Matching", slug: "boys-matching", parentCategoryId: 1, parentCategoryName: "Family Matching", productCount: 45, iconKey: "cube" },
  { id: 2, name: "Girls Matching", slug: "girls-matching", parentCategoryId: 1, parentCategoryName: "Family Matching", productCount: 52, iconKey: "heart" },
  { id: 3, name: "Jackets", slug: "jackets", parentCategoryId: 3, parentCategoryName: "Outwear", productCount: 18, iconKey: "tag" },
  { id: 4, name: "Hats & Caps", slug: "hats-and-caps", parentCategoryId: 4, parentCategoryName: "Accessories", productCount: 36, iconKey: "sun" },
];

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>(INITIAL_SUBCATEGORIES);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState<number>(CATEGORIES[0].id);
  const [selectedIcon, setSelectedIcon] = useState("cube");
  const [showIconDropdown, setShowIconDropdown] = useState(false);

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
    if (!name || !slug || !parentCategoryId) return;

    const parentCat = CATEGORIES.find((c) => c.id === Number(parentCategoryId));
    if (!parentCat) return;

    const newSubcategory: Subcategory = {
      id: Date.now(),
      name,
      slug,
      parentCategoryId: Number(parentCategoryId),
      parentCategoryName: parentCat.name,
      productCount: 0,
      iconKey: selectedIcon,
    };

    setSubcategories([...subcategories, newSubcategory]);
    setName("");
    setSlug("");
    setSelectedIcon("cube");
    setShowIconDropdown(false);
    alert(`Subcategory "${name}" successfully created!`);
  };

  const handleDelete = (id: number, subName: string) => {
    if (confirm(`Are you sure you want to delete the subcategory "${subName}"?`)) {
      setSubcategories(subcategories.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Subcategories</h1>
        <p className="text-slate-550 dark:text-slate-400 text-sm mt-1.5">Configure store subcategories and link them to parent collections.</p>
      </div>

      {/* Grid: Subcategories List + Add Subcategory Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subcategory List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 overflow-hidden">
          <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Active Subcategories</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Existing sub-collections display list.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Subcategory Name</th>
                  <th className="py-4 px-6 font-semibold">Parent Category</th>
                  <th className="py-4 px-6 font-semibold">Slug</th>
                  <th className="py-4 px-6 font-semibold text-center">Products</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {subcategories.map((sub) => {
                  const iconInfo = ICON_MAP[sub.iconKey] || ICON_MAP.cube;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-xl border ${iconInfo.bgClass} ${iconInfo.textClass} shrink-0`}>
                            {iconInfo.icon}
                          </span>
                          <span>{sub.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-violet-600 dark:text-violet-400">
                        <span className="bg-violet-50 dark:bg-violet-950/45 px-2.5 py-1 rounded-lg">
                          {sub.parentCategoryName}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-550 dark:text-slate-400">{sub.slug}</td>
                      <td className="py-4 px-6 text-center font-bold text-slate-900 dark:text-white">{sub.productCount}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(sub.id, sub.name)}
                          className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-rose-400 dark:hover:text-rose-350 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Subcategory Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-fit">
          <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Create Subcategory</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Create a new sub-collection.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Subcategory Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Boys Matching"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Subcategory Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. boys-matching"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Parent Category</label>
              <select
                value={parentCategoryId}
                onChange={(e) => setParentCategoryId(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Custom Icon Dropdown Selection */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Choose Icon</label>
              
              <button
                type="button"
                onClick={() => setShowIconDropdown(!showIconDropdown)}
                className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-250 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg border ${ICON_MAP[selectedIcon].bgClass} ${ICON_MAP[selectedIcon].textClass} shrink-0`}>
                    {ICON_MAP[selectedIcon].icon}
                  </span>
                  <span>{ICON_MAP[selectedIcon].name}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    showIconDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showIconDropdown && (
                <>
                  <div
                    onClick={() => setShowIconDropdown(false)}
                    className="fixed inset-0 z-30"
                  />
                  <div className="absolute left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    {Object.entries(ICON_MAP).map(([key, info]) => {
                      const isSelected = selectedIcon === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedIcon(key);
                            setShowIconDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                            isSelected ? "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400" : "text-slate-700 dark:text-slate-350"
                          }`}
                        >
                          <span className={`flex h-7 w-7 items-center justify-center rounded-lg border ${info.bgClass} ${info.textClass} shrink-0`}>
                            {info.icon}
                          </span>
                          <span>{info.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3.5 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer"
            >
              Add Subcategory
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
