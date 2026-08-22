"use client";

import React, { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert(`Subscribed successfully with email: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-accent-light border-t border-accent/20 font-sans text-slate-700 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">

        {/* Column 1: Logo & Links */}
        <div className="md:col-span-3 space-y-6">
          {/* Stylized Logo F-Shape */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-600/20 font-black text-xl">
              H
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">HATBAZAR</span>
          </div>

          {/* Quick Links List */}
          <ul className="space-y-2.5 text-sm font-semibold text-slate-500">
            <li>
              <a href="#" className="hover:text-violet-600 transition-colors">About Hatbazar</a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-600 transition-colors">Terms & Conditions</a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-600 transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-600 transition-colors">Cancellation & Return Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-600 transition-colors">FAQs</a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-600 transition-colors">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Column 2: Inbox & Help */}
        <div className="md:col-span-5 space-y-8">
          {/* Inbox Discount Area */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-accent shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Get Special Discounts in Your Inbox
              </h3>
            </div>

            <form onSubmit={handleSubscribe} className="flex gap-2 items-end max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to get offers, discounts and more."
                className="flex-1 bg-transparent border-0 border-b border-slate-300 focus:border-violet-500 py-2 px-1 focus:ring-0 text-slate-800 placeholder-slate-400 text-sm focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-hover text-white font-extrabold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase active:scale-95 hover:-translate-y-0.5 transition-all cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Call Helpline Area */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-accent shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.944-6.944l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                For Any Help You May Call Us At
              </h3>
            </div>
            <div className="space-y-1">
              <a 
                href="tel:+8809677666888" 
                className="text-accent text-lg font-black tracking-wide block hover:text-accent-hover transition-colors"
              >
                +8809677666888
              </a>
              <p className="text-xs text-slate-400 font-bold">Customer Service</p>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Track your order or get help returning an order
              </p>
            </div>
          </div>
        </div>

        {/* Column 3: Follow Us & FB Widget */}
        <div className="md:col-span-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Follow Us</h3>
            </div>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Stay updated on our latest arrivals, exclusive promotions and events.
            </p>
          </div>

          {/* Social Icons Row */}
          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a href="#" className="w-8 h-8 rounded-full border border-slate-200 hover:border-violet-500 hover:text-violet-600 bg-white text-slate-400 flex items-center justify-center transition-all cursor-pointer">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" className="w-8 h-8 rounded-full border border-slate-200 hover:border-black hover:text-black bg-white text-slate-400 flex items-center justify-center transition-all cursor-pointer">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.95-1.72-.08 2.65-.01 5.3.02 7.95-.04 2.29-.86 4.79-2.73 6.13-2.14 1.62-5.32 1.77-7.46.33-2.31-1.5-3.23-4.66-2.22-7.22 1-2.58 3.96-4.22 6.7-3.64v4.08c-1.47-.38-3.19.16-3.97 1.48-.87 1.34-.47 3.39.88 4.18 1.25.77 3.07.21 3.65-1.22.14-.52.12-1.07.12-1.61-.02-3.89-.01-7.78-.02-11.66z" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="w-8 h-8 rounded-full border border-slate-200 hover:border-blue-600 hover:text-blue-600 bg-white text-slate-400 flex items-center justify-center transition-all cursor-pointer">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="#" className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-800 hover:text-slate-800 bg-white text-slate-400 flex items-center justify-center transition-all cursor-pointer">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Pinterest */}
            <a href="#" className="w-8 h-8 rounded-full border border-slate-200 hover:border-red-600 hover:text-red-600 bg-white text-slate-400 flex items-center justify-center transition-all cursor-pointer">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.906 2.17-2.906 1.024 0 1.518.769 1.518 1.69 0 1.03-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.493 0-2.873-2.064-4.882-5.005-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.164 0 7.397 2.967 7.397 6.93 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C1.124 21.658 0 17.065 0 11.987c0-6.62 5.367-11.987 11.987-11.987s11.987 5.367 11.987 11.987c0 6.62-5.367 11.987-11.987 11.987z" />
              </svg>
            </a>
          </div>

          {/* Facebook Widget Mockup */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/30 shadow-sm flex items-center justify-between gap-4 max-w-sm hover:shadow transition-shadow">
            <div className="flex items-center gap-3">
              {/* Facebook Round Circle icon */}
              <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center text-white shrink-0">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-slate-800 text-[13.5px] truncate">Fabrilife</span>
                  {/* Verified Badge */}
                  <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a.75.75 0 00-.75-.75h-.007a.75.75 0 00-.75.75v.006a.75.75 0 00.75.75h.007a.75.75 0 00.75-.75v-.006zm-.75 2.25a.75.75 0 01.75-.75h.007a.75.75 0 01.75.75v.007a.75.75 0 01-.75.75h-.007a.75.75 0 01-.75-.75V5.7zm6.733-2.25a.75.75 0 00-.75-.75h-.007a.75.75 0 00-.75.75v.006a.75.75 0 00.75.75h.007a.75.75 0 00.75-.75v-.006zm-.75 2.25a.75.75 0 01.75-.75h.007a.75.75 0 01.75.75v.007a.75.75 0 01-.75.75h-.007a.75.75 0 01-.75-.75V5.7zM2.87 9.07a.75.75 0 00-.75-.75H2.113a.75.75 0 00-.75.75v.007a.75.75 0 00.75.75h.007a.75.75 0 00.75-.75V9.07zm-.75 2.25a.75.75 0 01.75-.75h.007a.75.75 0 01.75.75v.007a.75.75 0 01-.75.75h-.007a.75.75 0 01-.75-.75v-.007zm14.73-2.25a.75.75 0 00-.75-.75h-.007a.75.75 0 00-.75.75v.007a.75.75 0 00.75.75h.007a.75.75 0 00.75-.75V9.07zm-.75 2.25a.75.75 0 01.75-.75h.007a.75.75 0 01.75.75v.007a.75.75 0 01-.75.75h-.007a.75.75 0 01-.75-.75v-.007zM10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <a href="#" className="text-[11px] font-bold text-blue-500 hover:underline">Follow</a>
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-none mt-1">937K followers • 1 following</p>
              </div>
            </div>
          </div>

          {/* App download buttons */}
          <div className="flex flex-wrap gap-2.5">
            {/* Google Play */}
            <a href="#" className="flex items-center gap-2 px-3 py-1.5 bg-black hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer select-none">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M3 5.277L14.767 17.06l3.52-3.523-14.81-8.528A1.9 1.9 0 003 5.277zm16.147 6.136l2.843-1.636a1.9 1.9 0 000-3.292L19.147 4.85l-3.327 3.33 3.327 3.233zM3 18.723a1.9 1.9 0 00.477 1.258l14.81-8.528-3.327-3.232L3 18.723zM3 7.025v9.95L8 12 3 7.025z" />
              </svg>
              <div className="text-left leading-tight">
                <span className="text-[8px] font-bold text-slate-400 block uppercase">Get it on</span>
                <span className="text-xs font-black text-white block">Google Play</span>
              </div>
            </a>
            {/* App Store */}
            <a href="#" className="flex items-center gap-2 px-3 py-1.5 bg-black hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer select-none">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.73-1.2 1.87-1.05 2.98 1.12.09 2.27-.56 3-1.43" />
              </svg>
              <div className="text-left leading-tight">
                <span className="text-[8px] font-bold text-slate-400 block">Download on the</span>
                <span className="text-xs font-black text-white block">App Store</span>
              </div>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
