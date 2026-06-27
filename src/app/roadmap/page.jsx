import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RoadmapClient from "./RoadmapClient";

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
    data: { user: authUser },
  } = await supabase.auth.getUser();

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
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', authUser.id);

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
    <RoadmapClient
      user={userRow}
      userId={authUser.id}
      userProgress={userProgress || []}
      roadmapSteps={roadmapSteps}
    />
  );
}
