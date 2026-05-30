import React from "react";
import Link from "next/link";

export default function StudentStories() {
  const testimonials = [
    {
      quote: "I had no idea Embedded Systems existed. Now I have a clear roadmap and I know exactly what to build. Nobody in my college is doing this — I am already ahead.",
      initials: "RS",
      name: "Ravi S.",
      role: "1st year CS, UP",
    },
    {
      quote: "I am ECE and everyone told me to just do web dev. Dishant showed me the VLSI path and now I know I can target Qualcomm. That changed everything for me.",
      initials: "PN",
      name: "Priya N.",
      role: "2nd year ECE, Kerala",
    },
  ];

  return (
    <section id="testimonials" className="py-24 border-t border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Testimonials Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Student stories
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Real students, real paths found
          </p>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
            What students say after using Dishant
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12 mb-24">
          {testimonials.map((t, index) => (
            <div 
              key={index}
              className="flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-8 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all duration-300"
            >
              {/* Quote Icon & Text */}
              <div className="relative">
                <span className="absolute -top-4 -left-2 text-7xl font-serif text-zinc-200 dark:text-zinc-800 pointer-events-none select-none">
                  “
                </span>
                <p className="relative text-base italic leading-7 text-zinc-700 dark:text-zinc-300 z-10 pl-4">
                  {t.quote}
                </p>
              </div>

              {/* Author Card */}
              <div className="mt-8 flex items-center gap-x-4 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-extrabold text-sm text-white shadow-sm">
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mx-auto max-w-5xl relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-20 text-center shadow-xl sm:px-16 dark:bg-zinc-900/60 dark:border dark:border-zinc-800">
          {/* Radial Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          
          <h3 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl z-10">
            Your path is waiting. Start finding it.
          </h3>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-zinc-400 z-10">
            Free to explore. No credit card. Takes 10 minutes.
          </p>
          
          <div className="relative mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 z-10">
            <Link
              href="/explore"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 active:bg-indigo-700 transition-all duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Find my field
            </Link>
            <a 
              href="#signin" 
              className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors py-2"
            >
              Already have an account? <span className="underline">Sign in</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
