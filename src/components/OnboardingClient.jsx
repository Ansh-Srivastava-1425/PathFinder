"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveOnboardingData } from "@/actions/onboarding";
import { fieldsData } from "@/data/fieldsData";

const INTEREST_TO_SLUGS = {
  "Hardware & circuits": ["embedded-systems", "vlsi-chip-design"],
  "Robots & automation": ["robotics", "embedded-systems"],
  "AI & data": ["ai-machine-learning", "computer-vision", "data-science"],
  "Biology & medicine": ["bioinformatics", "computational-biology"],
  "Security & hacking": ["cybersecurity"],
  "Space & aerospace": ["space-technology", "robotics"],
  "Writing software": ["web-development", "cloud-devops"],
  "Apps & products": ["mobile-development", "web-development"],
};

export default function OnboardingClient({ user }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [name, setName] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [branch, setBranch] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);

  const handleToggleInterest = (interest) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      } else {
        if (prev.length >= 2) {
          return [prev[1], interest];
        } else {
          return [...prev, interest];
        }
      }
    });
  };

  const getRecommendations = () => {
    if (isSkipped || selectedInterests.length === 0) {
      return ["robotics", "ai-machine-learning", "web-development"];
    }
    const slugs = [];
    selectedInterests.forEach((interest) => {
      const mapped = INTEREST_TO_SLUGS[interest] || [];
      mapped.forEach((slug) => {
        if (!slugs.includes(slug)) slugs.push(slug);
      });
    });
    const defaults = ["robotics", "ai-machine-learning", "web-development"];
    for (const defSlug of defaults) {
      if (slugs.length >= 3) break;
      if (!slugs.includes(defSlug)) slugs.push(defSlug);
    }
    return slugs.slice(0, 3);
  };

  const saveProfileData = async (skipped = false, selectedFieldSlug = null) => {
    setIsSubmitting(true);
    setSubmitError("");

    const payload = skipped
      ? {
          full_name: "",
          year_of_study: "",
          branch: "",
          interests: [],
          goal: "",
          onboarding_complete: true,
        }
      : {
          full_name: name,
          year_of_study: yearOfStudy,
          branch: branch,
          interests: selectedInterests,
          goal: selectedGoal,
          onboarding_complete: true,
        };

    if (selectedFieldSlug) {
      payload.chosen_field_id = selectedFieldSlug;
    }

    console.log('[saveProfileData] calling server action. Payload:', payload);

    try {
      const result = await saveOnboardingData(payload);
      console.log('[saveProfileData] server action result:', result);

      if (!result.success) {
        setSubmitError(result.error ? `Save failed: ${result.error}` : 'Something went wrong. Please try again.');
        return false;
      }

      return true;
    } catch (err) {
      console.error('[saveProfileData] unexpected error calling server action:', err);
      setSubmitError('Something went wrong. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep1Continue = () => {
    if (name.trim() && yearOfStudy && branch) {
      setIsSkipped(false);
      setStep(2);
    }
  };

  const handleStep1Skip = () => {
    setIsSkipped(true);
    setName("");
    setYearOfStudy("");
    setBranch("");
    setSelectedInterests([]);
    setSelectedGoal("");
    setStep(4);
  };

  const handleStep2Continue = () => {
    setStep(3);
  };

  const handleStep3Finish = async () => {
    console.log('button clicked');
    console.log('DEBUG — selectedGoal:', selectedGoal, '| isSubmitting:', isSubmitting);
    if (selectedGoal) {
      const success = await saveProfileData(false);
      if (success) {
        setStep(4);
      }
    }
  };

  const getSegmentStyle = (segNum) => {
    if (step > segNum) return { width: "100%", opacity: 0.4 };
    if (step === segNum) return { width: "100%", opacity: 1 };
    return { width: "0%", opacity: 0 };
  };

  const icons = {
    hardware: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <rect x="4" y="4" width="16" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="9" y="9" width="6" height="6" rx="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    software: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    robots: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1a3 3 0 0 1-.879 2.121L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.25v-1m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
      </svg>
    ),
    ai: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <circle cx="12" cy="5" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5" cy="12" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="19" cy="12" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="19" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7.5v9M7.5 12h9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7.5 7.5 12m4.5-4.5 4.5 4.5m-4.5 9.5-4.5-4.5m4.5 4.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    biology: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path d="M4.5 10.5C7.5 4.5 16.5 4.5 19.5 10.5M4.5 13.5C7.5 19.5 16.5 19.5 19.5 13.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 8v8M9 6v12M12 5.5v13M15 6v12M18 8v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    security: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    space: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.61 3.25a14.98 14.98 0 0 0-6.16 12.12A14.98 14.98 0 0 0 9.61 18.25l3.57-2.77a6 6 0 0 0 2.41-1.11Z" />
      </svg>
    ),
    apps: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <rect x="5" y="2" width="14" height="20" rx="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 18h.01M9 6h6M9 10h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    compass: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    briefcase: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0c0-1.242-1.008-2.25-2.25-2.25H6c-1.242 0-2.25 1.008-2.25 2.25m16.5 0V8.625c0-.621-.504-1.125-1.125-1.125h-2.25m-12 0c0-.621.504-1.125 1.125-1.125h2.25m-3.375 0V8.625M9 6h6v1.5H9V6Z" />
      </svg>
    ),
    arrows: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    book: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-16.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-16.25v16.25" />
      </svg>
    ),
  };

  const interestOptions = [
    { label: "Hardware & circuits", icon: icons.hardware },
    { label: "Writing software", icon: icons.software },
    { label: "Robots & automation", icon: icons.robots },
    { label: "AI & data", icon: icons.ai },
    { label: "Biology & medicine", icon: icons.biology },
    { label: "Security & hacking", icon: icons.security },
    { label: "Space & aerospace", icon: icons.space },
    { label: "Apps & products", icon: icons.apps },
  ];

  const goalOptions = [
    { label: "Explore what tech fields exist", icon: icons.compass },
    { label: "Get an internship in 3rd year", icon: icons.briefcase },
    { label: "Switch fields or careers", icon: icons.arrows },
    { label: "Figure out what to study next", icon: icons.book },
  ];

  const recommendedSlugs = getRecommendations();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 transition-colors duration-300">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      <div className="w-full max-w-[480px] space-y-6">
        {step < 4 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span>Step {step} of 3</span>
              <span>{Math.round(((step - 1) / 2) * 100)}% Complete</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((segNum) => (
                <div key={segNum} className="relative h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                    style={getSegmentStyle(segNum)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-300">

          {submitError && (
            <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-center font-medium animate-fade-in">
              {submitError}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Tell us about yourself</h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Just a few quick details so we can personalise your experience.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 mb-2">Your name</label>
                  <input
                    id="name" type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ravi Sharma"
                    className="block w-full h-11 rounded-lg border-0 px-3.5 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-zinc-950 dark:text-white dark:ring-zinc-800 dark:focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="year" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 mb-2">Year of study</label>
                  <select
                    id="year" required value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="block w-full h-11 rounded-lg border-0 px-3.5 shadow-sm ring-1 ring-inset ring-zinc-300 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  >
                    <option value="" disabled>Select your year</option>
                    <option value="1st year">1st year</option>
                    <option value="2nd year">2nd year</option>
                    <option value="3rd year">3rd year</option>
                    <option value="4th year">4th year</option>
                    <option value="Just graduated">Just graduated</option>
                    <option value="School student (Class 11–12)">School student (Class 11–12)</option>
                    <option value="Working professional">Working professional</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="branch" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 mb-2">Branch / stream</label>
                  <select
                    id="branch" required value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="block w-full h-11 rounded-lg border-0 px-3.5 shadow-sm ring-1 ring-inset ring-zinc-300 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  >
                    <option value="" disabled>Select your branch</option>
                    <option value="Computer Science (CS/IT)">Computer Science (CS/IT)</option>
                    <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                    <option value="Electrical Engineering (EE)">Electrical Engineering (EE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Other engineering">Other engineering</option>
                    <option value="Science (PCM/PCB)">Science (PCM/PCB)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <button type="button" onClick={handleStep1Skip} className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 min-h-[44px] px-2 flex items-center transition-colors cursor-pointer">
                  Skip for now
                </button>
                <button type="button" disabled={!name.trim() || !yearOfStudy || !branch} onClick={handleStep1Continue} className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">What excites you most?</h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Pick up to 2. This helps us show you the right fields.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((opt) => {
                  const isSelected = selectedInterests.includes(opt.label);
                  return (
                    <button
                      key={opt.label} type="button"
                      onClick={() => handleToggleInterest(opt.label)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-xl text-center transition-all duration-200 cursor-pointer min-h-[110px] gap-2 ${
                        isSelected
                          ? "border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/20 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <div className={`transition-transform duration-200 ${isSelected ? "text-indigo-600 dark:text-indigo-400 scale-105" : "text-zinc-400 dark:text-zinc-500"}`}>
                        {opt.icon}
                      </div>
                      <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 min-h-[44px] px-2 flex items-center transition-colors cursor-pointer">
                  ← Back
                </button>
                <button type="button" onClick={handleStep2Continue} className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors min-h-[44px] cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">What's your main goal?</h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">We'll tailor your roadmap and recommendations around this.</p>
              </div>
              <div className="space-y-3">
                {goalOptions.map((opt) => {
                  const isSelected = selectedGoal === opt.label;
                  return (
                    <button
                      key={opt.label} type="button"
                      onClick={() => setSelectedGoal(opt.label)}
                      className={`flex items-center gap-4 p-4 border rounded-xl text-left transition-all duration-200 cursor-pointer min-h-[56px] w-full ${
                        isSelected
                          ? "border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/20 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <div className={`flex-shrink-0 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 dark:text-zinc-500"}`}>
                        {opt.icon}
                      </div>
                      <span className="text-sm font-semibold leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {/* 🐛 DEBUG BANNER — remove before shipping */}
              <div style={{ fontSize: '11px', fontFamily: 'monospace', background: '#fef9c3', border: '1px solid #fde047', borderRadius: '6px', padding: '6px 10px', marginBottom: '4px', color: '#713f12', lineHeight: '1.6' }}>
                <strong>DEBUG</strong> &nbsp;|&nbsp;
                <span>selectedGoal: <code style={{ background: '#fef08a', padding: '0 4px', borderRadius: '3px' }}>{selectedGoal ? `"${selectedGoal}"` : '(empty — button will be DISABLED)'}</code></span>
                &nbsp;|&nbsp;
                <span>isSubmitting: <code style={{ background: '#fef08a', padding: '0 4px', borderRadius: '3px' }}>{String(isSubmitting)}</code></span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <button type="button" onClick={() => setStep(2)} className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 min-h-[44px] px-2 flex items-center transition-colors cursor-pointer">
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!selectedGoal || isSubmitting}
                  onClick={handleStep3Finish}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  {isSubmitting ? "Saving..." : "Finish setup ✓"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4 animate-scale-up">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904ZM18 9.75 17.25 12l-.75-2.25L14.25 9l2.25-.75L17.25 6l.75 2.25L20.25 9l-2.25.75ZM20.25 18l-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5.5 1.5 1.5.5-1.5.5Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {name ? `You're all set, ${name}!` : "You're all set!"}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Based on your answers, here are your top field matches to start exploring.</p>
              </div>

              <div className="space-y-3">
                {recommendedSlugs.map((slug) => {
                  const field = fieldsData[slug];
                  if (!field) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/explore/${slug}`}
                      onClick={async (e) => {
                        e.preventDefault();
                        const success = await saveProfileData(isSkipped, slug);
                        if (success) router.push(`/explore/${slug}`);
                      }}
                      className="block group"
                    >
                      <div className="flex items-start gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/20 hover:border-indigo-500 dark:hover:border-indigo-500/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer">
                        <span className="text-3xl flex-shrink-0" role="img" aria-label={field.name}>{field.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-zinc-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {field.name}
                            </h4>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border flex-shrink-0 ${
                              field.badges?.isGem
                                ? "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-300 border-violet-200/60"
                                : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 border-emerald-200/60"
                            }`}>
                              {field.badges?.isGem ? "✦ Gem" : "⭐ Popular"}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">{field.tagline}</p>
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">
                            <span>Salary range:</span>
                            <span className="text-zinc-700 dark:text-zinc-300 font-bold tabular-nums">
                              {field.stats?.entrySalary} – {field.stats?.seniorSalary}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors min-h-[44px] cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  Go to my dashboard →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}