import { getPosts } from '../posts/get-posts.js'
import { readFile } from 'fs/promises'
import { join } from 'path'

const CONFIG = {
  title: 'My Blog',
  siteUrl: 'https://zwkang.blog',
  description: 'Latest blog posts',
  lang: 'zh-cn'
}

const escapeXml = (str) =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const extractContent = (mdx) => {
  // 移除 frontmatter
  const withoutFrontmatter = mdx.replace(/^---[\s\S]*?---\n*/, '')
  // 移除 import 语句
  const withoutImports = withoutFrontmatter.replace(/^import\s+.*$/gm, '')
  // 移除图片引用（RSS 阅读器通常不支持）
  const withoutImages = withoutImports.replace(/!\[.*?\]\(.*?\)/g, '')
  // 清理多余空行
  return withoutImages.replace(/\n{3,}/g, '\n\n').trim()
}

export async function GET() {
  const allPosts = await getPosts()

  const postsWithContent = await Promise.all(
    allPosts.map(async (post) => {
      const slug = post.route.replace('/posts/', '')
      const filePath = join(process.cwd(), 'app/posts/(with-comments)', slug, 'page.mdx')
      try {
        const content = await readFile(filePath, 'utf-8')
        return { ...post, content: extractContent(content) }
      } catch {
        return { ...post, content: '' }
      }
    })
  )

  const posts = postsWithContent
    .map(
      post => `    <item>
        <title>${escapeXml(post.title)}</title>
        <description>${escapeXml(post.frontMatter.description)}</description>
        <link>${CONFIG.siteUrl}${post.route}</link>
        <guid isPermaLink="true">${CONFIG.siteUrl}${post.route}</guid>
        <pubDate>${new Date(post.frontMatter.date).toUTCString()}</pubDate>
        <author>${escapeXml(post.frontMatter.author)}</author>
        <content:encoded><![CDATA[${post.content}]]></content:encoded>
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.lang}</language>
    <atom:link href="${CONFIG.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${posts}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  })
}
