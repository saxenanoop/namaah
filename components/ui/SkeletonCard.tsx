"use client";

import React from "react";

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-card p-5 border border-saffron/10 shadow-soft animate-pulse flex flex-col justify-between h-48">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-2">
            <div className="h-5 w-28 bg-saffron/20 dark:bg-slate-700 rounded-md" />
            <div className="h-4 w-16 bg-saffron/15 dark:bg-slate-700 rounded-md" />
          </div>
          <div className="w-8 h-8 rounded-full bg-saffron/15 dark:bg-slate-700" />
        </div>
        <div className="h-3 w-20 bg-charcoal/10 dark:bg-slate-700 rounded-full mb-3" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-charcoal/10 dark:bg-slate-700 rounded" />
          <div className="h-3 w-4/5 bg-charcoal/10 dark:bg-slate-700 rounded" />
        </div>
      </div>
      <div className="pt-3 border-t border-charcoal/5 dark:border-slate-700 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="h-4 w-14 bg-saffron/15 dark:bg-slate-700 rounded-md" />
          <div className="h-4 w-14 bg-saffron/15 dark:bg-slate-700 rounded-md" />
        </div>
        <div className="h-3 w-12 bg-saffron/20 dark:bg-slate-700 rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
