import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsClient from '@/components/SettingsClient'

export const metadata = {
  title: 'Settings — Dishant',
  description: 'Manage your profile, account settings, and career roadmap.',
}

export default async function SettingsPage() {
  const supabase = await createClient()

  // 1. Get current authenticated user session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const authUser = session?.user;

  if (!authUser) {
    redirect('/auth/login')
  }

  // 2. Fetch user details, trying user_profiles first, then users
  let profile = null
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authUser.id)
      .single()

    if (!error && data) {
      profile = data
    }
  } catch (err) {
    console.warn('[settings/page] Failed to query user_profiles:', err)
  }

  if (!profile) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (!error && data) {
        profile = {
          id: data.id,
          user_id: data.id,
          full_name: data.full_name || '',
          branch: data.branch || '',
          chosen_field_id: data.chosen_field_id || '',
        }
      }
    } catch (err) {
      console.error('[settings/page] Failed to query users table:', err)
    }
  }

  // Final fallback if no database record exists yet
  if (!profile) {
    profile = {
      user_id: authUser.id,
      full_name: '',
      branch: '',
      chosen_field_id: '',
    }
  }

  // 3. Fetch fields from the database, trying fields table first
  let dbFields = null
  try {
    const { data, error } = await supabase
      .from('fields')
      .select('id, name, slug, emoji')
    
    if (!error && data) {
      dbFields = data
    }
  } catch (err) {
    console.warn('[settings/page] Failed to query fields table:', err)
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white min-h-screen">
      <SettingsClient
        initialProfile={profile}
        authUser={authUser}
        dbFields={dbFields}
      />
    </div>
  )
}
