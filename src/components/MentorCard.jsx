'use client'

import { useState, useTransition } from 'react'
import { bookSession } from '@/actions/bookSession'

// ─── Tag pill ────────────────────────────────────────────────────────────────
function TagPill({ label }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-[11px] font-semibold text-zinc-400 tracking-wide">
      {label}
    </span>
  )
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ name, avatarUrl, size = 'md' }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sizeClasses = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-14 h-14 text-base'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0`}
      />
    )
  }

  // Deterministic gradient from name
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  const bg = `hsl(${hue} 55% 22%)`
  const text = `hsl(${hue} 80% 72%)`

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center shrink-0 font-extrabold ring-2 ring-white/5`}
      style={{ background: bg, color: text }}
    >
      {initials}
    </div>
  )
}

// ─── MentorCard ──────────────────────────────────────────────────────────────

/**
 * Props:
 *   mentor          — full mentor row from Supabase
 *   onOpenWaitlist  — () => void  — opens the waitlist modal (when no calendly_url)
 */
export default function MentorCard({ mentor, onOpenWaitlist }) {
  const [booked, setBooked] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleBook = () => {
    if (mentor.calendly_url) {
      // Open Calendly in new tab immediately (no async delay)
      window.open(mentor.calendly_url, '_blank', 'noopener,noreferrer')
      // Log the session in the background — don't block UX
      startTransition(async () => {
        await bookSession(mentor.id)
        setBooked(true)
      })
    } else {
      // Fallback: open the waitlist modal
      onOpenWaitlist?.()
    }
  }

  const tags = Array.isArray(mentor.tags) ? mentor.tags : []

  return (
    <article className="group relative flex flex-col bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5 backdrop-blur-sm shadow-lg shadow-black/20 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-indigo-900/20 hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01]">
      {/* Subtle indigo glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />

      {/* Header row */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar name={mentor.name} avatarUrl={mentor.avatar_url} />

        <div className="flex-1 min-w-0 space-y-0.5">
          <h3 className="text-base font-bold text-white leading-snug truncate">
            {mentor.name}
          </h3>
          {mentor.title && (
            <p className="text-xs text-zinc-400 leading-snug truncate">{mentor.title}</p>
          )}
          {mentor.years_experience != null && (
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-semibold pt-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {mentor.years_experience}+ yrs experience
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {mentor.bio && (
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4 flex-1">
          {mentor.bio}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
      )}

      {/* Action */}
      <button
        type="button"
        onClick={handleBook}
        disabled={isPending}
        className={`mt-auto w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
          booked
            ? 'bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 cursor-default'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/30 hover:shadow-indigo-700/30 disabled:opacity-60 disabled:cursor-not-allowed'
        }`}
      >
        {booked ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Session logged!
          </>
        ) : mentor.calendly_url ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Book a Session
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              <line x1="6" y1="1" x2="6" y2="4"/>
              <line x1="10" y1="1" x2="10" y2="4"/>
              <line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
            Join Waitlist
          </>
        )}
      </button>
    </article>
  )
}
