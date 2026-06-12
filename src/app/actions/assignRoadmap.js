'use server'

import { createClient } from '@/lib/supabase/server'

export async function assignRoadmap(fieldSlug) {
  if (!fieldSlug) {
    return { success: false, error: 'No field slug provided' }
  }

  const supabase = await createClient()

  // Get current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.error('[assignRoadmap] User not authenticated:', authError)
    return { success: false, error: 'Not authenticated. Please log in.' }
  }

  console.log(`[assignRoadmap] User ${user.id} requesting roadmap for slug: ${fieldSlug}`)

  // 1. Try target schema implementation (fields + user_profiles tables)
  try {
    const { data: fieldData, error: fieldError } = await supabase
      .from('fields')
      .select('id')
      .eq('slug', fieldSlug)
      .single()

    if (fieldError) {
      throw new Error(`Failed to lookup field by slug from 'fields' table: ${fieldError.message}`)
    }

    if (!fieldData?.id) {
      throw new Error(`Field not found in 'fields' table for slug: ${fieldSlug}`)
    }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        chosen_field_id: fieldData.id
      }, { onConflict: 'user_id' })

    if (profileError) {
      throw new Error(`Failed to upsert user_profile: ${profileError.message}`)
    }

    console.log(`[assignRoadmap] Successfully upserted chosen_field_id: ${fieldData.id} into user_profiles table for user: ${user.id}`)
    return { success: true }

  } catch (error) {
    console.warn('[assignRoadmap] Preferred database lookup failed. Falling back to direct users table update. Details:', error.message)

    // 2. Fallback implementation (users table with slug as chosen_field_id)
    try {
      const { error: fallbackError } = await supabase
        .from('users')
        .update({ chosen_field_id: fieldSlug })
        .eq('id', user.id)

      if (fallbackError) {
        console.error('[assignRoadmap] Fallback update failed:', fallbackError)
        return { success: false, error: fallbackError.message }
      }

      console.log(`[assignRoadmap] Fallback succeeded: updated users table chosen_field_id to '${fieldSlug}' for user: ${user.id}`)
      return { success: true }
    } catch (fallbackErr) {
      console.error('[assignRoadmap] Critical error in both primary and fallback paths:', fallbackErr)
      return { success: false, error: fallbackErr.message }
    }
  }
}
