/**
 * WordPress WXR XML + CSV → JSON 解析脚本
 *
 * 从 WordPress 导出的 WXR XML 和 CSV 中提取已发布的文章，
 * 合并去重后输出为 JSON 供 /old-posts 路由使用。
 *
 * 用法: node scripts/parse-wordpress.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const XML_PATH = resolve(__dirname, 'data/kangkangblog.WordPress.2023-02-10.xml')
const CSV_PATH = resolve(__dirname, 'data/zwkang.csv')
const OUTPUT_PATH = resolve(__dirname, '../app/old-posts/data/posts.json')

/** 提取 CDATA 或纯文本内容 */
const extractCDATA = (text) =>
  text?.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '') ?? ''

/** 从 item XML 块中提取指定标签内容 */
const extractTag = (item, tag) => {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)
  const match = item.match(regex)
  return match ? extractCDATA(match[1].trim()) : ''
}

/** 从 item 中提取所有 category 标签 */
const extractCategories = (item) => {
  const matches = [...item.matchAll(/<category\s+domain="category"[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/g)]
  return [...new Set(matches.map(m => m[1]))]
}

/** 已失效的旧域名列表 */
const DEAD_DOMAINS = [
  'ls-l.cn',
  'zwkang.com',
  'zwk.life',
  'zwk.space',
  'zwkang.github.io',
  '10.10.1.10',
  '121.42.163.218',
  'next-with-git-issue-kang95630.now.sh'
]

const DEAD_DOMAIN_PATTERN = new RegExp(
  `<a\\s+[^>]*href="https?://(?:${DEAD_DOMAINS.map(d => d.replace(/\./g, '\\.')).join('|')})[^"]*"[^>]*>(.*?)</a>`,
  'gi'
)

/** 匹配 HTML 转义形式的死链（&lt;a href="..."&gt;...&lt;/a&gt;） */
const DEAD_DOMAIN_ESCAPED_PATTERN = new RegExp(
  `&lt;a\\s+[^&]*href="https?://(?:${DEAD_DOMAINS.map(d => d.replace(/\./g, '\\.')).join('|')})[^"]*"[^&]*&gt;(.*?)&lt;/a&gt;`,
  'gi'
)

/** 匹配死链域名的 <img> 标签（旧图片引用） */
const DEAD_IMG_PATTERN = new RegExp(
  `<img\\s+[^>]*src="https?://(?:${DEAD_DOMAINS.map(d => d.replace(/\./g, '\\.')).join('|')})[^"]*"[^>]*/?>`,
  'gi'
)

/** 匹配 HTML 转义形式的死链 img */
const DEAD_IMG_ESCAPED_PATTERN = new RegExp(
  `&lt;img\\s+[^&]*src="https?://(?:${DEAD_DOMAINS.map(d => d.replace(/\./g, '\\.')).join('|')})[^"]*"[^&]*/? ?&gt;`,
  'gi'
)

/** 将死链标签替换为纯文本或移除 */
const stripDeadLinks = (html) =>
  html
    .replace(DEAD_DOMAIN_PATTERN, '$1')
    .replace(DEAD_DOMAIN_ESCAPED_PATTERN, '$1')
    .replace(DEAD_IMG_PATTERN, '')
    .replace(DEAD_IMG_ESCAPED_PATTERN, '')

/** 解析单个 <item> 块 */
const parseItem = (itemXml) => {
  const postType = extractTag(itemXml, 'wp:post_type')
  const status = extractTag(itemXml, 'wp:status')

  if (postType !== 'post' || status !== 'publish') return null

  const title = extractTag(itemXml, 'title')
  const slug = extractTag(itemXml, 'wp:post_name')
  const date = extractTag(itemXml, 'wp:post_date')
  const content = extractTag(itemXml, 'content:encoded')
  const excerpt = extractTag(itemXml, 'excerpt:encoded')
  const categories = extractCategories(itemXml)

  // 跳过无内容文章
  if (!content.trim()) return null

  return {
    title: title || slug || 'Untitled',
    slug: decodeURIComponent(slug) || String(Date.now()),
    date,
    content: stripDeadLinks(content),
    excerpt,
    categories
  }
}

// --- Parse XML ---
const xml = readFileSync(XML_PATH, 'utf-8')
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]

