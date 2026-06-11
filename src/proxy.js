import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  // Start with a response that forwards the incoming request headers unchanged.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // Canonical @supabase/ssr pattern:
        //  1. Write onto request.cookies so any subsequent server reads see the
        //     refreshed token within this same middleware invocation.
        //  2. Write onto supabaseResponse with full options so the browser
        //     receives the Set-Cookie header (HttpOnly, SameSite, Max-Age …).
        //  Never re-create supabaseResponse here — doing so loses any headers
        //  that were already set on the response.
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Calling getUser() (not getSession()) is required: it validates the JWT
  // server-side and writes the refreshed token back via setAll above.
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
