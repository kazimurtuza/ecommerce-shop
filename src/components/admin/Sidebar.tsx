"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarSubItem {
  name: string;
  href: string;
  subItems?: SidebarSubItem[];
}

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  subItems?: SidebarSubItem[];
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [activeHash, setActiveHash] = useState("");

  // Track active sub-item hashes and auto-expand active parents
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    
    // Auto-expand menu items that contain the active path
    const initialOpen: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.subItems) {
        if (pathname.startsWith(item.href)) {
          initialOpen[item.name] = true;
        }
        item.subItems.forEach((subItem) => {
          if (subItem.subItems) {
            const hasActiveNestedItem = subItem.subItems.some((nested) => pathname.startsWith(nested.href));
            if (hasActiveNestedItem) {
              initialOpen[item.name] = true;
              initialOpen[subItem.name] = true;
            }
          }
        });
      }
    });
    setOpenDropdowns((prev) => ({ ...prev, ...initialOpen }));

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const menuItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: (
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
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
          />
        </svg>
      ),
    },
    {
      name: "POS System",
      href: "/admin/pos",
      icon: (
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
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: (
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: (
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      subItems: [
        { name: "General Settings", href: "/admin/settings#general" },
        { name: "Billing & Shipping", href: "/admin/settings#billing" },
        {
          name: "Product Settings",
          href: "/admin/settings/product",
          subItems: [
            { name: "Category", href: "/admin/categories" },
            { name: "Subcategory", href: "/admin/subcategories" },
            { name: "Unit", href: "/admin/units" },
            { name: "Brand", href: "/admin/brands" },
          ],
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 dark:bg-slate-950 border-r border-slate-800 dark:border-slate-900 text-slate-100 shadow-2xl transition-all duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800 dark:border-slate-900 shrink-0">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 text-lg font-extrabold tracking-widest text-white hover:opacity-90 transition-opacity"
            onClick={onClose}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-md shadow-violet-500/20">
              <span className="text-sm font-black text-white">HB</span>
            </div>
            <span>HATBAZAR</span>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 dark:border-slate-900 text-slate-400 hover:text-white md:hidden hover:bg-slate-800 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const hasSubItems = !!item.subItems && item.subItems.length > 0;
            const isActive = pathname.startsWith(item.href);
            const isOpen = !!openDropdowns[item.name];

            if (hasSubItems) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-slate-800/50 dark:bg-slate-900/50 text-slate-100"
                        : "text-slate-400 hover:bg-slate-800/60 dark:hover:bg-slate-900/60 hover:text-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`transition-colors duration-200 ${
                          isActive ? "text-violet-500" : "text-slate-400 group-hover:text-slate-100"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <span>{item.name}</span>
                    </div>
                    {/* Chevron Icon */}
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Sub items dropdown */}
                  <div
                    className={`pl-11 space-y-1 overflow-hidden transition-all duration-200 ${
                      isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.subItems!.map((subItem) => {
                      const hasNestedSubItems = !!subItem.subItems && subItem.subItems.length > 0;
                      const isNestedOpen = !!openDropdowns[subItem.name];

                      if (hasNestedSubItems) {
                        return (
                          <div key={subItem.name} className="space-y-1">
                            <button
                              onClick={() => toggleDropdown(subItem.name)}
                              className={`w-full group flex items-center justify-between rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-150 cursor-pointer text-slate-400 hover:text-slate-100`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                <span>{subItem.name}</span>
                              </div>
                              <svg
                                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                  isNestedOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {/* Second-level Nested Sub items dropdown */}
                            <div
                              className={`pl-5 space-y-1 overflow-hidden transition-all duration-200 ${
                                isNestedOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                              }`}
                            >
                              {subItem.subItems!.map((nestedItem) => {
                                const isNestedActive = pathname === nestedItem.href;
                                return (
                                  <Link
                                    key={nestedItem.href}
                                    href={nestedItem.href}
                                    onClick={() => {
                                      onClose();
                                    }}
                                    className={`group flex items-center gap-3 rounded-lg py-1.5 px-3 text-[11px] font-semibold transition-all duration-150 ${
                                      isNestedActive
                                        ? "text-violet-400 bg-slate-800/30"
                                        : "text-slate-400 hover:text-slate-100 hover:translate-x-1"
                                    }`}
                                  >
                                    <span className={`w-1 h-1 rounded-full transition-colors ${
                                      isNestedActive ? "bg-violet-400" : "bg-slate-600 group-hover:bg-violet-400"
                                    }`} />
                                    <span>{nestedItem.name}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      const isSubActive = pathname === "/admin/settings" && (
                        (subItem.href.endsWith("#general") && activeHash === "#general") ||
                        (subItem.href.endsWith("#billing") && activeHash === "#billing") ||
                        (subItem.href.endsWith("#general") && activeHash === "")
                      );

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => {
                            onClose();
                          }}
                          className={`group flex items-center gap-3 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-150 ${
                            isSubActive
                              ? "text-violet-400 bg-slate-800/30"
                              : "text-slate-400 hover:text-slate-100 hover:translate-x-1"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            isSubActive ? "bg-violet-400" : "bg-slate-500 group-hover:bg-violet-400"
                          }`} />
                          <span>{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/15 scale-[1.02]"
                    : "text-slate-400 hover:bg-slate-800/60 dark:hover:bg-slate-900/60 hover:text-slate-100"
                }`}
              >
                <div
                  className={`transition-colors duration-200 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"
                  }`}
                >
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Area / Quick Action */}
        <div className="p-4 border-t border-slate-800 dark:border-slate-900 bg-slate-950/20 shrink-0">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-slate-800/40 dark:border-slate-800/20"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
