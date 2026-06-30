'use client'

import { useState, useMemo, useRef } from 'react'
import { Search, MapPin, ChevronDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Job, NewsItem } from '@/lib/types'
import type { Category } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_LIST } from '@/lib/constants'
import { formatSalary, daysAgo } from '@/lib/utils'
import CompanyLogo from '@/components/jobs/CompanyLogo'

// Hardcoded industry stats for the Market Pulse rail
const MARKET_PULSE = [
  { label: 'MW Under Construction', value: '34,200', delta: '+18.4% YoY' },
  { label: 'Transformer Lead Time', value: '104 wks', delta: '+12 wks QoQ' },
  { label: 'Hyperscaler Capex 2026E', value: '$312B', delta: '+34% YoY' },
  { label: 'Avg CxA Eng Salary', value: '$142K', delta: '+9% YoY' },
  { label: 'Active US Projects', value: '2,847', delta: '+47 this week' },
]

const FEATURED_COMPANIES = [
  'Equinix', 'Iron Mountain', 'Digital Realty', 'Meta', 'CyrusOne', 'Vantage',
]

function getBadge(job: Job): { label: string; cls: string } | null {
  const ageHours = (Date.now() - new Date(job.created_at).getTime()) / 3_600_000
  if (ageHours < 24) return { label: 'NEW', cls: 'bg-[#3ecf8e] text-black' }
  if ((job.salary_min ?? 0) >= 110000) return { label: 'FEATURED', cls: 'bg-amber-100 text-amber-800 border border-amber-300' }
  if ((job.salary_min ?? 0) >= 90000) return { label: 'HOT', cls: 'bg-red-100 text-red-700 border border-red-200' }
  return null
}

type SortKey = 'newest' | 'salary' | 'relevance'

