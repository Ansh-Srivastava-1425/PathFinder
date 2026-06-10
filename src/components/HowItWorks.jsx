import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Explore fields",
      description: "Browse 13 career fields. See what each one actually involves.",
    },
    {
      number: "2",
      title: "Take the quiz",
      description: "12 quick questions. AI recommends the best fields for you personally.",
    },
    {
      number: "3",
      title: "Get your roadmap",
      description: "Step-by-step plan from where you are to job-ready.",
    },
    {
      number: "4",
      title: "Talk to a mentor",
      description: "Book a 30-min call with someone actually working in your field.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 border-t border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-950/20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            How it works
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            From confused to clear in 4 steps
          </p>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
            Takes less than 10 minutes to find your path
          </p>
        </div>

        {/* Steps Layout */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="group relative flex flex-col items-center text-center bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300"
              >
                {/* Number Badge */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-600/20 group-hover:scale-110 group-hover:bg-indigo-500 transition-all duration-200 dark:bg-indigo-500 dark:group-hover:bg-indigo-400">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </p>

                {/* Connecting Chevron Arrow (Desktop only, between cards) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-4 -translate-y-1/2 translate-x-1/2 z-10 hidden lg:block text-zinc-300 dark:text-zinc-700">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="2.5" 
                      stroke="currentColor" 
                      className="h-6 w-6 animate-pulse"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
