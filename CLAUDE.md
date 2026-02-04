# Blog Project - AI 协作指南

这是一个基于 Next.js 和 Nextra 的现代博客系统，使用 MDX 格式编写文章，支持标签、搜索、RSS 和评论功能。

## 项目概览

### 技术栈
- **Next.js 16.0.7** (App Router) - React 服务端渲染框架
- **React 19.1.0** - UI 库
- **Nextra + nextra-theme-blog** - 博客框架和主题
- **Pagefind 1.3.0** - 静态搜索引擎
- **Giscus** - 基于 GitHub Discussions 的评论系统
- **MDX** - Markdown + JSX 文章格式

### 项目结构
```
app/
├── layout.jsx              # 根布局（主题、字体、Giscus 配置）
├── page.mdx                # 首页
├── _meta.global.js         # 全局导航配置
├── posts/                  # 文章模块
│   ├── page.jsx            # 文章列表页
│   ├── get-posts.js        # 文章获取工具
│   └── (with-comments)/    # 带评论的文章路由组
│       ├── layout.jsx      # 评论布局
│       └── [各文章目录]/   # 每篇文章一个目录
│           └── page.mdx    # 文章内容
├── tags/[tag]/page.jsx     # 动态标签页
└── rss.xml/route.js        # RSS 源生成

mdx-components.jsx          # 自定义 MDX 组件
next.config.js              # Next.js 配置
```

## 代码规范

### JavaScript/React 风格
- **ES Module** 语法（`import/export`）
- **箭头函数**优先
- **async/await** 处理异步操作
- **解构赋值**和**模板字符串**
- **函数式编程**：使用 `map`、`filter`、`sort`、`flatMap`
- **服务端组件**优先（Next.js App Router 默认）

### 文件命名
- 组件文件：`layout.jsx`、`page.jsx`（小写）
- 工具函数：`get-posts.js`（kebab-case）
- MDX 文章：`page.mdx`
- 配置文件：`_meta.global.js`（下划线前缀表示元数据）

### 组件模式
```jsx
// 服务端组件（默认）
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// 元数据导出
export const metadata = {
  title: '标题',
  description: '描述'
}

// 静态参数生成
export function generateStaticParams() {
  return [{ slug: 'example' }]
}
```

## MDX 文章规范

### 前置元数据（Frontmatter）
每篇文章必须包含以下元数据：
```yaml
---
title: 文章标题
date: 2024-01-01
description: 文章描述（用于 SEO 和列表展示）
tag: web development  # 单个标签
author: 作者名
---
```

### 草稿文章
- 在 `_meta.global.js` 中设置 `display: 'hidden'` 隐藏草稿
- 草稿文章仍可通过直接 URL 访问（用于预览）

### 支持的 Nextra 组件
```mdx
import { Callout, Steps, Tabs, Cards, FileTree, Bleed } from 'nextra/components'

<Callout type="info">提示信息</Callout>
<Steps>
### 步骤 1
内容
</Steps>
```

### 代码块
- 支持语法高亮
- 自动显示复制按钮（`defaultShowCopyCode: true`）
- 支持文件名标注：` ```js filename="example.js" `

## 开发工作流

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
# 自动执行 postbuild 生成搜索索引
```

### 启动生产服务器
```bash
npm start
```

## 功能模块说明

### 1. 文章系统
- **位置**：`app/posts/get-posts.js`
- **逻辑**：
  - 读取 `_meta.global.js` 获取文章列表
  - 动态导入每篇文章的 `page.mdx` 获取元数据
  - 过滤草稿（`draft: true`）
  - 按日期倒序排列
- **注意**：新增文章需在 `_meta.global.js` 中注册

### 2. 标签系统
- **位置**：`app/tags/[tag]/page.jsx`
- **逻辑**：
  - 从所有文章中提取标签
  - 生成静态标签页（`generateStaticParams`）
  - 按标签过滤文章
- **限制**：每篇文章仅支持单个标签

