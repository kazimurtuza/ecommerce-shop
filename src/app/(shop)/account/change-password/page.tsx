"use client";

import React, { useState } from "react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    // Success response mockup
    setSuccessMsg("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto font-sans animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          Change Password
        </h2>
        <p className="text-xs text-slate-400 font-medium mb-6">
          Update your security credentials.
        </p>

        {errorMsg && (
          <div className="mb-5 text-xs font-bold text-red-500 bg-red-50 border border-red-100 p-3.5 rounded-xl">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl">
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* iOS Grouped Cell Container */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">
              Security Credentials
            </span>
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100/80 shadow-sm">
              
              {/* Current Password Row */}
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 shrink-0 md:w-1/3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <label className="text-sm font-bold text-slate-600">
                    Current Password *
                  </label>
                </div>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 placeholder-slate-300 text-left md:w-2/3 md:text-right" 
                  placeholder="Enter current password"
                  required
                />
              </div>

              {/* New Password Row */}
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 shrink-0 md:w-1/3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H3.75v-2.25A2.25 2.25 0 016 17.25h1.5v-1.5a2.25 2.25 0 012.25-2.25h1.5v-1.5a2.25 2.25 0 01.383-1.25m9.367-4.25a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <label className="text-sm font-bold text-slate-600">
                    New Password *
                  </label>
                </div>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 placeholder-slate-300 text-left md:w-2/3 md:text-right" 
                  placeholder="Min. 6 characters"
                  required
                />
              </div>

              {/* Confirm Password Row */}
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 shrink-0 md:w-1/3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0112 2.714z" />
                  </svg>
                  <label className="text-sm font-bold text-slate-600">
                    Confirm Password *
                  </label>
                </div>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 placeholder-slate-300 text-left md:w-2/3 md:text-right" 
                  placeholder="Re-enter new password"
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
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
