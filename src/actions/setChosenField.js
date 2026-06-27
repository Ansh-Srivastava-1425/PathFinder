'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function setChosenField(fieldSlug) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  await supabase.from('users').update({ chosen_field_id: fieldSlug }).eq('id', user.id)
  redirect('/roadmap')
}
