import React from "react";
import Hero from "@/components/Hero";
import ExploreSection from "@/components/ExploreSection";
import Stats from "@/components/Stats";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import StudentStories from "@/components/StudentStories";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Stats />

      {/* Problem Section */}
      <ProblemSection />

      {/* Explore Section */}
      <ExploreSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Student Stories Section */}
      <StudentStories />

      {/* Footer */}
      <Footer />
    </div>
  );
}
