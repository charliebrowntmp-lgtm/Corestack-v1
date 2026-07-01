import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MOCK_JOBS } from '@/lib/mock-jobs'
import { CATEGORY_LABELS } from '@/lib/constants'
import { daysAgo, formatSalary } from '@/lib/utils'
import CompanyLogo from '@/components/jobs/CompanyLogo'
import DashboardTabs from '@/components/dashboard/DashboardTabs'

export const metadata: Metadata = {
  title: 'Dashboard — Corestack',
  description: 'Track your applications, saved jobs, and listings.',
}

// ── Mock demo data ────────────────────────────────────────────────────────────

const DEMO_APPLIED = MOCK_JOBS.filter((j) =>
  ['mock-ops-1', 'mock-con-1', 'mock-elec-1'].includes(j.id)
)
const DEMO_SAVED = MOCK_JOBS.filter((j) =>
  ['mock-cool-1', 'mock-net-1', 'mock-ops-3'].includes(j.id)
)

const QUICK_STATS = [
  { label: 'Applications', value: String(DEMO_APPLIED.length), sub: 'roles applied to' },
  { label: 'Saved Jobs', value: String(DEMO_SAVED.length), sub: 'saved for later' },
  { label: 'My Listings', value: '0', sub: 'active postings' },
  { label: 'Profile', value: 'Demo', sub: 'sign in to save progress' },
]

// ── Tab content components ────────────────────────────────────────────────────

