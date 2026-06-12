'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Server action to subscribe a user's email to the newsletter.
 * Inserts the email into `newsletter_subscribers` table.
 */
export async function subscribeNewsletter(email) {
  if (!email || !email.trim()) {
    return { success: false, error: 'Email is required.' }
  }

  const cleanEmail = email.trim().toLowerCase()

  const supabase = await createClient()
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email: cleanEmail,
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error('[subscribeNewsletter] Full error object:', error)
    // Unique violation constraint code in PostgreSQL
    if (error.code === '23505') {
      return { success: false, error: 'This email is already subscribed!' }
    }
    return { success: false, error: error.message }
  }

  return { success: true }
}
