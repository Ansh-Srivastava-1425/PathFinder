'use client'

import { useState } from 'react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function downloadCSV(rows, filename) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] == null ? '' : String(row[h])
          // Escape quotes and wrap in quotes if contains comma/quote/newline
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            return `"${val.replace(/"/g, '""')}"`
          }
          return val
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function WaitlistTable({ rows, type }) {
  return (
    <div className="rounded-xl border border-zinc-800/70 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-900/80 text-zinc-500 text-xs uppercase tracking-widest">
            <th className="text-left px-4 py-3 font-semibold">#</th>
            <th className="text-left px-4 py-3 font-semibold">Email</th>
            {type === 'mentor' && (
              <th className="text-left px-4 py-3 font-semibold">Source</th>
            )}
            <th className="text-left px-4 py-3 font-semibold">Signed up</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={type === 'mentor' ? 4 : 3}
                className="px-4 py-12 text-center text-zinc-600"
              >
                No entries yet.
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr
                key={r.id || r.email || i}
                className={`border-t border-zinc-800/50 transition-colors hover:bg-zinc-800/30 ${
                  i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/40'
                }`}
              >
                <td className="px-4 py-3 text-zinc-600 tabular-nums">{i + 1}</td>
                <td className="px-4 py-3 text-zinc-300 font-medium">{r.email || '—'}</td>
                {type === 'mentor' && (
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-950/40 border border-violet-800/30 text-violet-300 text-xs font-medium">
                      {r.source || 'mentor'}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                  {formatDate(r.created_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const TABS = [
  { key: 'newsletter', label: 'Newsletter', icon: '📬' },
  { key: 'mentor', label: 'Mentor Waitlist', icon: '⏳' },
]

export default function WaitlistClient({ newsletter, mentorWaitlist }) {
  const [activeTab, setActiveTab] = useState('newsletter')

  const isNewsletter = activeTab === 'newsletter'
  const rows = isNewsletter ? newsletter : mentorWaitlist
  const csvFilename = isNewsletter ? 'newsletter_subscribers.csv' : 'mentor_waitlist.csv'
  const csvRows = rows.map((r) =>
    isNewsletter
      ? { email: r.email, created_at: r.created_at }
      : { email: r.email, source: r.source, created_at: r.created_at }
  )

  return (
    <main className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white">Waitlists</h1>
          <p className="text-sm text-zinc-500">
            {rows.length} {isNewsletter ? 'newsletter subscribers' : 'mentor waitlist entries'}
          </p>
        </div>

        {/* Export CSV */}
        <button
          onClick={() => downloadCSV(csvRows, csvFilename)}
          disabled={rows.length === 0}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-zinc-700 bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 hover:border-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800/60 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            <span
              className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                activeTab === tab.key
                  ? 'bg-indigo-600/30 text-indigo-300'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {tab.key === 'newsletter' ? newsletter.length : mentorWaitlist.length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <WaitlistTable rows={rows} type={activeTab} />
    </main>
  )
}