### 3. RSS 源
- **位置**：`app/rss.xml/route.js`
- **配置**：
  - 站点 URL：`https://demo.vercel.pub`
  - 标题：`My Portfolio`
  - 描述：`My Portfolio`
- **注意**：部署时需更新站点 URL

### 4. 搜索功能
- **工具**：Pagefind
- **构建**：`postbuild` 脚本自动生成索引
- **位置**：`.next/server/app/pagefind/`
- **注意**：搜索索引在构建时生成，开发模式不可用

### 5. 评论系统
- **工具**：Giscus
- **配置**：`app/layout.jsx` 中的 `appId`
- **启用**：仅在 `(with-comments)` 路由组内的文章显示
- **注意**：需要 GitHub 仓库和 Discussions 功能

## AI 协作指令

### 添加新文章
1. 在 `app/posts/(with-comments)/` 下创建新目录（kebab-case 命名）
2. 创建 `page.mdx` 文件，包含完整的 frontmatter
3. 在 `app/_meta.global.js` 中注册文章路径
4. 如果是草稿，设置 `display: 'hidden'`

### 修改文章
- **直接编辑** `page.mdx` 文件
- **保持** frontmatter 格式一致
- **测试** MDX 语法和组件是否正常渲染

### 添加新功能
- **优先使用** Nextra 内置组件和功能
- **保持** 服务端组件优先原则
- **避免** 过度工程化，保持代码简洁
- **遵循** Next.js App Router 最佳实践

### 样式修改
- **主题配置**：`app/layout.jsx` 中的 `<body>` 样式
- **自定义组件**：`mdx-components.jsx`
- **全局样式**：使用 Tailwind CSS 类名（如已配置）

### 配置修改
- **Next.js**：`next.config.js`
- **导航**：`app/_meta.global.js`
- **RSS**：`app/rss.xml/route.js`
- **MDX 组件**：`mdx-components.jsx`

### UI/设计审查
使用 `web-design-guidelines` 技能审查界面代码：
```bash
# 通过 Skill 工具调用
skill: "web-design-guidelines"
args: "app/layout.jsx"  # 或使用 glob 模式如 "app/**/*.jsx"
```

**何时使用：**
- 审查 UI 组件的可访问性
- 检查设计最佳实践
- 验证用户体验规范
- 审核新增或修改的界面代码

**审查内容：**
- 可访问性（ARIA、语义化 HTML、键盘导航）
- 性能（图片优化、懒加载、代码分割）
- SEO（元标签、结构化数据、语义化标签）
- 用户体验（响应式设计、交互反馈、错误处理）

**建议时机：**
- 添加新页面或组件后
- 修改布局或样式后
- 部署到生产环境前

### 注意事项
- **不要删除** OpenSpec 管理块
- **不要修改** Giscus appId（除非迁移评论系统）
- **不要提交** `.next/` 目录
- **测试构建**：确保 `npm run build` 成功
- **检查搜索**：构建后验证 Pagefind 索引生成
- **UI 审查**：重要界面修改后运行 web-design-guidelines 检查

## 常见任务

### 隐藏/显示文章
编辑 `app/_meta.global.js`：
```js
'article-slug': {
  display: 'hidden'  // 隐藏
  // display: 'normal' // 显示（默认）
}
```

### 更改站点信息
编辑 `app/rss.xml/route.js`：
```js
const SITE_URL = 'https://zwkang.blog'
const SITE_TITLE = 'Your Blog'
const SITE_DESCRIPTION = 'Your Description'
```

### 添加新标签
- 无需手动配置
- 在文章 frontmatter 中使用新标签即可
- 构建时自动生成标签页

### 自定义 MDX 组件
编辑 `mdx-components.jsx`：
```jsx
export function useMDXComponents(components) {
  return {
    h1: (props) => <h1 style={{...}} {...props} />,
    // 添加更多自定义组件
    ...components,
  }
}
```

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes

---

<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->