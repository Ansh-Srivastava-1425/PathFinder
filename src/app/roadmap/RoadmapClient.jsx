"use client";

import React, { useState } from "react";
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900/30 dark:selection:text-indigo-200">
      {/* 1. Header with Progress Bar */}
      <header className="sticky top-[64px] z-40 bg-zinc-50/85 dark:bg-zinc-950/85 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 pt-8 pb-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <Link href="/dashboard" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors mb-3 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-4">
                <span className="text-4xl sm:text-5xl" aria-hidden="true">{field.emoji}</span>
                {field.name} Roadmap
              </h1>
            </div>
            <div className="text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3 shadow-sm">
              <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">Progress</span>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-none">{progressPercent}%</div>
            </div>
          </div>
          
          <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="absolute left-0 top-0 h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 2. Roadmap Steps - Full width single column, LMS style */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-10">
        {field.roadmap?.map((stepItem, index) => {
          const stepId = stepItem.id || stepItem.name;
          const dbStep = roadmapSteps.find((s) => s.step_number === index + 1);
          
          const progressRow = progressData.find((r) => r.roadmap_step_id === stepId);
          const isCompleted = progressRow?.status === "completed";
          const isRecentlyCompleted = recentlyCompletedStepId === stepId;
          const submittedUrl = progressRow?.personal_note || "";
          
          // Determine status for UI
          let statusText = "Not Started";
          let statusColor = "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700";
          let icon = "⭕";
          
          if (isCompleted) {
            statusText = "Completed";
            statusColor = "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50";
            icon = "✅";
          } else if (index === completedStepsCount) {
            statusText = "In Progress";
            statusColor = "text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50";
            icon = "🔵";
          }

          const requiresSubmission = dbStep?.requires_submission || false;

          return (
            <section 
              key={stepId} 
              className={`w-full min-h-[200px] rounded-[2rem] border p-6 sm:p-10 transition-all duration-500 ${
                isCompleted 
                  ? "bg-white/50 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/50" 
                  : index === completedStepsCount
                    ? "bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-900/60 shadow-xl shadow-indigo-900/5 ring-1 ring-indigo-50 dark:ring-indigo-900/20"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-md"
              } ${isRecentlyCompleted ? "scale-[1.02] shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-500 transition-transform" : ""}`}
            >
              
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 border-b border-zinc-100 dark:border-zinc-800/60 pb-8">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm ${
                    isCompleted 
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" 
                      : index === completedStepsCount
                        ? "bg-indigo-600 text-white dark:bg-indigo-500"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                      {stepItem.name}
                    </h2>
                    {stepItem.meta && (
                      <p className="text-base font-semibold text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center gap-2">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {stepItem.meta}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${statusColor}`}>
                  <span>{icon}</span>
                  {statusText}
                </div>
              </div>

              <div className="space-y-8">
                {/* DB Info: Resources */}
                {dbStep?.resources && dbStep.resources.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-xl">📚</span> Resources
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {dbStep.resources.map((res, i) => (
                        <a 
                          key={i}
                          href={res.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-800 p-4 rounded-xl transition-all group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:border-indigo-300 dark:group-hover:border-indigo-700 transition-colors">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors line-clamp-2">
                            {res.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* DB Info: What to build */}
                {dbStep?.project_instructions && (
                  <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800/80">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-xl">🛠️</span> What to build
                    </h3>
                    <div className="text-base text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed prose dark:prose-invert max-w-none">
                      {dbStep.project_instructions}
                    </div>
                  </div>
                )}

                {/* Submission & Action */}
                {!isCompleted && (
                  <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800/60">
                    {requiresSubmission && (
                      <div className="mb-6">
                        <label htmlFor={`github-${stepId}`} className="block text-base font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                          GitHub / Project URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`github-${stepId}`}
                          type="url"
                          placeholder="https://github.com/your-username/repo"
                          value={submissionUrls[stepId] || ""}
                          onChange={(e) => handleUrlChange(stepId, e.target.value)}
                          className="w-full rounded-xl bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 px-5 py-4 text-base text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleMarkComplete(stepId, requiresSubmission)}
                      disabled={loadingSteps[stepId]}
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/20 transition-all focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingSteps[stepId] ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Mark Complete
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {isCompleted && submittedUrl && (
                  <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800/60">
                    <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">Your Submission</p>
                    <a href={submittedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-base font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline break-all">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {submittedUrl}
                    </a>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
