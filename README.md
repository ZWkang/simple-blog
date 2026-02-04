<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=180&section=header&text=zwkang.blog&fontSize=50&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=前端技术%20·%20AI%20应用&descSize=16&descAlignY=55">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,4,6,8&height=180&section=header&text=zwkang.blog&fontSize=50&animation=fadeIn&fontAlignY=35&desc=前端技术%20·%20AI%20应用&descSize=16&descAlignY=55" width="100%"/>
</picture>

<div align="center">

[![Live](https://img.shields.io/badge/🌐_Live-zwkang.blog-000?style=for-the-badge)](https://zwkang.blog)
[![RSS](https://img.shields.io/badge/RSS-Subscribe-FFA500?style=for-the-badge&logo=rss&logoColor=white)](https://zwkang.blog/rss.xml)
[![GitHub](https://img.shields.io/badge/GitHub-zwkang-181717?style=for-the-badge&logo=github)](https://github.com/zwkang)
[![Twitter](https://img.shields.io/badge/X-@wkang__zZZ-000?style=for-the-badge&logo=x)](https://x.com/wkang_zZZ)

</div>

---

## 技术栈

<table>
<tr>
<td width="50%">

### 框架
- **Next.js 16** - App Router + Turbopack
- **React 19** - UI 渲染
- **Nextra 4.6** - 博客主题

</td>
<td width="50%">

### 功能
- **Pagefind** - 全文搜索
- **Giscus** - GitHub 评论
- **MDX** - Markdown + React

</td>
</tr>
</table>

---

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

---

## 项目结构

```
app/
├── posts/(with-comments)/   # 文章目录
├── about/                   # 关于页面
├── tags/[tag]/              # 标签聚合
└── rss.xml/                 # RSS 订阅源
```

---

## 写作

```mdx
---
title: 文章标题
date: 2024-01-01
description: 文章描述
tags: [标签]
author: zwkang
---

正文...
```

---

## License

MIT © [zwkang](https://github.com/zwkang)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=100&section=footer">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,4,6,8&height=100&section=footer" width="100%"/>
</picture>
