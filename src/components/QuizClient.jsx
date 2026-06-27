"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { assignRoadmap } from "@/app/actions/assignRoadmap";

// ─── Quiz Data ────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    text: "When you face a complex problem, what's your natural first instinct?",
    options: [
      "Break it into smaller logical steps and reason through each one",
      "Sketch or visualise how the components fit together",
      "Look for patterns — has something like this been solved before?",
      "Think about who is affected and what outcome they actually need",
    ],
  },
  {
    id: 2,
    text: "You have a free weekend and unlimited resources. What sounds most exciting?",
    options: [
      "Build something that moves — a robot, drone, or mechanical contraption",
      "Write a program that learns from data and makes predictions",
      "Design a product that solves a daily frustration you have",
      "Set up a server, network, or infrastructure that just works reliably",
    ],
  },
  {
    id: 3,
    text: "Which of these accomplishments would give you the most satisfaction?",
    options: [
      "A bridge or building you designed is now used by thousands of people",
      "Your algorithm outperforms humans at a specific diagnosis task",
      "A startup you co-founded raises its first round of funding",
      "Your code ships in a product used by millions every day",
    ],
  },
  {
    id: 4,
    text: "How do you feel about working with physical, tangible materials?",
    options: [
      "Love it — I want to see and touch what I build",
      "It's fine, but I'm more excited by what runs in software",
      "I prefer a mix — hardware and software together is ideal",
      "I'd rather work entirely in the digital / virtual world",
    ],
  },
  {
    id: 5,
    text: "A teammate proposes a creative but risky solution. Your reaction?",
    options: [
      "Analyse the failure modes — I want to know exactly what could go wrong",
      "Prototype it fast — better to test and see than to debate endlessly",
      "Map out the business risk alongside the technical risk",
      "Research if similar approaches have succeeded or failed elsewhere",
    ],
  },
  {
    id: 6,
    text: "Which school subjects felt most alive to you?",
    options: [
      "Maths and Physics — elegant proofs and how the universe works",
      "Chemistry and Biology — the material world at the molecular level",
      "Computer Science and Logic — building systems that think",
      "Economics and Strategy — how decisions shape outcomes",
    ],
  },
  {
    id: 7,
    text: "Where do you see yourself working ten years from now?",
    options: [
      "Inside a research lab pushing the boundary of what's possible",
      "At a product company shipping features used by millions",
      "Running my own venture solving a problem I care deeply about",
      "Consulting across industries, applying expertise broadly",
    ],
  },
  {
    id: 8,
    text: "Which of these technologies excites you the most right now?",
    options: [
      "Large language models and generative AI",
      "Autonomous vehicles and robotics",
      "Renewable energy and sustainable infrastructure",
      "Biotech, CRISPR, and medical devices",
    ],
  },
  {
    id: 9,
    text: "How do you prefer to measure success in your work?",
    options: [
      "Precision and correctness — the answer is either right or wrong",
      "Impact — how many people's lives improved because of this",
      "Efficiency — the same output with fewer resources",
      "Innovation — we did something nobody had done before",
    ],
  },
  {
    id: 10,
    text: "When you join a group project, what role do you naturally drift into?",
    options: [
      "The architect — figuring out how everything fits together",
      "The implementer — hands on, making things actually work",
      "The communicator — keeping everyone aligned and the vision clear",
      "The researcher — making sure we're solving the right problem",
    ],
  },
  {
    id: 11,
    text: "Which constraint do you find most motivating to work within?",
    options: [
      "Physical laws — gravity, thermodynamics, material limits",
      "Computational limits — latency, memory, scale",
      "Human limits — attention, trust, behaviour, adoption",
      "Financial limits — making something great with limited budget",
    ],
  },
  {
    id: 12,
    text: "Finish this sentence: 'I want my career to be remembered for…'",
    options: [
      "Building systems that last — infrastructure others build on top of",
      "Solving a problem that everyone said was impossible",
      "Creating something beautiful that people love using every day",
      "Training the next generation of engineers and leaders",
    ],
  },
];

// ─── Field Results Logic ──────────────────────────────────────────────────────

