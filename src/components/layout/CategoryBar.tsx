"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Custom SVG Icons for Baby & Mom Care Subcategories
const IconPlaceholder = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconBabyPersonal = () => (
  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const IconDiaper = () => (
  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
  </svg>
);

const IconGroomingKit = () => (
  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconShampoo = () => (
  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

interface SubCategoryItem {
  name: string;
  slug: string;
  icon?: () => React.JSX.Element;
}

interface SubCategory {
  name: string;
  slug: string;
  icon?: () => React.JSX.Element;
  items?: SubCategoryItem[];
}

interface Category {
  name: string;
  slug: string;
  subcategories?: SubCategory[];
}

const CATEGORIES_DATA: Category[] = [
  { name: "Home", slug: "" },
  {
    name: "Medicine",
    slug: "medicine",
    subcategories: [
      {
        name: "Prescription Drugs",
        slug: "prescription-drugs",
        icon: IconPlaceholder,
        items: [
          { name: "Antibiotics", slug: "antibiotics" },
          { name: "Cardiovascular", slug: "cardiovascular" },
          { name: "Anti-Diabetic", slug: "anti-diabetic" },
        ],
      },
      {
        name: "OTC Medicines",
        slug: "otc-medicines",
        icon: IconPlaceholder,
        items: [
          { name: "Fever & Pain Relief", slug: "fever-pain-relief" },
          { name: "Cold & Cough", slug: "cold-cough" },
          { name: "First Aid Care", slug: "first-aid-care" },
        ],
      },
    ],
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    subcategories: [
      {
        name: "Devices & Monitors",
        slug: "devices-monitors",
        icon: IconPlaceholder,
        items: [
          { name: "BP Monitors", slug: "bp-monitors" },
          { name: "Thermometers", slug: "thermometers" },
          { name: "Glucometers", slug: "glucometers" },
        ],
      },
      {
        name: "Wellness Products",
        slug: "wellness-products",
        icon: IconPlaceholder,
        items: [
          { name: "Masks & Sanitizers", slug: "masks-sanitizers" },
          { name: "Orthopedic Supports", slug: "orthopedic-supports" },
        ],
      },
    ],
  },
  {
    name: "Beauty",
    slug: "beauty",
    subcategories: [
      {
        name: "Skincare",
        slug: "skincare",
        icon: IconBabyPersonal,
        items: [
          { name: "Cleansers", slug: "cleansers" },
          { name: "Moisturizers", slug: "moisturizers" },
          { name: "Face Serums", slug: "face-serums" },
          { name: "Sun Protection", slug: "sun-protection" },
        ],
      },
      {
        name: "Makeup",
        slug: "makeup",
        icon: IconShampoo,
        items: [
          { name: "Face Makeup", slug: "face-makeup" },
          { name: "Eye Makeup", slug: "eye-makeup" },
          { name: "Lipsticks & Liners", slug: "lipsticks-liners" },
        ],
      },
    ],
  },
  {
    name: "Sexual Wellness",
    slug: "sexual-wellness",
    subcategories: [
      {
        name: "Contraceptives",
        slug: "contraceptives",
        icon: IconPlaceholder,
        items: [
          { name: "Condoms", slug: "condoms" },
          { name: "Emergency Pills", slug: "emergency-pills" },
        ],
      },
      {
        name: "Lubricants & Gels",
        slug: "lubricants-gels",
        icon: IconPlaceholder,
        items: [
          { name: "Water-Based", slug: "water-based" },
          { name: "Silicone-Based", slug: "silicone-based" },
        ],
      },
    ],
  },
  {
    name: "Baby & Mom Care",
    slug: "baby-mom-care",
    subcategories: [
      {
        name: "All",
        slug: "all-baby-mom",
        icon: IconPlaceholder,
        items: [],
      },
      {
        name: "Baby Personal Care",
        slug: "baby-personal-care",
        icon: IconBabyPersonal,
        items: [
          { name: "Grooming & Healthcare Kits", slug: "grooming-healthcare-kits", icon: IconGroomingKit },
          { name: "Shampoo & Conditioners", slug: "shampoo-conditioners", icon: IconShampoo },
        ],
      },
      {
        name: "Baby Diapers & Clothing",
        slug: "baby-diapers-clothing",
        icon: IconDiaper,
        items: [
          { name: "Diapers", slug: "diapers" },
          { name: "Wipes", slug: "wipes" },
          { name: "Rompers & Tops", slug: "rompers-tops" },
        ],
      },
    ],
  },
  { name: "Herbal", slug: "herbal" },
  { name: "Home Care", slug: "home-care" },
  { name: "Supplement", slug: "supplement" },
  { name: "Food and Nutrition", slug: "food-nutrition" },
  { name: "Pet Care", slug: "pet-care" },
  { name: "Veterinary", slug: "veterinary" },
  { name: "Homeopathy", slug: "homeopathy" },
];

export default function CategoryBar() {
  const [activeCategory, setActiveCategory] = useState<string>("Home");
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<SubCategory | null>(null);
  const [showScrollLeft, setShowScrollLeft] = useState<boolean>(false);
  const [showScrollRight, setShowScrollRight] = useState<boolean>(true);
  const [dropdownLeft, setDropdownLeft] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check scroll position to dynamically show/hide left and right chevron scroll buttons
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowScrollLeft(scrollLeft > 5);
      setShowScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      // Run once on mount to establish scroll bar dimensions
      checkScroll();
      // Handle resize triggers
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const amount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryMouseEnter = (e: React.MouseEvent<HTMLDivElement>, category: Category) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setHoveredCategory(category);
    
    if (category.subcategories && category.subcategories.length > 0) {
      const firstSub = category.subcategories.find(sub => sub.name !== "All") || category.subcategories[0];
      setHoveredSubCategory(firstSub);
    } else {
      setHoveredSubCategory(null);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      let leftOffset = rect.left - containerRect.left;
      const dropdownWidth = 500;
      const containerWidth = containerRect.width;

      if (leftOffset + dropdownWidth > containerWidth) {
        leftOffset = containerWidth - dropdownWidth - 16;
      }
      if (leftOffset < 16) {
        leftOffset = 16;
      }
      setDropdownLeft(leftOffset);
    }
  };

  const handleCategoryMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
      setHoveredSubCategory(null);
    }, 100);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleDropdownMouseLeave = () => {
    setHoveredCategory(null);
    setHoveredSubCategory(null);
  };

  return (
    <div className="relative w-full bg-white border-b border-slate-100 z-40 font-sans select-none">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center h-12">
        {/* Left Scroll Button */}
        {showScrollLeft && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-2 md:left-4 z-10 w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Categories Horizontal Scroll List */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 overflow-x-auto scrollbar-none w-full h-full py-1 pr-12 relative"
        >
          {CATEGORIES_DATA.map((category) => {
            const isActive = activeCategory === category.name;
            const isHovered = hoveredCategory?.name === category.name;
            return (
              <div
                key={category.slug}
                className="relative h-full flex items-center shrink-0"
                onMouseEnter={(e) => handleCategoryMouseEnter(e, category)}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <Link
                  href={category.slug ? `/categories/${category.slug}` : "/"}
                  onClick={() => setActiveCategory(category.name)}
                  className={`text-[13px] md:text-sm font-semibold tracking-wide transition-colors relative py-3 ${
                    isActive || isHovered
                      ? "text-primary"
                      : "text-slate-600 hover:text-primary"
                  }`}
                >
                  {category.name}
                  {/* Underline Indicator */}
                  {(isActive || isHovered) && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full animate-fadeIn" />
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {showScrollRight && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-2 md:right-4 z-10 w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Multilevel Dropdown Container (Desktop Hover Only) */}
        {hoveredCategory && hoveredCategory.subcategories && hoveredCategory.subcategories.length > 0 && (
          <div
            className="absolute top-[44px] bg-white border border-slate-100 shadow-xl rounded-xl hidden lg:flex min-h-[220px] z-50 animate-fadeIn overflow-hidden"
            style={{ left: `${dropdownLeft}px` }}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            {/* Left Column: Subcategories */}
            <div className="w-60 border-r border-slate-100/80 p-2 flex flex-col gap-0.5 bg-white shrink-0">
              {hoveredCategory.subcategories.map((sub) => {
                const isSubHovered = hoveredSubCategory?.name === sub.name;
                const Icon = sub.icon || IconPlaceholder;
                return (
                  <div
                    key={sub.slug}
                    onMouseEnter={() => setHoveredSubCategory(sub)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 cursor-pointer ${
                      isSubHovered
                        ? "bg-primary-light text-primary"
                        : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                    }`}
                  >
                    <Link
                      href={`/categories/${hoveredCategory.slug}/${sub.slug}`}
                      className="flex items-center gap-3 w-full"
                    >
                      <Icon />
                      <span>{sub.name}</span>
                    </Link>
                    {sub.items && sub.items.length > 0 && (
                      <svg
                        className={`w-3.5 h-3.5 ${isSubHovered ? "text-primary" : "text-slate-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Sub-subcategories (Visible only if hovered subcategory has items) */}
            {hoveredSubCategory && hoveredSubCategory.items && hoveredSubCategory.items.length > 0 && (
              <div className="w-64 p-3 flex flex-col gap-1.5 bg-white shrink-0">
                {hoveredSubCategory.items.map((item) => {
                  const SubIcon = item.icon || IconPlaceholder;
                  return (
                    <Link
                      key={item.slug}
                      href={`/categories/${hoveredCategory.slug}/${hoveredSubCategory.slug}/${item.slug}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-slate-600 hover:text-primary hover:bg-slate-50 font-semibold transition-all duration-150"
                    >
                      <SubIcon />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
