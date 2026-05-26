"use client";

import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full relative">
      {/* Search Icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          className="h-5 w-5 text-zinc-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      
      {/* Input Field */}
      <input
        type="text"
        name="search"
        id="search"
        value={value}
        onChange={onChange}
        className="block w-full rounded-xl border border-white/10 bg-zinc-900/80 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
        placeholder="Try Robotics, Bioinformatics, Space Tech..."
      />
    </div>
  );
}
