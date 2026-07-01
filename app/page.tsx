import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getNews } from '@/lib/api'
import { MOCK_NEWS } from '@/lib/mock-news'
import HomeClient from '@/components/home/HomeClient'

export const metadata: Metadata = {
  title: 'Corestack — Data Center Jobs',
  description:
    'The job board for the people building the cloud. Operations, construction, power, cooling, and networking roles across the data center industry.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const dbNews = await getNews().catch(() => [])
  const news = dbNews.length > 0 ? dbNews : MOCK_NEWS

  return <HomeClient jobs={jobs ?? []} news={news} />
}
