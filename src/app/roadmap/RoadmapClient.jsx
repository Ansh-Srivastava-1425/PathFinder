"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { fieldsData } from "@/data/fieldsData";
import { updateStepProgress } from "@/actions/progress";

export default function RoadmapClient({ user, userId, userProgress = [], roadmapSteps = [] }) {
  const chosenFieldId = user?.chosen_field_id;
  const field = chosenFieldId ? fieldsData[chosenFieldId] : null;

  // Local state for optimistic updates
  const [progressData, setProgressData] = useState(userProgress);
  const [recentlyCompletedStepId, setRecentlyCompletedStepId] = useState(null);
  
  // State for Github submission URL inputs
  const [submissionUrls, setSubmissionUrls] = useState({});
  const [loadingSteps, setLoadingSteps] = useState({});

  const handleUrlChange = (stepId, value) => {
    setSubmissionUrls((prev) => ({ ...prev, [stepId]: value }));
  };

  const handleMarkComplete = async (stepId, requiresSubmission) => {
    if (loadingSteps[stepId]) return;
    
    const submissionUrl = submissionUrls[stepId] || "";
    
    if (requiresSubmission && !submissionUrl.trim()) {
      alert("Please provide a GitHub submission URL before completing this step.");
      return;
    }

    setLoadingSteps((prev) => ({ ...prev, [stepId]: true }));
    
    // Optimistic UI update
    setRecentlyCompletedStepId(stepId);
    setTimeout(() => {
      setRecentlyCompletedStepId(null);
    }, 1500);

    setProgressData((prev) => {
      const exists = prev.find((r) => r.roadmap_step_id === stepId);
      if (exists) {
        return prev.map((r) =>
          r.roadmap_step_id === stepId
            ? { ...r, status: "completed", completed_at: new Date().toISOString(), personal_note: submissionUrl }
            : r
        );
      }
      return [
        ...prev,
        {
          user_id: userId,
          field_slug: chosenFieldId,
          roadmap_step_id: stepId,
          status: "completed",
          completed_at: new Date().toISOString(),
          personal_note: submissionUrl,
        },
      ];
    });

    try {
      await updateStepProgress(userId, chosenFieldId, stepId, "completed", submissionUrl);
    } catch (error) {
      console.error("Failed to update progress on server", error);
      // Revert optimistic update if needed (left out for simplicity, matching DashboardClient pattern)
    } finally {
      setLoadingSteps((prev) => ({ ...prev, [stepId]: false }));
    }
  };

  if (!field) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-zinc-500">Field data not found.</p>
      </div>
    );
  }

  // Calculate overall progress
  const totalSteps = field.roadmap?.length || 0;
  const completedStepsCount = progressData.filter((r) => r.status === "completed").length;
  const progressPercent = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900/30 dark:selection:text-indigo-200">
      {/* 1. Header with Progress Bar */}
      <header className="sticky top-[64px] z-40 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 pt-8 pb-6 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href="/dashboard" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                <span className="text-4xl" aria-hidden="true">{field.emoji}</span>
                {field.name} Roadmap
              </h1>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Progress</span>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{progressPercent}%</div>
            </div>
          </div>
          
          <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
            <div
              className="absolute left-0 top-0 h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 2. Roadmap Steps */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-10 space-y-8 relative">
        <div className="absolute left-9 sm:left-11 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
        
        {field.roadmap?.map((stepItem, index) => {
          const stepId = stepItem.id || stepItem.name;
          const dbStep = roadmapSteps.find((s) => s.step_number === index + 1);
          
          const progressRow = progressData.find((r) => r.roadmap_step_id === stepId);
          const isCompleted = progressRow?.status === "completed";
          const isRecentlyCompleted = recentlyCompletedStepId === stepId;
          const submittedUrl = progressRow?.personal_note || "";
          
          // Determine status for UI
          let statusText = "Not Started ⭕";
          let statusColor = "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50";
          let stepMarkerColor = "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600";
          
          if (isCompleted) {
            statusText = "Completed ✅";
            statusColor = "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30";
            stepMarkerColor = "border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/20";
          } else if (index === completedStepsCount) {
            statusText = "In Progress 🔵";
            statusColor = "text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30";
            stepMarkerColor = "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-indigo-500/10";
          }

          const requiresSubmission = dbStep?.requires_submission || false;

          return (
            <div key={stepId} className="relative z-10 flex gap-4 sm:gap-6 group">
              
              {/* Step Marker line connector */}
              <div className="hidden sm:flex flex-col items-center mt-6">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-300 ${stepMarkerColor}`}>
                  {isCompleted ? "✓" : index + 1}
                </div>
              </div>

              {/* Step Card */}
              <div className={`flex-1 rounded-2xl border p-6 transition-all duration-300 ${
                isCompleted 
                  ? "bg-white/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 opacity-75 hover:opacity-100" 
                  : index === completedStepsCount
                    ? "bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-900/50 shadow-md shadow-indigo-900/5 ring-1 ring-indigo-50 dark:ring-indigo-900/20"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md"
              } ${isRecentlyCompleted ? "scale-[1.01] shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500 transition-transform" : ""}`}>
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="sm:hidden text-xs font-bold text-zinc-400 dark:text-zinc-500">STEP {index + 1}</span>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {stepItem.name}
                      </h3>
                    </div>
                    {stepItem.meta && (
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        ⏱️ Estimated time: {stepItem.meta}
                      </p>
                    )}
                  </div>
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto ${statusColor}`}>
                    {statusText}
                  </div>
                </div>

                {/* DB Info: Resources */}
                {dbStep?.resources && dbStep.resources.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 uppercase tracking-wide">Resources</h4>
                    <ul className="space-y-2">
                      {dbStep.resources.map((res, i) => (
                        <li key={i}>
                          <a 
                            href={res.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium bg-indigo-50 dark:bg-indigo-950/30 px-3 py-2 rounded-lg w-full transition-colors group-hover/res"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            {res.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* DB Info: Project Instructions */}
                {dbStep?.project_instructions && (
                  <div className="mb-6 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-4 border border-zinc-200/80 dark:border-zinc-800/80">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Project / Exercise</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                      {dbStep.project_instructions}
                    </p>
                  </div>
                )}

                {/* Submission & Action */}
                {!isCompleted && (
                  <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
                    {requiresSubmission && (
                      <div className="mb-4">
                        <label htmlFor={`github-${stepId}`} className="block text-sm font-bold text-zinc-900 dark:text-zinc-200 mb-2">
                          GitHub / Project URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`github-${stepId}`}
                          type="url"
                          placeholder="https://github.com/your-username/repo"
                          value={submissionUrls[stepId] || ""}
                          onChange={(e) => handleUrlChange(stepId, e.target.value)}
                          className="w-full rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow"
                        />
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleMarkComplete(stepId, requiresSubmission)}
                      disabled={loadingSteps[stepId]}
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-zinc-900 dark:bg-white px-6 py-3 text-sm font-bold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-white dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingSteps[stepId] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 dark:border-zinc-900/30 border-t-white dark:border-t-zinc-900 rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Mark as Complete
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {isCompleted && submittedUrl && (
                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Your Submission:</p>
                    <a href={submittedUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all">
                      {submittedUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
