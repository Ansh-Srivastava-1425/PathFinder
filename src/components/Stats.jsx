import React from "react";

export default function Stats() {
  const stats = [
    { value: "13", label: "Career fields" },
    { value: "Be among the first", label: "Join early" },
    { value: "10", label: "Min to clarity" },
  ];

  return (
    <section className="border-t border-zinc-200/80 bg-white py-12 dark:border-zinc-800/80 dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-12 gap-x-6 text-center sm:grid-cols-4 lg:gap-x-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center justify-center p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all duration-300"
            >
              <dd className="text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 sm:text-5xl group-hover:scale-105 transition-transform duration-200">
                {stat.value}
              </dd>
              <dt className="mt-2 text-sm font-medium leading-6 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-200">
                {stat.label}
              </dt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
