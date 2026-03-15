import Link from 'next/link'
import { notFound } from 'next/navigation'
import posts from '../data/posts.json' with { type: 'json' }
import CodeHighlight from './code-highlight'

export function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }))
}

const findPost = (slug) =>
  posts.find(p => p.slug === slug || p.slug === decodeURIComponent(slug))

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt || post.title
  }
}

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return dateFormatter.format(date)
}

export default async function OldPostPage({ params }) {
  const { slug } = await params
  const post = findPost(slug)

  if (!post) notFound()

  return (
    <article className="old-post-detail">
      <header>
        <h1>{post.title}</h1>
        <div style={{ color: 'var(--nextra-color-gray-600)', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.categories.length > 0 && (
            <span> · {post.categories.join(', ')}</span>
          )}
        </div>
      </header>
      <CodeHighlight>
        <div
          className="old-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </CodeHighlight>
      <footer style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid var(--nextra-color-gray-200)' }}>
        <Link href="/old-posts">← 返回文章列表</Link>
      </footer>
    </article>
  )
}