const FIELDS = [
  {
    emoji: "🧠",
    name: "AI / Machine Learning",
    slug: "ai-machine-learning",
    tagline: "Teaching machines to think",
    explanationTemplate: () =>
      `Your instinct to look for patterns, excitement about LLMs and generative AI, and preference for measuring success through innovation all point strongly toward AI/ML. You're drawn to problems where the solution isn't hard-coded — it emerges from data. That's exactly where this field lives.`,
  },
  {
    emoji: "🤖",
    name: "Robotics",
    slug: "robotics",
    tagline: "Building things that move",
    explanationTemplate: () =>
      `Your love for tangible, physical builds and your excitement about autonomous vehicles and robotics reveals a hands-on maker instinct. You want to see, touch, and test what you create. Robotics sits at the intersection of mechanical design, electronics, and software — giving you all three.`,
  },
  {
    emoji: "🌐",
    name: "Web Development",
    slug: "web-development",
    tagline: "Shipping products at scale",
    explanationTemplate: () =>
      `Your drive to ship features used by millions, comfort in the digital world, and satisfaction from products that just work — these are the hallmarks of a great software engineer. You think in systems, move fast, and care deeply about reliability and user experience.`,
  },
  {
    emoji: "🔬",
    name: "Bioinformatics",
    slug: "bioinformatics",
    tagline: "Engineering that saves lives",
    explanationTemplate: () =>
      `Your interest in Chemistry, Biology, and medical technologies signals a calling toward biomedical/bioinformatics engineering. You want your work to have direct human impact — and this field measures success in lives improved, which aligns perfectly with how you think.`,
  },
  {
    emoji: "☁️",
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    tagline: "Building a sustainable future",
    explanationTemplate: () =>
      `You think in systems and long time-horizons. Cloud & DevOps rewards engineers who care about reliability, efficiency, and collective infrastructure impact — the backbone that every other product depends on. Your answers show exactly that kind of thinking.`,
  },
  {
    emoji: "📱",
    name: "Mobile Development",
    slug: "mobile-development",
    tagline: "Designing things people love",
    explanationTemplate: () =>
      `You gravitate toward user needs and want your career remembered for creating something beautiful that people love using. Mobile development rewards empathy, craft, and an obsession with the experience — making it the perfect match for how you think.`,
  },
];

// Field index reference (matches FIELDS array order):
//   0 = AI & ML  |  1 = Mechanical & Robotics  |  2 = Software Engineering
//   3 = Biomedical  |  4 = Environmental & Energy  |  5 = Product & UX Design
//
// Each inner array = [optionA, optionB, optionC, optionD] → field index for that option
const OPTION_TO_FIELD = [
  [2, 1, 0, 5], // Q1:  logical steps→SW, visualise→Mech, patterns→AI, people→Product
  [1, 0, 5, 2], // Q2:  robot/drone→Mech, ML program→AI, design product→Product, infra→SW
  [4, 3, 5, 2], // Q3:  bridge/building→Env, diagnosis algo→Bio, startup→Product, code→SW
  [1, 2, 0, 2], // Q4:  love physical→Mech, more software→SW, mix (hw+sw)→AI, digital→SW
  [0, 1, 5, 4], // Q5:  analyse failures→AI, prototype fast→Mech, business risk→Product, research→Env
  [0, 3, 0, 5], // Q6:  maths/physics→AI, chem/bio→Bio, CS/logic→AI, economics→Product
  [0, 2, 5, 4], // Q7:  research lab→AI, product company→SW, own venture→Product, consulting→Env
  [0, 1, 4, 3], // Q8:  LLMs/GenAI→AI, autonomous vehicles→Mech, renewables→Env, biotech→Bio
  [2, 3, 4, 0], // Q9:  precision/correct→SW, impact/lives→Bio, efficiency→Env, innovation→AI
  [2, 1, 5, 0], // Q10: architect→SW, implementer→Mech, communicator→Product, researcher→AI
  [1, 2, 5, 4], // Q11: physical laws→Mech, compute limits→SW, human limits→Product, financial→Env
  [2, 0, 5, 4], // Q12: systems that last→SW, impossible problem→AI, beautiful things→Product, teach→Env
];

// Fixed match percentages — deterministic, no randomness
const MATCH_PCTS = [94, 81, 73];

