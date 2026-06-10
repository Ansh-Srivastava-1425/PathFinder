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
  const headersList = await headers()
  
  // Use x-forwarded-host to handle environments with load balancers, 
  // fallback to host
  const host = headersList.get('x-forwarded-host') || headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  
  // Pass next=check so the callback route knows to determine the destination
  // based on the user's onboarding status rather than defaulting to /
  const redirectUrl = `${protocol}://${host}/auth/callback?next=check`
  
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
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/?error=logout_failed')
  }
  
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
