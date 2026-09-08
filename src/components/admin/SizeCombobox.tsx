"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export const INITIAL_SIZES: string[] = [
  // Apparel standard
  "Free Size",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "XXS",
  // Pants / Waist numeric
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  // Kids / Toddler
  "0-3M",
  "3-6M",
  "6-12M",
  "12-18M",
  "18-24M",
  "2T",
  "3T",
  "4T",
  "5T",
  // Footwear
  "EU 36",
  "EU 37",
  "EU 38",
  "EU 39",
  "EU 40",
  "EU 41",
  "EU 42",
  "EU 43",
  "EU 44",
  "EU 45",
];

const LOCAL_STORAGE_CUSTOM_SIZES_KEY = "ecommerce_custom_variant_sizes";

interface SizeComboboxProps {
  value: string;
  onChange: (size: string) => void;
  className?: string;
}

export default function SizeCombobox({
  value,
  onChange,
  className = "",
}: SizeComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customSizes, setCustomSizes] = useState<string[]>([]);
  const [newSizeName, setNewSizeName] = useState("");
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 220,
  });

  // Client-side initialization & load custom sizes from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOM_SIZES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCustomSizes(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = 240;
    const dropdownHeight = 330;

    let top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;

    if (rect.bottom + dropdownHeight > window.innerHeight && rect.top > dropdownHeight) {
      top = rect.top + window.scrollY - dropdownHeight - 4;
    }

    if (left + dropdownWidth > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - dropdownWidth - 16);
    }

    setCoords({
      top,
      left,
      width: Math.max(rect.width, dropdownWidth),
    });
  };

  const handleOpen = () => {
    updatePosition();
    setIsOpen(true);
    setSearchQuery("");
    setNewSizeName("");
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        handleClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const allSizes = useMemo(() => {
    const combined = [...customSizes, ...INITIAL_SIZES];
    const seen = new Set<string>();
    return combined.filter((s) => {
      const lower = s.toLowerCase().trim();
      if (!lower || seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }, [customSizes]);

  const filteredSizes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allSizes;
    return allSizes.filter((s) => s.toLowerCase().includes(q));
  }, [allSizes, searchQuery]);

  const handleSelectSize = (sz: string) => {
    onChange(sz);
    handleClose();
  };

  const handleAddCustomSize = (customName?: string) => {
    const sizeToAdd = (customName || newSizeName || searchQuery).trim();
    if (!sizeToAdd) return;

    // Check if not already in list
    if (!allSizes.some((s) => s.toLowerCase() === sizeToAdd.toLowerCase())) {
      const updated = [sizeToAdd, ...customSizes];
      setCustomSizes(updated);
      try {
        localStorage.setItem(LOCAL_STORAGE_CUSTOM_SIZES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }

    onChange(sizeToAdd);
    handleClose();
  };

  const hasExactMatch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return allSizes.some((s) => s.toLowerCase() === q);
  }, [allSizes, searchQuery]);

  return (
    <div className={`relative inline-block w-full ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? handleClose() : handleOpen())}
        className="w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-violet-500 text-left transition-all cursor-pointer shadow-xs group"
        title={`Size: ${value || "Select Size"} - Click to change`}
      >
        <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
          {value ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-300 font-bold text-[11px]">
              {value}
            </span>
          ) : (
            <span className="text-slate-400 font-normal">Select size</span>
          )}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-violet-500 transition-transform duration-150 shrink-0 ${
            isOpen ? "rotate-180 text-violet-600" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Dropdown Popover via Portal */}
      {isOpen &&
        mounted &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 99999,
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-2 text-xs animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Search Input (`src`) */}
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search size (e.g. XL, 32)..."
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Quick 1-click add button if query typed and not in list */}
            {searchQuery.trim() && !hasExactMatch && (
              <button
                type="button"
                onClick={() => handleAddCustomSize(searchQuery.trim())}
                className="w-full py-1.5 px-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 font-bold text-[11px] flex items-center justify-between hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors cursor-pointer"
              >
                <span>+ Add &quot;{searchQuery.trim()}&quot;</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-600 text-white">Select</span>
              </button>
            )}

            {/* Size Options List */}
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800/80 pr-0.5">
              {filteredSizes.length === 0 ? (
                <div className="py-4 text-center text-slate-400">
                  <p className="text-[11px]">No size found for &quot;{searchQuery}&quot;</p>
                  <p className="text-[10px] mt-0.5 text-violet-500 font-medium">
                    Click above or enter below to add it!
                  </p>
                </div>
              ) : (
                filteredSizes.map((sz) => {
                  const isSelected = value?.toLowerCase() === sz.toLowerCase();

                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSelectSize(sz)}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-left transition-colors cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-950/40 ${
                        isSelected ? "bg-violet-50/80 dark:bg-violet-950/60 font-bold text-violet-600 dark:text-violet-400" : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <span className="truncate text-xs">{sz}</span>
                      {isSelected && (
                        <svg
                          className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 stroke-[3]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Add Custom Size Section (`add`) */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex flex-col gap-1.5 bg-slate-50/50 dark:bg-slate-950/30 p-2 rounded-xl">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>+ Add Custom Size</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newSizeName}
                  onChange={(e) => setNewSizeName(e.target.value)}
                  placeholder="e.g. 42R, One Size"
                  className="flex-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSize();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomSize()}
                  disabled={!newSizeName.trim()}
                  className="px-2.5 py-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
