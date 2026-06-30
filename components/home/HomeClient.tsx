'use client'

import { useState, useMemo, useRef } from 'react'
import { Search, MapPin, ChevronDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Job, NewsItem } from '@/lib/types'
import type { Category } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_LIST } from '@/lib/constants'
import { formatSalary, daysAgo } from '@/lib/utils'
import CompanyLogo from '@/components/jobs/CompanyLogo'

// ── Constants ─────────────────────────────────────────────────────────────────

const CAT_COLOR: Record<Category, string> = {
  operations: '#f97316',
  construction: '#3b82f6',
  electrical_power: '#eab308',
  cooling_mechanical: '#8b5cf6',
  networking: '#22c55e',
}

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

// ── Helpers ───────────────────────────────────────────────────────────────────

function getBadge(job: Job): { label: string; cls: string } | null {
  const ageHours = (Date.now() - new Date(job.created_at).getTime()) / 3_600_000
  if (ageHours < 24) return { label: 'NEW', cls: 'bg-[#3ecf8e] text-black' }
  if ((job.salary_min ?? 0) >= 110000)
    return { label: 'FEATURED', cls: 'bg-amber-100 text-amber-800 border border-amber-300' }
  if ((job.salary_min ?? 0) >= 90000)
    return { label: 'HOT', cls: 'bg-red-100 text-red-700 border border-red-200' }
  return null
}

type SortKey = 'newest' | 'salary' | 'relevance'

