'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Logs a mentor session booking into mentor_sessions.
 * Called when a user clicks "Book a Session" on a mentor card.
 */
export async function bookSession(mentorId) {
  if (!mentorId) {
    return { success: false, error: 'No mentor ID provided.' }
  }

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user;

  // Allow unauthenticated bookings — just don't record user_id
  const { error } = await supabase
    .from('mentor_sessions')
    .insert({
      mentor_id:  mentorId,
      user_id:    user?.id ?? null,
      booked_at:  new Date().toISOString(),
      status:     'pending',
    })

  if (error) {
    console.error('[bookSession] Insert error:', error)
    // Don't block the user — Calendly already opened in a new tab
    return { success: false, error: error.message }
  }

  return { success: true }
}