function ApplicationsList() {
  return (
    <ul role="list" className="border-l border-t border-black">
      {DEMO_APPLIED.map((job) => (
        <li key={job.id} className="border-r border-b border-black bg-white/75 backdrop-blur-sm">
          <div className="flex items-center gap-5 px-6 py-5">
            <CompanyLogo company={job.company} size={44} />
            <div className="flex-1 min-w-0">
              <Link
                href={`/jobs/${job.id}`}
                className="font-semibold text-sm hover:text-[#3ecf8e] transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none line-clamp-1"
              >
                {job.title}
              </Link>
              <p className="text-xs text-black/50 mt-0.5">
                {job.company}
                <span className="mx-1.5 text-black/20">·</span>
                {job.location}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] border border-black/15 px-2 py-0.5">
                  {CATEGORY_LABELS[job.category]}
                </span>
                {(job.salary_min || job.salary_max) && (
                  <span className="text-[10px] font-medium text-[#3ecf8e] tabular-nums">
                    {formatSalary(job.salary_min, job.salary_max)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-[10px] font-bold px-2 py-1 bg-[#3ecf8e]/15 text-[#3ecf8e] uppercase tracking-wide">
                Applied
              </span>
              <p className="text-[11px] text-black/35 mt-1.5">{daysAgo(job.created_at)}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function SavedList() {
  return (
    <ul role="list" className="border-l border-t border-black">
      {DEMO_SAVED.map((job) => (
        <li key={job.id} className="border-r border-b border-black bg-white/75 backdrop-blur-sm">
          <div className="flex items-center gap-5 px-6 py-5">
            <CompanyLogo company={job.company} size={44} />
            <div className="flex-1 min-w-0">
              <Link
                href={`/jobs/${job.id}`}
                className="font-semibold text-sm hover:text-[#3ecf8e] transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none line-clamp-1"
              >
                {job.title}
              </Link>
              <p className="text-xs text-black/50 mt-0.5">
                {job.company}
                <span className="mx-1.5 text-black/20">·</span>
                {job.location}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] border border-black/15 px-2 py-0.5">
                  {CATEGORY_LABELS[job.category]}
                </span>
                {(job.salary_min || job.salary_max) && (
                  <span className="text-[10px] font-medium text-[#3ecf8e] tabular-nums">
                    {formatSalary(job.salary_min, job.salary_max)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-2">
              <Link
                href={`/jobs/${job.id}`}
                className="text-[11px] border border-black px-3 py-1.5 transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
              >
                View Role
              </Link>
              <p className="text-[11px] text-black/30">{daysAgo(job.created_at)}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function ListingsList() {
  return (
    <div className="border border-black px-8 py-14 text-center bg-white/75 backdrop-blur-sm">
      <p className="text-sm text-black/50 mb-1">No active listings.</p>
      <p className="text-xs text-black/35 mb-6 max-w-xs mx-auto">
        Reach data center operations, construction, power, cooling, and networking
        professionals.
      </p>
      <Link
        href="/post"
        className="inline-block bg-black text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
      >
        Post a Job
      </Link>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  return (
    <div
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,0,0,0.07) 1.2px, transparent 1.2px)',
        backgroundSize: '22px 22px',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="px-6 pt-10 pb-12 border-b border-black">
        <div className="max-w-5xl mx-auto">
          {/* Demo mode banner */}
          <div className="flex items-center gap-3 border border-black/20 bg-white/80 backdrop-blur-sm px-4 py-2.5 mb-8 text-xs text-black/50 w-fit">
            <span className="w-1.5 h-1.5 bg-amber-400 flex-shrink-0" aria-hidden="true" />
            Viewing demo data —{' '}
            <Link href="/signin" className="underline hover:text-black transition-colors">
              sign in
            </Link>{' '}
            to access your real dashboard.
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
            Corestack
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
            My Dashboard
          </h1>
          <p className="mt-3 text-sm text-black/50 max-w-md leading-relaxed">
            Track your job applications, manage saved roles, and post listings
            for your organisation.
          </p>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────── */}
      <div className="border-b border-black">
        <div className="max-w-5xl mx-auto flex divide-x divide-black overflow-x-auto">
          {QUICK_STATS.map((s) => (
            <div key={s.label} className="flex-1 min-w-[130px] px-6 py-5 bg-white/70 backdrop-blur-sm">
              <p className="text-2xl font-bold tabular-nums">{s.value}</p>
              <p className="text-xs font-semibold mt-0.5">{s.label}</p>
              <p className="text-[11px] text-black/35 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto flex gap-0 divide-x divide-black border-b border-black">

        {/* Main tabs */}
        <div className="flex-1 min-w-0 py-8 px-6 sm:px-8">
          <Suspense fallback={null}>
            <DashboardTabs
              applications={<ApplicationsList />}
              saved={<SavedList />}
              listings={<ListingsList />}
            />
          </Suspense>
        </div>

        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 hidden lg:block" aria-label="Quick actions">
          <div className="sticky top-0 divide-y divide-black">

            {/* Quick actions */}
            <div className="px-6 py-7 bg-white/70 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-5">
                Quick Actions
              </p>
              <div className="space-y-2">
                <Link
                  href="/jobs"
                  className="flex items-center justify-between px-4 py-3 border border-black text-sm font-medium transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none group"
                >
                  Browse Jobs
                  <span className="text-black/30 group-hover:text-white transition-colors">→</span>
                </Link>
                <Link
                  href="/post"
                  className="flex items-center justify-between px-4 py-3 border border-black text-sm font-medium transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none group"
                >
                  Post a Job
                  <span className="text-black/30 group-hover:text-white transition-colors">→</span>
                </Link>
                <Link
                  href="/resources"
                  className="flex items-center justify-between px-4 py-3 border border-black text-sm font-medium transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none group"
                >
                  Training & Resources
                  <span className="text-black/30 group-hover:text-white transition-colors">→</span>
                </Link>
                <Link
                  href="/news"
                  className="flex items-center justify-between px-4 py-3 border border-black text-sm font-medium transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none group"
                >
                  Industry News
                  <span className="text-black/30 group-hover:text-white transition-colors">→</span>
                </Link>
              </div>
            </div>

            {/* Profile completion */}
            <div className="px-6 py-7 bg-white/70 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
                Profile
              </p>
              <div className="space-y-3">
                {[
                  { step: 'Create account', done: false },
                  { step: 'Add resume / CV', done: false },
                  { step: 'Set job preferences', done: false },
                  { step: 'Enable job alerts', done: false },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <span
                      className={`w-4 h-4 flex-shrink-0 border ${item.done ? 'bg-[#3ecf8e] border-[#3ecf8e]' : 'border-black/25'}`}
                      aria-hidden="true"
                    />
                    <span className={`text-xs ${item.done ? 'line-through text-black/30' : 'text-black/60'}`}>
                      {item.step}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/signin"
                className="mt-5 block text-center text-xs font-semibold uppercase tracking-wide border border-black px-4 py-2.5 transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
              >
                Sign In to Continue
              </Link>
            </div>

            {/* Market stat */}
            <div className="px-6 py-7 bg-white/70 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
                Market Snapshot
              </p>
              <dl className="space-y-3">
                {[
                  { label: 'Avg Ops Technician', value: '$63K' },
                  { label: 'Avg Critical Power Eng', value: '$112K' },
                  { label: 'Avg Construction PM', value: '$108K' },
                  { label: 'Remote roles available', value: '4' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-2">
                    <dt className="text-[11px] text-black/45 leading-snug">{s.label}</dt>
                    <dd className="text-xs font-bold tabular-nums flex-shrink-0">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

          </div>
        </aside>
      </div>
    </div>
  )
}