function computeResults(answers) {
  const scores = new Array(FIELDS.length).fill(0);

  Object.entries(answers).forEach(([qIdx, optIdx]) => {
    const qi = parseInt(qIdx);
    const fieldIdx = OPTION_TO_FIELD[qi]?.[optIdx];
    if (fieldIdx !== undefined) {
      scores[fieldIdx] += 10;
    }
  });

  // Rank all fields by score, take exactly the top 3
  const top3 = FIELDS
    .map((field, i) => ({ ...field, score: scores[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Apply fixed, deterministic match percentages
  return top3.map((field, i) => ({
    ...field,
    matchPct: MATCH_PCTS[i],
  }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuizNavbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid rgba(39,39,42,0.8)",
        backgroundColor: "rgba(9,9,11,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "white",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "-0.02em",
            opacity: 1,
            transition: "opacity 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: "24px", height: "24px" }}
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <span>Dishant</span>
        </Link>

        <Link
          href="/"
          style={{
            color: "#71717a",
            fontSize: "0.875rem",
            textDecoration: "none",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a1a1aa")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#71717a")}
        >
          Save &amp; exit
        </Link>
      </div>
    </header>
  );
}

function ProgressBar({ current, total }) {
  const pct = ((current - 1) / total) * 100;
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "1.5rem 1.5rem 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span
          style={{ color: "#52525b", fontSize: "0.8rem", fontWeight: 500 }}
        >
          Discovering your path
        </span>
        <span
          style={{ color: "#52525b", fontSize: "0.8rem", fontWeight: 500 }}
        >
          Question {current} of {total}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "3px",
          backgroundColor: "#18181b",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: "#6366f1",
            borderRadius: "999px",
            transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
}

function OptionCard({ letter, text, selected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const active = selected || hovered;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        width: "100%",
        padding: "16px 18px",
        borderRadius: "12px",
        border: `1px solid ${active ? "#6366f1" : "rgba(63,63,70,0.6)"}`,
        backgroundColor: active ? "rgba(99,102,241,0.08)" : "rgba(24,24,27,0.8)",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s ease",
        outline: "none",
        boxShadow: selected ? "0 0 0 1px rgba(99,102,241,0.3)" : "none",
      }}
    >
      <span
        style={{
          minWidth: "28px",
          height: "28px",
          borderRadius: "7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          flexShrink: 0,
          marginTop: "1px",
          backgroundColor: selected ? "#6366f1" : "rgba(39,39,42,0.8)",
          color: selected ? "#fff" : "#71717a",
          transition: "all 0.15s ease",
          border: selected ? "none" : "1px solid rgba(63,63,70,0.6)",
        }}
      >
        {letter}
      </span>
      <span
        style={{
          fontSize: "0.95rem",
          lineHeight: "1.6",
          color: selected ? "#fff" : hovered ? "#e4e4e7" : "#a1a1aa",
          transition: "color 0.15s ease",
          fontWeight: selected ? 500 : 400,
        }}
      >
        {text}
      </span>
    </button>
  );
}

// ─── Screen 1 — Active Question ───────────────────────────────────────────────

function QuestionScreen({ question, qIndex, total, answer, onAnswer, onContinue, onBack, onSkip, visible }) {
  const letters = ["A", "B", "C", "D"];

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.22s ease, transform 0.22s ease",
        pointerEvents: visible ? "auto" : "none",
        position: visible ? "relative" : "absolute",
        width: "100%",
      }}
    >
      <ProgressBar current={qIndex + 1} total={total} />

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "2rem 1.5rem 3rem",
        }}
      >
        {/* Question label */}
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "#6366f1",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Question {qIndex + 1}
        </p>

        {/* Question text */}
        <h2
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)",
            fontWeight: 500,
            color: "#fff",
            lineHeight: "1.65",
            marginBottom: "2rem",
            letterSpacing: "-0.01em",
          }}
        >
          {question.text}
        </h2>

        {/* Options */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "2rem",
          }}
        >
          {question.options.map((opt, i) => (
            <OptionCard
              key={i}
              letter={letters[i]}
              text={opt}
              selected={answer === i}
              onClick={() => onAnswer(i)}
            />
          ))}
        </div>

        {/* Back / Continue */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <button
            onClick={onBack}
            disabled={qIndex === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: qIndex === 0 ? "#3f3f46" : "#71717a",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: qIndex === 0 ? "not-allowed" : "pointer",
              padding: "8px 0",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (qIndex !== 0) e.currentTarget.style.color = "#a1a1aa";
            }}
            onMouseLeave={(e) => {
              if (qIndex !== 0) e.currentTarget.style.color = "#71717a";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>

          <button
            onClick={answer !== undefined ? onContinue : undefined}
            disabled={answer === undefined}
            style={{
              padding: "10px 28px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: answer !== undefined ? "#6366f1" : "#27272a",
              color: answer !== undefined ? "#fff" : "#52525b",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: answer !== undefined ? "pointer" : "not-allowed",
              transition: "all 0.15s ease",
              boxShadow:
                answer !== undefined
                  ? "0 4px 16px rgba(99,102,241,0.3)"
                  : "none",
            }}
            onMouseEnter={(e) => {
              if (answer !== undefined)
                e.currentTarget.style.backgroundColor = "#818cf8";
            }}
            onMouseLeave={(e) => {
              if (answer !== undefined)
                e.currentTarget.style.backgroundColor = "#6366f1";
            }}
          >
            {qIndex === total - 1 ? "See my results →" : "Continue →"}
          </button>
        </div>

        {/* Skip */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onSkip}
            style={{
              background: "none",
              border: "none",
              color: "#52525b",
              fontSize: "0.8rem",
              textDecoration: "underline",
              cursor: "pointer",
              transition: "color 0.15s ease",
              textUnderlineOffset: "3px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#71717a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#52525b")}
          >
            Skip this question
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 2 — Processing ────────────────────────────────────────────────────

function ProcessingScreen({ visible }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
        position: visible ? "relative" : "absolute",
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <style>{`
        @keyframes brainPulse {
          0%, 100% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      <div
        style={{
          fontSize: "4rem",
          marginBottom: "1.5rem",
          animation: "brainPulse 2s ease-in-out infinite",
          display: "inline-block",
        }}
      >
        🧠
      </div>

      <h2
        style={{
          fontSize: "1.4rem",
          fontWeight: 600,
          color: "#fff",
          marginBottom: "10px",
          letterSpacing: "-0.02em",
          textAlign: "center",
        }}
      >
        Analysing your answers
        <span style={{ display: "inline-flex", gap: "3px", marginLeft: "4px" }}>
          {[0, 0.3, 0.6].map((delay, i) => (
            <span
              key={i}
              style={{
                animation: `dotPulse 1.2s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                display: "inline-block",
              }}
            >
              .
            </span>
          ))}
        </span>
      </h2>

      <p
        style={{
          color: "#52525b",
          fontSize: "0.95rem",
          textAlign: "center",
          maxWidth: "340px",
          lineHeight: "1.6",
        }}
      >
        Finding the engineering fields that fit you best
      </p>
    </div>
  );
}

