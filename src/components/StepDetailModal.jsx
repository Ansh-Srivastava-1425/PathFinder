'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { updateStepProgress } from '@/actions/progress'
import { submitStepProof } from '@/actions/submitStepProof'

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>
  )
}

function ArticleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  )
}

function DocsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0 opacity-60">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}

// ─── Resource type config ─────────────────────────────────────────────────────

const RESOURCE_CONFIG = {
  video: {
    icon: <VideoIcon />,
    label: 'Video',
    colorClass: 'bg-red-950/40 border-red-800/40 text-red-400',
    badgeClass: 'bg-red-950/30 text-red-400 border-red-800/30',
  },
  article: {
    icon: <ArticleIcon />,
    label: 'Article',
    colorClass: 'bg-blue-950/40 border-blue-800/40 text-blue-400',
    badgeClass: 'bg-blue-950/30 text-blue-400 border-blue-800/30',
  },
  docs: {
    icon: <DocsIcon />,
    label: 'Docs',
    colorClass: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400',
    badgeClass: 'bg-emerald-950/30 text-emerald-400 border-emerald-800/30',
  },
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const config = {
    completed: { label: 'Completed', cls: 'bg-indigo-950/50 border-indigo-700/40 text-indigo-300' },
    in_progress: { label: 'In Progress', cls: 'bg-amber-950/50 border-amber-700/40 text-amber-300' },
    not_started: { label: 'Not Started', cls: 'bg-zinc-800/70 border-zinc-700/40 text-zinc-400' },
  }
  const { label, cls } = config[status] || config.not_started
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  )
}

// ─── Markdown renderer (custom components for dark theme) ────────────────────

const MarkdownComponents = {
  h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-3 mt-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold text-white mb-2 mt-4">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-bold text-zinc-200 mb-2 mt-3">{children}</h3>,
  p: ({ children }) => <p className="text-sm text-zinc-300 leading-relaxed mb-3">{children}</p>,
  ul: ({ children }) => <ul className="space-y-1.5 mb-3 pl-1">{children}</ul>,
  ol: ({ children }) => <ol className="space-y-1.5 mb-3 pl-1 list-decimal list-inside">{children}</ol>,
  li: ({ children }) => (
    <li className="text-sm text-zinc-300 leading-relaxed flex gap-2">
      <span className="text-indigo-400 mt-1 shrink-0">▸</span>
      <span>{children}</span>
    </li>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-300 text-xs font-mono border border-zinc-700">
        {children}
      </code>
    ) : (
      <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-3">
        <code className="text-xs text-zinc-300 font-mono">{children}</code>
      </pre>
    ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-indigo-500 pl-4 my-3 text-zinc-400 italic">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
      {children}
    </a>
  ),
  hr: () => <hr className="border-zinc-800 my-4" />,
}

// ─── Main Modal Component ─────────────────────────────────────────────────────

const getSalaryRange = (slug) => {
  switch (slug) {
    case 'web-development':
      return '₹4L – ₹25L per year';
    case 'ai-machine-learning':
      return '₹6L – ₹35L per year';
    case 'robotics':
      return '₹4L – ₹20L per year';
    case 'vlsi-chip-design':
      return '₹5L – ₹30L per year';
    case 'cybersecurity':
      return '₹5L – ₹28L per year';
    default:
      return '₹4L – ₹20L per year';
  }
};

/**
 * StepDetailModal
 * 
 * Props:
 *   step          — { id, name, meta, resources, project_instructions, requires_submission }
 *   status        — 'not_started' | 'in_progress' | 'completed'
 *   fieldSlug     — string
 *   onClose       — () => void
 *   onComplete    — (stepId) => void  — called on successful completion (optimistic update)
 */
