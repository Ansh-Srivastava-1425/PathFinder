import React from "react";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import ExploreClient from "@/components/ExploreClient";

export const metadata = {
  title: "Explore Fields - PathFinder",
  description: "Explore diverse domains, compare popular careers against hidden gems, and plan your journey.",
  openGraph: {
    title: "Explore Fields - PathFinder",
    description: "Explore diverse domains, compare popular careers against hidden gems, and plan your journey.",
    siteName: "PathFinder",
  },
};

export default function ExplorePage() {
  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white">
      {/* Page Header */}
      <PageHeader
        title="Explore tech fields"
        subtitle="13 career fields — including the ones nobody talks about. Find yours."
      />

      {/* Interactive Main Area */}
      <ExploreClient />

      {/* Footer */}
      <Footer />
    </div>
  );
}
