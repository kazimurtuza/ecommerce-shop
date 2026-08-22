"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  size: string;
  qty: number;
  image: string;
}

export default function CheckoutPage() {
  // Cart item state matching the cargo pants in mockup
  const [cartItem, setCartItem] = useState<CartItem>({
    id: 1,
    name: "Premium Cargo Pant [V Pocket] - Gray",
    price: 1890,
    originalPrice: 2500,
    size: "38",
    qty: 1,
    image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=240&fit=crop&q=80"
  });

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [city, setCity] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Saved Addresses state
  const [savedAddresses] = useState([
    {
      id: "addr-1",
      label: "Dhaka Home",
      addressLine: "House 24, Road 5, Sector 11",
      city: "Dhaka",
      altPhone: "01711122233",
      instructions: "Leave it with the security guard."
    },
    {
      id: "addr-2",
      label: "Ctg Office",
      addressLine: "Flat 4B, Building 7, Nasirabad HS",
      city: "Chittagong",
      altPhone: "01999888777",
      instructions: "Please call before arriving."
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("addr-1");

  // Auto-populate inputs when selectedAddressId changes
  useEffect(() => {
    if (selectedAddressId === "custom") {
      setDetailedAddress("");
      setCity("");
      setAltPhone("");
      setDeliveryNote("");
    } else {
      const selected = savedAddresses.find(addr => addr.id === selectedAddressId);
      if (selected) {
        setDetailedAddress(selected.addressLine);
        setCity(selected.city);
        setAltPhone(selected.altPhone);
        setDeliveryNote(selected.instructions);
      }
    }
  }, [selectedAddressId, savedAddresses]);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Payment method: 'cod' (Cash on Delivery), 'card' (Card Payment), 'bkash' (bKash)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "bkash">("bkash");

  // Quantity controls
  const handleIncreaseQty = () => {
    setCartItem(prev => ({ ...prev, qty: prev.qty + 1 }));
  };

  const handleDecreaseQty = () => {
    if (cartItem.qty > 1) {
      setCartItem(prev => ({ ...prev, qty: prev.qty - 1 }));
    }
  };

  // Calculations
  const subtotal = cartItem.price * cartItem.qty;
  const originalSubtotal = cartItem.originalPrice * cartItem.qty;
  
  // Shipping: 60 BDT for Dhaka, 120 BDT for other cities
  const shippingCost = city === "Dhaka" ? 60 : (city === "" ? 60 : 120);
  const total = subtotal + shippingCost - discountAmount;

  // Coupon Apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    
    const code = couponCode.trim().toUpperCase();
    if (code === "SAVE100") {
      setAppliedCoupon("SAVE100");
      setDiscountAmount(100);
      setCouponCode("");
    } else if (code === "FREE") {
      setAppliedCoupon("FREE");
      setDiscountAmount(shippingCost);
      setCouponCode("");
    } else if (code === "") {
      setCouponError("Please enter code");
    } else {
      setCouponError("Invalid code. Try 'SAVE100'");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Form submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !detailedAddress || !city) {
      alert("Please fill in all required (*) fields.");
      return;
    }
    if (!termsAgreed) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    alert(`Order Confirmed! \nMethod: ${paymentMethod.toUpperCase()} \nTotal: ৳${total}`);
  };

  return (
    <div className="bg-[#f2f2f7] min-h-screen pb-24 md:py-12 px-4 sm:px-6 lg:px-8 font-['-apple-system',_BlinkMacSystemFont,_'Segoe_UI',_Roboto,_Helvetica,_Arial,_sans-serif] antialiased text-[#1c1c1e]">
      <div className="max-w-5xl mx-auto">
        
        {/* iOS Header */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200/60">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Secure Checkout</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-black">Checkout</h1>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 block">Total Amount</span>
            <span className="text-xl font-black text-black">৳{total}</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Contact & Shipping (Col span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact Information Group */}
            <div>
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider pl-4 pb-2 block">Contact Details</span>
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden divide-y divide-slate-100">
                
                {/* Full Name Row */}
                <div className="flex items-center px-4 py-3.5 gap-4">
                  <span className="text-slate-400 w-5 shrink-0">
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                    <label className="text-[14px] font-semibold text-slate-700 w-28 shrink-0">Full Name *</label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="flex-1 bg-transparent text-[14px] placeholder-slate-400 focus:outline-none w-full py-0.5"
                    />
                  </div>
                </div>

                {/* Email Row */}
                <div className="flex items-center px-4 py-3.5 gap-4">
                  <span className="text-slate-400 w-5 shrink-0">
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                    <label className="text-[14px] font-semibold text-slate-700 w-28 shrink-0">Email</label>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent text-[14px] placeholder-slate-400 focus:outline-none w-full py-0.5"
                    />
                  </div>
                </div>

                {/* Phone Number Row */}
                <div className="flex items-center px-4 py-3.5 gap-4">
                  <span className="text-slate-400 w-5 shrink-0">
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                    <label className="text-[14px] font-semibold text-slate-700 w-28 shrink-0">Phone *</label>
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-transparent text-[14px] placeholder-slate-400 focus:outline-none w-full py-0.5 font-medium"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Shipping Address Group */}
            <div>
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider pl-4 pb-2 block">Shipping Address</span>
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden divide-y divide-slate-100">
                
                {/* Saved Addresses Selector Row */}
                <div className="p-4 bg-slate-50/50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                    Select Delivery Address
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`flex-1 min-w-[120px] p-3 text-left rounded-xl border transition-all active:scale-95 cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "border-violet-600 bg-violet-50/20 shadow-sm"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-800">{addr.label}</span>
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? "border-violet-600 bg-violet-600" : "border-slate-300"
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 truncate max-w-[160px]">{addr.addressLine}</span>
                        </button>
                      );
                    })}
                    
                    {/* Custom Address Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedAddressId("custom")}
                      className={`flex-1 min-w-[120px] p-3 text-left rounded-xl border transition-all active:scale-95 cursor-pointer flex flex-col justify-between ${
                        selectedAddressId === "custom"
                          ? "border-violet-600 bg-violet-50/20 shadow-sm"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">Custom Address</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          selectedAddressId === "custom" ? "border-violet-600 bg-violet-600" : "border-slate-300"
                        }`}>
                          {selectedAddressId === "custom" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">Type address manually</span>
                    </button>
                  </div>
                </div>

                {/* Detailed Address Row */}
                <div className="flex items-center px-4 py-3.5 gap-4">
                  <span className="text-slate-400 w-5 shrink-0">
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                    <label className="text-[14px] font-semibold text-slate-700 w-28 shrink-0">Address *</label>
                    <input
                      type="text"
                      required
                      autoComplete="street-address"
                      placeholder="House, Road, Area"
                      value={detailedAddress}
                      onChange={(e) => {
                        setSelectedAddressId("custom");
                        setDetailedAddress(e.target.value);
                      }}
                      className="flex-1 bg-transparent text-[14px] placeholder-slate-400 focus:outline-none w-full py-0.5"
                    />
                  </div>
                </div>

                {/* City Selection Row */}
                <div className="flex items-center px-4 py-3.5 gap-4">
                  <span className="text-slate-400 w-5 shrink-0">
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </span>
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                    <label className="text-[14px] font-semibold text-slate-700 w-28 shrink-0">City/District *</label>
                    <div className="flex-1 relative w-full">
                      <select
                        required
                        value={city}
                        onChange={(e) => {
                          setSelectedAddressId("custom");
                          setCity(e.target.value);
                        }}
                        className="w-full bg-transparent text-[14px] focus:outline-none appearance-none cursor-pointer text-slate-800 font-medium py-0.5 pr-8"
                      >
                        <option value="">Select City</option>
                        <option value="Dhaka">Dhaka (৳60)</option>
                        <option value="Chittagong">Chittagong (৳120)</option>
                        <option value="Sylhet">Sylhet (৳120)</option>
                        <option value="Rajshahi">Rajshahi (৳120)</option>
                        <option value="Khulna">Khulna (৳120)</option>
                        <option value="Barisal">Barisal (৳120)</option>
                        <option value="Rangpur">Rangpur (৳120)</option>
                        <option value="Mymensingh">Mymensingh (৳120)</option>
                      </select>
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alt Phone Row */}
                <div className="flex items-center px-4 py-3.5 gap-4">
                  <span className="text-slate-400 w-5 shrink-0">
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                    <label className="text-[14px] font-semibold text-slate-700 w-28 shrink-0">Alt. Phone</label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="Optional"
                      value={altPhone}
                      onChange={(e) => {
                        setSelectedAddressId("custom");
                        setAltPhone(e.target.value);
                      }}
                      className="flex-1 bg-transparent text-[14px] placeholder-slate-400 focus:outline-none w-full py-0.5"
                    />
                  </div>
                </div>

                {/* Note Row */}
                <div className="flex px-4 py-3.5 gap-4 items-start">
                  <span className="text-slate-400 w-5 shrink-0 mt-1">
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </span>
                  <div className="flex-1 flex flex-col md:flex-row gap-1 md:gap-4">
                    <label className="text-[14px] font-semibold text-slate-700 w-28 shrink-0 mt-0.5">Instructions</label>
                    <textarea
                      placeholder="Delivery instructions (optional)"
                      value={deliveryNote}
                      onChange={(e) => {
                        setSelectedAddressId("custom");
                        setDeliveryNote(e.target.value);
                      }}
                      rows={2}
                      className="flex-1 bg-transparent text-[14px] placeholder-slate-400 focus:outline-none w-full resize-none py-0.5"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & Payment (Col span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Order Items & Summary Group */}
            <div>
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider pl-4 pb-2 block">Order Summary</span>
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden p-4 space-y-4">
                
                {/* Product Detail Card inside list */}
                <div className="flex gap-4">
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cartItem.image}
                      alt={cartItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[13.5px] font-bold text-black leading-snug line-clamp-2">
                        {cartItem.name}
                      </h4>
                      <p className="text-[11.5px] text-slate-500 font-medium mt-1">
                        Size: {cartItem.size} • Qty: {cartItem.qty}
                      </p>
                    </div>
                    
                    {/* iOS Quantity Counter */}
                    <div className="flex items-center gap-1.5 mt-2 bg-[#f2f2f7] w-fit rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={handleDecreaseQty}
                        className="w-6 h-6 flex items-center justify-center rounded-md text-[#007aff] hover:bg-white active:scale-95 transition-all text-sm select-none cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-black w-4 text-center text-slate-800">{cartItem.qty}</span>
                      <button
                        type="button"
                        onClick={handleIncreaseQty}
                        className="w-6 h-6 flex items-center justify-center rounded-md text-[#007aff] hover:bg-white active:scale-95 transition-all text-sm select-none cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end justify-between">
                    <span className="text-[11px] text-slate-400 line-through">
                      ৳{originalSubtotal}
                    </span>
                    <span className="text-[14px] font-extrabold text-black">
                      ৳{subtotal}
                    </span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Subtotal list details */}
                <div className="space-y-3 pt-1 text-[13px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">৳{subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-slate-800">৳{shippingCost}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-[#34c759] font-bold bg-[#eefaf0] px-3 py-2 rounded-xl items-center">
                      <span>Discount ({appliedCoupon})</span>
                      <div className="flex items-center gap-2">
                        <span>-৳{discountAmount}</span>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="w-5 h-5 flex items-center justify-center bg-[#34c759]/10 rounded-full text-[#34c759] hover:bg-[#34c759]/25 text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-[15px] font-black text-black border-t border-slate-100 pt-3">
                    <span>Total Amount</span>
                    <span className="text-base text-[#007aff]">৳{total}</span>
                  </div>
                </div>

                {/* Premium Green Delivery notification */}
                <div className="bg-[#eefaf0] border border-[#d2f3db] rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-[#34c759] shrink-0">
                    <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="text-[11.5px] font-bold text-[#1e7e34] leading-normal">
                    Arrives <span className="font-black">within 2-3 Days</span> after confirmation.
                  </p>
                </div>

              </div>
            </div>

            {/* iOS Styled Promo Code input */}
            <div>
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider pl-4 pb-2 block">Promo Code</span>
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. SAVE100)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-transparent px-3 text-[13.5px] placeholder-slate-400 focus:outline-none font-semibold uppercase text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#007aff] hover:bg-[#0062cc] active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs tracking-wider transition-all select-none cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-[11px] text-[#ff3b30] font-semibold mt-2 pl-4">{couponError}</p>
              )}
            </div>

            {/* iOS Unified Payment Selection Group */}
            <div>
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider pl-4 pb-2 block">Payment Method</span>
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden divide-y divide-slate-100">
                
                {/* 1. Cash on Delivery Row */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className="flex items-center px-4 py-4 gap-4 cursor-pointer hover:bg-slate-50/50 active:bg-slate-50 transition-colors"
                >
                  <span className="text-slate-500 shrink-0">
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-bold text-black">Cash on Delivery</span>
                      <span className="text-[8.5px] font-black bg-[#ff9500]/10 text-[#ff9500] px-1.5 py-0.5 rounded-full uppercase tracking-wider">Popular</span>
                    </div>
                    <span className="block text-[11px] text-slate-400 font-semibold mt-0.5">Pay when order is delivered</span>
                  </div>
                  {paymentMethod === "cod" && (
                    <span className="text-[#007aff] shrink-0">
                      <svg className="w-5.5 h-5.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* 2. Card Payment Row */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className="flex items-center px-4 py-4 gap-4 cursor-pointer hover:bg-slate-50/50 active:bg-slate-50 transition-colors"
                >
                  <span className="text-slate-500 shrink-0">
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-bold text-black">Card Payment</span>
                      <span className="text-[8.5px] font-black bg-[#34c759]/10 text-[#34c759] px-1.5 py-0.5 rounded-full uppercase tracking-wider">Secure</span>
                    </div>
                    <span className="block text-[11px] text-slate-400 font-semibold mt-0.5">SSLCommerz (Visa, Mastercard, Amex)</span>
                  </div>
                  {paymentMethod === "card" && (
                    <span className="text-[#007aff] shrink-0">
                      <svg className="w-5.5 h-5.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* 3. bKash Row */}
                <div
                  onClick={() => setPaymentMethod("bkash")}
                  className="flex items-center px-4 py-4 gap-4 cursor-pointer hover:bg-slate-50/50 active:bg-slate-50 transition-colors"
                >
                  <span className="text-pink-500 shrink-0">
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-bold text-black">bKash Mobile Wallet</span>
                      <span className="text-[8.5px] font-black bg-pink-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">10% Off</span>
                    </div>
                    <span className="block text-[11px] text-slate-400 font-semibold mt-0.5">Pay securely with bKash app</span>
                  </div>
                  {paymentMethod === "bkash" ? (
                    <span className="text-[#007aff] shrink-0">
                      <svg className="w-5.5 h-5.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="text-xs font-black italic tracking-wide text-pink-600 border border-pink-100 bg-pink-50 rounded px-1.5 py-0.5 select-none">
                      bKash
                    </span>
                  )}
                </div>

              </div>

              {/* Conditional bKash offer banner */}
              {paymentMethod === "bkash" && (
                <div className="bg-[#fff0f4] border border-[#ffccd9] rounded-2xl p-4 text-[11.5px] leading-relaxed text-pink-600 mt-3 shadow-inner">
                  <span className="font-extrabold text-pink-700 block mb-0.5">bKash Offer:</span>
                  10% Cashback up to BDT 150 on purchase over BDT 600, max BDT 300 during campaign period.
                </div>
              )}
            </div>

            {/* Checkbox row */}
            <div className="flex items-start gap-3 px-4">
              <button
                type="button"
                onClick={() => setTermsAgreed(!termsAgreed)}
                className={`mt-0.5 w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                  termsAgreed ? "bg-[#34c759] border-[#34c759] text-white" : "border-slate-300 bg-white"
                }`}
              >
                {termsAgreed && (
                  <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <label className="text-[11.5px] text-slate-500 leading-normal select-none">
                I agree to the{" "}
                <Link href="/terms" className="text-[#007aff] font-semibold hover:underline">
                  Terms & Conditions
                </Link>
                ,{" "}
                <Link href="/refund-policy" className="text-[#007aff] font-semibold hover:underline">
                  Refund Policy
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-[#007aff] font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Main Action Button (Desktop Only) */}
            <div className="hidden md:block">
              <button
                type="submit"
                className="w-full bg-black hover:bg-slate-900 active:scale-[0.99] text-white font-extrabold py-4 px-6 rounded-2xl tracking-wide transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-[14px] flex items-center justify-center gap-2 select-none cursor-pointer"
              >
                <span>
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                {paymentMethod === "cod" ? "Confirm Order" : "Pay Now"} • ৳{total}
              </button>
            </div>

          </div>

          {/* STICKY BOTTOM MOBILE BAR */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-white/80 border-t border-slate-200/50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-4 py-3 pb-6 flex items-center justify-between z-40">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total to Pay</span>
              <span className="text-[18px] font-black text-black">৳{total}</span>
            </div>
            <button
              type="submit"
              className="bg-black hover:bg-slate-900 active:scale-95 text-white font-extrabold py-3 px-6 rounded-xl text-xs tracking-wider transition-all flex items-center gap-1.5 select-none cursor-pointer shadow-sm"
            >
              <span>
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              Confirm Order
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
