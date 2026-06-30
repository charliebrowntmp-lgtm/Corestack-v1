import Link from 'next/link'
import { getJobs } from '@/lib/api'
import JobGrid from '@/components/jobs/JobGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corestack — Data Center Jobs',
  description:
    'The job board for the people building the cloud. Browse data center operations, construction, electrical, cooling, and networking roles.',
}

export default async function HomePage() {
  let jobs = await getJobs().catch(() => [])
  const recent = jobs.slice(0, 12)
  const companyCount = new Set(jobs.map((j) => j.company)).size

  return (
    <div>
      {/* Hero */}
      <section className="px-6 py-20 border-b border-black">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            The job board for the people building the cloud.
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl">
            Operations, construction, power, cooling, and networking roles
            across the data center industry. Find your next position or post an
            opening today.
          </p>
          <div className="mt-8 flex flex-wrap gap-0">
            <Link
              href="/post"
              className="bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
            >
              Post a Job
            </Link>
            <Link
              href="/jobs"
              className="border border-black border-l-0 px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section
        className="flex border-b border-black overflow-x-auto"
        aria-label="Site statistics"
      >
        <div className="flex-1 border-r border-black px-8 py-6 min-w-32">
          <p className="text-3xl font-bold tabular-nums">{jobs.length}</p>
          <p className="text-sm text-black/50 mt-1">Open roles</p>
        </div>
        <div className="flex-1 border-r border-black px-8 py-6 min-w-32">
          <p className="text-3xl font-bold tabular-nums">{companyCount}</p>
          <p className="text-sm text-black/50 mt-1">Companies hiring</p>
        </div>
        <div className="flex-1 px-8 py-6 min-w-32">
          <p className="text-3xl font-bold tabular-nums">5</p>
          <p className="text-sm text-black/50 mt-1">Job categories</p>
        </div>
      </section>

      {/* Recent listings */}
      <section className="px-6 py-12">
        <div className="flex items-baseline justify-between gap-4 mb-8 flex-wrap">
          <h2 className="text-2xl font-bold">Recent Openings</h2>
          <Link
            href="/jobs"
            className="text-sm border border-black px-4 py-2 transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          >
            View all jobs →
          </Link>
        </div>
        <JobGrid jobs={recent} />
      </section>

      {/* Second CTA */}
      <section className="border-t border-black bg-black text-white px-6 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold">Building a team?</h2>
          <p className="mt-3 text-white/60 text-lg">
            Post your opening and reach data center professionals across
            operations, construction, power, cooling, and networking.
          </p>
          <Link
            href="/post"
            className="mt-6 inline-block bg-white text-black px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          >
            Post a Job
          </Link>
        </div>
      </section>
    </div>
  )
}
