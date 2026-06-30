import Link from 'next/link'
import type { Job } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/constants'
import { formatSalary, daysAgo } from '@/lib/utils'

interface Props {
  job: Job
}

export default function JobCard({ job }: Props) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block p-5 transition-colors duration-150 hover:bg-[#3ecf8e]/10 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
    >
      <div className="flex items-start justify-between gap-3 min-w-0">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-w-0">
          {job.title}
        </h3>
        <span className="flex-shrink-0 text-xs border border-black px-2 py-0.5 whitespace-nowrap">
          {CATEGORY_LABELS[job.category]}
        </span>
      </div>

      <p className="mt-1.5 text-sm text-black/60 truncate min-w-0">
        {job.company}
        <span className="mx-1.5 text-black/30">·</span>
        {job.location}
      </p>

      {(job.salary_min !== null || job.salary_max !== null) && (
        <p className="mt-2 text-sm tabular-nums font-medium">
          {formatSalary(job.salary_min, job.salary_max)}
        </p>
      )}

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {job.remote && (
          <span className="text-xs border border-black px-2 py-0.5">
            Remote
          </span>
        )}
        <span className="text-xs text-black/40 ml-auto">
          {daysAgo(job.created_at)}
        </span>
      </div>
    </Link>
  )
}