function applySort(jobs: Job[], sort: SortKey): Job[] {
  return [...jobs].sort((a, b) => {
    if (sort === 'salary') return (b.salary_min ?? 0) - (a.salary_min ?? 0)
    if (sort === 'newest')
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    const diff = (b.paid_amount_cents ?? 0) - (a.paid_amount_cents ?? 0)
    return diff !== 0 ? diff : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

function excerpt(text: string, max = 140): string {
  const plain = text
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  return plain.length <= max ? plain : plain.slice(0, max).trimEnd() + '…'
}

// ── Main component ────────────────────────────────────────────────────────────

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

  const companyCount = useMemo(() => new Set(jobs.map((j) => j.company)).size, [jobs])
  const remoteCount = useMemo(() => jobs.filter((j) => j.remote).length, [jobs])
  const recentCount = useMemo(
    () =>
      jobs.filter(
        (j) => Date.now() - new Date(j.created_at).getTime() < 7 * 86_400_000
      ).length,
    [jobs]
  )

  const filtered = useMemo(() => {
    const kw = keyword.toLowerCase().trim()
    const loc = location.toLowerCase().trim()
    const result = jobs.filter((job) => {
      if (activeCategory !== 'all' && job.category !== activeCategory) return false
      if (
        kw &&
        !job.title.toLowerCase().includes(kw) &&
        !job.company.toLowerCase().includes(kw)
      )
        return false
      if (loc && !job.location.toLowerCase().includes(loc)) return false
      return true
    })
    return applySort(result, sort)
  }, [jobs, keyword, location, activeCategory, sort])

  const countFor = (cat: Category | 'all') =>
    cat === 'all' ? jobs.length : jobs.filter((j) => j.category === cat).length

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    browseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function clearFilters() {
    setKeyword('')
    setLocation('')
    setActiveCategory('all')
  }

  const hasActiveFilters = keyword || location || activeCategory !== 'all'

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center px-6 py-28 sm:py-36 text-center overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.11) 1.2px, transparent 1.2px)',
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
            <label htmlFor="hero-kw" className="sr-only">
              Job title or keyword
            </label>
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
            <label htmlFor="hero-loc" className="sr-only">
              Location
            </label>
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
          className="mt-8 flex items-center gap-2.5 text-sm text-black/40 hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
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
            'radial-gradient(circle, rgba(0,0,0,0.07) 1.2px, transparent 1.2px), linear-gradient(to bottom, #f3f3f3 0%, #f0f0f0 20%, #f6f6f6 60%, #fafafa 100%)',
          backgroundSize: '22px 22px, 100% 100%',
        }}
      >
        {/* ── Stats strip ─────────────────────────────────── */}
        <div
          className="flex divide-x divide-black border-b border-black overflow-x-auto"
          aria-label="Platform statistics"
        >
          {[
            { label: 'Open roles', value: String(jobs.length) },
            { label: 'Companies hiring', value: String(companyCount) },
            { label: 'Remote roles', value: String(remoteCount) },
            { label: 'Added this week', value: String(recentCount) },
            { label: 'Specialisations', value: '5' },
          ].map((s) => (
            <div key={s.label} className="flex-1 px-6 py-5 min-w-[120px]">
              <p className="text-2xl font-bold tabular-nums">{s.value}</p>
              <p className="text-xs text-black/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Main layout: job grid + sidebar ─────────────── */}
        <div className="flex divide-x divide-black">

          {/* Left: category tiles + sort bar + mosaic job grid */}
          <div className="flex-1 min-w-0">

            {/* Category tiles */}
            <div
              className="grid border-b border-black overflow-x-auto"
              style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}
              role="group"
              aria-label="Filter by category"
            >
              {(['all', ...CATEGORY_LIST] as const).map((cat, i) => {
                const isActive = activeCategory === cat
                const isAll = cat === 'all'
                const label = isAll ? 'All Categories' : CATEGORY_LABELS[cat]
                const color = !isAll ? CAT_COLOR[cat] : '#000'
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={isActive}
                    className={[
                      'p-5 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none relative',
                      i > 0 ? 'border-l border-black' : '',
                      isActive ? 'bg-white' : 'hover:bg-white/60',
                    ].join(' ')}
                  >
                    {/* Colour dot */}
                    <span
                      className="block w-2.5 h-2.5 mb-3"
                      style={{ backgroundColor: isActive ? color : '#d1d5db' }}
                      aria-hidden="true"
                    />
                    <p className="font-semibold text-xs leading-snug line-clamp-2">{label}</p>
                    <p className="text-[11px] text-black/40 mt-1 tabular-nums">
                      {countFor(cat)} roles
                    </p>
                    {/* Active underline */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Sort bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-black bg-white/70 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="text-xs text-black/50">
                  <span className="font-semibold text-black tabular-nums">{filtered.length}</span>{' '}
                  {filtered.length === 1 ? 'role' : 'roles'}
                  {activeCategory !== 'all' && (
                    <span className="text-black/35"> in {CATEGORY_LABELS[activeCategory]}</span>
                  )}
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[10px] border border-black/20 px-2 py-0.5 text-black/40 hover:text-black hover:border-black transition-colors focus-visible:ring-1 focus-visible:ring-[#3ecf8e] outline-none"
                  >
                    Clear ×
                  </button>
                )}
              </div>
              <div
                className="flex border border-black/20"
                role="group"
                aria-label="Sort order"
              >
                {(['newest', 'salary', 'relevance'] as const).map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSort(s)}
                    aria-pressed={sort === s}
                    className={[
                      'px-3 py-1.5 text-[11px] font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none',
                      i > 0 ? 'border-l border-black/20' : '',
                      sort === s ? 'bg-black text-white' : 'hover:bg-black/5',
                    ].join(' ')}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mosaic job cards */}
            {filtered.length === 0 ? (
              <div className="py-20 text-center bg-white border-b border-black">
                <p className="text-sm text-black/40">No roles match your search.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 text-xs underline hover:text-black text-black/40"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <ul
                role="list"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-black"
              >
                {filtered.map((job) => (
                  <li
                    key={job.id}
                    className="border-r border-b border-black bg-white"
                  >
                    <MosaicJobCard job={job} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="w-56 flex-shrink-0 hidden xl:block" aria-label="Market data and news">
            <div className="sticky top-0 divide-y divide-black">
              {/* Market Pulse */}
              <div className="px-5 py-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-5">
                  Market Pulse
                </p>
                <ul role="list" className="space-y-5">
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
              <div className="px-5 py-6">
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
                  className="mt-5 flex items-center gap-1.5 text-xs text-black/40 hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                >
                  All news <ArrowRight size={11} aria-hidden="true" />
                </Link>
              </div>

              {/* Post a job CTA */}
              <div className="px-5 py-6">
                <p className="text-xs font-semibold leading-snug mb-2">
                  Hiring data center talent?
                </p>
                <p className="text-[11px] text-black/50 leading-relaxed mb-4">
                  Reach operations, construction, power, cooling, and networking
                  professionals.
                </p>
                <Link
                  href="/post"
                  className="block text-center text-xs font-medium bg-black text-white px-4 py-2.5 transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

// ── Mosaic job card ───────────────────────────────────────────────────────────

function MosaicJobCard({ job }: { job: Job }) {
  const badge = getBadge(job)
  const salary = formatSalary(job.salary_min, job.salary_max)
  const hasSalary = job.salary_min !== null || job.salary_max !== null

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="flex flex-col p-7 min-h-[300px] h-full group transition-colors duration-150 hover:bg-black/[0.02] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
    >
      {/* Header: logo + badge */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <CompanyLogo company={job.company} size={48} />
        {badge && (
          <span
            className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wide flex-shrink-0 ${badge.cls}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-black/70 transition-colors">
        {job.title}
      </h3>

      {/* Company + location */}
      <p className="text-sm text-black/50 mb-3">
        {job.company}
        <span className="mx-1.5 text-black/20">·</span>
        {job.location}
      </p>

      {/* Description excerpt — fills remaining space */}
      <p className="text-xs text-black/40 leading-relaxed line-clamp-3 flex-1 mb-5">
        {excerpt(job.description)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-4 border-t border-black/[0.07] flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] border border-black/15 px-2.5 py-1 whitespace-nowrap">
            {CATEGORY_LABELS[job.category]}
          </span>
          {job.remote && (
            <span className="text-[11px] border border-black/15 px-2.5 py-1">Remote</span>
          )}
        </div>
        {hasSalary ? (
          <span className="text-xs font-semibold text-[#3ecf8e] tabular-nums flex-shrink-0">
            {salary}
          </span>
        ) : (
          <span className="text-[11px] text-black/25 flex-shrink-0">{daysAgo(job.created_at)}</span>
        )}
      </div>
    </Link>
  )
}
