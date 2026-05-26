"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import FilterPills from "@/components/FilterPills";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const FIELDS = [
  // ── Hidden Gems ──────────────────────────────────────────────────────────
  {
    emoji: "🤖",
    name: "Robotics",
    tagline: "Build machines that move, think, and act in the real world.",
    category: "Hardware",
    badge: "Hidden gem",
    difficulty: "Intermediate",
    salary: "6L – 20L/yr",
  },
  {
    emoji: "🔌",
    name: "VLSI / Chip Design",
    tagline: "Design the microscopic circuits powering modern high-performance microchips.",
    category: "Hardware",
    badge: "Hidden gem",
    difficulty: "Advanced",
    salary: "8L – 22L/yr",
  },
  {
    emoji: "🔬",
    name: "Bioinformatics",
    tagline: "Decode life itself — where genomics meets algorithms.",
    category: "Research",
    badge: "Hidden gem",
    difficulty: "Advanced",
    salary: "5L – 15L/yr",
  },
  {
    emoji: "👁️",
    name: "Computer Vision",
    tagline: "Teach machines to see the world the way humans do.",
    category: "AI & Data",
    badge: "Hidden gem",
    difficulty: "Advanced",
    salary: "8L – 28L/yr",
  },
  {
    emoji: "🛰️",
    name: "Space Technology",
    tagline: "Write software that escapes gravity and reaches the stars.",
    category: "Research",
    badge: "Hidden gem",
    difficulty: "Advanced",
    salary: "7L – 25L/yr",
  },
  {
    emoji: "⚙️",
    name: "Embedded Systems",
    tagline: "Program the tiny brains inside every smart device on earth.",
    category: "Hardware",
    badge: "Hidden gem",
    difficulty: "Intermediate",
    salary: "5L – 18L/yr",
  },
  {
    emoji: "🧬",
    name: "Computational Biology",
    tagline: "Model evolution, disease, and drug discovery with code.",
    category: "Research",
    badge: "Hidden gem",
    difficulty: "Advanced",
    salary: "6L – 18L/yr",
  },
  // ── Popular ───────────────────────────────────────────────────────────────
  {
    emoji: "🔒",
    name: "Cybersecurity",
    tagline: "Defend networks, hunt vulnerabilities, and outsmart attackers.",
    category: "Security",
    badge: "Popular",
    difficulty: "Intermediate",
    salary: "5L – 22L/yr",
  },
  {
    emoji: "🌐",
    name: "Web Development",
    tagline: "Build apps that connect billions of people across the globe.",
    category: "Software",
    badge: "Popular",
    difficulty: "Beginner friendly",
    salary: "4L – 16L/yr",
  },
  {
    emoji: "🧠",
    name: "AI / Machine Learning",
    tagline: "Train models that learn, reason, and automate at scale.",
    category: "AI & Data",
    badge: "Popular",
    difficulty: "Advanced",
    salary: "10L – 35L/yr",
  },
  {
    emoji: "📱",
    name: "Mobile Development",
    tagline: "Ship apps that live in billions of pockets around the world.",
    category: "Software",
    badge: "Popular",
    difficulty: "Beginner friendly",
    salary: "5L – 18L/yr",
  },
  {
    emoji: "☁️",
    name: "Cloud & DevOps",
    tagline: "Keep the internet running — scale, automate, and deploy fearlessly.",
    category: "Software",
    badge: "Popular",
    difficulty: "Intermediate",
    salary: "6L – 24L/yr",
  },
  {
    emoji: "📊",
    name: "Data Science",
    tagline: "Turn raw numbers into decisions that shape entire industries.",
    category: "AI & Data",
    badge: "Popular",
    difficulty: "Intermediate",
    salary: "6L – 20L/yr",
  },
];

const CATEGORIES = ["All", "Software", "Hardware", "Research", "Security", "Emerging", "AI & Data"];

