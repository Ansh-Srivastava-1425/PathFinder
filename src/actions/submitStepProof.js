'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Validates and saves a GitHub repo URL as proof for a roadmap step.
 * Sets status = 'completed' and stores the URL in personal_note.
 */
export async function submitStepProof({ fieldSlug, stepId, githubUrl }) {
  // ── Input validation ────────────────────────────────────────────────────────
  if (!fieldSlug || !stepId) {
    return { success: false, error: 'Missing step information.' }
  }

  const trimmedUrl = (githubUrl || '').trim()
  if (!trimmedUrl) {
    return { success: false, error: 'Please paste your GitHub repository URL.' }
  }

  // Allow both https://github.com/… and github.com/…
  const normalised = trimmedUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')
  if (!normalised.startsWith('github.com/')) {
    return {
      success: false,
      error: 'URL must start with github.com — e.g. github.com/yourname/repo',
    }
  }

  // Must have at least /user/repo path segments
  const parts = normalised.split('/').filter(Boolean)
  if (parts.length < 3) {
    return {
      success: false,
      error: 'Please enter a full repo URL, e.g. github.com/yourname/my-project',
    }
  }

  // ── Auth ────────────────────────────────────────────────────────────────────
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
  if (!user) return { success: false, error: 'Not authenticated. Please log in.' }

  // ── Upsert progress ─────────────────────────────────────────────────────────
  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: user.id,
        field_slug: fieldSlug,
        roadmap_step_id: stepId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        personal_note: `https://${normalised}`,
      },
      { onConflict: 'user_id,roadmap_step_id' }
    )

  if (error) {
    console.error('[submitStepProof] Upsert error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, githubUrl: `https://${normalised}` }
}
