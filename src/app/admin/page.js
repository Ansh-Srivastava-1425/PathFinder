import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Overview — Admin | Dishant',
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, accent = 'indigo' }) {
  const accentMap = {
    indigo: 'from-indigo-600/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400',
    emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    violet: 'from-violet-600/20 to-violet-600/5 border-violet-500/20 text-violet-400',
    amber: 'from-amber-600/20 to-amber-600/5 border-amber-500/20 text-amber-400',
  }
  const cls = accentMap[accent] || accentMap.indigo

  return (
    <div className={`bg-gradient-to-br ${cls} border rounded-2xl p-6 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <span className="text-4xl font-black text-white tabular-nums">
        {value ?? <span className="text-zinc-600 text-2xl">—</span>}
      </span>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AdminOverviewPage() {
  const adminClient = createAdminClient()

  // Run all queries in parallel
  const [
    { count: usersCount },
    { count: newsletterCount },
    { count: waitlistCount },
    { data: recentUsers },
  ] = await Promise.all([
    adminClient.from('user_profiles').select('*', { count: 'exact', head: true }),
    adminClient.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
    adminClient.from('waitlist').select('*', { count: 'exact', head: true }),
    adminClient
      .from('user_profiles')
      .select('full_name, branch, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  // Fetch emails for recent users via auth.users using service role
  // user_profiles doesn't store email — pull from auth admin API
  let recentWithEmails = recentUsers || []
  try {
    const emailMap = {}
    await Promise.all(
      recentWithEmails.map(async (u) => {
        const { data } = await adminClient.auth.admin.getUserById(u.user_id)
        emailMap[u.user_id] = data?.user?.email || '—'
      })
    )
    recentWithEmails = recentWithEmails.map((u) => ({
      ...u,
      email: emailMap[u.user_id],
    }))
  } catch {
    // email enrichment is best-effort
  }

  return (
    <main className="flex-1 p-8 space-y-10 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-white">Overview</h1>
        <p className="text-sm text-zinc-500">Platform-wide stats at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <StatCard label="Registered Users" value={usersCount ?? 0} icon="👤" accent="indigo" />
        <StatCard label="Newsletter Signups" value={newsletterCount ?? 0} icon="📬" accent="emerald" />
        <StatCard label="Mentor Waitlist" value={waitlistCount ?? 0} icon="⏳" accent="violet" />
      </div>

      {/* Recent Signups */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Recent Signups</h2>
        <div className="rounded-xl border border-zinc-800/70 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900/80 text-zinc-500 text-xs uppercase tracking-widest">
                <th className="text-left px-4 py-3 font-semibold">#</th>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Branch</th>
                <th className="text-left px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentWithEmails.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-600 text-sm">
                    No users yet.
                  </td>
                </tr>
              ) : (
                recentWithEmails.map((u, i) => (
                  <tr
                    key={u.user_id}
                    className={`border-t border-zinc-800/50 transition-colors hover:bg-zinc-800/30 ${
                      i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/40'
                    }`}
                  >
                    <td className="px-4 py-3 text-zinc-600 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-white">
                      {u.full_name || <span className="text-zinc-600 italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {u.branch || <span className="text-zinc-600 italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{formatDate(u.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
