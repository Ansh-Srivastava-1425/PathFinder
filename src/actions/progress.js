'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function updateStepProgress(fieldSlug, stepId, status) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user;
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      field_slug: fieldSlug,
      roadmap_step_id: stepId,
      status: status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,roadmap_step_id' })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
