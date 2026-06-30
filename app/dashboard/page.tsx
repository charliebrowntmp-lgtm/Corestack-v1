import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getUserApplications, getUserSavedJobs, getPostedJobs } from '@/lib/api'
import { unsaveJob } from '@/app/actions/saved'
import { updateJobStatus } from '@/app/actions/jobs'
import DashboardTabs from '@/components/dashboard/DashboardTabs'
import { CATEGORY_LABELS } from '@/lib/constants'
import { daysAgo, formatSalary } from '@/lib/utils'
import type { ApplicationWithJob, SavedJobWithJob, Job } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your job applications, saved jobs, and listings.',
}

// --- Applications tab content ---
function ApplicationsList({ items }: { items: ApplicationWithJob[] }) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center border border-black">
        <p className="text-sm text-black/50">No applications yet.</p>
        <Link
          href="/jobs"
          className="mt-4 inline-block border border-black px-4 py-2 text-sm transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        >
          Browse jobs
        </Link>
      </div>
    )
  }
  return (
    <ul className="border-l border-t border-black">
      {items.map((app) => (
        <li key={app.id} className="border-r border-b border-black p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <Link
                href={`/jobs/${app.job.id}`}
                className="font-semibold hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none line-clamp-1"
              >
                {app.job.title}
              </Link>
              <p className="text-sm text-black/60 mt-0.5 truncate">
                {app.job.company} · {app.job.location}
              </p>
            </div>
            <span className="text-xs border border-black px-2 py-0.5 flex-shrink-0">
              {CATEGORY_LABELS[app.job.category]}
            </span>
          </div>
          <p className="text-xs text-black/40 mt-2">Applied {daysAgo(app.created_at)}</p>
        </li>
      ))}
    </ul>
  )
}

// --- Saved jobs tab content ---
function SavedList({ items }: { items: SavedJobWithJob[] }) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center border border-black">
        <p className="text-sm text-black/50">No saved jobs yet.</p>
        <Link
          href="/jobs"
          className="mt-4 inline-block border border-black px-4 py-2 text-sm transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        >
          Browse jobs
        </Link>
      </div>
    )
  }
  return (
    <ul className="border-l border-t border-black">
      {items.map((saved) => (
        <li key={saved.id} className="border-r border-b border-black p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <Link
                href={`/jobs/${saved.job.id}`}
                className="font-semibold hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none line-clamp-1"
              >
                {saved.job.title}
              </Link>
              <p className="text-sm text-black/60 mt-0.5 truncate">
                {saved.job.company} · {saved.job.location}
              </p>
              {(saved.job.salary_min !== null || saved.job.salary_max !== null) && (
                <p className="text-sm tabular-nums mt-1">
                  {formatSalary(saved.job.salary_min, saved.job.salary_max)}
                </p>
              )}
            </div>
            <form action={unsaveJob.bind(null, saved.job_id)}>
              <button
                type="submit"
                className="text-xs border border-black px-3 py-1.5 transition-colors duration-150 hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none flex-shrink-0"
                aria-label={`Remove ${saved.job.title} from saved jobs`}
              >
                Remove
              </button>
            </form>
          </div>
          <p className="text-xs text-black/40 mt-2">Saved {daysAgo(saved.created_at)}</p>
        </li>
      ))}
    </ul>
  )
}

// --- My listings tab content ---
function ListingsList({ items }: { items: Job[] }) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center border border-black">
        <p className="text-sm text-black/50">No listings yet.</p>
        <Link
          href="/post"
          className="mt-4 inline-block bg-black text-white px-4 py-2 text-sm transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        >
          Post a job
        </Link>
      </div>
    )
  }

  const statusLabel: Record<string, string> = {
    active: 'Active',
    closed: 'Closed',
    draft: 'Draft',
  }

  return (
    <ul className="border-l border-t border-black">
      {items.map((job) => (
        <li key={job.id} className="border-r border-b border-black p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <Link
                href={`/jobs/${job.id}`}
                className="font-semibold hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none line-clamp-1"
              >
                {job.title}
              </Link>
              <p className="text-sm text-black/60 mt-0.5">{job.company}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <span className="text-xs border border-black px-2 py-0.5">
                {statusLabel[job.status] ?? job.status}
              </span>
              {job.status === 'active' ? (
                <form action={updateJobStatus.bind(null, job.id, 'closed')}>
                  <button
                    type="submit"
                    className="text-xs border border-black px-3 py-1.5 transition-colors duration-150 hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                    aria-label={`Close listing: ${job.title}`}
                  >
                    Close
                  </button>
                </form>
              ) : (
                <form action={updateJobStatus.bind(null, job.id, 'active')}>
                  <button
                    type="submit"
                    className="text-xs border border-black px-3 py-1.5 transition-colors duration-150 hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                    aria-label={`Reopen listing: ${job.title}`}
                  >
                    Reopen
                  </button>
                </form>
              )}
            </div>
          </div>
          <p className="text-xs text-black/40 mt-2">Posted {daysAgo(job.created_at)}</p>
        </li>
      ))}
    </ul>
  )
}

// --- Main page ---
export default async function DashboardPage() {
  const [applications, saved, listings] = await Promise.all([
    getUserApplications().catch(() => []),
    getUserSavedJobs().catch(() => []),
    getPostedJobs().catch(() => []),
  ])

  return (
    <div className="px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <Suspense fallback={null}>
          <DashboardTabs
            applications={<ApplicationsList items={applications} />}
            saved={<SavedList items={saved} />}
            listings={<ListingsList items={listings} />}
          />
        </Suspense>
      </div>
    </div>
  )
}