const xmlPosts = items
  .map(match => parseItem(match[1]))
  .filter(Boolean)

// --- Parse CSV ---
/** CSV 解析器（处理带引号、换行的字段） */
const parseCSV = (text) => {
  const rows = []
  let i = 0
  const len = text.length

  // 跳过 header 行
  while (i < len && text[i] !== '\n') i++
  i++

  while (i < len) {
    const row = []
    for (let col = 0; col < 5; col++) {
      if (i >= len) break
      if (text[i] === '"') {
        i++ // skip opening quote
        let value = ''
        while (i < len) {
          if (text[i] === '"') {
            if (i + 1 < len && text[i + 1] === '"') {
              value += '"'
              i += 2
            } else {
              i++
              break
            }
          } else {
            value += text[i]
            i++
          }
        }
        row.push(value)
        if (i < len && (text[i] === ',' || text[i] === '\n')) i++
      } else {
        let value = ''
        while (i < len && text[i] !== ',' && text[i] !== '\n') {
          value += text[i]
          i++
        }
        row.push(value)
        if (i < len && (text[i] === ',' || text[i] === '\n')) i++
      }
    }
    if (row.length >= 2 && row[1].trim()) {
      rows.push({ id: row[0], title: row[1], content: row[2] || '', src_url: row[3] || '', mtime: row[4] || '' })
    }
  }
  return rows
}

/** 从 CSV src_url 中提取 slug */
const extractSlugFromUrl = (url) => {
  try {
    const path = new URL(url).pathname
    const parts = path.replace(/\.html$/, '').split('/').filter(Boolean)
    // 取最后一段（非数字 ID 的部分，或最后一段作为 fallback）
    return decodeURIComponent(parts[parts.length - 1] || '')
  } catch {
    return ''
  }
}

/** 从 CSV src_url 提取日期 */
const extractDateFromUrl = (url) => {
  try {
    const path = new URL(url).pathname
    const match = path.match(/\/(\d{4})\/(\d{2})\//)
    if (match) return `${match[1]}-${match[2]}-01 00:00:00`
  } catch {}
  return ''
}

const csvText = readFileSync(CSV_PATH, 'utf-8')
const csvRecords = parseCSV(csvText)

// 已有文章标题集合（用于去重）
const existingTitles = new Set(xmlPosts.map(p => p.title.trim().toLowerCase()))

const csvPosts = csvRecords
  .filter(r => {
    const content = r.content.trim()
    // 跳过无内容的记录
    if (!content) return false
    // 跳过与 XML 重复的
    if (existingTitles.has(r.title.trim().toLowerCase())) return false
    return true
  })
  .map(r => {
    // 密码保护的表单内容替换为空（实际内容不受保护）
    let content = r.content.replace(/<form[^>]*class="post-password-form"[^>]*>[\s\S]*?<\/form>/gi, '')
    content = stripDeadLinks(content)
    const slug = extractSlugFromUrl(r.src_url) || r.id
    const date = extractDateFromUrl(r.src_url)

    return {
      title: r.title || 'Untitled',
      slug,
      date,
      content: content.trim(),
      excerpt: '',
      categories: []
    }
  })
  .filter(p => p.content) // 过滤移除密码表单后变空的文章

console.log(`CSV: ${csvPosts.length} new posts (not in XML)`)

// --- Merge & Output ---
const posts = [...xmlPosts, ...csvPosts]
  .sort((a, b) => new Date(b.date) - new Date(a.date))

mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
writeFileSync(OUTPUT_PATH, JSON.stringify(posts, null, 2), 'utf-8')

console.log(`Total: ${posts.length} published posts → ${OUTPUT_PATH}`)
