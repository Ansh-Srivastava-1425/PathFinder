"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isExplore = pathname === "/explore";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white transition-opacity hover:opacity-90">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-pulse"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span>Pathfinder</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/explore"
              className={`text-sm transition-colors duration-200 ${
                isExplore
                  ? "font-semibold text-indigo-600 dark:text-indigo-400"
                  : "font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
              }`}
            >
              Explore
            </Link>
            <Link
              href="/#roadmaps"
              className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Roadmaps
            </Link>
            <Link
              href="/#mentors"
              className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Mentors
            </Link>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/#get-started"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-sm shadow-indigo-600/10 hover:shadow-md hover:shadow-indigo-600/20 transition-all duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in slide-in-from-top-4 duration-200" id="mobile-menu">
          <div className="space-y-3 flex flex-col">
            <Link
              href="/explore"
              onClick={() => setIsOpen(false)}
              className={`rounded-md px-3 py-2 text-base transition-colors ${
                isExplore
                  ? "font-semibold text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/30"
                  : "font-medium text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400"
              }`}
            >
              Explore
            </Link>
            <Link
              href="/#roadmaps"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400 transition-colors"
            >
              Roadmaps
            </Link>
            <Link
              href="/#mentors"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400 transition-colors"
            >
              Mentors
            </Link>
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href="/#get-started"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-500 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

