"use client";

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    explore: [
      { label: "Career Paths", href: "#explore" },
      { label: "Hidden Gems", href: "#explore" },
      { label: "AI Diagnostic Quiz", href: "#quiz" },
      { label: "Verified Mentors", href: "#mentors" },
    ],
    resources: [
      { label: "Step-by-Step Roadmaps", href: "#roadmaps" },
      { label: "Student Success Stories", href: "#testimonials" },
      { label: "Community Discord", href: "#community" },
      { label: "Tech Blog", href: "#blog" },
    ],
    company: [
      { label: "About Pathfinder", href: "#about" },
      { label: "Careers", href: "#careers", badge: "Hiring" },
      { label: "Contact Support", href: "#contact" },
      { label: "Partners", href: "#partners" },
    ],
  };

  return (
    <footer className="border-t border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand section */}
          <div className="space-y-6">
            <a href="#" className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white transition-opacity hover:opacity-90">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span>Pathfinder</span>
            </a>
            <p className="max-w-xs text-sm leading-6 text-zinc-650 dark:text-zinc-400">
              Navigate your tech career with absolute confidence. Personalized AI career roadmaps, peer insights, and verified mentor calls.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {/* Twitter / X */}
              <a href="#" className="text-zinc-400 hover:text-zinc-550 dark:hover:text-zinc-300 transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a href="#" className="text-zinc-400 hover:text-zinc-550 dark:hover:text-zinc-300 transition-colors" aria-label="GitHub">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="text-zinc-400 hover:text-zinc-550 dark:hover:text-zinc-300 transition-colors" aria-label="LinkedIn">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white uppercase tracking-wider">
                Explore
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {links.explore.map((item, idx) => (
                  <li key={idx}>
                    <a href={item.href} className="text-sm text-zinc-550 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors duration-200">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white uppercase tracking-wider">
                Resources
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {links.resources.map((item, idx) => (
                  <li key={idx}>
                    <a href={item.href} className="text-sm text-zinc-550 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors duration-200">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white uppercase tracking-wider">
                Company
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {links.company.map((item, idx) => (
                  <li key={idx}>
                    <a href={item.href} className="text-sm text-zinc-550 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors duration-200 inline-flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-400/20">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Newsletter Signup Banner */}
        <div className="mt-16 border-t border-zinc-100 dark:border-zinc-900 pt-8 xl:flex xl:items-center xl:justify-between">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
              Subscribe to our developer newsletter
            </h3>
            <p className="mt-2 text-sm text-zinc-550 dark:text-zinc-400 max-w-md">
              The latest roadmaps, hidden tech gem discoveries, and career advice delivered straight to your inbox weekly.
            </p>
          </div>
          <form className="mt-6 sm:flex sm:max-w-md xl:mt-0 gap-3 w-full" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              name="email-address"
              id="email-address"
              required
              className="w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-550 dark:focus:border-indigo-500 transition-colors"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:bg-indigo-700 transition-all duration-200 sm:mt-0 sm:w-auto shrink-0 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Legal & Bottom bar */}
        <div className="mt-12 border-t border-zinc-100 dark:border-zinc-900 pt-8 md:flex md:items-center md:justify-between text-xs text-zinc-500 dark:text-zinc-450">
          <p className="md:order-1">
            &copy; {currentYear} Pathfinder. Built for modern tech developers and students.
          </p>
          <div className="mt-4 flex space-x-6 md:order-2 md:mt-0">
            <a href="#privacy" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
