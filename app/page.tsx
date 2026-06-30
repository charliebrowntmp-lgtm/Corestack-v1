import type { Metadata } from 'next'
import { getJobs, getNews } from '@/lib/api'
import { MOCK_JOBS } from '@/lib/mock-jobs'
import { MOCK_NEWS } from '@/lib/mock-news'
import HomeClient from '@/components/home/HomeClient'

export const metadata: Metadata = {
  title: 'Corestack — Data Center Jobs',
  description:
    'The job board for the people building the cloud. Operations, construction, power, cooling, and networking roles across the data center industry.',
}

export default async function HomePage() {
  const [dbJobs, dbNews] = await Promise.all([
    getJobs().catch(() => []),
    getNews().catch(() => []),
  ])

  const jobs = dbJobs.length > 0 ? dbJobs : MOCK_JOBS
  const news = dbNews.length > 0 ? dbNews : MOCK_NEWS

  return <HomeClient jobs={jobs} news={news} />
}
