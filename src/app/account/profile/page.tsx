"use client";

import React, { useState } from "react";

export default function ProfilePage() {
  // Contact details state
  const [fullName, setFullName] = useState("Alex John");
  const [email, setEmail] = useState("alex.john@example.com");
  const [phone, setPhone] = useState("01711223344");

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile details updated successfully!");
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto font-sans">
      {/* Contact Details Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          Profile Details
        </h2>
        <p className="text-xs text-slate-400 font-medium mb-6">
          Update your personal details.
        </p>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* iOS Grouped Cell Container for Contact details */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">
              Contact Details
            </span>
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100/80">
              
              {/* Full Name Row */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 shrink-0">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <label className="text-sm font-bold text-slate-600">
                    Full Name *
                  </label>
                </div>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 placeholder-slate-300 text-right md:w-2/3" 
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email Row */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 shrink-0">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <label className="text-sm font-bold text-slate-600">
                    Email
                  </label>
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 placeholder-slate-300 text-right md:w-2/3" 
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone Row */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 shrink-0">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.944-6.944l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <label className="text-sm font-bold text-slate-600">
                    Phone *
                  </label>
                </div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 placeholder-slate-300 text-right md:w-2/3" 
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm py-3 px-8 rounded-xl transition-all duration-300 ease-out shadow-sm shadow-violet-600/10 hover:shadow-md hover:shadow-violet-600/20 active:scale-[0.98] hover:-translate-y-0.5 cursor-pointer"
            >
              Save Profile Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
