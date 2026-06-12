'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fieldsData } from '@/data/fieldsData'
import { createClient } from '@/lib/supabase/client'
import { updateProfile } from '@/app/actions/updateProfile'
import { assignRoadmap } from '@/app/actions/assignRoadmap'
import Footer from '@/components/Footer'

export default function SettingsClient({ initialProfile, authUser, dbFields }) {
  const router = useRouter()
  const profile = initialProfile || {}

  // Section A states
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [branch, setBranch] = useState(profile.branch || '')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')

  // Section B states
  const [isResetting, setIsResetting] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')

  // Section C states
  const [selectedTrack, setSelectedTrack] = useState(profile.chosen_field_id || '')
  const [isSavingTrack, setIsSavingTrack] = useState(false)
  const [trackMessage, setTrackMessage] = useState('')
  const [trackError, setTrackError] = useState('')

  // Derive career fields list dynamically (database or static fallback)
  const fields = useMemo(() => {
    if (dbFields && dbFields.length > 0) {
      return dbFields
    }
    return Object.entries(fieldsData).map(([slug, f]) => ({
      id: slug,
      slug: slug,
      name: f.name,
      emoji: f.emoji,
    }))
  }, [dbFields])

  // Derive current chosen track name and emoji
  const currentTrack = useMemo(() => {
    const fieldId = profile.chosen_field_id
    if (!fieldId) return null

    if (fieldsData[fieldId]) {
      return fieldsData[fieldId]
    }
    const found = fields.find((f) => f.id === fieldId || f.slug === fieldId)
    if (found) {
      return {
        name: found.name,
        emoji: found.emoji || '🎯',
      }
    }
    return null
  }, [profile.chosen_field_id, fields])

  const branchOptions = [
    'Computer Science (CS/IT)',
    'Electronics & Communication (ECE)',
    'Electrical Engineering (EE)',
    'Mechanical Engineering',
    'Other engineering',
    'Science (PCM/PCB)',
    'Other',
  ]

  // Section A Save Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!fullName.trim() || !branch) {
      setProfileError('Please fill out all fields.')
      return
    }

    setIsSavingProfile(true)
    setProfileMessage('')
    setProfileError('')

    try {
      const result = await updateProfile({ full_name: fullName, branch })
      if (result.success) {
        setProfileMessage('Profile updated successfully!')
        router.refresh()
      } else {
        setProfileError(result.error || 'Failed to update profile.')
      }
    } catch (err) {
      console.error('[SettingsClient] Save profile error:', err)
      setProfileError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Section B Save Handler (Password Reset)
  const handleResetPassword = async () => {
    setIsResetting(true)
    setResetMessage('')
    setResetError('')

    const supabase = createClient()
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(authUser.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      })

      if (error) {
        setResetError(error.message)
      } else {
        setResetMessage('Password reset link sent! Check your inbox.')
      }
    } catch (err) {
      console.error('[SettingsClient] Password reset error:', err)
      setResetError('An unexpected error occurred. Please try again.')
    } finally {
      setIsResetting(false)
    }
  }

  // Section C Save Handler
  const handleSaveTrack = async () => {
    if (!selectedTrack) {
      setTrackError('Please select a career track.')
      return
    }

    setIsSavingTrack(true)
    setTrackMessage('')
    setTrackError('')

    try {
      const result = await assignRoadmap(selectedTrack)
      if (result.success) {
        setTrackMessage('Career track updated successfully!')
        router.refresh()
      } else {
        setTrackError(result.error || 'Failed to update career track.')
      }
    } catch (err) {
      console.error('[SettingsClient] Save track error:', err)
      setTrackError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSavingTrack(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white">
      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-2 border-b border-zinc-900 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Account Settings</h1>
          <p className="text-sm text-zinc-400">Manage your profile details, security preferences, and roadmap track.</p>
        </div>

        {/* Section A — Personal Info */}
        <section className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-6 shadow-lg shadow-black/25 backdrop-blur-md space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Personal Information</h2>
            <p className="text-xs text-zinc-500">Update your name and engineering branch to personalise recommendations.</p>
          </div>

          {profileMessage && (
            <div className="p-3 text-xs bg-emerald-950/30 border border-emerald-800/30 text-emerald-400 rounded-lg text-center font-medium">
              {profileMessage}
            </div>
          )}

          {profileError && (
            <div className="p-3 text-xs bg-red-950/30 border border-red-900/30 text-red-400 rounded-lg text-center font-medium">
              {profileError}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ravi Sharma"
                  className="block w-full h-11 rounded-lg border border-zinc-800 px-3.5 bg-zinc-950/80 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 text-sm shadow-inner transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="branch" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Engineering Branch
                </label>
                <select
                  id="branch"
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="block w-full h-11 rounded-lg border border-zinc-800 px-3 bg-zinc-950/80 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                >
                  <option value="" disabled>Select your branch</option>
                  {branchOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {isSavingProfile ? 'Saving profile...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </section>

        {/* Section B — Account */}
        <section className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-6 shadow-lg shadow-black/25 backdrop-blur-md space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Account Security</h2>
            <p className="text-xs text-zinc-500">Manage your login email and update your account password.</p>
          </div>

          {resetMessage && (
            <div className="p-3 text-xs bg-emerald-950/30 border border-emerald-800/30 text-emerald-400 rounded-lg text-center font-medium">
              {resetMessage}
            </div>
          )}

          {resetError && (
            <div className="p-3 text-xs bg-red-950/30 border border-red-900/30 text-red-400 rounded-lg text-center font-medium">
              {resetError}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2 max-w-md">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={authUser.email}
                className="block w-full h-11 rounded-lg border border-zinc-800/80 px-3.5 bg-zinc-950/30 text-zinc-500 cursor-not-allowed text-sm shadow-inner"
              />
              <span className="text-[10px] text-zinc-600 block">
                Primary login email (cannot be modified)
              </span>
            </div>

            <div className="flex justify-start pt-2">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isResetting}
                className="flex items-center justify-center rounded-lg bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isResetting ? 'Sending reset link...' : 'Reset Password via Email'}
              </button>
            </div>
          </div>
        </section>

        {/* Section C — Career Track */}
        <section className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-6 shadow-lg shadow-black/25 backdrop-blur-md space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Career Track & Roadmap</h2>
            <p className="text-xs text-zinc-500">Switch or update the active engineering domain for your learning roadmap.</p>
          </div>

          {trackMessage && (
            <div className="p-3 text-xs bg-emerald-950/30 border border-emerald-800/30 text-emerald-400 rounded-lg text-center font-medium">
              {trackMessage}
            </div>
          )}

          {trackError && (
            <div className="p-3 text-xs bg-red-950/30 border border-red-900/30 text-red-400 rounded-lg text-center font-medium">
              {trackError}
            </div>
          )}

          {/* Current track indicator */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/50 max-w-lg">
            <span className="text-3xl" role="img" aria-label="field emoji">
              {currentTrack?.emoji || '🎯'}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Active Roadmap Track</span>
              <span className="font-bold text-white text-md">
                {currentTrack?.name || 'No active track selected'}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2 max-w-md">
              <label htmlFor="trackSelect" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Select New Career Track
              </label>
              <select
                id="trackSelect"
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="block w-full h-11 rounded-lg border border-zinc-800 px-3 bg-zinc-950/80 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
              >
                <option value="" disabled>Select a track</option>
                {fields.map((f) => (
                  <option key={f.id} value={f.slug || f.id}>
                    {f.emoji} {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveTrack}
                disabled={isSavingTrack || !selectedTrack || selectedTrack === profile.chosen_field_id}
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {isSavingTrack ? 'Updating track...' : 'Save Career Track'}
              </button>

              <Link
                href="/explore"
                className="flex items-center justify-center rounded-lg border border-zinc-800 hover:border-zinc-700 bg-transparent px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Explore All Fields
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
