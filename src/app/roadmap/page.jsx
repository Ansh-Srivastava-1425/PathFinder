import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RoadmapClient from "./RoadmapClient";
import { fieldsData } from "@/data/fieldsData";

export const metadata = {
  title: "Roadmap — Dishant",
  description: "Your detailed field roadmap.",
  openGraph: {
    title: "Roadmap — Dishant",
    description: "Your detailed field roadmap.",
    siteName: "Dishant",
  },
};

export default async function RoadmapPage() {
  const supabase = await createClient();
  
  // Get current authenticated user session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const authUser = session?.user;

  // If not logged in, redirect to login page
  if (!authUser) {
    redirect("/auth/login");
  }

  // Fetch the user's row from public.users
  let userRow = null;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (!error) {
      userRow = data;
    }
  } catch (err) {
    console.error("Error loading user profile database row:", err);
  }

  // If logged in but onboarding_complete is false (or row not found), redirect to onboarding
  if (!userRow || !userRow.onboarding_complete) {
    redirect("/onboarding");
  }

  // Fetch user's progress rows server-side
  const { data: userProgress, error: progressError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', authUser.id);

  if (progressError) {
    console.error("[/roadmap] Error loading user progress:", progressError);
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-6 rounded-2xl text-center max-w-sm">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p className="text-sm opacity-90">Something went wrong loading your progress. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  // Load roadmap steps directly from static fieldsData
  const fieldSlug = userRow.chosen_field_id;
  const fieldData = fieldsData[fieldSlug];
  
  if (!fieldData || !fieldData.roadmap || fieldData.roadmap.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl text-center max-w-md shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="font-bold text-xl text-zinc-900 dark:text-white mb-2">Roadmap coming soon</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">We are currently curating the high-quality roadmap for this field. Please check back later.</p>
        </div>
      </div>
    );
  }

  // Map the static roadmap array to match the structure expected by RoadmapClient
  // (We add requires_submission property based on the 'meta' string)
  const roadmapSteps = fieldData.roadmap.map((step, index) => ({
    ...step,
    id: step.step,
    step_number: index + 1,
    requires_submission: step.meta?.toLowerCase().includes('project') || false,
  }));

  return (
    <RoadmapClient
      user={userRow}
      userId={authUser.id}
      userProgress={userProgress || []}
      roadmapSteps={roadmapSteps}
    />
  );
}
