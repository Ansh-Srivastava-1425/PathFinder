"use client";

import React, { useState, useTransition, useMemo, useRef } from "react";
import Link from "next/link";
import { fieldsData } from "@/data/fieldsData";
import { updateStepProgress } from "@/actions/progress";

export default function DashboardClient({ user, userId, userProgress = [] }) {
  // Extract user details
  const firstName = user?.full_name ? user.full_name.trim().split(/\s+/)[0] : "student";
  const chosenFieldId = user?.chosen_field_id;

  // Try to load field details from fieldsData
  const field = chosenFieldId ? fieldsData[chosenFieldId] : null;

  // Formatting date for Section 1 subline
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Time of day greeting logic
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  // Parsing total estimated weeks from roadmap step meta
  const calculateTotalWeeks = () => {
    if (!field?.roadmap) return 16;
    let total = 0;
    field.roadmap.forEach((step) => {
      const match = step.meta?.match(/(\d+)\s+week/);
      if (match) {
        total += parseInt(match[1], 10);
      }
    });
    return total > 0 ? total : 16;
  };

  const totalWeeks = calculateTotalWeeks();

  // Seed state from the server-side-fetched prop; updates optimistically on step click
  const [progressData, setProgressData] = useState(userProgress);
  const [isPending, startTransition] = useTransition();

  // AI Advisor state
  const [advisorQuestion, setAdvisorQuestion] = useState('');
  const [advisorResponse, setAdvisorResponse] = useState('');
  const [advisorLoading, setAdvisorLoading] = useState(false);

  const handleStepClick = (stepId) => {
    if (!chosenFieldId) return;
    startTransition(async () => {
      const result = await updateStepProgress(chosenFieldId, stepId, 'completed');
      if (result.success) {
        // Upsert locally so the UI updates without a full page reload
        setProgressData((prev) => {
          const exists = prev.find((r) => r.roadmap_step_id === stepId);
          if (exists) {
            return prev.map((r) =>
              r.roadmap_step_id === stepId
                ? { ...r, status: 'completed', completed_at: new Date().toISOString() }
                : r
            );
          }
          return [
            ...prev,
            {
              user_id: userId,
              field_slug: chosenFieldId,
              roadmap_step_id: stepId,
              status: 'completed',
              completed_at: new Date().toISOString(),
            },
          ];
        });
      } else {
        console.error('Failed to update step progress:', result.error);
      }
    });
  };

  // AI Advisor handler
  const handleAskAdvisor = async () => {
    if (!advisorQuestion.trim()) return;
    setAdvisorLoading(true);
    setAdvisorResponse('');
    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: advisorQuestion })
      });
      const data = await response.json();
      setAdvisorResponse(data.reply);
    } catch(err) {
      setAdvisorResponse('Sorry, something went wrong. Please try again.');
    } finally {
      setAdvisorLoading(false);
    }
  };

  // Derived progress metrics
  const totalRoadmapSteps = field?.roadmap?.length || 0;
  const completedSteps = progressData.filter((row) => row.status === "completed").length;
  const progressPercent = totalRoadmapSteps > 0 ? Math.round((completedSteps / totalRoadmapSteps) * 100) : 0;
  const derivedTimeLeft = Math.round(totalWeeks * (1 - progressPercent / 100));
  const badgesCount = Math.min(4, Math.floor(progressPercent / 25));

  const streakData = useMemo(() => {
    const completedDates = progressData
      .filter(row => row.completed_at)
      .map(row => new Date(row.completed_at).toISOString().split("T")[0]);
    const uniqueDates = [...new Set(completedDates)].sort((a, b) => new Date(b) - new Date(a));
    
    let currentStreak = 0;
    let bestStreak = 0;

    const todayStr = new Date().toISOString().split("T")[0];
    let tempCurrentStreak = 0;
    let checkDate = new Date();
    
    while (true) {
      const dStr = checkDate.toISOString().split("T")[0];
      if (uniqueDates.includes(dStr)) {
        tempCurrentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dStr === todayStr) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yStr = checkDate.toISOString().split("T")[0];
        if (uniqueDates.includes(yStr)) {
          tempCurrentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
    }
    currentStreak = tempCurrentStreak;

    if (uniqueDates.length > 0) {
      let maxStrk = 1;
      let currStrk = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const d1 = new Date(uniqueDates[i]);
        const d2 = new Date(uniqueDates[i+1]);
        const diffDays = Math.ceil(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currStrk++;
          if (currStrk > maxStrk) maxStrk = currStrk;
        } else {
          currStrk = 1;
        }
      }
      bestStreak = maxStrk;
    }
    return { currentStreak, bestStreak, uniqueDates };
  }, [progressData]);

  // Weekly streak days setup (Mon - Sun)
  const streakDays = [
    { label: "M", value: 1, name: "Monday" },
    { label: "T", value: 2, name: "Tuesday" },
    { label: "W", value: 3, name: "Wednesday" },
    { label: "T", value: 4, name: "Thursday" },
    { label: "F", value: 5, name: "Friday" },
    { label: "S", value: 6, name: "Saturday" },
    { label: "S", value: 0, name: "Sunday" },
  ];

  const currentDayOfWeek = new Date().getDay();

  const activeDayValues = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDates.push({ value: d.getDay(), dateStr: d.toISOString().split("T")[0] });
    }
    return weekDates
      .filter(w => streakData.uniqueDates.includes(w.dateStr))
      .map(w => w.value);
  }, [streakData.uniqueDates]);

  // AI Advisor dynamic prompt helper
  const getAiAdvisorPrompt = () => {
    if (field?.roadmap && field.roadmap.length > 0) {
      return `What should I build this week on my "${field.roadmap[0].name}" step?`;
    }
    return "Which engineering tech fields fit my interests?";
  };

  // Sparkles SVG Icon
  const SparklesIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904ZM18 9.75 17.25 12l-.75-2.25L14.25 9l2.25-.75L17.25 6l.75 2.25L20.25 9l-2.25.75ZM20.25 18l-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5.5 1.5 1.5.5-1.5.5Z" />
    </svg>
  );

  return (
    <div className="flex-1 flex flex-col items-center bg-zinc-50 dark:bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full max-w-[720px] space-y-8">
        
        {/* SECTION 1: Greeting */}
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {formattedDate} &middot;{" "}
            {field ? (
              <span>keep going on your <span className="font-semibold text-indigo-600 dark:text-indigo-400">{field.name}</span> path</span>
            ) : (
              <span>keep exploring your path</span>
            )}
          </p>
        </div>

        {/* SECTION 2: Stats Row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Progress Card */}
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm transition-colors duration-300">
            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 block">
              Progress
            </span>
            <span className="text-2xl font-extrabold text-zinc-950 dark:text-white mt-1 block">
              {progressPercent}%
            </span>
            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 block mt-1">
              {completedSteps} of {totalRoadmapSteps} steps done
            </span>
          </div>

          {/* Streak Card */}
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm transition-colors duration-300">
            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 block">
              Streak
            </span>
            <span className="text-2xl font-extrabold text-zinc-950 dark:text-white mt-1 block">
              {streakData.currentStreak} days
            </span>
            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 block mt-1">
              Best: {streakData.bestStreak} days
            </span>
          </div>

          {/* Time Left Card */}
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm transition-colors duration-300">
            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 block">
              Time Left
            </span>
            <span className="text-2xl font-extrabold text-zinc-950 dark:text-white mt-1 block">
              ~{field ? derivedTimeLeft : 0} wks
            </span>
            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 block mt-1">
              Estimated path duration
            </span>
          </div>

          {/* Badges Card */}
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm transition-colors duration-300">
            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 block">
              Badges
            </span>
            <span className="text-2xl font-extrabold text-zinc-950 dark:text-white mt-1 block">
              {badgesCount}
            </span>
            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 block mt-1">
              Milestones earned
            </span>
          </div>
        </div>

        {/* SECTION 3: Field & Progress Card */}
        {field ? (
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm transition-colors duration-300 space-y-4">
            <div className="flex items-center justify-between">
              {/* Pill badge with emoji and name */}
              <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/50">
                <span>{field.emoji}</span>
                <span>{field.name}</span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {progressPercent < 25
                  ? 'Beginner'
                  : progressPercent < 50
                  ? 'Intermediate'
                  : progressPercent < 75
                  ? 'Advanced'
                  : 'Job-ready'}{' '}
                phase &middot; Step {completedSteps + 1} of {totalRoadmapSteps}
              </span>
            </div>

            {/* Horizontal progress bar */}
            <div className="space-y-2">
              <div className="relative h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
              
              {/* Milestones labels */}
              <div className="flex justify-between text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Job ready</span>
              </div>
            </div>
          </div>
        ) : (
          /* Explore Fields CTA Card if no field chosen */
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 p-8 rounded-2xl shadow-sm transition-colors duration-300 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                You haven't chosen a field yet
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Explore the 13 career tracks and pick one to begin your roadmap progress.
              </p>
            </div>
            <div>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 transition-colors min-h-[44px] cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Explore fields →
              </Link>
            </div>
          </div>
        )}

        {/* SECTION 4: Roadmap Steps */}
        {field && field.roadmap && (
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 block">
              Your roadmap
            </span>

            <div className="space-y-3">
              {field.roadmap.slice(0, 5).map((stepItem, index) => {
                const rowId = stepItem.id || stepItem.name;
                const stepRow = progressData.find(row => row.roadmap_step_id === rowId);

                const isCompleted = stepRow?.status === "completed";
                const isInProgress = stepRow?.status === "in_progress";
                const isLocked = !isCompleted && !isInProgress;

                // Est weeks for current
                const stepWeeks = stepItem.meta?.split(" • ")[0] || "4 weeks";

                return (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    aria-label={`Mark "${stepItem.name}" as completed`}
                    onClick={() => !isCompleted && handleStepClick(rowId)}
                    onKeyDown={(e) => e.key === 'Enter' && !isCompleted && handleStepClick(rowId)}
                    className={`flex items-start gap-4 p-4 rounded-xl border bg-white dark:bg-zinc-900/50 shadow-sm transition-all duration-300 ${
                      isCompleted
                        ? 'border-zinc-200 dark:border-zinc-800/40 cursor-default'
                        : isPending
                        ? 'border-zinc-200 dark:border-zinc-800/40 opacity-60 cursor-wait'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer'
                    }`}
                  >
                    {/* Status Dot */}
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : isInProgress ? (
                        <div className="w-6 h-6 rounded-full border-2 border-indigo-600 dark:border-indigo-500 flex items-center justify-center bg-transparent">
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500 animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-transparent flex items-center justify-center" />
                      )}
                    </div>

                    {/* Step Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                        {stepItem.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {isCompleted && `Completed · ${stepWeeks}`}
                        {isInProgress && (
                          <span>
                            In progress &middot; est. {stepWeeks} &middot; Build:{" "}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {field.projects?.[0]?.name || "Beginner Project"}
                            </span>
                          </span>
                        )}
                        {isLocked && "Locked · unlock after current step"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View Full Roadmap Link */}
            <div className="pt-1">
              <Link
                href="/explore"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors inline-flex items-center gap-1 min-h-[44px]"
              >
                View full roadmap →
              </Link>
            </div>
          </div>
        )}

        {/* SECTION 5: Weekly Streak */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 block">
            This week
          </span>

          <div className="flex items-center justify-between gap-2 max-w-sm">
            {streakDays.map((day) => {
              const isActive = activeDayValues.includes(day.value);
              const isToday = day.value === currentDayOfWeek;

              return (
                <div key={day.name} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm"
                        : isToday
                        ? "border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-transparent"
                        : "bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {isActive ? (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{day.label}</span>
                    )}
                  </div>
                  <span className={`text-[9px] font-bold uppercase ${isToday ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`}>
                    {day.name.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 6: AI Advisor Card */}
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm transition-colors duration-300 space-y-4">
          {/* Card header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-900/40">
              {SparklesIcon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Ask your AI advisor</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Powered by PathFinder AI · India-focused career advice</p>
            </div>
          </div>

          {/* Input row */}
          <div className="flex gap-2">
            <input
              id="advisor-question-input"
              type="text"
              value={advisorQuestion}
              onChange={(e) => setAdvisorQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !advisorLoading && handleAskAdvisor()}
              placeholder="Ask me anything about your career path..."
              disabled={advisorLoading}
              className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors disabled:opacity-60"
            />
            <button
              id="advisor-send-btn"
              type="button"
              onClick={handleAskAdvisor}
              disabled={advisorLoading || !advisorQuestion.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors min-h-[44px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {advisorLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <>Send →</>
              )}
            </button>
          </div>

          {/* Loading indicator */}
          {advisorLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-500 dark:text-indigo-400">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              PathFinder AI is thinking…
            </div>
          )}

          {/* Response area */}
          {advisorResponse && !advisorLoading && (
            <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50 dark:bg-indigo-950/20 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {advisorResponse}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
