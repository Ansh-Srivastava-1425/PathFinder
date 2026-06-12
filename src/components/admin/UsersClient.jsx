'use client'

import { useState, useMemo } from 'react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function UsersClient({ users }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return users
    return users.filter(
      (u) =>
        (u.full_name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    )
  }, [query, users])

  return (
    <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white">Users</h1>
          <p className="text-sm text-zinc-500">
            {filtered.length} of {users.length} users
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 4.5 4.5a7.5 7.5 0 0 0 12.15 12.15Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg border border-zinc-800 bg-zinc-900/70 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800/70 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900/80 text-zinc-500 text-xs uppercase tracking-widest">
              <th className="text-left px-4 py-3 font-semibold">#</th>
              <th className="text-left px-4 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Email</th>
              <th className="text-left px-4 py-3 font-semibold">Branch</th>
              <th className="text-left px-4 py-3 font-semibold">Career Field</th>
              <th className="text-left px-4 py-3 font-semibold">Progress</th>
              <th className="text-left px-4 py-3 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-600">
                  {query ? `No users match "${query}".` : 'No users found.'}
                </td>
              </tr>
            ) : (
              filtered.map((u, i) => (
                <tr
                  key={u.user_id || i}
                  className={`border-t border-zinc-800/50 transition-colors hover:bg-zinc-800/30 ${
                    i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/40'
                  }`}
                >
                  <td className="px-4 py-3 text-zinc-600 tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-white max-w-[160px] truncate">
                    {u.full_name || <span className="text-zinc-600 italic">—</span>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 max-w-[200px] truncate">{u.email || '—'}</td>
                  <td className="px-4 py-3 text-zinc-400 max-w-[180px] truncate">
                    {u.branch || <span className="text-zinc-600 italic">—</span>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {u.field_name ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-950/40 border border-indigo-800/30 text-indigo-300 text-xs font-medium">
                        {u.field_emoji} {u.field_name}
                      </span>
                    ) : (
                      <span className="text-zinc-600 italic text-xs">No track</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.progress_pct != null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${Math.min(100, u.progress_pct)}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-400 tabular-nums">
                          {u.progress_pct}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-600 italic text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                    {formatDate(u.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
