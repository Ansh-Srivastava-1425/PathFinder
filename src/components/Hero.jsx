import React from "react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden flex flex-col justify-center min-h-[calc(100vh-4rem)] py-16 sm:py-24">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500 to-violet-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
            Navigate your tech career with <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">Pathfinder</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Stop guessing. Follow proven, community-vetted career roadmaps, discover fields that match your interests, and get guided by world-class mentors.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#get-started"
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:bg-indigo-700 transition-all duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Get Started
            </a>
            <a href="#explore" className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Explore Fields <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Background Gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-violet-500 to-indigo-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  );
}