// ─── Screen 3 — Results ───────────────────────────────────────────────────────

const RANK_LABELS = ["Best match", "Strong match", "Good match"];
const RANK_COLORS = ["#6366f1", "#71717a", "#71717a"];

function ResultCard({ result, rank, visible, delay }) {
  const isTop = rank === 0;

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.35s ease ${delay}s, transform 0.35s ease ${delay}s`,
        padding: "20px",
        borderRadius: "14px",
        border: `1px solid ${isTop ? "rgba(99,102,241,0.5)" : "rgba(39,39,42,0.8)"}`,
        backgroundColor: isTop
          ? "rgba(99,102,241,0.07)"
          : "rgba(18,18,20,0.9)",
        boxShadow: isTop ? "0 0 0 1px rgba(99,102,241,0.15) inset" : "none",
        display: "flex",
        gap: "18px",
        alignItems: "flex-start",
      }}
    >
      {/* Emoji */}
      <div
        style={{
          fontSize: "2.25rem",
          lineHeight: 1,
          flexShrink: 0,
          marginTop: "2px",
        }}
      >
        {result.emoji}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Rank label */}
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: RANK_COLORS[rank],
            marginBottom: "6px",
          }}
        >
          {RANK_LABELS[rank]}
        </p>

        {/* Field name + match badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {result.name}
          </h3>
          <span
            style={{
              padding: "2px 10px",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 700,
              backgroundColor: isTop
                ? "rgba(99,102,241,0.25)"
                : "rgba(39,39,42,0.9)",
              color: isTop ? "#818cf8" : "#71717a",
              border: `1px solid ${isTop ? "rgba(99,102,241,0.4)" : "rgba(63,63,70,0.6)"}`,
              whiteSpace: "nowrap",
            }}
          >
            {result.matchPct}% match
          </span>
        </div>

        {/* Explanation */}
        <p
          style={{
            fontSize: "0.85rem",
            color: "#52525b",
            lineHeight: "1.7",
            margin: 0,
          }}
        >
          {result.explanationTemplate({})}
        </p>
      </div>
    </div>
  );
}

function ResultsScreen({ results, visible, onStartRoadmap, isAssigning, assignError }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
        pointerEvents: visible ? "auto" : "none",
        position: visible ? "relative" : "absolute",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 4rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              display: "inline-block",
            }}
          >
            🎯
          </div>
          <h1
            style={{
              fontSize: "clamp(1.4rem, 3vw, 1.75rem)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.03em",
              marginBottom: "10px",
            }}
          >
            Your top field matches
          </h1>
          <p
            style={{
              color: "#52525b",
              fontSize: "0.9rem",
              lineHeight: "1.7",
              maxWidth: "440px",
              margin: "0 auto",
            }}
          >
            Based on how you think, what excites you, and where you see yourself
            — here are the three engineering fields that fit you best.
          </p>
        </div>

        {/* Result cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginBottom: "2.5rem",
          }}
        >
          {results.map((r, i) => (
            <ResultCard
              key={i}
              result={r}
              rank={i}
              visible={visible}
              delay={0.1 + i * 0.12}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>

          {assignError && (
            <div
              style={{
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#f87171",
                fontSize: "0.875rem",
                textAlign: "center",
                marginBottom: "4px",
                fontWeight: 500
              }}
            >
              {assignError}
            </div>
          )}

          <button
            onClick={isAssigning ? undefined : onStartRoadmap}
            disabled={isAssigning}
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: isAssigning ? "#27272a" : "#6366f1",
              color: isAssigning ? "#71717a" : "#fff",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: isAssigning ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              boxShadow: isAssigning ? "none" : "0 4px 20px rgba(99,102,241,0.35)",
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            onMouseEnter={(e) => {
              if (!isAssigning) {
                e.currentTarget.style.backgroundColor = "#818cf8";
                e.currentTarget.style.boxShadow =
                  "0 6px 24px rgba(99,102,241,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isAssigning) {
                e.currentTarget.style.backgroundColor = "#6366f1";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(99,102,241,0.35)";
              }
            }}
          >
            {isAssigning ? (
              <>
                <svg
                  style={{
                    animation: "spin 1s linear infinite",
                    width: "18px",
                    height: "18px",
                    color: "currentColor"
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    style={{ opacity: 0.25 }}
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    style={{ opacity: 0.75 }}
                  />
                </svg>
                <span>Creating your roadmap...</span>
              </>
            ) : (
              <span>Start my {results[0]?.name} roadmap →</span>
            )}
          </button>

          {/* Per-field explore buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {results.map((r) => (
              <a
                key={r.slug}
                href={`/explore/${r.slug}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "1px solid rgba(63,63,70,0.7)",
                  backgroundColor: "transparent",
                  color: "#a1a1aa",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.45)";
                  e.currentTarget.style.color = "#e4e4e7";
                  e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(63,63,70,0.7)";
                  e.currentTarget.style.color = "#a1a1aa";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span style={{ fontSize: "1rem", lineHeight: 1 }}>{r.emoji}</span>
                <span>Explore {r.name}</span>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: 0.5, flexShrink: 0 }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────

