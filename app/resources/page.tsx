import type { Metadata } from 'next'
import { getResources } from '@/lib/api'
import type { Resource } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Training programs, certifications, and schools for data center careers.',
}

const TYPE_LABELS: Record<Resource['type'], string> = {
  program: 'Training Programs',
  cert: 'Certifications',
  school: 'Schools',
}

const TYPE_ORDER: Resource['type'][] = ['program', 'cert', 'school']

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="border border-black p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-sm leading-snug min-w-0">
          {resource.name}
        </h3>
        <span className="text-xs text-black/50 flex-shrink-0">{resource.provider}</span>
      </div>

      {resource.description && (
        <p className="text-sm text-black/60 line-clamp-3">
          {resource.description}
        </p>
      )}

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs mt-auto border border-black px-3 py-1.5 self-start transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        aria-label={`Learn more about ${resource.name}`}
      >
        Learn more →
      </a>
    </article>
  )
}

export default async function ResourcesPage() {
  const resources = await getResources().catch(() => [])

  const grouped = TYPE_ORDER.reduce<Record<Resource['type'], Resource[]>>(
    (acc, type) => {
      acc[type] = resources.filter((r) => r.type === type)
      return acc
    },
    { program: [], cert: [], school: [] }
  )

  return (
    <div className="px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-3">Resources</h1>
        <p className="text-black/50 text-sm mb-10">
          Training programs, certifications, and schools for data center careers.
        </p>

        {TYPE_ORDER.map((type) => {
          const items = grouped[type]
          if (items.length === 0) return null
          return (
            <section key={type} className="mb-12">
              <h2 className="text-xl font-bold mb-6 pb-3 border-b border-black">
                {TYPE_LABELS[type]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-black">
                {items.map((resource) => (
                  <div key={resource.id} className="border-r border-b border-black">
                    <ResourceCard resource={resource} />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