function applySort(jobs: Job[], sort: SortKey): Job[] {
  return [...jobs].sort((a, b) => {
    if (sort === 'salary') return (b.salary_min ?? 0) - (a.salary_min ?? 0)
    if (sort === 'newest')
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    // relevance: featured (paid) jobs first, then newest
    const diff = (b.paid_amount_cents ?? 0) - (a.paid_amount_cents ?? 0)
    return diff !== 0 ? diff : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

interface Props {
  jobs: Job[]
  news: NewsItem[]
}

export default function HomeClient({ jobs, news }: Props) {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const browseRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const kw = keyword.toLowerCase().trim()
    const loc = location.toLowerCase().trim()
    const result = jobs.filter((job) => {
      if (activeCategory !== 'all' && job.category !== activeCategory) return false
      if (kw && !job.title.toLowerCase().includes(kw) && !job.company.toLowerCase().includes(kw)) return false
      if (loc && !job.location.toLowerCase().includes(loc)) return false
      return true
    })
    return applySort(result, sort)
  }, [jobs, keyword, location, activeCategory, sort])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    browseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function clearFilters() {
    setKeyword('')
    setLocation('')
    setActiveCategory('all')
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center px-6 py-28 sm:py-36 text-center overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.11) 1.2px, transparent 1.2px)',
          backgroundSize: '22px 22px',
          backgroundColor: '#f3f3f3',
        }}
      >
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-black uppercase tracking-tight leading-none text-balance max-w-4xl">
          Infrastructure Jobs For The People Who Keep The World Running.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-black/50 max-w-[30rem] leading-relaxed">
          Corestack aggregates data center and AI infrastructure roles from top
          employers&thinsp;—&thinsp;updated daily.
        </p>

        {/* Two-field search bar */}
        <form
          onSubmit={handleSearch}
          className="mt-9 flex w-full max-w-2xl bg-white border border-black"
        >
          <div className="flex flex-1 items-center border-r border-black px-4 min-w-0">
            <Search size={14} className="text-black/30 flex-shrink-0 mr-3" aria-hidden="true" />
            <label htmlFor="hero-kw" className="sr-only">Job title or keyword</label>
            <input
              id="hero-kw"
              type="text"
              placeholder="Job title or keyword…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 py-3.5 text-sm bg-transparent outline-none placeholder:text-black/30 min-w-0"
            />
          </div>
          <div className="hidden sm:flex flex-1 items-center border-r border-black px-4 min-w-0">
            <MapPin size={14} className="text-black/30 flex-shrink-0 mr-3" aria-hidden="true" />
            <label htmlFor="hero-loc" className="sr-only">Location</label>
            <input
              id="hero-loc"
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 py-3.5 text-sm bg-transparent outline-none placeholder:text-black/30 min-w-0"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
          >
            Search
          </button>
        </form>

        {/* Category quick-filters */}
        <div
          className="flex mt-3 overflow-x-auto max-w-2xl w-full"
          role="group"
          aria-label="Filter by category"
        >
          {(['all', ...CATEGORY_LIST] as const).map((cat, i) => {
            const isActive = activeCategory === cat
            const label = cat === 'all' ? 'All' : CATEGORY_LABELS[cat]
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={[
                  'px-4 py-2 text-xs font-medium whitespace-nowrap border-t border-b border-r border-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none',
                  i === 0 ? 'border-l' : '',
                  isActive ? 'bg-black text-white' : 'bg-white hover:bg-[#3ecf8e]',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Hiring companies strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 mt-12 text-sm text-black/30 select-none">
          {FEATURED_COMPANIES.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>

        {/* Scroll down */}
        <button
          type="button"
          onClick={() => browseRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-8 flex items-center gap-2.5 text-sm text-black/40 hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          Scroll down
          <span className="w-7 h-7 border border-black/20 flex items-center justify-center">
            <ChevronDown size={14} aria-hidden="true" />
          </span>
        </button>
      </section>

      {/* ── BROWSE ───────────────────────────────────────────────────────── */}
      <div
        ref={browseRef}
        id="jobs"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.06) 1.2px, transparent 1.2px), linear-gradient(to bottom, #f3f3f3 0%, #ffffff 45%)',
          backgroundSize: '22px 22px, 100% 100%',
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-0 divide-x divide-black/10">

            {/* Main — job list */}
            <main className="flex-1 min-w-0 py-6">
              {/* Sticky list header */}
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border border-black/10 flex items-center justify-between px-4 py-2.5 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">Live roles</span>
                  <span className="flex items-center gap-1.5 text-xs border border-black/15 px-2 py-0.5 text-black/50">
                    <span className="w-1.5 h-1.5 bg-[#3ecf8e]" aria-hidden="true" />
                    <span className="tabular-nums">{filtered.length}</span>
                  </span>
                </div>
                <div className="flex border border-black/15" role="group" aria-label="Sort order">
                  {(['newest', 'salary', 'relevance'] as const).map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSort(s)}
                      aria-pressed={sort === s}
                      className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none ${sort === s ? 'bg-black text-white' : 'hover:bg-black/5'} ${i > 0 ? 'border-l border-black/15' : ''}`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="py-16 text-center text-sm text-black/40 border border-black/10 bg-white">
                  No roles match your search.{' '}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="underline hover:text-black"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <ul role="list" className="space-y-2">
                  {filtered.map((job) => (
                    <li
                      key={job.id}
                      className="border border-black/10 bg-white hover:border-black/25 transition-colors duration-150"
                    >
                      <JobRow job={job} />
                    </li>
                  ))}
                </ul>
              )}
            </main>

            {/* Right — market pulse + news */}
            <aside className="w-52 flex-shrink-0 hidden xl:block pl-6 py-6">
              <div className="sticky top-6 space-y-8">
                {/* Market Pulse */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
                    Market Pulse
                  </p>
                  <ul role="list" className="space-y-4">
                    {MARKET_PULSE.map((stat) => (
                      <li key={stat.label} className="flex items-start justify-between gap-2">
                        <span className="text-xs text-black/50 leading-snug">{stat.label}</span>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold tabular-nums">{stat.value}</p>
                          <p className="text-[10px] text-[#3ecf8e]">↑ {stat.delta}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Latest News */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
                    Latest News
                  </p>
                  <ul role="list" className="space-y-4">
                    {news.slice(0, 5).map((item) => (
                      <li key={item.id}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                        >
                          <p className="text-xs font-medium leading-snug group-hover:underline line-clamp-3">
                            {item.headline}
                          </p>
                          <p className="text-[10px] text-black/40 mt-1">
                            <span className="text-[#3ecf8e]">{item.source}</span>
                            {' · '}
                            {new Date(item.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/news"
                    className="mt-4 flex items-center gap-1.5 text-xs text-black/40 hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                  >
                    All news <ArrowRight size={11} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Job row ───────────────────────────────────────────────────────────────────

function JobRow({ job }: { job: Job }) {
  const badge = getBadge(job)
  const salary = formatSalary(job.salary_min, job.salary_max)
  const hasSalary = job.salary_min !== null || job.salary_max !== null

  return (
    <div className="flex items-start gap-4 px-5 py-4 hover:bg-black/[0.02] transition-colors">
      <CompanyLogo company={job.company} size={40} />

      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <Link
              href={`/jobs/${job.id}`}
              className="font-semibold text-sm leading-snug hover:underline focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              {job.title}
            </Link>
            {badge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide flex-shrink-0 ${badge.cls}`}
              >
                {badge.label}
              </span>
            )}
          </div>
          <span className="text-xs text-black/30 whitespace-nowrap flex-shrink-0">
            {daysAgo(job.created_at)}
          </span>
        </div>

        {/* Company + division */}
        <p className="text-xs text-black/50 mt-0.5">
          {job.company}
          <span className="text-black/25 mx-1">·</span>
          <span className="text-black/35">{CATEGORY_LABELS[job.category]}</span>
        </p>

        {/* Meta chips */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-black/40">
          <span>{job.location}</span>
          {hasSalary && (
            <>
              <span className="text-black/20">|</span>
              <span className="text-[#3ecf8e] font-medium tabular-nums">{salary}</span>
            </>
          )}
          {job.remote && (
            <>
              <span className="text-black/20">|</span>
              <span>Remote</span>
            </>
          )}
        </div>
      </div>

      {/* Apply CTA */}
      <Link
        href={`/jobs/${job.id}`}
        className="self-center flex-shrink-0 text-xs font-medium border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap"
        aria-label={`Apply for ${job.title} at ${job.company}`}
      >
        Apply →
      </Link>
    </div>
  )
}
