import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingClient from "@/components/OnboardingClient";

export const metadata = {
  title: "Onboarding — Dishant",
  description: "Personalise your career path recommendations on Dishant.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if onboarding_complete is already true on the user's profile
  let onboardingComplete = false;
  try {
    const { data: profile, error } = await supabase
      .from("users")
      .select("onboarding_complete")
      .eq("id", user.id)
      .single();

    if (!error && profile?.onboarding_complete) {
      onboardingComplete = true;
    }
  } catch (err) {
    // If the profiles table doesn't exist yet or query fails, ignore and let them onboard
    console.error("Failed to query profiles table for onboarding check:", err);
  }

  if (onboardingComplete) {
    redirect("/dashboard");
  }

  return <OnboardingClient user={user} />;
}
