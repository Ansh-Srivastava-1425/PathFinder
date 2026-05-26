"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function FieldDetailClient({ field, slug }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", branch: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
      setFormData({ name: "", email: "", branch: "" });
    }, 2000);
  };

  // Theme maps for company cards
  const companyThemeClasses = {
    purple: "bg-purple-950/40 text-purple-400 border border-purple-900/30",
    green: "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30",
    warm: "bg-amber-950/40 text-yellow-400 border border-amber-900/30",
    blue: "bg-blue-950/40 text-blue-400 border border-blue-900/30",
  };

  // Avatar colors for students section
  const avatarThemeClasses = {
    indigo: "bg-indigo-950/50 text-indigo-300 border border-indigo-900/40",
    pink: "bg-pink-950/50 text-pink-300 border border-pink-900/40",
    emerald: "bg-emerald-950/50 text-emerald-300 border border-emerald-900/40",
    amber: "bg-amber-950/50 text-yellow-300 border border-amber-900/40",
    sky: "bg-sky-950/50 text-sky-300 border border-sky-900/40",
    violet: "bg-violet-950/50 text-violet-300 border border-violet-900/40",
    cyan: "bg-cyan-950/50 text-cyan-300 border border-cyan-900/40",
    teal: "bg-teal-950/50 text-teal-300 border border-teal-900/40",
    orange: "bg-orange-950/50 text-orange-300 border border-orange-900/40",
    yellow: "bg-yellow-950/50 text-yellow-300 border border-yellow-900/40",
    purple: "bg-purple-950/50 text-purple-300 border border-purple-900/40",
    blue: "bg-blue-950/50 text-blue-300 border border-blue-900/40",
  };

  return (
    <div className="relative w-full bg-zinc-950 text-zinc-100 pb-28 font-sans antialiased">
      
      {/* ── 1. Breadcrumb ─────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            Home
          </Link>
          <svg className="h-2.5 w-2.5 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/explore" className="hover:text-zinc-300 transition-colors">
            Explore
          </Link>
          <svg className="h-2.5 w-2.5 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-zinc-400 select-none">{field.name}</span>
        </nav>
      </div>

      {/* ── 2. Hero Section ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-10 border-b border-zinc-900/40">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Emoji */}
          <div className="text-5xl md:text-6xl flex-shrink-0 select-none pt-1">
            {field.emoji}
          </div>

          {/* Name, Tagline & Badges */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
              {field.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed font-normal">
              {field.tagline}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center rounded-md bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-emerald-400 border border-emerald-900/40">
                🛡️ {field.badges.safety}
              </span>
              <span className="inline-flex items-center rounded-md bg-amber-950/60 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-yellow-400 border border-amber-900/40">
                ⚙️ {field.badges.difficulty}
              </span>
              {field.badges.isGem && (
                <span className="inline-flex items-center rounded-md bg-violet-950/60 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-violet-400 border border-violet-900/40">
                  ✦ Hidden Gem
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Start my roadmap
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-transparent px-5 py-3 text-sm font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Talk to a mentor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Quick Stats Bar ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-8 border-b border-zinc-900/40">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="rounded-xl border border-zinc-900/80 bg-zinc-900/30 p-4">
            <span className="block text-[10px] font-bold tracking-wider uppercase text-zinc-500">
              Entry Salary
            </span>
            <span className="block mt-1 text-base sm:text-lg font-bold text-white">
              {field.stats.entrySalary}
            </span>
          </div>

          <div className="rounded-xl border border-zinc-900/80 bg-zinc-900/30 p-4">
            <span className="block text-[10px] font-bold tracking-wider uppercase text-zinc-500">
              Senior Salary
            </span>
            <span className="block mt-1 text-base sm:text-lg font-bold text-emerald-400">
              {field.stats.seniorSalary}
            </span>
          </div>

          <div className="rounded-xl border border-zinc-900/80 bg-zinc-900/30 p-4">
            <span className="block text-[10px] font-bold tracking-wider uppercase text-zinc-500">
              Future Safety
            </span>
            <span className="block mt-1 text-base sm:text-lg font-bold text-emerald-400 text-ellipsis overflow-hidden">
              {field.stats.futureSafety}
            </span>
          </div>

          <div className="rounded-xl border border-zinc-900/80 bg-zinc-900/30 p-4">
            <span className="block text-[10px] font-bold tracking-wider uppercase text-zinc-500">
              Best Branch
            </span>
            <span className="block mt-1 text-base sm:text-lg font-bold text-white">
              {field.stats.bestBranch}
            </span>
          </div>

          <div className="rounded-xl border border-zinc-900/80 bg-zinc-900/30 p-4 col-span-2 md:col-span-1">
            <span className="block text-[10px] font-bold tracking-wider uppercase text-zinc-500">
              Time to Job-Ready
            </span>
            <span className="block mt-1 text-base sm:text-lg font-bold text-yellow-400">
              {field.stats.timeToJobReady}
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. What Is This Field Section ────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 border-b border-zinc-900/40">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            What is this field?
          </h2>
        </div>
        <div className="max-w-4xl text-sm sm:text-base text-zinc-300 leading-[1.8] font-normal space-y-4">
          <p>{field.description}</p>
        </div>
      </section>

      {/* ── 5. What You Will Actually Build Section ────────────── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 border-b border-zinc-900/40">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            What you will actually build
          </h2>
        </div>
        <p className="text-xs text-zinc-500 mt-1 mb-6">
          Real projects, not toy examples.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {field.projects.map((proj, idx) => (
            <div key={idx} className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5 flex flex-col justify-between col-span-2 md:col-span-1">
              <div>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${
                  proj.badge === "Beginner"
                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40"
                    : proj.badge === "Intermediate"
                    ? "bg-amber-950/60 text-yellow-400 border border-amber-900/40"
                    : "bg-red-950/60 text-red-400 border border-red-900/40"
                }`}>
                  {proj.badge}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-white leading-snug">
                  {proj.name}
                </h3>
                <p className="mt-2 text-xs leading-[1.6] text-zinc-400">
                  {proj.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Companies You Can Target Section ──────────────── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 border-b border-zinc-900/40">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Companies you can target
          </h2>
        </div>
        <p className="text-xs text-zinc-500 mt-1 mb-6">
          From defense forces and public labs to fast-scaling unicorns.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {field.companies.map((company, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-xl border border-zinc-900 bg-zinc-900/20 p-4 col-span-2 sm:col-span-1">
              <div className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg text-xs font-bold uppercase select-none ${
                companyThemeClasses[company.theme] || companyThemeClasses.blue
              }`}>
                {company.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                  {company.name}
                </h4>
                <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider truncate">
                  {company.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Salary in India Section ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 border-b border-zinc-900/40">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-6 4h6m-6 4h3.5A2.5 2.5 0 0015 13.5v0A2.5 2.5 0 0012.5 11H9m0 0V5m0 6L14 18" />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Salary in India
          </h2>
        </div>
        <p className="text-xs text-zinc-500 mt-1 mb-8">
          Relative salary progression across career levels.
        </p>

        <div className="space-y-4 max-w-3xl">
          {field.salaries.map((sal, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-24 sm:w-32 text-xs sm:text-sm text-zinc-400 font-semibold truncate">
                {sal.level}
              </div>
              <div className="flex-1 h-3 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${sal.ratio}%` }}
                />
              </div>
              <div className="w-28 sm:w-36 text-right text-xs sm:text-sm text-white font-semibold">
                {sal.amount}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Future Safety Verdict Box ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 border-b border-zinc-900/40">
        <div className="flex items-center gap-2 mb-6">
          <svg className="h-5 w-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Is this field future safe?
          </h2>
        </div>

        <div className="rounded-xl border border-emerald-800/30 bg-emerald-950/10 p-5 flex gap-4 items-start max-w-4xl">
          <svg className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-emerald-400 leading-none">
              {field.futureVerdict.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-[1.7]">
              {field.futureVerdict.text}
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. Real People Who Made It Section ───────────────── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 border-b border-zinc-900/40">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Real people who made it
          </h2>
        </div>
        <p className="text-xs text-zinc-500 mt-1 mb-6">
          Career paths from India — no IIT required.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field.people.map((person, idx) => (
            <div key={idx} className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold uppercase select-none ${
                  avatarThemeClasses[person.avatarTheme] || avatarThemeClasses.indigo
                }`}>
                  {person.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                    {person.transformation}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-semibold truncate uppercase tracking-wider">
                    {person.role}
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-zinc-400 font-normal">
                "{person.story}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. Roadmap Preview Section ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Roadmap preview
          </h2>
        </div>
        <p className="text-xs text-zinc-500 mt-1 mb-8">
          Sign up to unlock the complete structured learning journey.
        </p>

        {/* Vertical Timeline */}
        <div className="relative border-l border-zinc-800 ml-4 pl-6 space-y-8 max-w-xl">
          {field.roadmap.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Bullet node */}
              <span className={`absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full ring-4 ring-zinc-950 ${
                step.locked
                  ? "bg-zinc-800 text-zinc-500"
                  : "bg-indigo-600 text-white"
              }`}>
                {step.locked ? (
                  <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>

              {/* Text content */}
              <div className={step.locked ? "opacity-35 select-none" : ""}>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {step.step}
                </h4>
                <h3 className="text-sm font-semibold text-white mt-0.5">
                  {step.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {step.meta}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Unlock Box */}
        <div className="mt-10 rounded-xl border border-indigo-500/40 bg-zinc-900/20 p-6 max-w-xl text-center">
          <h4 className="text-sm font-bold text-white">
            Unlock the complete learning path
          </h4>
          <p className="text-xs text-zinc-400 mt-1.5 mb-4 leading-relaxed">
            Gain full access to all remaining steps, video tutorials, downloadable reference sheets, and interactive assignments.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-bold text-white transition-colors cursor-pointer"
          >
            Unlock full roadmap — free
          </button>
        </div>
      </section>

      {/* ── 11. Sticky CTA Bar ───────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900/80 py-4 z-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white">
              {field.name}
            </h4>
            <p className="text-[10px] sm:text-xs text-zinc-500">
              Free to start — no credit card needed.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-colors flex-shrink-0 cursor-pointer text-center"
          >
            Start my roadmap
          </button>
        </div>
      </div>

      {/* ── Sign-up Modal ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {isSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-white">
                  Welcome to Pathfinder!
                </h3>
                <p className="text-xs text-zinc-400">
                  Unlocking your roadmap. One second...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Unlock all {field.name} content
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Get access to the full roadmap, resources, and mentor connects.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold tracking-wider uppercase text-zinc-500 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold tracking-wider uppercase text-zinc-500 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@college.edu.in"
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold tracking-wider uppercase text-zinc-500 mb-1">
                      Engineering Branch
                    </label>
                    <input
                      type="text"
                      name="branch"
                      required
                      value={formData.branch}
                      onChange={handleInputChange}
                      placeholder="e.g. ECE / Mech / CSE"
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-bold text-white transition-colors pt-2 cursor-pointer"
                  >
                    Unlock roadmap for free
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
