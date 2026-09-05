"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Header({
  onMenuToggle,
  isDarkMode = false,
  onThemeToggle,
}: {
  onMenuToggle: () => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 font-sans transition-colors duration-200">
      {/* Left Area: Sidebar Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 md:hidden transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>

        {/* Global Admin Search Bar */}
        <div className="relative hidden sm:block w-72">
          <input
            type="text"
            placeholder="Search dashboard, orders..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
          <div className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Area: Admin Settings & Profile */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        {onThemeToggle && (
          <button
            onClick={onThemeToggle}
            aria-label="Toggle dark mode"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            {isDarkMode ? (
              // Sun icon for dark mode (switches to light)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707m12.728 0l-.707-.707M6.364 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              // Moon icon for light mode (switches to dark)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        )}

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <h3 className="font-bold text-sm text-slate-955 dark:text-white">Notifications</h3>
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 text-xs leading-normal hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors cursor-pointer">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold">
                      $
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">New Order #12402 received</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">2 mins ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs leading-normal hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors cursor-pointer">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold">
                      !
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Low stock alert: Floral Outfit</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">1 hour ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs leading-normal hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors cursor-pointer">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 font-bold">
                      U
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">New customer registered</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">3 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 hover:opacity-90 focus:outline-none cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-bold select-none border border-violet-200 dark:border-violet-800">
              AD
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Admin Demo</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 leading-none">Super Administrator</p>
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div
                onClick={() => setShowProfileMenu(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 font-sans">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">admin@hatbazar.com</p>
                </div>
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex w-full items-center px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Settings & Profile
                </Link>
                <Link
                  href="/"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex w-full items-center px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Go to Storefront
                </Link>
                <div className="border-t border-slate-100 dark:border-slate-800 mt-1.5 pt-1.5">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      alert("Admin panel logout demo");
                    }}
                    className="flex w-full items-center px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 transition-colors text-left cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
