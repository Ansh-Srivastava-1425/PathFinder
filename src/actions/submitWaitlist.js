'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Server action to submit an email to the product/mentor waitlist.
 * Inserts the email and source into the `waitlist` table.
 */
export async function submitWaitlist({ email, source }) {
  if (!email || !email.trim()) {
    return { success: false, error: 'Email is required.' }
  }
  if (!source) {
    return { success: false, error: 'Source is required.' }
  }

  const cleanEmail = email.trim().toLowerCase()

  const supabase = await createClient()
  const { error } = await supabase
    .from('waitlist')
    .insert({
      email: cleanEmail,
      source: source,
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error('[submitWaitlist] Full error object:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
