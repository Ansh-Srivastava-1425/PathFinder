"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/actions/auth";
import { submitWaitlist } from "@/actions/submitWaitlist";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  // Mentor Waitlist States
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorStatus, setMentorStatus] = useState(null); // null | 'success' | string (error message)
  const [mentorLoading, setMentorLoading] = useState(false);

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    if (!mentorEmail.trim()) return;
    setMentorLoading(true);
    setMentorStatus(null);
    try {
      const res = await submitWaitlist({ email: mentorEmail, source: 'mentor' });
      if (res.success) {
        setMentorStatus('success');
        setMentorEmail('');
      } else {
        setMentorStatus(res.error || 'Failed to join waitlist.');
      }
    } catch (err) {
      setMentorStatus('An unexpected error occurred.');
    } finally {
      setMentorLoading(false);
    }
  };

  // Auth States
  const [user, setUser] = useState(null);
  const [userRow, setUserRow] = useState(null);
  const [loading, setLoading] = useState(false);

  const isExplore = pathname === "/explore";

  useEffect(() => {
    const supabase = createClient();

    // Fetch initial user session
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        setUser(user);
        if (user) {
          const { data } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", user.id)
            .single();
          setUserRow(data);
        }
      } catch (err) {
        console.error("Error fetching user in Navbar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        try {
          const { data } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", session.user.id)
            .single();
          setUserRow(data);
        } catch (err) {
          console.error("Error refetching profile on auth change:", err);
        }
      } else {
        setUser(null);
        setUserRow(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (isMobileDropdownOpen && mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isMobileDropdownOpen]);

  const getInitials = () => {
    if (userRow?.full_name) {
      const parts = userRow.full_name.trim().split(/\s+/);
      if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "?";
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsMobileDropdownOpen(false);
    setIsOpen(false);
    await logout();
  };

  const handleDesktopToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleMobileToggle = () => {
    setIsMobileDropdownOpen((prev) => !prev);
  };

  return (
    <>
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
              <span>PathFinder</span>
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
              href="/explore"
              className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Roadmaps
            </Link>
            <Link
              href="/mentors"
              className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Talk to a mentor
            </Link>
          </nav>

          {/* Desktop Profile / Signin Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!loading && !user && (
              <Link
                href="/auth/signup"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-sm shadow-indigo-600/10 hover:shadow-md hover:shadow-indigo-600/20 transition-all duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Get Started
              </Link>
            )}

            {loading ? (
              <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800/60 animate-pulse border border-zinc-200/50 dark:border-zinc-800/50" />
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={handleDesktopToggle}
                  className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border shadow-sm select-none transition-colors duration-200 ${
                    user
                      ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs tracking-wider"
                      : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 text-zinc-550 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  {user ? (
                    getInitials()
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900 animate-in fade-in slide-in-from-top-2 duration-150">
                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          Profile settings
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left block rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          Log in
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button / Actions */}
          <div className="flex md:hidden items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800/60 animate-pulse border border-zinc-200/50 dark:border-zinc-800/50" />
            ) : (
              <div className="relative" ref={mobileDropdownRef}>
                <button
                  type="button"
                  onClick={handleMobileToggle}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center select-none shadow-sm transition-colors duration-200 ${
                    user
                      ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] tracking-wide"
                      : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-850 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  {user ? (
                    getInitials()
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  )}
                </button>

                {isMobileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900 animate-in fade-in slide-in-from-top-2 duration-150">
                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileDropdownOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsMobileDropdownOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          Profile settings
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left block rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          onClick={() => setIsMobileDropdownOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          Log in
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsMobileDropdownOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
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
              href="/explore"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400 transition-colors"
            >
              Roadmaps
            </Link>
            <Link
              href="/mentors"
              onClick={() => setIsOpen(false)}
              className="text-left rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400 transition-colors"
            >
              Talk to a mentor
            </Link>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              {loading ? (
                <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-800 font-extrabold text-[10px] tracking-wide flex items-center justify-center">
                      {getInitials()}
                    </div>
                    <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 truncate">
                      {userRow?.full_name || user?.email}
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400 transition-colors"
                  >
                    Profile settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-500 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  >
                    Get Started
                  </Link>
                  <div className="flex justify-between gap-2 text-center">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
      {/* Mentor Waitlist Modal */}
      {isMentorModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative">
            <button
              onClick={() => { setIsMentorModalOpen(false); setMentorStatus(null); setMentorEmail(''); }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Coming soon</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  We&apos;re onboarding verified mentors. Drop your email to be notified when this launches.
                </p>
              </div>

              {mentorStatus === 'success' ? (
                <p className="text-sm font-semibold text-emerald-400">You&apos;re on the list!</p>
              ) : (
                <form onSubmit={handleMentorSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={mentorEmail}
                    onChange={(e) => setMentorEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                  {mentorStatus && mentorStatus !== 'success' && (
                    <p className="text-xs text-red-400">{mentorStatus}</p>
                  )}
                  <button
                    type="submit"
                    disabled={mentorLoading}
                    className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {mentorLoading ? 'Saving...' : 'Notify me'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}