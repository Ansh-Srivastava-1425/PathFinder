import React from "react";

export default function PageHeader({ title, subtitle }) {
  return (
    <section className="pt-16 pb-8 border-b border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-base text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
