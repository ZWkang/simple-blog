## Context

博客使用 Next.js 16 + Nextra 构建，文章通过 MDX 格式存储在 `app/posts/(with-comments)/` 目录下。现有 WordPress 导出文件包含 127 篇历史文章（89 篇 publish），格式为 WXR XML。需要将这些文章以独立路由 `/old-posts` 展示，与现有 `/posts` 体系分离。

## Goals / Non-Goals

**Goals:**
- 构建时解析 WordPress XML 生成静态 JSON 数据
- `/old-posts` 页面展示已发布的历史文章列表
- `/old-posts/[slug]` 展示单篇文章详情
- 保留文章原始分类和日期信息

**Non-Goals:**
- 不将历史文章转换为 MDX 格式
- 不将历史文章纳入现有 `/posts` 体系和标签系统
- 不迁移评论数据
- 不处理 WordPress 媒体文件/图片

## Decisions

### 1. XML 解析方案：构建时预处理为 JSON

**选择**: 编写 Node.js 脚本在构建时（prebuild）解析 XML 并输出 JSON 文件到 `app/old-posts/data/` 目录。

**理由**: WordPress XML 文件约 1MB，解析一次生成 JSON 即可。运行时无需 XML 解析开销，页面直接 import JSON。

**替代方案**: 运行时解析 XML → 增加构建复杂度且每次请求都要解析，不合理。

### 2. XML 解析库：使用 Node.js 内置能力

**选择**: 使用 `node:stream` + 简单正则/DOM 解析（或轻量库如 `fast-xml-parser`），避免引入重依赖。

**理由**: WXR 格式固定，结构可预测，无需完整 XML 解析器。

### 3. 路由结构：`/old-posts` 独立路由

**选择**: `app/old-posts/page.jsx`（列表）+ `app/old-posts/[slug]/page.jsx`（详情）

**理由**: 与现有 `/posts` 分离，避免影响现有文章系统。使用 `generateStaticParams` 实现 SSG。

### 4. 内容渲染：直接渲染 HTML

**选择**: WordPress 文章内容为 HTML，使用 `dangerouslySetInnerHTML` 渲染（内容来源可信——自有博客导出）。

**理由**: 历史内容格式复杂，转换为 Markdown 成本高且可能丢失格式。

### 5. 仅展示 publish 状态文章

**选择**: 解析脚本过滤 `wp:status` 为 `publish` 且 `wp:post_type` 为 `post` 的条目。

## Risks / Trade-offs

- **HTML 安全性** → 数据来源为自有 WordPress 导出，内容可信；但仍需基本 sanitize
- **图片引用失效** → 历史文章中引用的 WordPress 媒体文件可能已不可访问，Non-Goal 范围
- **大量文章性能** → 89 篇文章列表页一次性渲染可接受，无需分页
