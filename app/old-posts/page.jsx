import Link from 'next/link'
import posts from './data/posts.json' with { type: 'json' }

export const metadata = {
  title: 'Old Posts'
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return dateFormatter.format(date)
}

export default function OldPostsPage() {
  return (
    <div data-pagefind-ignore="all">
      <h1>{metadata.title}</h1>
      <p style={{ color: 'var(--nextra-color-gray-600)', marginBottom: '2rem' }}>
        从 WordPress 迁移的历史文章（{posts.length} 篇）
      </p>
      <ul className="posts-list">
        {posts.map(post => (
          <li key={post.slug}>
            <Link className="posts-list-link" href={`/old-posts/${encodeURIComponent(post.slug)}`}>
              <time className="posts-list-date" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
              <span className="posts-list-title">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
