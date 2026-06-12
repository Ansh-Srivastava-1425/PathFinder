'use server'

import { createClient } from '@/lib/supabase/server'

export async function updateProfile(profileData) {
  if (!profileData) {
    return { success: false, error: 'No profile data provided' }
  }

  const supabase = await createClient()

  // Get current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.error('[updateProfile] User not authenticated:', authError)
    return { success: false, error: 'Not authenticated. Please log in.' }
  }

  const { full_name, branch } = profileData

  console.log(`[updateProfile] User ${user.id} requesting profile update:`, profileData)

  // 1. Try target schema implementation (user_profiles table)
  try {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        user_id: user.id,
        full_name,
        branch,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (profileError) {
      throw new Error(`Failed to upsert user_profiles: ${profileError.message}`)
    }

    console.log(`[updateProfile] Successfully upserted profile into user_profiles for user: ${user.id}`)
    return { success: true }

  } catch (error) {
    console.warn('[updateProfile] Preferred user_profiles upsert failed. Falling back to direct users table update. Details:', error.message)

    // 2. Fallback implementation (users table)
    try {
      const { error: fallbackError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          full_name,
          branch
        }, { onConflict: 'id' })

      if (fallbackError) {
        console.error('[updateProfile] Fallback upsert failed:', fallbackError)
        return { success: false, error: fallbackError.message }
      }

      console.log(`[updateProfile] Fallback succeeded: upserted into users table for user: ${user.id}`)
      return { success: true }
    } catch (fallbackErr) {
      console.error('[updateProfile] Critical error in both primary and fallback paths:', fallbackErr)
      return { success: false, error: fallbackErr.message }
    }
  }
}
