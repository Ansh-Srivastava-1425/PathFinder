'use server'
import { createClient } from '@/lib/supabase/server'

export async function setChosenField(fieldSlug) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'not_logged_in' }
  await supabase.from('users').update({ chosen_field_id: fieldSlug }).eq('id', user.id)
  return { success: true }
}
