import React from "react";
import { notFound } from "next/navigation";
import { fieldsData } from "@/data/fieldsData";
import FieldDetailClient from "@/components/FieldDetailClient";

export async function generateStaticParams() {
  return Object.keys(fieldsData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const field = fieldsData[slug];
  if (!field) {
    return {
      title: "Field Not Found - PathFinder",
      openGraph: {
        title: "Field Not Found - PathFinder",
        siteName: "PathFinder",
      },
    };
  }
  return {
    title: `${field.name} Roadmap & Career Guide - PathFinder`,
    description: `Explore the ${field.name} career path in India. Salary range: ${field.stats.entrySalary} to ${field.stats.seniorSalary}. Discover skills, projects, companies, and guidance.`,
    openGraph: {
      title: `${field.name} Roadmap & Career Guide - PathFinder`,
      description: `Explore the ${field.name} career path in India. Salary range: ${field.stats.entrySalary} to ${field.stats.seniorSalary}. Discover skills, projects, companies, and guidance.`,
      siteName: "PathFinder",
    },
  };
}

export default async function FieldDetailPage({ params }) {
  const { slug } = await params;
  const field = fieldsData[slug];

  if (!field) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white min-h-screen">
      <FieldDetailClient field={field} slug={slug} />
    </div>
  );
}
