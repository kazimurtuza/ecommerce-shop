"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    storeName: "Hatbazar Store",
    storeEmail: "contact@hatbazar.com",
    currency: "USD",
    taxRate: "15",
    shippingFee: "18.99",
    allowRegistration: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Store settings saved successfully! (Simulation)");
  };

  return (
    <div className="space-y-8 font-sans max-w-3xl mx-auto transition-colors duration-200">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Store Settings</h1>
        <p className="text-slate-550 dark:text-slate-400 text-sm mt-1.5">Manage store preferences, billing rates, and shipping policies.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Preferences */}
        <div id="general" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 space-y-6 scroll-mt-24">
          <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm pb-3 border-b border-slate-100 dark:border-slate-800">
            General Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Support Email</label>
              <input
                type="email"
                name="storeEmail"
                value={formData.storeEmail}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Base Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="USD" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">USD ($) United States Dollar</option>
                <option value="BDT" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">BDT (৳) Bangladeshi Taka</option>
                <option value="EUR" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">EUR (€) Euro</option>
                <option value="GBP" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">GBP (£) British Pound</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="allowRegistration"
                  checked={formData.allowRegistration}
                  onChange={handleChange}
                  className="h-4.5 w-4.5 rounded border-slate-350 dark:border-slate-700 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-750 dark:text-slate-300">Allow new customer registration</span>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing, Tax, Shipping Rates */}
        <div id="billing" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 space-y-6 scroll-mt-24">
          <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm pb-3 border-b border-slate-100 dark:border-slate-800">
            Billing & Shipping Rates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">VAT / Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                min="0"
                max="100"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Default Shipping Fee ($)</label>
              <input
                type="text"
                name="shippingFee"
                value={formData.shippingFee}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Form Action buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
