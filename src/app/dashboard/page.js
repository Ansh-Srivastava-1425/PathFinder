import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";

export const metadata = {
  title: "Dashboard — PathFinder",
  description: "Your personalised engineering career path dashboard.",
  openGraph: {
    title: "Dashboard — PathFinder",
    description: "Your personalised engineering career path dashboard.",
    siteName: "PathFinder",
  },
};

export default async function DashboardPage() {
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

  // Fetch user's progress rows server-side so DashboardClient starts with real data
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', authUser.id);

  return (
    <DashboardClient
      user={userRow}
      userId={authUser.id}
      userProgress={userProgress || []}
    />
  );
}