/* ─────────────────────────────────────────────
   DIFFICULTY BADGE
───────────────────────────────────────────── */
function DifficultyBadge({ level }) {
  const map = {
    "Beginner friendly": "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40",
    Intermediate: "bg-amber-950/60 text-yellow-400 border border-amber-800/40",
    Advanced: "bg-red-950/60 text-red-400 border border-red-900/40",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
        map[level] ?? map["Intermediate"]
      }`}
    >
      {level}
    </span>
  );
}

/* ─────────────────────────────────────────────
   FIELD CARD
───────────────────────────────────────────── */
function FieldCard({ field }) {
  const isGem = field.badge === "Hidden gem";
  const slug = field.name
    .toLowerCase()
    .replace(/ \/ /g, "-")
    .replace(/ & /g, "-")
    .replace(/\s+/g, "-");

  return (
    <Link href={`/explore/${slug}`} className="block h-full">
      <div
        className={`group flex flex-col h-full rounded-2xl border bg-zinc-900/60 p-5 transition-all duration-300
          hover:border-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10
          ${isGem ? "border-zinc-800/60" : "border-zinc-800/40"}`}
      >
        {/* Top row — emoji + badge */}
        <div className="flex items-start justify-between">
          <span style={{ fontSize: 28, lineHeight: 1 }} role="img" aria-label={field.name}>
            {field.emoji}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
              isGem
                ? "bg-violet-900/50 text-violet-300 border border-violet-700/50"
                : "bg-emerald-900/50 text-emerald-300 border border-emerald-700/50"
            }`}
          >
            {isGem ? "✦ Hidden gem" : "⭐ Popular"}
          </span>
        </div>

        {/* Field name */}
        <h3 className="mt-4 text-sm font-semibold text-white leading-snug">
          {field.name}
        </h3>

        {/* Tagline */}
        <p className="mt-1.5 text-xs leading-[1.6] text-zinc-400 flex-1">
          {field.tagline}
        </p>

        {/* Footer row — difficulty + salary */}
        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2">
          <DifficultyBadge level={field.difficulty} />
          <span className="text-[11px] text-zinc-500 font-medium tabular-nums">{field.salary}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   SECTION DIVIDER
───────────────────────────────────────────── */
function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-600">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-800/70" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN CLIENT COMPONENT
───────────────────────────────────────────── */
export default function ExploreClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  /* Filter logic */
  const filtered = useMemo(() => {
    return FIELDS.filter((f) => {
      const matchesCategory =
        activeCategory === "All" || f.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.tagline.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const gems = filtered.filter((f) => f.badge === "Hidden gem");
  const popular = filtered.filter((f) => f.badge === "Popular");
  const hiddenGemCount = FIELDS.filter((f) => f.badge === "Hidden gem").length;

  /* How many hidden gems are in the full (unfiltered) dataset */
  const totalHiddenGems = FIELDS.filter((f) => f.badge === "Hidden gem").length;

  return (
    <section className="flex-1 py-10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Search Bar ─────────────────────────────────────── */}
        <div className="max-w-2xl mb-6">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ── Filter Pills ────────────────────────────────────── */}
        <div className="mb-3">
          <FilterPills
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* ── Stats Bar ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-8 px-0.5">
          <span className="text-[11px] text-zinc-600 font-medium">
            Showing {filtered.length} field{filtered.length !== 1 ? "s" : ""}
          </span>
          <span className="text-[11px] text-zinc-600 font-medium">
            {totalHiddenGems} hidden gems you probably haven't heard of
          </span>
        </div>

        {/* ── Empty state ─────────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-zinc-400 text-sm">No fields match your search.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ── Hidden Gems section ─────────────────────────────── */}
        {gems.length > 0 && (
          <div className="mb-10">
            <SectionDivider label="Hidden gems — explore these first" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gems.map((field) => (
                <FieldCard key={field.name} field={field} />
              ))}
            </div>
          </div>
        )}

        {/* ── Popular section ─────────────────────────────────── */}
        {popular.length > 0 && (
          <div>
            <SectionDivider label="Popular fields" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map((field) => (
                <FieldCard key={field.name} field={field} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
