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
  const [aiContent, setAiContent] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  
  // State for Accordion Toggle
  const [expandedStepId, setExpandedStepId] = useState(null);

  const toggleExpand = (stepId) => {
    setExpandedStepId((prev) => (prev === stepId ? null : stepId));
  };

  const handleExpandAI = async (stepId, stepName) => {
    if (aiContent[stepId] || aiLoading[stepId]) return;

    setAiLoading((prev) => ({ ...prev, [stepId]: true }));

    const systemPrompt = `You are a career roadmap expert for Indian engineering students. Give a detailed breakdown for the roadmap step: '${stepName}' in '${field.name}'. Return ONLY a JSON object with these fields: { "skills": ["skill1", "skill2"] (8-10 specific subtopics), "resources": [{"name": "resource name", "url": "url", "type": "YouTube/Website/Docs"}] (4-5 free resources), "project": "detailed project description to build", "tips": ["tip1", "tip2", "tip3"] (3 India-specific tips) }`;

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: "Return JSON data.", systemPrompt }),
      });
      const data = await res.json();
      if (data.reply) {
        let jsonString = data.reply.trim();
        // Remove markdown backticks if present
        if (jsonString.startsWith("\`\`\`json")) {
          jsonString = jsonString.slice(7, -3).trim();
        } else if (jsonString.startsWith("\`\`\`")) {
          jsonString = jsonString.slice(3, -3).trim();
        }
        
        const parsedData = JSON.parse(jsonString);
        setAiContent((prev) => ({ ...prev, [stepId]: parsedData }));
      }
    } catch (error) {
      console.error("Failed to fetch or parse AI content", error);
    } finally {
      setAiLoading((prev) => ({ ...prev, [stepId]: false }));
    }
  };

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

      {/* 2. Roadmap Steps - Accordion Layout */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-6">
        {field.roadmap?.map((stepItem, index) => {
          const stepId = stepItem.id || stepItem.name;
          const dbStep = roadmapSteps.find((s) => s.step_number === index + 1);
          
          const progressRow = progressData.find((r) => r.roadmap_step_id === stepId);
          const isCompleted = progressRow?.status === "completed";
          const isRecentlyCompleted = recentlyCompletedStepId === stepId;
          const submittedUrl = progressRow?.personal_note || "";
          const isExpanded = expandedStepId === stepId;
          
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
              className={`w-full rounded-3xl border transition-all duration-300 overflow-hidden ${
                isCompleted 
                  ? "bg-white/50 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/50" 
                  : index === completedStepsCount
                    ? "bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-900/60 shadow-lg shadow-indigo-900/5 ring-1 ring-indigo-50 dark:ring-indigo-900/20"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md"
              } ${isRecentlyCompleted ? "scale-[1.02] shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-500 transition-transform" : ""}`}
            >
              
              {/* Accordion Header (Clickable) */}
              <div 
                onClick={() => toggleExpand(stepId)}
                className={`cursor-pointer p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30 select-none ${
                  isExpanded ? "border-b border-zinc-100 dark:border-zinc-800/60 pb-6 sm:pb-8" : ""
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm shrink-0 ${
                    isCompleted 
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" 
                      : index === completedStepsCount
                        ? "bg-indigo-600 text-white dark:bg-indigo-500"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                      {stepItem.name}
                    </h2>
                    {stepItem.meta && (
                      <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {stepItem.meta}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border ${statusColor}`}>
                    <span>{icon}</span>
                    {statusText}
                  </div>
                  <div className="text-zinc-400 dark:text-zinc-500 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-6 sm:p-8 pt-8 space-y-10 animate-in slide-in-from-top-4 fade-in duration-300">
                  
                  {/* AI Generation Trigger */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Interactive Learning Guide</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Expand this step with AI to get a structured breakdown of skills, resources, and projects.</p>
                    </div>
                    {!aiContent[stepId] && (
                      <button
                        onClick={() => handleExpandAI(stepId, stepItem.name)}
                        disabled={aiLoading[stepId]}
                        className="w-full sm:w-auto shrink-0 inline-flex justify-center items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-950/60 px-5 py-3 rounded-xl border border-indigo-200 dark:border-indigo-900/50 shadow-sm disabled:opacity-70"
                      >
                        {aiLoading[stepId] ? (
                          <>
                            <div className="w-4 h-4 border-2 border-indigo-600/30 dark:border-indigo-400/30 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            ✨ Expand with AI
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* The AI Content JSON Rendering */}
                  {aiContent[stepId] ? (
                    <div className="space-y-10">
                      
                      {/* Skills Grid */}
                      {aiContent[stepId].skills?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <span>🎯</span> Skills to Learn
                          </h4>
                          <div className="flex flex-wrap gap-2.5">
                            {aiContent[stepId].skills.map((skill, i) => (
                              <span key={i} className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-sm font-bold rounded-xl shadow-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resources List */}
                      {aiContent[stepId].resources?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <span>📚</span> Resources
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {aiContent[stepId].resources.map((res, i) => {
                              let typeIcon = "🌐";
                              if (res.type?.toLowerCase().includes("youtube")) typeIcon = "📺";
                              if (res.type?.toLowerCase().includes("docs") || res.type?.toLowerCase().includes("document")) typeIcon = "📄";
                              
                              return (
                                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-xl transition-all group shadow-sm">
                                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                                    {typeIcon}
                                  </div>
                                  <div className="flex flex-col overflow-hidden">
                                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">{res.name}</span>
                                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{res.type}</span>
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Project Box */}
                      {aiContent[stepId].project && (
                        <div className="bg-gradient-to-br from-indigo-50/80 to-zinc-50 dark:from-indigo-950/20 dark:to-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                          <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                            <span>🛠️</span> Project to Build
                          </h4>
                          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {aiContent[stepId].project}
                          </p>
                        </div>
                      )}

                      {/* Tips List */}
                      {aiContent[stepId].tips?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <span>💡</span> Pro Tips for India
                          </h4>
                          <div className="space-y-3">
                            {aiContent[stepId].tips.map((tip, i) => (
                              <div key={i} className="flex items-start gap-4 text-base text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                                  {i + 1}
                                </div>
                                <span className="leading-relaxed">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    /* Fallback DB Content if AI not expanded yet (show existing project/resources if any) */
                    <div className="space-y-8 opacity-75">
                      {dbStep?.resources && dbStep.resources.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">📚 Included Resources</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {dbStep.resources.map((res, i) => (
                              <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg">
                                <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-300 line-clamp-1">{res.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {dbStep?.project_instructions && (
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 uppercase tracking-wider">🛠️ Overview</h3>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
                            {dbStep.project_instructions}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submission & Action */}
                  <div className="pt-8 mt-8 border-t border-zinc-100 dark:border-zinc-800/60">
                    {!isCompleted ? (
                      <div>
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
                    ) : (
                      <div>
                        {submittedUrl && (
                          <div className="mb-4">
                            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">Your Submission</p>
                            <a href={submittedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-base font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline break-all">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {submittedUrl}
                            </a>
                          </div>
                        )}
                        <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}
