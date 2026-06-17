'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(formData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  // Determine where to send the user based on their onboarding status
  const userId = signInData?.user?.id
  let destination = '/onboarding'

  if (userId) {
    const { data: profile } = await supabase
      .from('users')
      .select('onboarding_complete')
      .eq('id', userId)
      .single()

    if (profile?.onboarding_complete === true) {
      destination = '/dashboard'
    }
  }

  revalidatePath('/', 'layout')
  redirect(destination)
}

export async function signup(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
      data: {
        full_name: formData.get('full_name'),
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectUrl = `${siteUrl}/auth/callback?next=check`
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }
}

export async function logout() {
  const supabase = await createClient()

  try {
    await supabase.auth.signOut()
  } catch (err) {
    // signOut() failure is non-fatal — the session will expire naturally.
    // Do NOT call redirect() here; throwing inside a catch corrupts the
    // NEXT_REDIRECT signal and causes the 'apply' TypeError.
    console.error('signOut error (non-fatal):', err)
  }

  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
