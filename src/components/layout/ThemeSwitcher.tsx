"use client";

import React, { useState, useEffect } from "react";

type Theme = "default" | "ice-gray";

interface ThemeOption {
  id: Theme;
  name: string;
  primaryColor: string; // CSS hex color
  accentColor: string;  // CSS hex color
}

const THEMES_LIST: ThemeOption[] = [
  {
    id: "default",
    name: "Default (Teal & Pink)",
    primaryColor: "#00827f",
    accentColor: "#ff3366"
  },
  {
    id: "ice-gray",
    name: "Ice Gray (Pastel)",
    primaryColor: "#5c6d76",
    accentColor: "#cad3d8"
  }
];

export default function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState<Theme>("default");
  const [mounted, setMounted] = useState(false);

  // Sync state with localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("selected-theme") as Theme;
    if (savedTheme && (savedTheme === "default" || savedTheme === "ice-gray")) {
      setActiveTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "default");
    }
    setMounted(true);
  }, []);

  const changeTheme = (theme: Theme) => {
    setActiveTheme(theme);
    localStorage.setItem("selected-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none animate-slideUp">
      <div className="flex items-center gap-3 bg-white/75 backdrop-blur-md border border-slate-200/55 p-2 px-3 rounded-full shadow-lg">
        <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase pl-1">
          Theme
        </span>
        <div className="flex items-center gap-2">
          {THEMES_LIST.map((theme) => {
            const isSelected = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => changeTheme(theme.id)}
                title={theme.name}
                className={`group relative w-7 h-7 rounded-full p-[2px] border-2 transition-all cursor-pointer focus:outline-none hover:scale-105 active:scale-95 ${
                  isSelected ? "border-slate-800" : "border-slate-200/50 hover:border-slate-400"
                }`}
                aria-label={`Switch to ${theme.name} theme`}
              >
                <div className="w-full h-full rounded-full flex overflow-hidden rotate-45">
                  <div
                    style={{ backgroundColor: theme.primaryColor }}
                    className="w-1/2 h-full"
                  />
                  <div
                    style={{ backgroundColor: theme.accentColor }}
                    className="w-1/2 h-full"
                  />
                </div>

                {/* Hover Tooltip Label */}
                <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 bg-slate-900 text-white text-[9px] font-extrabold px-2 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm shadow-black/20">
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
