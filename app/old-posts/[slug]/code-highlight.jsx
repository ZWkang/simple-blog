'use client'

import { useEffect, useRef } from 'react'

export default function CodeHighlight({ children }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const codeBlocks = container.querySelectorAll('pre code[class*="language-"]')
    if (codeBlocks.length === 0) return

    // 注入行号样式（仅一次）
    if (!document.getElementById('old-post-line-numbers')) {
      const style = document.createElement('style')
      style.id = 'old-post-line-numbers'
      style.textContent = `
        code.nextra-code[data-line-numbers] {
          display: grid;
          counter-reset: line;
          background-color: var(--shiki-light-bg);
          padding-top: 0.8em;
          padding-bottom: 0.8em;
          border-radius: 0.375rem;
        }
        .dark code.nextra-code[data-line-numbers] {
          background-color: var(--shiki-dark-bg);
        }
        code.nextra-code[data-line-numbers] > .line {
          padding-left: 0.5em;
          padding-right: 1em;
        }
        code.nextra-code[data-line-numbers] > .line::before {
          counter-increment: line;
          content: counter(line);
          display: inline-block;
          width: 2.5rem;
          padding-right: 1em;
          text-align: right;
          color: #6b7280;
        }
      `
      document.head.appendChild(style)
    }

    let cancelled = false

    import('shiki/bundle/web').then(async ({ createHighlighter }) => {
      if (cancelled) return

      const langs = new Set()
      for (const block of codeBlocks) {
        const match = block.className.match(/language-(\S+)/)
        if (match) langs.add(match[1])
      }

      const highlighter = await createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: [...langs]
      })

      if (cancelled) return

      for (const block of codeBlocks) {
        const match = block.className.match(/language-(\S+)/)
        if (!match) continue

        const lang = match[1]
        const code = block.textContent || ''
        const pre = block.parentElement

        if (!pre || !highlighter.getLoadedLanguages().includes(lang)) continue

        try {
          const html = highlighter.codeToHtml(code, {
            lang,
            themes: { dark: 'github-dark', light: 'github-light' },
            defaultColor: false
          })

          // 用临时容器解析 shiki 输出，通过 DOM 操作设置属性
          const tmp = document.createElement('div')
          tmp.innerHTML = html
          const newPre = tmp.querySelector('pre')
          if (!newPre) continue

          // not-prose 排除 Tailwind prose 样式，避免双层内边距/背景
          newPre.classList.add('not-prose')
          Object.assign(newPre.style, {
            borderRadius: '0.375rem',
            overflowX: 'auto',
            margin: '1.7em 0',
            background: 'transparent'
          })

          // nextra-code 复用 Nextra --shiki-light/dark 主题切换
          const codeEl = newPre.querySelector('code')
          if (codeEl) {
            codeEl.classList.add('nextra-code')
            codeEl.dataset.lineNumbers = ''
          }

          pre.replaceWith(newPre)
        } catch {
          // 高亮失败则保持原样
        }
      }

      highlighter.dispose()
    })

    return () => { cancelled = true }
  }, [])

  return <div ref={containerRef}>{children}</div>
}
