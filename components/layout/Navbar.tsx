"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  shortlistCount: number;
  onOpenShortlist: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedGender?: "all" | "boy" | "girl" | "unisex";
  onGenderChange?: (gender: "all" | "boy" | "girl" | "unisex") => void;
}

export default function Navbar({
  shortlistCount,
  onOpenShortlist,
  searchQuery = "",
  onSearchChange,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-cream/90 dark:bg-slate-900/90 backdrop-blur-md shadow-soft border-b border-saffron/10 py-2.5"
          : "bg-cream dark:bg-slate-900 border-b border-saffron/10 py-3.5"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Logo with Lotus Icon */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-saffron-light dark:bg-saffron/20 border border-saffron/30 flex items-center justify-center text-saffron group-hover:scale-105 transition-transform">
            {/* Lotus SVG */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-saffron-deep dark:text-saffron"
            >
              <path d="M12 3c-2.5 3-4.5 6-4.5 9 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5c0-3-2-6-4.5-9z" />
              <path d="M12 16.5C8 16.5 4 14 2 11c3-1 6.5 0 9 2.5" />
              <path d="M12 16.5c4 0 8-2.5 10-5.5-3-1-6.5 0-9 2.5" />
            </svg>
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-charcoal dark:text-white group-hover:text-saffron-deep transition-colors">
            Namaah<span className="text-saffron">.</span>
          </span>
        </Link>

        {/* Quick Search bar in Navbar (Desktop / Tablet) */}
        {onSearchChange && (
          <div className="hidden md:flex items-center flex-1 max-w-sm relative">
            <svg
              className="absolute left-3.5 w-4 h-4 text-charcoal/40 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search name, meaning, or letter..."
              className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-white/80 dark:bg-slate-800 border border-saffron/20 rounded-full focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white text-charcoal dark:text-white placeholder-charcoal/40 dark:placeholder-slate-400 transition-all"
            />
          </div>
        )}

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Origins Guide Link */}
          <Link
            href="/origins"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted dark:text-slate-300 hover:text-saffron-deep dark:hover:text-saffron transition-colors px-2.5 py-1.5 rounded-full hover:bg-saffron-light/50 dark:hover:bg-slate-800"
          >
            <span>📜</span>
            <span>Name Origins</span>
          </Link>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="w-9 h-9 rounded-full bg-saffron-light/60 dark:bg-slate-800 border border-saffron/20 flex items-center justify-center text-charcoal dark:text-amber-300 hover:scale-105 transition-all"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            <span className="text-base">{theme === "light" ? "🌙" : "☀️"}</span>
          </button>

          {/* Shortlist Button */}
          <button
            onClick={onOpenShortlist}
            aria-label="Open My Shortlist"
            className="relative inline-flex items-center gap-2 bg-saffron text-white hover:bg-saffron-dark px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="hidden sm:inline">My Shortlist</span>
            <span className="bg-white text-saffron-deep text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {shortlistCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
