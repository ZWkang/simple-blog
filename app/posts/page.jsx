import Link from 'next/link'
import { getPosts } from './get-posts'

export const metadata = {
  title: 'Posts'
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return dateFormatter.format(date)
}

export default async function PostsPage() {
  const posts = await getPosts()
  return (
    <div data-pagefind-ignore="all">
      <h1>{metadata.title}</h1>
      <ul className="posts-list">
        {posts.map(post => {
          const title = post?.frontMatter?.title ?? post?.name ?? post?.route
          const date = formatDate(post?.frontMatter?.date)
          return (
            <li key={post.route}>
              <Link className="posts-list-link" href={post.route}>
                <time className="posts-list-date" dateTime={post?.frontMatter?.date}>
                  {date}
                </time>
                <span className="posts-list-title">{title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
