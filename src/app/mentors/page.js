import { createClient } from '@/lib/supabase/server'
import MentorsClient from '@/components/MentorsClient'
import PageHeader from '@/components/PageHeader'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Mentors — Dishant',
  description: 'Book a 1-on-1 session with a verified industry mentor. Get guidance on your engineering career path, placements, and technical interviews.',
  openGraph: {
    title: 'Mentors — Dishant',
    description: 'Connect with verified industry mentors working at top Indian tech companies.',
    siteName: 'Dishant',
  },
}

export default async function MentorsPage() {
  const supabase = await createClient()

  // Fetch all active mentors ordered by creation date
  const { data: mentors, error } = await supabase
    .from('mentors')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[mentors/page] Failed to fetch mentors:', error)
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white">
      <PageHeader
        title="Talk to a mentor"
        subtitle="1-on-1 sessions with verified engineers working at India's top tech companies."
      />
      <MentorsClient mentors={mentors || []} />
      <Footer />
    </div>
  )
}
