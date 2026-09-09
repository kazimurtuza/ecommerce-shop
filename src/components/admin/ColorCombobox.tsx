"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export interface ColorOption {
  name: string;
  hex: string;
}

export const INITIAL_COLORS: ColorOption[] = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Off White / Cream", hex: "#FAF9F6" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Khaki", hex: "#C3B091" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Dark Gray", hex: "#4B5563" },
  { name: "Light Gray / Silver", hex: "#D1D5DB" },
  { name: "Navy Blue", hex: "#0F172A" },
  { name: "Royal Blue", hex: "#2563EB" },
  { name: "Sky Blue", hex: "#38BDF8" },
  { name: "Baby Blue", hex: "#89CFF0" },
  { name: "Denim Blue", hex: "#1560BD" },
  { name: "Teal", hex: "#0D9488" },
  { name: "Cyan", hex: "#06B6D4" },
  { name: "Olive Green", hex: "#556B2F" },
  { name: "Forest Green", hex: "#15803D" },
  { name: "Emerald Green", hex: "#10B981" },
  { name: "Sage Green", hex: "#9CAF88" },
  { name: "Mint Green", hex: "#A7F3D0" },
  { name: "Maroon", hex: "#800000" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Wine Red", hex: "#722F37" },
  { name: "Crimson", hex: "#DC143C" },
  { name: "Red", hex: "#EF4444" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Peach", hex: "#FFDAB9" },
  { name: "Salmon", hex: "#FA8072" },
  { name: "Blush Pink", hex: "#F472B6" },
  { name: "Baby Pink", hex: "#FBCFE8" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Magenta / Fuchsia", hex: "#D946EF" },
  { name: "Lavender", hex: "#C084FC" },
  { name: "Lilac", hex: "#C8A2C8" },
  { name: "Purple / Violet", hex: "#7C3AED" },
  { name: "Mustard Yellow", hex: "#EAB308" },
  { name: "Pastel Yellow", hex: "#FEF08A" },
  { name: "Orange", hex: "#F97316" },
  { name: "Rust", hex: "#B7410E" },
  { name: "Brown / Chocolate", hex: "#78350F" },
  { name: "Tan / Camel", hex: "#C19A6B" },
  { name: "Gold", hex: "#D97706" },
];

const LOCAL_STORAGE_CUSTOM_COLORS_KEY = "ecommerce_custom_variant_colors";

interface ColorComboboxProps {
  value: string;
  hexValue?: string;
  onChange: (colorName: string, hexCode: string) => void;
  className?: string;
}

export default function ColorCombobox({
  value,
  hexValue = "#000000",
  onChange,
  className = "",
}: ColorComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customColors, setCustomColors] = useState<ColorOption[]>([]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#6366F1");
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Position state for portal dropdown
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 260,
  });

  // Client-side initialization & load custom colors from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOM_COLORS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCustomColors(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Update dropdown coordinates whenever it opens
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = 280;
    const dropdownHeight = 360;

    // Default below trigger
    let top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;

    // Flip upward if close to bottom of window
    if (rect.bottom + dropdownHeight > window.innerHeight && rect.top > dropdownHeight) {
      top = rect.top + window.scrollY - dropdownHeight - 4;
    }

    // Keep within right edge of screen
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
    setNewColorName("");
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Close on click outside or escape key
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

  // Combined list of initial + custom colors
  const allColors = useMemo(() => {
    const list = [...customColors, ...INITIAL_COLORS];
    // Deduplicate by lowercase name
    const seen = new Set<string>();
    return list.filter((c) => {
      const lower = c.name.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }, [customColors]);

  // Filtered colors by search query
  const filteredColors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allColors;
    return allColors.filter(
      (c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q)
    );
  }, [allColors, searchQuery]);

  const handleSelectColor = (c: ColorOption) => {
    onChange(c.name, c.hex);
    handleClose();
  };

  const handleAddCustomColor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = (newColorName.trim() || searchQuery.trim());
    if (!name) return;

    const newColor: ColorOption = {
      name,
      hex: newColorHex,
    };

    const updated = [newColor, ...customColors];
    setCustomColors(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_COLORS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    onChange(newColor.name, newColor.hex);
    handleClose();
  };

  const currentColorHex = hexValue || "#000000";
  const currentColorName = value || "Select Color";

  return (
    <div className={`relative inline-block w-full ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? handleClose() : handleOpen())}
        className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-violet-500 text-left transition-all cursor-pointer shadow-xs group"
        title={`Color: ${currentColorName} (${currentColorHex}) - Click to change`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 shadow-2xs"
            style={{ backgroundColor: currentColorHex }}
          />
          <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {value ? value : <span className="text-slate-400 font-normal">Select color</span>}
          </span>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-violet-500 transition-transform duration-150 shrink-0 ${isOpen ? "rotate-180 text-violet-600" : ""
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
                placeholder="Search color name or hex..."
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

            {/* Color Options List */}
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800/80 pr-0.5">
              {filteredColors.length === 0 ? (
                <div className="py-4 text-center text-slate-400">
                  <p className="text-[11px]">No matching color found</p>
                  <p className="text-[10px] mt-0.5 text-violet-500 font-medium">
                    You can add &quot;{searchQuery}&quot; below!
                  </p>
                </div>
              ) : (
                filteredColors.map((c) => {
                  const isSelected =
                    value?.toLowerCase() === c.name.toLowerCase() ||
                    hexValue?.toLowerCase() === c.hex.toLowerCase();

                  return (
                    <button
                      key={c.name + c.hex}
                      type="button"
                      onClick={() => handleSelectColor(c)}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-left transition-colors cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-950/40 ${isSelected ? "bg-violet-50/80 dark:bg-violet-950/60 font-bold" : ""
                        }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="truncate text-xs text-slate-800 dark:text-slate-200">
                          {c.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          {c.hex}
                        </span>
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
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Add Custom Color Section (`add`) */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex flex-col gap-1.5 bg-slate-50/50 dark:bg-slate-950/30 p-2 rounded-xl">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>+ Add Custom Color</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"
                  title="Pick hex"
                />
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder={searchQuery ? searchQuery : "New color name (e.g. Dusty Rose)"}
                  className="flex-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomColor();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomColor()}
                  disabled={!newColorName.trim() && !searchQuery.trim()}
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
