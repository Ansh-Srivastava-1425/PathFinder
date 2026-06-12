import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/AdminSidebar'

export const metadata = {
  title: 'Admin — PathFinder',
  description: 'PathFinder internal admin dashboard.',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }) {
  // 1. Verify the session user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // 2. Guard: only allow the configured admin email
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || user.email !== adminEmail) {
    redirect('/dashboard')
  }

  // 3. Render admin shell
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
