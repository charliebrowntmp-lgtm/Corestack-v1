import Link from 'next/link'
import type { Metadata } from 'next'
import { getJobs } from '@/lib/api'
import { MOCK_JOBS } from '@/lib/mock-jobs'
import HomeBrowse from '@/components/home/HomeBrowse'

export const metadata: Metadata = {
  title: 'Corestack — Data Center Jobs',
  description:
    'The job board for the people building the cloud. Operations, construction, power, cooling, and networking roles across the data center industry.',
}

export default async function HomePage() {
  const dbJobs = await getJobs().catch(() => [])
  const jobs = dbJobs.length > 0 ? dbJobs : MOCK_JOBS

  const companyCount = new Set(jobs.map((j) => j.company)).size

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      {/* Page header */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-balance">
          Browse All{' '}
          <span className="font-light text-black/40">Data Center Jobs</span>
        </h1>
        <p className="mt-4 text-base text-black/50 max-w-md mx-auto leading-relaxed">
          Operations, construction, power, cooling, and networking roles across
          the data center industry.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-black/40">
          <span>
            <strong className="text-black tabular-nums">{jobs.length}</strong>{' '}
            open roles
          </span>
          <span className="text-black/20">·</span>
          <span>
            <strong className="text-black tabular-nums">{companyCount}</strong>{' '}
            companies
          </span>
          <span className="text-black/20">·</span>
          <span>
            <strong className="text-black tabular-nums">5</strong> categories
          </span>
        </div>
      </div>

      {/* Client browse (search + filter tabs + grid) */}
      <HomeBrowse jobs={jobs} />

      {/* Employer CTA */}
      <div className="mt-16 border border-black p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-bold text-lg">Building a data center team?</h2>
          <p className="text-sm text-black/50 mt-1">
            Reach operations, construction, power, cooling, and networking
            professionals in one place.
          </p>
        </div>
        <Link
          href="/post"
          className="flex-shrink-0 bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap"
        >
          Post a Job
        </Link>
      </div>
    </div>
  )
}
