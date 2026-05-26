"use client";

import React from "react";

export default function FilterPills({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              id={`filter-pill-${category.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => onSelectCategory(category)}
              type="button"
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide
                transition-all duration-200 cursor-pointer active:scale-95 outline-none
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-900/30"
                    : "border border-zinc-700/60 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