export default function QuizClient() {
  const router = useRouter();
  const [screen, setScreen] = useState("quiz"); // "quiz" | "processing" | "results"
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [transitioning, setTransitioning] = useState(false);
  const [results, setResults] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");

  async function handleStartRoadmap() {
    if (results.length === 0 || isAssigning) return;
    setIsAssigning(true);
    setAssignError("");

    try {
      const topResult = results[0];
      const result = await assignRoadmap(topResult.slug);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setAssignError(result.error || "Failed to assign roadmap. Please try again.");
        setIsAssigning(false);
      }
    } catch (err) {
      console.error("Error in handleStartRoadmap:", err);
      setAssignError("An unexpected error occurred. Please try again.");
      setIsAssigning(false);
    }
  }

  const currentAnswer = answers[qIndex];

  function handleAnswer(optIdx) {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIdx }));
  }

  function handleContinue() {
    if (transitioning) return;
    if (qIndex < QUESTIONS.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setQIndex((i) => i + 1);
        setTransitioning(false);
      }, 200);
    } else {
      // Last question — go to processing
      setScreen("processing");
      const computed = computeResults(answers);
      setResults(computed);
      setTimeout(() => {
        setScreen("results");
      }, 2600);
    }
  }

  function handleBack() {
    if (qIndex === 0 || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setQIndex((i) => i - 1);
      setTransitioning(false);
    }, 200);
  }

  function handleSkip() {
    if (qIndex < QUESTIONS.length - 1) {
      handleContinue();
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#09090b",
        color: "#fff",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <QuizNavbar />

      <main
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Screen 1 — Questions */}
        {screen === "quiz" && (
          <QuestionScreen
            question={QUESTIONS[qIndex]}
            qIndex={qIndex}
            total={QUESTIONS.length}
            answer={currentAnswer}
            onAnswer={handleAnswer}
            onContinue={handleContinue}
            onBack={handleBack}
            onSkip={handleSkip}
            visible={!transitioning}
          />
        )}

        {/* Screen 2 — Processing */}
        <ProcessingScreen visible={screen === "processing"} />

        {/* Screen 3 — Results */}
        {results.length > 0 && (
          <ResultsScreen
            results={results}
            visible={screen === "results"}
            onStartRoadmap={handleStartRoadmap}
            isAssigning={isAssigning}
            assignError={assignError}
          />
        )}
      </main>
    </div>
  );
}
