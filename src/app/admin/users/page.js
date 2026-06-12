import { createAdminClient } from '@/lib/supabase/admin'
import UsersClient from '@/components/admin/UsersClient'

export const metadata = {
  title: 'Users — Admin | PathFinder',
}

export default async function AdminUsersPage() {
  const adminClient = createAdminClient()

  // Fetch all user profiles joined with their chosen field name
  const { data: profiles, error } = await adminClient
    .from('user_profiles')
    .select(`
      user_id,
      full_name,
      branch,
      created_at,
      chosen_field_id,
      fields (
        id,
        name,
        slug,
        emoji
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin/users] Failed to fetch profiles:', error)
  }

  // Enrich with emails from auth.admin API
  let users = profiles || []
  try {
    const emailMap = {}
    await Promise.all(
      users.map(async (u) => {
        const { data } = await adminClient.auth.admin.getUserById(u.user_id)
        emailMap[u.user_id] = data?.user?.email || '—'
      })
    )
    users = users.map((u) => ({
      ...u,
      email: emailMap[u.user_id],
      field_name: u.fields?.name || null,
      field_emoji: u.fields?.emoji || null,
      // progress_pct is not stored directly; mark as null (can extend later)
      progress_pct: null,
    }))
  } catch (err) {
    console.error('[admin/users] Email enrichment error:', err)
    users = users.map((u) => ({
      ...u,
      email: '—',
      field_name: u.fields?.name || null,
      field_emoji: u.fields?.emoji || null,
      progress_pct: null,
    }))
  }

  return <UsersClient users={users} />
}
