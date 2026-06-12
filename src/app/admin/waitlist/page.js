import { createAdminClient } from '@/lib/supabase/admin'
import WaitlistClient from '@/components/admin/WaitlistClient'

export const metadata = {
  title: 'Waitlists — Admin | PathFinder',
}

export default async function AdminWaitlistPage() {
  const adminClient = createAdminClient()

  const [{ data: newsletter }, { data: mentorWaitlist }] = await Promise.all([
    adminClient
      .from('newsletter_subscribers')
      .select('id, email, created_at')
      .order('created_at', { ascending: false }),
    adminClient
      .from('waitlist')
      .select('id, email, source, created_at')
      .order('created_at', { ascending: false }),
  ])

  return (
    <WaitlistClient
      newsletter={newsletter || []}
      mentorWaitlist={mentorWaitlist || []}
    />
  )
}
