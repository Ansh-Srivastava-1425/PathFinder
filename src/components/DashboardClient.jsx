"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { fieldsData } from "@/data/fieldsData";
import { updateStepProgress } from "@/actions/progress";
import StepDetailModal from "@/components/StepDetailModal";

const BADGES = [
  { id: 1, label: "First Steps",   emoji: "🌱", threshold: 25 },
  { id: 2, label: "Halfway Hero",  emoji: "⚡", threshold: 50 },
  { id: 3, label: "Almost There",  emoji: "🔥", threshold: 75 },
  { id: 4, label: "Path Complete", emoji: "🏆", threshold: 100 },
]

export default function DashboardClient({ user, userId, userProgress = [], roadmapSteps = [] }) {
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

  // States for animations & skeletons
  const [recentlyCompletedStepId, setRecentlyCompletedStepId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // AI Advisor state
  const [advisorQuestion, setAdvisorQuestion] = useState('');
  const [advisorResponse, setAdvisorResponse] = useState('');
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [selectedStep, setSelectedStep] = useState(null)

  // Opens the modal with the enriched step object
  const handleStepClick = useCallback((stepItem, stepIndex, stepRow) => {
    if (!chosenFieldId) return
    const dbStep = roadmapSteps.find(s => s.step_number === stepIndex + 1)
    setSelectedStep({
      // Core step info from fieldsData
      id: stepItem.id || stepItem.name,
      name: stepItem.name,
      meta: stepItem.meta,
      // Resources & instructions: prefer DB values
      resources: dbStep?.resources || [],
      project_instructions: dbStep?.project_instructions || null,
      requires_submission: dbStep?.requires_submission || false,
      // Any existing submission URL stored in personal_note
      personal_note: stepRow?.personal_note || '',
    })
  }, [chosenFieldId, roadmapSteps])

  const handleModalClose = useCallback(() => setSelectedStep(null), [])

  // Optimistic update called by the modal after a successful action
  const handleStepComplete = useCallback((stepId) => {
    setRecentlyCompletedStepId(stepId);
    setTimeout(() => {
      setRecentlyCompletedStepId(null);
    }, 1500);

    setProgressData((prev) => {
      const exists = prev.find((r) => r.roadmap_step_id === stepId)
      if (exists) {
        return prev.map((r) =>
          r.roadmap_step_id === stepId
            ? { ...r, status: 'completed', completed_at: new Date().toISOString() }
            : r
        )
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
      ]
    })
  }, [userId, chosenFieldId])

  // AI Advisor handler
  const handleAskAdvisor = async () => {
    if (!advisorQuestion.trim()) return;
    setAdvisorLoading(true);
    setAdvisorResponse('');

    const systemPrompt = `You are Dishant AI, a career guidance advisor for Indian engineering students. \nYou are advising a student with the following profile:\n- Chosen field: ${fieldName}\n- Current roadmap step: ${currentStepTitle}\n- Overall progress: ${progressPercentage}%\n- Current streak: ${streakDays} days\n\nGive advice that is specific to their field and current step. \nReference Indian job market context where relevant — mention companies like \nTCS, Infosys, Flipkart, Razorpay, ISRO, or startups depending on the field.\nKeep responses concise, practical, and motivating.\nIf asked about salaries, give INR figures.\nNever give generic advice — always tie it back to their current step and field.`;

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: advisorQuestion, systemPrompt })
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
  const progressPercentage = progressPercent;
  const earnedBadges = BADGES.filter(b => progressPercentage >= b.threshold);

  const streakData = useMemo(() => {
    const toISTDateStr = (dateInput) => {
      const d = new Date(dateInput);
      const istDate = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
      return istDate.toISOString().split("T")[0];
    };

    const completedDates = progressData
      .filter(row => row.completed_at)
      .map(row => toISTDateStr(row.completed_at));
    const uniqueDates = [...new Set(completedDates)].sort((a, b) => new Date(b) - new Date(a));
    
    let currentStreak = 0;
    let bestStreak = 0;

    const todayStr = toISTDateStr(new Date());
    let tempCurrentStreak = 0;
    let checkDate = new Date();
    
    while (true) {
      const dStr = toISTDateStr(checkDate);
      if (uniqueDates.includes(dStr)) {
        tempCurrentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dStr === todayStr) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yStr = toISTDateStr(checkDate);
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

  const fieldName = field?.name || "None";
  const currentStep = field?.roadmap?.find((stepItem) => {
    const rowId = stepItem.id || stepItem.name;
    const stepRow = progressData.find(row => row.roadmap_step_id === rowId);
    return stepRow?.status !== "completed";
  });
  const currentStepTitle = currentStep?.name || "None";
  const streakDays = streakData.currentStreak;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progressPercentage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progressPercentage, isLoading]);

  // Weekly calendar streak days setup (Mon - Sun)
  const calendarStreakDays = [
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
    <>
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
          {isLoading ? (
            <>
              {/* Progress Card Skeleton */}
              <div className="bg-zinc-200 dark:bg-zinc-800 animate-gray-pulse h-[108px] rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50" />
              {/* Streak Card Skeleton */}
              <div className="bg-zinc-200 dark:bg-zinc-800 animate-gray-pulse h-[108px] rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50" />
              {/* Time Left Card Skeleton */}
              <div className="bg-zinc-200 dark:bg-zinc-800 animate-gray-pulse h-[108px] rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50" />
              {/* Badges Card Skeleton */}
              <div className="bg-zinc-200 dark:bg-zinc-800 animate-gray-pulse h-[148px] rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50" />
            </>
          ) : (
            <>
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
                <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 block mb-3">
                  Badges
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {BADGES.map((b) => {
                    const isEarned = progressPercentage >= b.threshold;
                    return (
                      <div
                        key={b.id}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                          isEarned
                            ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                            : "bg-zinc-100/30 dark:bg-zinc-900/10 border-zinc-200/20 dark:border-zinc-800/20 opacity-40 grayscale"
                        }`}
                      >
                        <span className="text-3xl select-none">
                          {b.emoji}
                        </span>
                        <span className="text-[9px] font-bold text-center mt-1 leading-tight text-zinc-700 dark:text-zinc-300">
                          {b.label}
                        </span>
                        {!isEarned && (
                          <span className="absolute inset-0 flex items-center justify-center text-sm select-none bg-zinc-950/15 dark:bg-black/35">
                            🔒
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Empty State for 0% Progress */}
        {progressPercentage === 0 && (
          <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-950/10 dark:to-purple-950/10 border border-indigo-200/50 dark:border-indigo-900/40 p-6 rounded-2xl text-center space-y-3 transition-colors duration-300">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Your journey starts here 🚀
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              You haven't completed any steps yet. Ready to take your first step?
            </p>
            <button
              onClick={() => {
                document.getElementById("roadmap-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-900/10 transition-colors cursor-pointer"
            >
              Start Step 1
            </button>
          </div>
        )}

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
                <div
                  className="absolute top-0 left-0 h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                  style={{
                    width: `${animatedProgress}%`,
                    transition: 'width 1s ease-in-out'
                  }}
                />
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
        {isLoading ? (
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 block">
              Your roadmap
            </span>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-zinc-200 dark:bg-zinc-800 animate-gray-pulse h-[74px] rounded-xl border border-zinc-200/50 dark:border-zinc-800/50" />
              ))}
            </div>
          </div>
        ) : (
          field && field.roadmap && (
            <div id="roadmap-section" className="space-y-3">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 block">
              Your roadmap
            </span>

            <div className="space-y-3">
              {field.roadmap.map((stepItem, index) => {
                const rowId = stepItem.id || stepItem.name;
                const stepRow = progressData.find(row => row.roadmap_step_id === rowId);

                const isCompleted = stepRow?.status === "completed";
                const isInProgress = stepRow?.status === "in_progress";

                // Est weeks for current
                const stepWeeks = stepItem.meta?.split(" • ")[0] || "4 weeks";
                // Does this step require a GitHub submission? (from DB)
                const dbStep = roadmapSteps.find(s => s.step_number === index + 1);
                const requiresSubmission = dbStep?.requires_submission || false;

                return (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open step: ${stepItem.name}`}
                    onClick={() => handleStepClick(stepItem, index, stepRow)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStepClick(stepItem, index, stepRow)}
                    className={`flex items-start gap-4 p-4 rounded-xl border bg-white dark:bg-zinc-900/50 shadow-sm transition-all duration-200 border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md cursor-pointer group ${
                      recentlyCompletedStepId === rowId ? 'animate-complete-pulse border-green-500 dark:border-green-500' : ''
                    }`}
                  >
                    {/* Status Dot */}
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
                          recentlyCompletedStepId === rowId ? 'bg-green-600 dark:bg-green-500' : 'bg-indigo-600 dark:bg-indigo-500'
                        }`}>
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
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {stepItem.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {isCompleted && `Completed · ${stepWeeks}`}
                        {isInProgress && (
                          <span>
                            In progress &middot; est. {stepWeeks} &middot; Build:{" "}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {roadmapSteps.find(s => s.step_number === index + 1)?.title || "Project"}
                            </span>
                          </span>
                        )}
                        {!isCompleted && !isInProgress && (
                          <span className="inline-flex items-center gap-1">
                            {stepWeeks}
                            {requiresSubmission && (
                              <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-500 dark:text-amber-400">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                GitHub required
                              </span>
                            )}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Chevron arrow */}
                    <div className="shrink-0 text-zinc-400 dark:text-zinc-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors mt-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View Full Roadmap Link */}
            <div className="pt-1">
              <Link
                href="/roadmap"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors inline-flex items-center gap-1 min-h-[44px]"
              >
                View full roadmap →
              </Link>
            </div>
          </div>
        )
      )}

        {/* SECTION 5: Weekly Streak */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 block">
            This week
          </span>

          <div className="flex items-center justify-between gap-2 max-w-sm">
            {calendarStreakDays.map((day) => {
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
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Powered by Dishant AI · India-focused career advice</p>
            </div>
          </div>

          {/* Input row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="advisor-question-input"
              type="text"
              value={advisorQuestion}
              onChange={(e) => setAdvisorQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !advisorLoading && handleAskAdvisor()}
              placeholder={`Ask me about ${fieldName}, ${currentStepTitle}, jobs, salaries...`}
              disabled={advisorLoading}
              className="w-full sm:flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors disabled:opacity-60"
            />
            <button
              id="advisor-send-btn"
              type="button"
              onClick={handleAskAdvisor}
              disabled={advisorLoading || !advisorQuestion.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors min-h-[44px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
              Dishant AI is thinking…
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

    {/* Step Detail Modal - rendered as a portal-like overlay */}
    {selectedStep && (
      <StepDetailModal
        step={selectedStep}
        status={
          progressData.find(r => r.roadmap_step_id === selectedStep.id)?.status || 'not_started'
        }
        fieldSlug={chosenFieldId}
        onClose={handleModalClose}
        onComplete={handleStepComplete}
      />
    )}
    {/* Dynamic animations and styles */}
    <style>{`
      @keyframes grayPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .4; }
      }
      .animate-gray-pulse {
        animation: grayPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes completePulse {
        0% { border-color: rgba(34, 197, 94, 0.4); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
        50% { border-color: rgba(34, 197, 94, 1); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
        100% { border-color: rgba(34, 197, 94, 0.2); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
      }
      .animate-complete-pulse {
        animation: completePulse 1.5s ease-out;
      }
    `}</style>
    </>
  );
}
