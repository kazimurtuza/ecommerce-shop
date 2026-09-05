"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-dark-mode");
    if (savedTheme === "true") {
      setIsDarkMode(true);
    } else if (savedTheme === "false") {
      setIsDarkMode(false);
    } else {
      // Default to system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(systemPrefersDark);
    }
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    localStorage.setItem("admin-dark-mode", String(nextVal));
  };

  // Avoid hydration mismatch by waiting until mounted
  const layoutClass = `flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-200 ${
    mounted && isDarkMode ? "dark" : ""
  }`;

  return (
    <div className={layoutClass}>
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Admin Header */}
        <Header 
          onMenuToggle={() => setIsSidebarOpen(true)} 
          isDarkMode={mounted ? isDarkMode : false}
          onThemeToggle={toggleDarkMode}
        />

        {/* Dynamic Page Content */}
        <main className="flex-grow overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
