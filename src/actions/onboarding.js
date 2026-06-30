'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function saveOnboardingData(payload) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Server-side auth — cannot be spoofed by the client
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user;
  if (!user) {
    console.error('[saveOnboardingData] getUser returned no user — not authenticated')
    return { success: false, error: 'Not authenticated' }
  }

  console.log('[saveOnboardingData] authenticated as uid:', user.id)
  console.log('[saveOnboardingData] upsert payload:', { ...payload, id: user.id })

  const { error } = await supabase
    .from('users')
    .upsert({ ...payload, id: user.id }, { onConflict: 'id' })

  if (error) {
    console.error('[saveOnboardingData] upsert error:', error)
    return { success: false, error: error.message }
  }

  console.log('[saveOnboardingData] upsert succeeded')

  if (payload.chosen_field_id) {
    console.log('[saveOnboardingData] updating chosen_field_id:', payload.chosen_field_id)
    const { error: fieldError } = await supabase
      .from('users')
      .update({ chosen_field_id: payload.chosen_field_id })
      .eq('id', user.id)

    if (fieldError) {
      console.error('[saveOnboardingData] chosen_field_id update error:', fieldError)
      return { success: false, error: fieldError.message }
    }
    console.log('[saveOnboardingData] chosen_field_id updated')
  }

  console.log('[saveOnboardingData] all done — returning success')
  return { success: true }
}
