import React from "react";

export default function ProblemSection() {
  const problems = [
    {
      title: "Herd mentality",
      description: "Senior does web dev, junior follows, their junior follows. Nobody questions it.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 text-red-500 dark:text-red-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
    },
    {
      title: "Hidden fields",
      description: "Robotics, VLSI, Bioinformatics — nobody told you these exist and pay well.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 text-red-500 dark:text-red-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
      ),
    },
    {
      title: "No roadmap",
      description: "Even if you find a field, nobody shows you how to get there step by step.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 text-red-500 dark:text-red-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8m-9-3.75h.008v.008H6V11.25Zm.008 4.5H6v.008h.008V15.75Zm9.75-4.5h.008v.008h-.008V11.25Zm.008 4.5h-.008v.008h.008V15.75Z M2.25 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75S17.385 2.25 12 2.25 2.25 6.585 2.25 12Z"
          />
        </svg>
      ),
    },
    {
      title: "Too late realisation",
      description: "You figure out the wrong path in 3rd year. Internship season is already here.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 text-red-500 dark:text-red-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="problem" className="py-24 bg-zinc-50 dark:bg-zinc-900/10 border-t border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Why students end up in the wrong field
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Three reasons most students waste their first two years
          </p>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
            Actually, there are four critical traps that hold back aspiring developers. Here is how they happen:
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="group relative flex gap-6 rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/40 hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300"
              >
                {/* Icon wrapper with a warm red background glow on hover */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 group-hover:bg-red-100 dark:group-hover:bg-red-950/60 transition-colors duration-200">
                  {problem.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {problem.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                    {problem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
