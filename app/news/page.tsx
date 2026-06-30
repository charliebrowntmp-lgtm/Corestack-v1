import type { Metadata } from 'next'
import { getNews } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Industry News',
  description: 'Latest news and updates from the data center industry.',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function NewsPage() {
  const news = await getNews().catch(() => [])

  return (
    <div className="px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">Industry News</h1>

        {news.length === 0 ? (
          <p className="text-sm text-black/50 py-12 text-center border border-black">
            No news articles yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-black">
            {news.map((item) => (
              <article key={item.id} className="border-r border-b border-black p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs text-black/40 tabular-nums">
                    {formatDate(item.published_at)}
                  </span>
                  <span className="text-xs border border-black px-2 py-0.5 truncate max-w-32">
                    {item.source}
                  </span>
                </div>

                <h2 className="font-semibold text-sm leading-snug">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                  >
                    {item.headline}
                  </a>
                </h2>

                {item.excerpt && (
                  <p className="text-sm text-black/60 line-clamp-3">
                    {item.excerpt}
                  </p>
                )}

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs mt-auto border border-black px-3 py-1.5 self-start transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                  aria-label={`Read full article: ${item.headline}`}
                >
                  Read article →
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
