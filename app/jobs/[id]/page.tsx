import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import { getJob } from '@/lib/api'
import { CATEGORY_LABELS } from '@/lib/constants'
import { formatSalary, daysAgo } from '@/lib/utils'
import AuthGate from '@/components/auth/AuthGate'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const job = await getJob(id)
    return {
      title: `${job.title} at ${job.company}`,
      description: `${job.title} position at ${job.company} in ${job.location}. ${job.remote ? 'Remote available.' : ''}`,
    }
  } catch {
    return { title: 'Job Not Found' }
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params

  let job
  try {
    job = await getJob(id)
  } catch {
    notFound()
  }

  return (
    <div className="px-6 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <a
          href="/jobs"
          className="text-sm text-black/50 hover:text-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none inline-block mb-8"
        >
          ← Back to jobs
        </a>

        {/* Job header */}
        <div className="border border-black p-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-black/60 mt-1">
                {job.company}
                <span className="mx-2 text-black/30">·</span>
                {job.location}
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0 items-start">
              <span className="border border-black px-3 py-1 text-xs font-medium">
                {CATEGORY_LABELS[job.category]}
              </span>
              {job.remote && (
                <span className="border border-black px-3 py-1 text-xs">
                  Remote
                </span>
              )}
            </div>
          </div>

          {/* Salary */}
          {(job.salary_min !== null || job.salary_max !== null) && (
            <p className="mt-4 tabular-nums font-medium text-sm">
              {formatSalary(job.salary_min, job.salary_max)}
            </p>
          )}

          {/* Posted date */}
          <p className="mt-2 text-xs text-black/40">
            Posted {daysAgo(job.created_at)}
          </p>

          {/* Apply section */}
          <div className="mt-8 pt-8 border-t border-black">
            <AuthGate jobId={job.id} />
          </div>
        </div>

        {/* Description */}
        <div className="border border-black border-t-0 p-8">
          <h2 className="text-lg font-bold mb-6">Job Description</h2>
          <div className="prose prose-sm max-w-none
            prose-headings:font-bold prose-headings:text-black
            prose-p:text-black/80 prose-p:leading-relaxed
            prose-li:text-black/80
            prose-a:text-[#3ecf8e] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-black
            prose-hr:border-black">
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
