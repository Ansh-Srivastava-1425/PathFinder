import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Determine the redirect destination
      let destination = next

      // When next=check (set by Google OAuth flow), look up the user's
      // onboarding status and redirect to the correct page
      if (next === 'check') {
        destination = '/onboarding' // safe default

        const { data: { user } } = await supabase.auth.getUser()
        if (user?.id) {
          const { data: profile } = await supabase
            .from('users')
            .select('onboarding_complete')
            .eq('id', user.id)
            .single()

          if (profile?.onboarding_complete === true) {
            destination = '/dashboard'
          }
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${destination}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${destination}`)
      } else {
        return NextResponse.redirect(`${origin}${destination}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
