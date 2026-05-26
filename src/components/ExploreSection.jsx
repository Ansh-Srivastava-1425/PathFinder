"use client";

import React, { useRef, useState, useEffect } from "react";

export default function ExploreSection() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const fields = [
    {
      emoji: "🤖",
      title: "Robotics",
      status: "Hidden gem",
      description: "Build the hardware and software brains of tomorrow's machines and autonomous systems.",
    },
    {
      emoji: "🔬",
      title: "Bioinformatics",
      status: "Hidden gem",
      description: "Combine biology and computer science to decode genomes and accelerate medical breakthroughs.",
    },
    {
      emoji: "👁️",
      title: "Computer Vision",
      status: "Hidden gem",
      description: "Teach computers to see, understand, and navigate the physical world using deep learning.",
    },
    {
      emoji: "🛰️",
      title: "Space Technology",
      status: "Hidden gem",
      description: "Develop software for orbit analysis, telemetry, rocket engines, and deep-space missions.",
    },
    {
      emoji: "🔒",
      title: "Cybersecurity",
      status: "Popular",
      description: "Secure digital infrastructure, defend networks, and hunt vulnerabilities from attackers.",
    },
    {
      emoji: "🌐",
      title: "Web Development",
      status: "Popular",
      description: "Build fast, scalable websites and web apps that connect billions of users worldwide.",
    },
    {
      emoji: "⚙️",
      title: "Embedded Systems",
      status: "Hidden gem",
      description: "Program microcontrollers, sensors, and hardware that drive smart devices and IoT.",
    },
    {
      emoji: "🧠",
      title: "AI / ML",
      status: "Popular",
      description: "Train large-scale models, build neural nets, and implement smart automation systems.",
    },
  ];

  // Auto scroll effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const cardWidth = 320; // approximate width of one card (including gap)
        
        // If we are at the end, reset to beginning, otherwise scroll forward
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          scrollRef.current.scrollTo({
            left: scrollLeft + cardWidth,
            behavior: "smooth",
          });
        }
      }
    }, 2000); // Auto-scroll every 2.0 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction) => {
    // Briefly pause auto-scrolling when user manually clicks navigation controls
    setIsPaused(true);
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = 320;
      const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
    // Resume auto-scroll after 5 seconds of inactivity
    const timeout = setTimeout(() => setIsPaused(false), 5000);
    return () => clearTimeout(timeout);
  };

  return (
    <section id="explore" className="py-24 border-t border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950 transition-colors duration-300 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Explore Fields
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Choose your domain
            </p>
            <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
              Compare popular standard career paths against lucrative hidden gems that most students miss.
            </p>
          </div>
          
          {/* Navigation Arrows for Carousel */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              onClick={() => scroll("left")}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer active:scale-95"
              aria-label="Scroll left"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300 dark:hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer active:scale-95"
              aria-label="Scroll right"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Container Wrapper with edge gradient masks */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Edge Fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent dark:from-zinc-950 hidden md:block" />
          
          {/* Right Edge Fade */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent dark:from-zinc-950 hidden md:block" />

          {/* Horizontal Scroller */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            {fields.map((field, index) => {
              const isHiddenGem = field.status === "Hidden gem";
              return (
                <div
                  key={index}
                  className={`flex flex-col justify-between rounded-2xl border bg-zinc-50/50 p-6 dark:bg-zinc-900/20 hover:shadow-md transition-all duration-300 hover:-translate-y-1 w-[285px] sm:w-[320px] shrink-0 snap-start ${
                    isHiddenGem
                      ? "border-zinc-200/60 dark:border-zinc-800/60 hover:border-amber-400 dark:hover:border-amber-500/50"
                      : "border-zinc-200/60 dark:border-zinc-800/60 hover:border-indigo-500 dark:hover:border-indigo-500/50"
                  }`}
                >
                  <div>
                    {/* Header: Emoji & Status Tag */}
                    <div className="flex items-center justify-between">
                      <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200" role="img" aria-label={field.title}>
                        {field.emoji}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
                          isHiddenGem
                            ? "bg-amber-50 text-amber-800 border border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/30"
                            : "bg-indigo-50 text-indigo-800 border border-indigo-200/50 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900/30"
                        }`}
                      >
                        {field.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {field.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400 h-[72px] overflow-hidden">
                      {field.description}
                    </p>
                  </div>

                  {/* CTA link in card */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                    <a
                      href={`#roadmaps?field=${encodeURIComponent(field.title.toLowerCase())}`}
                      className="inline-flex items-center text-xs font-semibold text-zinc-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors"
                    >
                      View roadmap <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
