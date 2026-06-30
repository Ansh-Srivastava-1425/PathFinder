import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";

export const metadata = {
  title: "Dashboard — Dishant",
  description: "Your personalised engineering career path dashboard.",
  openGraph: {
    title: "Dashboard — Dishant",
    description: "Your personalised engineering career path dashboard.",
    siteName: "Dishant",
  },
};

export default async function DashboardPage() {
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

  // Fetch user's progress rows server-side so DashboardClient starts with real data
  const { data: userProgress, error: progressError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', authUser.id);

  if (progressError) {
    console.error("[/dashboard] Error loading user progress:", progressError);
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[50vh] bg-zinc-50 dark:bg-zinc-950">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900/50 text-center max-w-md">
          <p className="font-bold mb-1">Error Loading Progress</p>
          <p className="text-sm opacity-90">Something went wrong loading your progress. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  // Fetch all roadmap steps for the user's chosen field from DB
  let roadmapSteps = [];
  try {
    const { data: stepsData, error: stepsError } = await supabase
      .from('roadmap_steps')
      .select('*')
      .eq('field_slug', userRow.chosen_field_id)
      .order('step_number', { ascending: true });

    if (!stepsError && stepsData) {
      roadmapSteps = stepsData;
    }
  } catch (err) {
    console.error("Error loading roadmap steps database rows:", err);
  }

  return (
    <DashboardClient
      user={userRow}
      userId={authUser.id}
      userProgress={userProgress || []}
      roadmapSteps={roadmapSteps}
    />
  );
}
