"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LoginModal from "../auth/LoginModal";

// Mock Brands Data
const BRANDS_LIST = [
  { name: "The Ordinary", slug: "the-ordinary" },
  { name: "CeraVe", slug: "cerave" },
  { name: "Cosrx", slug: "cosrx" },
  { name: "L'Oreal", slug: "loreal" },
  { name: "Neutrogena", slug: "neutrogena" },
  { name: "Cetaphil", slug: "cetaphil" },
  { name: "Innisfree", slug: "innisfree" },
  { name: "La Roche-Posay", slug: "la-roche-posay" },
];

// Mock Popular Search Suggestions Matching Screenshot
const SEARCH_PRODUCTS = [
  {
    title: "Versace Luxury Ladies Bracelet Watch",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=80&h=80&fit=crop&q=80",
    slug: "versace-luxury-ladies-bracelet-watch"
  },
  {
    title: "Crystal Heart \"I Love You\" Showpiece Liquid Bottle B0460",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=80&h=80&fit=crop&q=80",
    slug: "crystal-heart-i-love-you-showpiece"
  },
  {
    title: "Heart Love Gift Box – Teddy & Rose Edition L0510",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=80&h=80&fit=crop&q=80",
    slug: "heart-love-gift-box-teddy-rose"
  },
  {
    title: "Premium Heart Pearl Gift Set – Necklace & Rose Edition H0408",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=80&h=80&fit=crop&q=80",
    slug: "premium-heart-pearl-gift-set"
  },
  {
    title: "Star Master Projection Night Lamp",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=80&h=80&fit=crop&q=80",
    slug: "star-master-projection-night-lamp"
  }
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const brandsDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (brandsDropdownRef.current && !brandsDropdownRef.current.contains(event.target as Node)) {
        setIsBrandsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredProducts = SEARCH_PRODUCTS.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayProducts = searchQuery.trim() === "" ? SEARCH_PRODUCTS : (filteredProducts.length > 0 ? filteredProducts : SEARCH_PRODUCTS);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm font-sans">

        {/* DESKTOP HEADER */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* Left Section: Logo & Brands */}
            <div className="flex items-center gap-8 shrink-0">
              {/* Logo */}
              <Link href="/" className="focus:outline-none">
                <span className="text-[26px] font-extrabold tracking-[0.15em] text-slate-900 select-none">
                  HATBAZAR
                </span>
              </Link>

              {/* Brands Dropdown Menu (Desktop) */}
              <div ref={brandsDropdownRef} className="relative">
                <button
                  onClick={() => setIsBrandsDropdownOpen(!isBrandsDropdownOpen)}
                  onMouseEnter={() => setIsBrandsDropdownOpen(true)}
                  className="flex items-center gap-1.5 text-sm font-extrabold text-slate-700 hover:text-slate-900 transition-colors focus:outline-none py-2"
                  aria-expanded={isBrandsDropdownOpen}
                  aria-haspopup="true"
                >
                  BRANDS
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isBrandsDropdownOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Brands Dropdown List */}
                {isBrandsDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsBrandsDropdownOpen(false)}
                    className="absolute left-0 mt-1 w-64 rounded-2xl bg-white border border-slate-100 shadow-xl py-3 px-4 z-50 grid grid-cols-1 gap-1 animate-fadeIn"
                  >
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                      Popular Brands
                    </div>
                    {BRANDS_LIST.map((brand) => (
                      <Link
                        key={brand.slug}
                        href={`/brands/${brand.slug}`}
                        className="text-sm text-slate-600 hover:text-accent hover:bg-slate-50 px-3 py-2 rounded-xl transition-all duration-200 focus:outline-none focus:text-accent"
                        onClick={() => setIsBrandsDropdownOpen(false)}
                      >
                        {brand.name}
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-2 pt-2 px-2">
                      <Link
                        href="/brands"
                        className="text-xs text-accent hover:text-accent-hover font-bold flex items-center justify-between"
                        onClick={() => setIsBrandsDropdownOpen(false)}
                      >
                        View All Brands
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Section: Search Bar (Desktop) */}
            <div ref={searchRef} className="flex-1 max-w-xl relative">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="Ordinary Niacinamide @1099tk"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-white border border-accent rounded-2xl pl-5 pr-16 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all duration-200"
                />
                <div className="absolute right-4 flex items-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-blue-600 hover:text-blue-800 font-extrabold text-sm p-1.5 focus:outline-none cursor-pointer"
                      aria-label="Clear search"
                    >
                      <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button
                    className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label="Submit search"
                  >
                    <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Autocomplete Search Suggestions */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-50 animate-fadeIn">
                  <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
                    {displayProducts.map((product, idx) => (
                      <Link
                        key={idx}
                        href={`/products/${product.slug}`}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors duration-150 group"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-accent transition-colors leading-snug line-clamp-2">
                            {product.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* View All Button at the bottom */}
                  <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex justify-center">
                    <Link
                      href={`/products?q=${encodeURIComponent(searchQuery)}`}
                      className="text-xs font-bold text-accent hover:text-accent-hover transition-colors py-1 flex items-center gap-1.5 focus:outline-none"
                      onClick={() => setShowSuggestions(false)}
                    >
                      View All Results
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section: Actions (Wishlist, Login, Bag) */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Wishlist Button */}
              <Link
                href="/account/wishlist"
                className="flex items-center justify-center bg-[#131c31] hover:bg-[#1c2949] text-white text-[11px] font-extrabold px-6 py-3 rounded-full tracking-widest transition-all duration-200 select-none shadow-sm shadow-[#131c31]/20 focus:outline-none focus:ring-2 focus:ring-[#131c31]/50"
              >
                WISHLIST
              </Link>

              {/* Login Button */}
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-extrabold px-6 py-3 rounded-full tracking-widest border border-slate-100 hover:border-slate-200 transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
              >
                LOGIN
              </button>

              {/* Account Button */}
              <Link
                href="/account"
                className="flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-extrabold px-6 py-3 rounded-full tracking-widest border border-slate-100 hover:border-slate-200 transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                ACCOUNT
              </Link>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsBagOpen(true)}
                className="flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-[11px] font-extrabold px-5 py-3 rounded-full tracking-widest gap-2.5 transition-all duration-200 select-none shadow-sm shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
                aria-label="Open Shopping Bag"
              >
                <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>BAG</span>
                <span className="flex items-center justify-center bg-white text-accent text-[10px] w-4.5 h-4.5 rounded-full font-black select-none">
                  2
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE HEADER (Matches user screenshot exactly) */}
        <div className="md:hidden">
          {/* Row 1: Top bar */}
          <div className="flex items-center justify-between h-16 px-4 bg-white">
            {/* Left: Hamburger menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-slate-800 hover:bg-slate-50 rounded-xl focus:outline-none"
              aria-label="Open menu"
            >
              <svg className="w-6.5 h-6.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Center: Logo with icon mark */}
            <Link href="/" className="flex items-center gap-2 focus:outline-none">
              <div className="flex items-center justify-center text-slate-800 font-extrabold select-none">
                <svg className="w-6 h-6 transform -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M7 17L15 5H19L11 17H7Z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-widest text-slate-900 select-none">
                SHAJGOJ
              </span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Search Toggle Icon */}
              <button
                onClick={() => {
                  const searchInput = document.getElementById("mobile-search-input");
                  if (searchInput) {
                    searchInput.focus();
                    searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className="p-1.5 text-slate-800 hover:text-accent rounded-lg focus:outline-none"
                aria-label="Focus search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist Icon (Heart Outline) */}
              <Link
                href="/account/wishlist"
                className="p-1.5 text-slate-800 hover:text-accent rounded-lg focus:outline-none"
                aria-label="Wishlist"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsBagOpen(true)}
                className="relative p-1.5 text-slate-800 hover:text-accent rounded-lg focus:outline-none cursor-pointer"
                aria-label="Shopping Bag"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute top-0 right-0.5 flex items-center justify-center bg-accent text-white text-[9px] w-4.5 h-4.5 rounded-full font-bold shadow-sm">
                  2
                </span>
              </button>
            </div>
          </div>

          {/* Row 2: Search Bar Strip */}
          <div className="bg-[#f0f2f5] border-t border-b border-slate-200/80 px-4 py-3 relative" ref={searchRef}>
            <div className="relative flex items-center w-full">
              {/* Magnifying glass on the left */}
              <span className="absolute left-3.5 text-slate-400">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search a product"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              />
              {/* Clear button on the right */}
              {searchQuery && (
                <div className="absolute right-3.5 flex items-center">
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-blue-600 hover:text-blue-800 font-extrabold text-xs p-1 focus:outline-none cursor-pointer"
                    aria-label="Clear search"
                  >
                    <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-50 animate-fadeIn">
                <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto">
                  {displayProducts.map((product, idx) => (
                    <Link
                      key={idx}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-slate-50 transition-colors duration-150 active:bg-slate-100"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-800 truncate">
                          {product.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="bg-slate-50/80 px-4 py-2.5 border-t border-slate-100 flex justify-center">
                  <Link
                    href={`/products?q=${encodeURIComponent(searchQuery)}`}
                    className="text-[11px] font-bold text-accent hover:text-accent-hover transition-colors py-0.5 flex items-center gap-1 focus:outline-none"
                    onClick={() => setShowSuggestions(false)}
                  >
                    View All Results
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />

          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between py-6 px-6 z-50 transform transition-transform duration-300 animate-slideRight">
            <div className="space-y-6">
              {/* Drawer Top */}
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold tracking-widest text-slate-900">
                  SHAJGOJ
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col gap-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Shop Categories
                </div>
                <Link
                  href="/categories/makeup"
                  className="text-sm font-semibold text-slate-700 hover:text-accent py-1.5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Makeup
                </Link>
                <Link
                  href="/categories/skin"
                  className="text-sm font-semibold text-slate-700 hover:text-accent py-1.5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Skincare
                </Link>
                <Link
                  href="/categories/hair"
                  className="text-sm font-semibold text-slate-700 hover:text-accent py-1.5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Haircare
                </Link>
                <Link
                  href="/brands"
                  className="text-sm font-semibold text-slate-700 hover:text-accent py-1.5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Brands
                </Link>
              </nav>

              <hr className="border-slate-100" />

              {/* Quick Pages */}
              <nav className="flex flex-col gap-3.5">
                <Link
                  href="/account/wishlist"
                  className="flex items-center gap-3 text-sm text-slate-700 hover:text-accent font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  My Wishlist
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="flex items-center gap-3 text-sm text-slate-700 hover:text-accent font-semibold w-full text-left focus:outline-none cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login / Signup
                </button>
                <Link
                  href="/account"
                  className="flex items-center gap-3 text-sm text-slate-700 hover:text-accent font-semibold w-full text-left focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Account
                </Link>
              </nav>
            </div>

            {/* Support hotline */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-accent/15 text-accent rounded-xl">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Hotline</p>
                <p className="text-xs font-bold text-slate-800">09612-SHAJGOJ</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Bag Slider/Drawer Overlay */}
      {isBagOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsBagOpen(false)} />

          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50 animate-slideLeft">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Your Bag</span>
                <span className="bg-accent/15 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
                  2 Items
                </span>
              </div>
              <button
                onClick={() => setIsBagOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Bag Items list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Item 1 */}
              <div className="flex gap-4 border-b border-slate-100 pb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs shrink-0 select-none">
                  ON
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">
                    The Ordinary Niacinamide 10% + Zinc 1%
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Size: 30ml</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-bold text-slate-900">1099 BDT</span>
                    <span className="text-xs text-slate-500 font-medium">Qty: 1</span>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-4 border-b border-slate-100 pb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs shrink-0 select-none">
                  CC
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">
                    CeraVe Foaming Facial Cleanser
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Size: 236ml</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-bold text-slate-900">1850 BDT</span>
                    <span className="text-xs text-slate-500 font-medium">Qty: 1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer summary and checkout buttons */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              <div className="flex justify-between text-sm font-semibold text-slate-700">
                <span>Subtotal</span>
                <span className="font-extrabold text-slate-950">2949 BDT</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Shipping and taxes are calculated at checkout. Free shipping is applied to your order!
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsBagOpen(false)}
                  className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3.5 rounded-xl transition-colors text-center"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsBagOpen(false)}
                  className="flex items-center justify-center bg-accent hover:bg-accent-hover text-white font-bold text-xs py-3.5 rounded-xl shadow-md shadow-accent/20 transition-colors text-center"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal Overlay */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
