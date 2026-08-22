"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Profile", href: "/account/profile" },
    { name: "Addresses", href: "/account/addresses" },
    { name: "Password", href: "/account/change-password" },
    { name: "Orders", href: "/account/orders" },
    { name: "Wishlist", href: "/account/wishlist" },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Account</h1>
          <p className="text-sm text-slate-500 mt-2">Manage your profile, shipping details, security settings, orders, and wishlist.</p>
        </div>

        {/* iOS-Style Segmented Tab Controller */}
        <div className="bg-slate-200/50 p-1.5 rounded-2xl flex flex-wrap sm:grid sm:grid-cols-5 max-w-2xl mx-auto mb-10 shadow-inner border border-slate-200/20 gap-1 sm:gap-0 justify-center">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`py-2.5 px-3 text-center text-xs md:text-sm font-bold rounded-xl transition-all duration-200 select-none whitespace-nowrap flex-grow sm:flex-none ${
                  active 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-100" 
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>

        {/* Active Route Content Area */}
        <div className="transition-opacity duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}
