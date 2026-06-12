'use client'

import { useState, useMemo } from 'react'
import MentorCard from '@/components/MentorCard'
import { submitWaitlist } from '@/actions/submitWaitlist'

// ─── Field filter config ──────────────────────────────────────────────────────
// Keep in sync with fieldsData.js keys
const FIELD_FILTERS = [
  { label: 'All',                  slug: 'all' },
  { label: 'Web Dev',              slug: 'web-development' },
  { label: 'AI / ML',             slug: 'ai-machine-learning' },
  { label: 'Data Science',        slug: 'data-science' },
  { label: 'Computer Vision',     slug: 'computer-vision' },
  { label: 'Cloud & DevOps',      slug: 'cloud-devops' },
  { label: 'Cybersecurity',       slug: 'cybersecurity' },
  { label: 'Mobile Dev',          slug: 'mobile-development' },
  { label: 'Embedded Systems',    slug: 'embedded-systems' },
  { label: 'Robotics',            slug: 'robotics' },
  { label: 'VLSI',                slug: 'vlsi-chip-design' },
  { label: 'Space Tech',          slug: 'space-technology' },
  { label: 'Bioinformatics',      slug: 'bioinformatics' },
  { label: 'Comp Biology',        slug: 'computational-biology' },
]

// ─── Waitlist modal (inline — reused from Navbar) ─────────────────────────────
function WaitlistModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'success' | string (error message)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setStatus(null)
    try {
      const res = await submitWaitlist({ email, source: 'mentor' })
      if (res.success) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus(res.error || 'Failed to join waitlist.')
      }
    } catch (err) {
      setStatus('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white">Mentor sessions coming soon</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              This mentor&apos;s calendar isn&apos;t live yet. Drop your email and we&apos;ll notify you when they open slots.
            </p>
          </div>

          {status === 'success' ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <p className="text-sm font-semibold text-emerald-400">You&apos;re on the list!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {status && status !== 'success' && (
                <p className="text-xs text-red-400">{status}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Notify me'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ query, filter }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 space-y-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl">
        🔍
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white">No mentors found</h3>
        <p className="text-sm text-zinc-500">
          {query
            ? `No results for "${query}"`
            : filter !== 'all'
            ? 'No mentors in this field yet — check back soon!'
            : 'No mentors available yet.'}
        </p>
      </div>
    </div>
  )
}

// ─── Main client component ───────────────────────────────────────────────────

export default function MentorsClient({ mentors }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)

  // Only show filters that have at least one mentor
  const availableFilters = useMemo(() => {
    const slugsWithMentors = new Set(mentors.map((m) => m.field_slug).filter(Boolean))
    return FIELD_FILTERS.filter(
      (f) => f.slug === 'all' || slugsWithMentors.has(f.slug)
    )
  }, [mentors])

  const filtered = useMemo(() => {
    let result = mentors

    if (activeFilter !== 'all') {
      result = result.filter((m) => m.field_slug === activeFilter)
    }

    const q = searchQuery.toLowerCase().trim()
    if (q) {
      result = result.filter((m) => {
        const inName  = m.name?.toLowerCase().includes(q)
        const inTitle = m.title?.toLowerCase().includes(q)
        const inTags  = Array.isArray(m.tags) && m.tags.some((t) => t.toLowerCase().includes(q))
        const inBio   = m.bio?.toLowerCase().includes(q)
        return inName || inTitle || inTags || inBio
      })
    }

    return result
  }, [mentors, activeFilter, searchQuery])

  return (
    <>
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Result count */}
          <p className="text-sm text-zinc-500 shrink-0">
            {filtered.length} mentor{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter pills */}
        {availableFilters.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {availableFilters.map((f) => (
              <button
                key={f.slug}
                onClick={() => setActiveFilter(f.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  activeFilter === f.slug
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-900/30'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Mentor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.length === 0 ? (
            <EmptyState query={searchQuery} filter={activeFilter} />
          ) : (
            filtered.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onOpenWaitlist={() => setIsWaitlistOpen(true)}
              />
            ))
          )}
        </div>

        {/* Empty DB state */}
        {mentors.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <div className="text-5xl">🧑‍💻</div>
            <h2 className="text-xl font-bold text-white">Mentors coming soon</h2>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              We&apos;re onboarding verified industry engineers. Drop your email and be first to know when sessions go live.
            </p>
            <button
              onClick={() => setIsWaitlistOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white transition-colors cursor-pointer"
            >
              Join the waitlist
            </button>
          </div>
        )}
      </section>

      {/* Waitlist modal */}
      {isWaitlistOpen && (
        <WaitlistModal onClose={() => setIsWaitlistOpen(false)} />
      )}
    </>
  )
}
