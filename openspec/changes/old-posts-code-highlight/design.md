## Context

`/old-posts/[slug]` 使用 `dangerouslySetInnerHTML` 渲染 WordPress 导出的 HTML 内容。代码块格式为 `<pre><code class="language-xxx">`，共 45 篇文章含有代码。项目通过 nextra 已依赖 shiki。

## Goals / Non-Goals

**Goals:**
- 代码块获得语法高亮，与 Nextra MDX 文章的高亮体验一致

**Non-Goals:**
- 不修改数据源或解析脚本
- 不在构建时预处理高亮（成本高，91 篇文章大量 HTML）

## Decisions

### 1. 运行时 shiki 高亮

**选择**: 创建客户端组件，在 `useEffect` 中使用 shiki 的 `codeToHtml` 对页面中的 `<pre><code>` 元素做高亮。

**理由**: shiki 已在 node_modules 中，支持浏览器端使用。运行时高亮对 45 篇含代码的文章而言性能可接受（按需加载 shiki）。

**替代方案**: 构建时在解析脚本中用 shiki 预处理 → 增加构建依赖复杂度和数据体积，不值得。

### 2. 使用 shiki bundled web

**选择**: 从 `shiki/bundle/web` 导入轻量 bundle，仅包含常见 web 语言。

**理由**: 减少客户端加载体积，WordPress 文章中的代码主要是 JS/TS/JSX/CSS/HTML。

## Risks / Trade-offs

- **首次加载闪烁** → 代码先显示无高亮，shiki 加载后高亮替换。可接受。
- **shiki bundle 体积** → web bundle 约 200KB gzip，按需加载不影响首屏。
