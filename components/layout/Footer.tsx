"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address.", "info");
      return;
    }
    showToast("Subscribed! Weekly name inspiration is on its way. 📩", "success");
    setEmail("");
  };

  return (
    <footer className="bg-charcoal text-cream mt-20 border-t border-saffron/20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3c-2.5 3-4.5 6-4.5 9 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5c0-3-2-6-4.5-9z" />
                </svg>
              </div>
              <span className="font-heading text-2xl font-bold text-white tracking-wide">
                Namaah<span className="text-saffron">.</span>
              </span>
            </div>
            <p className="text-sm text-cream/70 leading-relaxed max-w-md">
              Namaah is a modern, sacred Hindu baby names finder dedicated to helping parents discover meaningful, Vedic, and beautiful names rooted in Sanskrit heritage, mythology, and nature.
            </p>

            {/* Social Icons Placeholder */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-saffron text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-saffron text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
              <a
                href="#twitter"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-saffron text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-heading text-lg font-semibold text-white tracking-wide">Explore</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>
                <a href="#browse-section" className="hover:text-saffron transition-colors">
                  Browse Names A-Z
                </a>
              </li>
              <li>
                <a href="#categories-section" className="hover:text-saffron transition-colors">
                  Browse by Theme
                </a>
              </li>
              <li>
                <a href="#how-to-choose" className="hover:text-saffron transition-colors">
                  How to Choose a Name
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-saffron transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-saffron transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white tracking-wide">
              Get Name Inspiration Weekly
            </h3>
            <p className="text-xs text-cream/70 leading-relaxed">
              Join 15,000+ parents receiving curated Vedic name guides, rare Sanskrit meanings, and astrology tips every Friday.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-cream/40 focus:outline-none focus:ring-2 focus:ring-saffron"
                  required
                />
                <button
                  type="submit"
                  className="bg-saffron hover:bg-saffron-dark text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-[11px] text-cream/40">No spam ever. Unsubscribe anytime in one click.</p>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/50 gap-4">
          <p>© {new Date().getFullYear()} Namaah — Sacred Hindu Baby Names. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Crafted with devotion & care</span>
            <span>✦</span>
            <span>Sanskrit & Vedic Heritage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