export default function StepDetailModal({ step, status, fieldSlug, onClose, onComplete }) {
  const [githubUrl, setGithubUrl] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [localStatus, setLocalStatus] = useState(status)

  // Existing submission URL (if already completed)
  const existingNote = step?.personal_note || ''

  // Trap focus and close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleMarkComplete = () => {
    setIsMarkingComplete(true)
    startTransition(async () => {
      const result = await updateStepProgress(fieldSlug, step.id, 'completed')
      if (result.success) {
        setLocalStatus('completed')
        onComplete(step.id)
      }
      setIsMarkingComplete(false)
    })
  }

  const handleSubmitProof = () => {
    setSubmitError('')
    setSubmitSuccess('')
    startTransition(async () => {
      const result = await submitStepProof({
        fieldSlug,
        stepId: step.id,
        githubUrl,
      })
      if (result.success) {
        setLocalStatus('completed')
        setSubmitSuccess('🎉 Submission saved! Step marked complete.')
        onComplete(step.id)
      } else {
        setSubmitError(result.error)
      }
    })
  }

  const isCompleted = localStatus === 'completed'
  const resources = step?.resources || []
  const hasInstructions = !!step?.project_instructions
  const requiresSubmission = !!step?.requires_submission

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="step-modal-title"
        className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto z-50 flex flex-col w-full h-full sm:h-auto sm:max-w-xl bg-zinc-900 border-l border-zinc-800/80 shadow-2xl overflow-y-auto"
        style={{ animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* ── Section A: Header ── */}
        <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800/60 px-6 py-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                {step?.meta?.split('•')[0]?.trim() || 'Step'}
              </span>
              <StatusBadge status={localStatus} />
            </div>
            <h2
              id="step-modal-title"
              className="text-lg font-extrabold text-white leading-snug"
            >
              {step?.name}
            </h2>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <span>🇮🇳 Est. Salary:</span>
              <span className="font-semibold text-emerald-400">{getSalaryRange(fieldSlug)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close panel"
          >
            <XIcon />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 px-6 py-6 space-y-8">

          {/* ── Section B: Resources ── */}
          {resources.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Learning Resources
              </h3>
              <ul className="space-y-2.5">
                {resources.map((res, i) => {
                  const cfg = RESOURCE_CONFIG[res.type] || RESOURCE_CONFIG.article
                  return (
                    <li key={i}>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all group hover:opacity-90 ${cfg.colorClass}`}
                      >
                        <span className="shrink-0">{cfg.icon}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-white group-hover:underline underline-offset-2 truncate">
                            {res.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${cfg.badgeClass}`}>
                              {res.type}
                            </span>
                            {res.label && (
                              <span className="text-xs font-semibold text-zinc-300">
                                {res.label}
                              </span>
                            )}
                          </div>
                        </span>
                        <ExternalLinkIcon />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {/* Empty resources state */}
          {resources.length === 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Learning Resources
              </h3>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800/50 bg-zinc-950/40">
                <span className="text-2xl">📚</span>
                <p className="text-sm text-zinc-500">
                  Resources for this step are being curated. Check back soon.
                </p>
              </div>
            </section>
          )}

          {/* ── Section C: Project Instructions ── */}
          {hasInstructions && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Project Instructions
              </h3>
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 px-5 py-4">
                <ReactMarkdown components={MarkdownComponents}>
                  {step.project_instructions?.replace(/\\n/g, '\n')}
                </ReactMarkdown>
              </div>
            </section>
          )}

          {/* ── Section D: GitHub Submission ── */}
          {requiresSubmission && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Project Submission
              </h3>

              {isCompleted && existingNote ? (
                // Already submitted — show the URL
                <div className="flex items-center gap-3 p-4 rounded-xl border border-indigo-800/40 bg-indigo-950/20">
                  <span className="text-indigo-400"><GitHubIcon /></span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-zinc-500 block">Submitted repo</span>
                    <a
                      href={existingNote}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-400 hover:text-indigo-300 font-medium truncate block underline underline-offset-2"
                    >
                      {existingNote}
                    </a>
                  </div>
                </div>
              ) : isCompleted && submitSuccess ? (
                <div className="p-4 rounded-xl border border-emerald-800/40 bg-emerald-950/20 text-sm text-emerald-400 font-medium">
                  {submitSuccess}
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-4 space-y-3">
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Build this project and push it to GitHub. Paste your public repository URL below to unlock this step.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                      <GitHubIcon />
                    </span>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => { setGithubUrl(e.target.value); setSubmitError('') }}
                      onKeyDown={(e) => e.key === 'Enter' && !isPending && githubUrl.trim() && handleSubmitProof()}
                      placeholder="github.com/yourname/project-repo"
                      disabled={isPending || isCompleted}
                      className="w-full pl-9 pr-4 h-11 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-400 bg-red-950/30 border border-red-800/30 rounded-lg px-3 py-2">
                      {submitError}
                    </p>
                  )}
                  {submitSuccess && (
                    <p className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 rounded-lg px-3 py-2">
                      {submitSuccess}
                    </p>
                  )}
                </div>
              )}
            </section>
          )}
        </div>

        {/* ── Section E: Action footer ── */}
        <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur border-t border-zinc-800/60 px-6 py-4">
          {isCompleted ? (
            <div className="flex items-center gap-2.5 text-sm font-semibold text-indigo-400">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600">
                <CheckIcon />
              </span>
              Step completed
            </div>
          ) : requiresSubmission ? (
            <button
              type="button"
              onClick={handleSubmitProof}
              disabled={isPending || !githubUrl.trim()}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-indigo-900/30"
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying…
                </>
              ) : (
                <>
                  <GitHubIcon />
                  Submit GitHub Repo
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={isPending || isMarkingComplete}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-indigo-900/30"
            >
              {isPending || isMarkingComplete ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <CheckIcon />
                  Mark as Complete
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Slide-in animation keyframe */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}
