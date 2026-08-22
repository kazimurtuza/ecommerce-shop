"use client";

import React, { useState } from "react";

// ==========================================
// Interfaces
// ==========================================

interface ShippingAddress {
  id: string;
  addressLine: string;
  city: string;
  altPhone?: string;
  instructions?: string;
  isDefault: boolean;
}

// ==========================================
// Mock Data
// ==========================================

const INITIAL_ADDRESSES: ShippingAddress[] = [
  {
    id: "addr-1",
    addressLine: "House 24, Road 5, Sector 11",
    city: "Dhaka",
    altPhone: "01711122233",
    instructions: "Leave it with the security guard.",
    isDefault: true,
  },
  {
    id: "addr-2",
    addressLine: "Flat 4B, Building 7, Nasirabad Housing Society",
    city: "Chattogram",
    altPhone: "01999888777",
    instructions: "Please call before arriving.",
    isDefault: false,
  }
];

const CITIES = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Narayanganj"
];

export default function AddressesPage() {
  // Address management state
  const [addresses, setAddresses] = useState<ShippingAddress[]>(INITIAL_ADDRESSES);
  
  // Form visibility & input fields state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [formAddress, setFormAddress] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formAltPhone, setFormAltPhone] = useState("");
  const [formInstructions, setFormInstructions] = useState("");
  const [formIsDefault, setFormIsDefault] = useState(false);

  // Error validations
  const [validationError, setValidationError] = useState("");

  const resetAddressForm = () => {
    setFormAddress("");
    setFormCity("");
    setFormAltPhone("");
    setFormInstructions("");
    setFormIsDefault(false);
    setValidationError("");
    setShowAddForm(false);
    setEditingAddressId(null);
  };

  const handleEditAddress = (addr: ShippingAddress) => {
    setEditingAddressId(addr.id);
    setFormAddress(addr.addressLine);
    setFormCity(addr.city);
    setFormAltPhone(addr.altPhone || "");
    setFormInstructions(addr.instructions || "");
    setFormIsDefault(addr.isDefault);
    setShowAddForm(true);
  };

  const handleAddOrUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formAddress.trim()) {
      setValidationError("Address line is required");
      return;
    }
    if (!formCity || formCity === "Select City") {
      setValidationError("City/District is required");
      return;
    }

    let updatedAddresses = [...addresses];

    if (editingAddressId) {
      // Edit existing
      updatedAddresses = updatedAddresses.map((addr) => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            addressLine: formAddress,
            city: formCity,
            altPhone: formAltPhone,
            instructions: formInstructions,
            isDefault: formIsDefault,
          };
        }
        return addr;
      });
    } else {
      // Add new
      const newAddress: ShippingAddress = {
        id: "addr-" + Date.now(),
        addressLine: formAddress,
        city: formCity,
        altPhone: formAltPhone,
        instructions: formInstructions,
        isDefault: formIsDefault,
      };
      updatedAddresses.push(newAddress);
    }

    // If this address is set as default, unset other default addresses
    if (formIsDefault) {
      const activeId = editingAddressId || updatedAddresses[updatedAddresses.length - 1].id;
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === activeId,
      }));
    } else if (updatedAddresses.length === 1) {
      // If it's the only address, force default
      updatedAddresses[0].isDefault = true;
    } else if (editingAddressId) {
      // Check if we edited the default address to be non-default, if so assign default to another
      const defaultExists = updatedAddresses.some((addr) => addr.isDefault);
      if (!defaultExists && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
    }

    setAddresses(updatedAddresses);
    resetAddressForm();
  };

  const handleSelectDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleDeleteAddress = (id: string) => {
    const filter = addresses.filter((addr) => addr.id !== id);
    // If we deleted the default, set first remaining as default
    if (addresses.find((addr) => addr.id === id)?.isDefault && filter.length > 0) {
      filter[0].isDefault = true;
    }
    setAddresses(filter);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto font-sans animate-fadeIn">
      {/* Shipping Addresses Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
              Shipping Addresses
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Manage your delivery locations.
            </p>
          </div>

          {!showAddForm && (
            <button
              onClick={() => {
                resetAddressForm();
                setShowAddForm(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:shadow active:scale-95 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
            >
              <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add New Address
            </button>
          )}
        </div>

        {/* Add/Edit Address Form Card - Matching user's mockup design perfectly */}
        {showAddForm && (
          <div className="mb-8 border border-slate-100 rounded-3xl p-6 bg-slate-50/30 transition-all duration-300">
            <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                {editingAddressId ? "Edit Shipping Address" : "New Shipping Address"}
              </span>
              <button
                onClick={resetAddressForm}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {validationError && (
              <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 border border-red-100 p-3.5 rounded-xl">
                ⚠️ {validationError}
              </div>
            )}

            <form onSubmit={handleAddOrUpdateAddress} className="space-y-6">
              {/* Form Input Group Wrapper (matches image format) */}
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100/80 shadow-sm">
                
                {/* Address Input Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex items-center gap-3 shrink-0 md:w-1/3 mt-1">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v3" />
                    </svg>
                    <label className="text-sm font-bold text-slate-600">
                      Address *
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 placeholder-slate-300 md:w-2/3"
                    placeholder="House, Road, Area"
                    required
                  />
                </div>

                {/* City/District Dropdown Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 shrink-0 md:w-1/3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                    </svg>
                    <label className="text-sm font-bold text-slate-600">
                      City/District *
                    </label>
                  </div>
                  <div className="w-full md:w-2/3 flex items-center justify-between select-none relative">
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 appearance-none pr-8 cursor-pointer"
                      required
                    >
                      <option value="" disabled hidden>Select City</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <svg className="w-4 h-4 text-slate-400 absolute right-0 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Alt Phone Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 shrink-0 md:w-1/3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                    <label className="text-sm font-bold text-slate-600">
                      Alt. Phone
                    </label>
                  </div>
                  <input
                    type="tel"
                    value={formAltPhone}
                    onChange={(e) => setFormAltPhone(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 placeholder-slate-300 md:w-2/3"
                    placeholder="Optional"
                  />
                </div>

                {/* Instructions Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex items-center gap-3 shrink-0 md:w-1/3 mt-1">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <label className="text-sm font-bold text-slate-600">
                      Instructions
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formInstructions}
                    onChange={(e) => setFormInstructions(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 placeholder-slate-300 md:w-2/3"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Set as Default Address Checkbox */}
              <div className="flex items-center gap-3 px-1 select-none">
                <input
                  type="checkbox"
                  id="defaultAddressCheckbox"
                  checked={formIsDefault}
                  onChange={(e) => setFormIsDefault(e.target.checked)}
                  className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500 cursor-pointer"
                />
                <label 
                  htmlFor="defaultAddressCheckbox"
                  className="text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Set as default shipping address
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 ease-out shadow-sm shadow-violet-600/10 hover:shadow-md hover:shadow-violet-600/20 active:scale-[0.98] hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                  {editingAddressId ? "Save Changes" : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={resetAddressForm}
                  className="flex-1 sm:flex-none border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-600 font-semibold py-3 px-8 rounded-xl transition-all duration-300 ease-out hover:shadow-sm hover:border-slate-300 active:scale-[0.98] hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Saved Addresses List */}
        {addresses.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-sm text-slate-400 font-medium">No shipping addresses added yet.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-3 text-xs font-bold text-violet-600 hover:text-violet-700 cursor-pointer"
            >
              Click here to add one
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => handleSelectDefault(addr.id)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                  addr.isDefault 
                    ? "border-violet-600 bg-violet-50/20 shadow-sm" 
                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Custom Radio Button */}
                  <div className="mt-1 shrink-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      addr.isDefault ? "border-violet-600" : "border-slate-300"
                    }`}>
                      {addr.isDefault && (
                        <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 text-sm">
                        {addr.city} Address
                      </span>
                      {addr.isDefault && (
                        <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {addr.addressLine}
                    </p>
                    {addr.altPhone && (
                      <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <span className="text-slate-500">Alt Phone:</span> {addr.altPhone}
                      </p>
                    )}
                    {addr.instructions && (
                      <p className="text-xs text-slate-400 italic">
                        &ldquo;{addr.instructions}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div 
                  className="flex items-center gap-2 self-end md:self-start shrink-0"
                  onClick={(e) => e.stopPropagation()} // Prevent setting as default when clicking buttons
                >
                  <button
                    onClick={() => handleEditAddress(addr)}
                    className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all active:scale-95 cursor-pointer"
                    title="Edit Address"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all active:scale-95 cursor-pointer"
                    title="Delete Address"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
