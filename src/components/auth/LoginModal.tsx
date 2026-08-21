"use client";

import React, { useState, useEffect, useRef } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRIES = [
  { code: "+88", name: "BD", flag: "🇧🇩" },
  { code: "+1", name: "US", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+91", name: "IN", flag: "🇮🇳" },
  { code: "+971", name: "AE", flag: "🇦🇪" },
];

const CAROUSEL_SLIDES = [
  {
    title: "Easy & multi-payment solutions",
    description: "You can pay in cash. Or online using your usual methods.",
    illustration: (
      <svg className="w-56 h-56 max-w-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Background Plate */}
        <circle cx="100" cy="100" r="85" fill="#f0f9f9" />
        
        {/* Sofa Frame */}
        <path d="M45 130C45 125 50 120 56 120H144C150 120 155 125 155 130V150H45V130Z" fill="#ccd3db" />
        <path d="M40 125C40 120 45 115 50 115H60V150H40V125Z" fill="#adb8c4" />
        <path d="M140 115H150C155 115 160 120 160 125V150H140V115Z" fill="#adb8c4" />
        
        {/* Sitting Character */}
        {/* Legs */}
        <path d="M85 115V135H95V115H85Z" fill="#2d3748" />
        <path d="M105 115V132H115V115H105Z" fill="#2d3748" />
        <path d="M85 135H72V142H85V135Z" fill="#718096" />
        <path d="M105 132H118V139H105V132Z" fill="#718096" />
        
        {/* Body */}
        <path d="M80 80C80 75 85 70 95 70H105C115 70 120 75 120 80V115H80V80Z" fill="#00827f" />
        
        {/* Head */}
        <circle cx="100" cy="55" r="15" fill="#fbd38d" />
        <path d="M92 48C92 45 108 45 108 48C108 51 92 51 92 48Z" fill="#4a5568" /> {/* Hair snippet */}
        
        {/* Arm and Phone */}
        <path d="M115 85L128 92L125 98L112 90L115 85Z" fill="#fbd38d" />
        <rect x="126" y="86" width="8" height="15" rx="1.5" transform="rotate(15 126 86)" fill="#1a202c" />
        <rect x="128" y="89" width="4" height="9" rx="0.5" transform="rotate(15 128 89)" fill="#fff" />
        
        {/* Floating Credit Card Representation */}
        <g className="animate-bounce" style={{ animationDuration: "3s" }}>
          <rect x="120" y="30" width="35" height="22" rx="3" fill="#3182ce" />
          <rect x="124" y="34" width="8" height="6" rx="1" fill="#ecc94b" />
          <line x1="124" y1="45" x2="148" y2="45" stroke="#fff" strokeWidth="2" />
        </g>

        {/* Success Checkmark Badge */}
        <g className="animate-pulse">
          <circle cx="60" cy="50" r="14" fill="#38a169" />
          <path d="M55 50L58 53L65 46" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Currency coins floating */}
        <circle cx="50" cy="90" r="7" fill="#ecc94b" />
        <circle cx="50" cy="90" r="5" fill="#f6e05e" />
        <circle cx="150" cy="85" r="9" fill="#ecc94b" />
        <circle cx="150" cy="85" r="6.5" fill="#f6e05e" />
      </svg>
    ),
  },
  {
    title: "Exclusive offers & discounts",
    description: "Access special promotions, health tips, and discounts tailored for you.",
    illustration: (
      <svg className="w-56 h-56 max-w-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Background Plate */}
        <circle cx="100" cy="100" r="85" fill="#fff0f3" />
        
        {/* Gift Box */}
        <rect x="65" y="85" width="70" height="65" rx="6" fill="#ff3366" />
        <rect x="60" y="75" width="80" height="15" rx="3" fill="#e02454" />
        
        {/* Gold Ribbon Vertical */}
        <rect x="94" y="75" width="12" height="75" fill="#ecc94b" />
        {/* Gold Ribbon Horizontal */}
        <rect x="65" y="110" width="70" height="12" fill="#ecc94b" />
        
        {/* Gift Bow */}
        <path d="M85 75C75 60 90 55 96 75Z" fill="#ecc94b" />
        <path d="M115 75C125 60 110 55 104 75Z" fill="#ecc94b" />
        <circle cx="100" cy="74" r="6" fill="#d69e2e" />

        {/* Floating Hearts & Stars */}
        <path d="M45 55C41 51 35 51 31 55C27 59 27 65 31 69L45 83L59 69C63 65 63 59 59 55C55 51 49 51 45 55Z" fill="#ff3366" className="animate-pulse" />
        <path d="M150 45L153 52L160 53L155 58L157 65L150 61L143 65L145 58L140 53L147 52L150 45Z" fill="#ecc94b" className="animate-bounce" style={{ animationDuration: "2.5s" }} />
        
        {/* Discount Badge */}
        <g transform="rotate(-15 150 110)" className="animate-bounce" style={{ animationDuration: "4s" }}>
          <circle cx="145" cy="115" r="24" fill="#00827f" />
          <text x="145" y="120" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">50%</text>
        </g>
      </svg>
    ),
  },
  {
    title: "Track your orders in real-time",
    description: "Get up-to-date tracking information on your delivery status.",
    illustration: (
      <svg className="w-56 h-56 max-w-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Background Plate */}
        <circle cx="100" cy="100" r="85" fill="#f7fafc" />
        
        {/* Road line */}
        <line x1="30" y1="145" x2="170" y2="145" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="145" x2="150" y2="145" stroke="#cbd5e0" strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round" />

        {/* Delivery Truck */}
        {/* Cargo Body */}
        <rect x="55" y="70" width="65" height="55" rx="4" fill="#00827f" />
        {/* Cabin */}
        <path d="M120 85H138C143 85 147 89 147 94V125H120V85Z" fill="#319795" />
        {/* Window */}
        <path d="M124 90H134L138 98H124V90Z" fill="#e2e8f0" />
        
        {/* Wheels */}
        <circle cx="75" cy="130" r="12" fill="#1a202c" />
        <circle cx="75" cy="130" r="5" fill="#fff" />
        <circle cx="127" cy="130" r="12" fill="#1a202c" />
        <circle cx="127" cy="130" r="5" fill="#fff" />
        
        {/* Headlight beam */}
        <polygon points="147,110 175,105 175,123 147,118" fill="#feebc8" opacity="0.6" />

        {/* Map Marker Pin */}
        <g transform="translate(100, 35)" className="animate-bounce">
          <path d="M0 -15C-8.3 -15 -15 -8.3 -15 0C-15 10.5 0 25 0 25C0 25 15 10.5 15 0C15 -8.3 8.3 -15 0 -15Z" fill="#ff3366" />
          <circle cx="0" cy="0" r="5" fill="#fff" />
        </g>
      </svg>
    ),
  },
];

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [hasReferral, setHasReferral] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Click outside listener for modal box & country dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    alert(`OTP Code sent to: ${selectedCountry.code} ${phone}${referralCode ? ` with Referral Code: ${referralCode}` : ""}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Modal Box Container */}
      <div
        ref={modalRef}
        className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row relative shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-all duration-200 z-50 focus:outline-none"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side: Illustrative Carousel (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-[#f8f9fa] flex-col items-center justify-center p-12 relative border-r border-slate-100 min-h-[480px]">
          <div className="w-full flex flex-col items-center text-center space-y-6">
            
            {/* Active Slide Graphics */}
            <div className="h-60 flex items-center justify-center transition-all duration-500">
              {CAROUSEL_SLIDES[activeSlide].illustration}
            </div>

            {/* Slide Info */}
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                {CAROUSEL_SLIDES[activeSlide].title}
              </h3>
              <p className="text-sm text-slate-500 max-w-xs leading-normal">
                {CAROUSEL_SLIDES[activeSlide].description}
              </p>
            </div>

            {/* Carousel Dot Indicators */}
            <div className="flex items-center gap-2 pt-2">
              {CAROUSEL_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    index === activeSlide ? "w-6 bg-primary" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center min-h-[480px]">
          <div className="space-y-6 max-w-sm mx-auto w-full">
            
            {/* Title Block */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800">Login</h2>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Login to make an order, access your orders, special offers, health tips, and more!
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Phone Input with Country Dropdown */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  
                  {/* Country Selector */}
                  <div className="relative" ref={countryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="flex items-center gap-1.5 px-4 h-full bg-slate-50 border-r border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
                    >
                      <span>{selectedCountry.flag}</span>
                      <span>({selectedCountry.code}) {selectedCountry.name}</span>
                      <svg
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                          isCountryDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Country List Options */}
                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-48 rounded-xl bg-white border border-slate-150 shadow-xl py-1.5 z-[110] max-h-48 overflow-y-auto animate-in fade-in duration-100">
                        {COUNTRIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c);
                              setIsCountryDropdownOpen(false);
                            }}
                            className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors focus:outline-none"
                          >
                            <span>{c.flag}</span>
                            <span className="font-semibold text-slate-800">({c.code})</span>
                            <span className="text-xs text-slate-400">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input Element */}
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    required
                  />

                </div>
              </div>

              {/* Referral Code Accordion */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setHasReferral(!hasReferral)}
                  className="flex items-center justify-between w-full text-xs font-bold text-primary hover:text-primary-hover focus:outline-none py-1 group"
                >
                  <span className="group-hover:underline">Have a referral code?</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${hasReferral ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {hasReferral && (
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all animate-slideDown"
                  />
                )}
              </div>

              {/* Submit / Send Button */}
              <button
                type="submit"
                disabled={!phone}
                className="w-full bg-primary hover:bg-primary-hover text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center"
              >
                Send
              </button>

            </form>

            {/* "or" Divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] bg-slate-100 flex-1" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
              <div className="h-[1px] bg-slate-100 flex-1" />
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => alert("Google Login Pressed")}
                className="flex items-center justify-center border border-slate-200 hover:border-slate-300 hover:bg-slate-50 py-2.5 rounded-xl transition-all duration-200 shadow-sm focus:outline-none cursor-pointer"
                aria-label="Login with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
              </button>

              {/* LinkedIn Button */}
              <button
                type="button"
                onClick={() => alert("LinkedIn Login Pressed")}
                className="flex items-center justify-center border border-slate-200 hover:border-slate-300 hover:bg-slate-50 py-2.5 rounded-xl transition-all duration-200 shadow-sm focus:outline-none cursor-pointer"
                aria-label="Login with LinkedIn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" fill="#0A66C2" />
                </svg>
              </button>
            </div>

            {/* Footer Notice */}
            <div className="pt-2">
              <p className="text-[10px] text-slate-400 font-medium text-center leading-normal">
                By continuing you agree to{" "}
                <a href="/terms" className="text-slate-600 hover:text-slate-800 hover:underline font-semibold">
                  Terms & Conditions
                </a>
                ,{" "}
                <a href="/privacy" className="text-slate-600 hover:text-slate-800 hover:underline font-semibold">
                  Privacy Policy
                </a>{" "}
                &{" "}
                <a href="/refund" className="text-slate-600 hover:text-slate-800 hover:underline font-semibold">
                  Refund-Return Policy
                </a>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
