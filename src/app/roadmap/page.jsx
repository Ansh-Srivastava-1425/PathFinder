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

    if (!stepsError && stepsData && stepsData.length > 0) {
      roadmapSteps = stepsData;
    } else {
      // Roadmap steps do not exist in the DB, so we generate them via API
      const fieldSlug = userRow.chosen_field_id;
      const fieldName = fieldsData[fieldSlug]?.name || fieldSlug;
      
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || (process.env.PORT ? `localhost:${process.env.PORT}` : 'localhost:3000');
      const baseUrl = `${protocol}://${host}`;

      console.log(`Generating roadmap for ${fieldName} via ${baseUrl}/api/generate-roadmap`);
      
      const res = await fetch(`${baseUrl}/api/generate-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldName, fieldSlug })
      });
      
      const aiData = await res.json();
      
      if (aiData.steps && Array.isArray(aiData.steps)) {
        // Map to DB schema
        const insertData = aiData.steps.map((stepObj, index) => ({
          field_slug: fieldSlug,
          step_number: index + 1,
          name: stepObj.name,
          meta: stepObj.meta,
          requires_submission: stepObj.meta?.toLowerCase().includes('project') || false,
          resources: [],
          project_instructions: ""
        }));
        
        // Save to Supabase
        const { data: insertedData, error: insertError } = await supabase
          .from('roadmap_steps')
          .insert(insertData)
          .select();
          
        if (!insertError && insertedData) {
          roadmapSteps = insertedData.sort((a, b) => a.step_number - b.step_number);
        } else {
          console.error("Failed to insert generated steps:", insertError);
          roadmapSteps = insertData; // fallback to pass to UI anyway
        }
      }
    }
  } catch (err) {
    console.error("Error loading or generating roadmap steps:", err);
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
