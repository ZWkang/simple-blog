## Why

`/old-posts` 详情页中 45 篇文章包含 `<pre><code class="language-xxx">` 格式的代码块，但因为使用 `dangerouslySetInnerHTML` 直接渲染 HTML，不经过 Nextra 的 MDX/shiki 管道，代码块没有语法高亮，影响阅读体验。

## What Changes

- 在 `/old-posts/[slug]` 详情页添加客户端代码高亮
- 利用项目已有的 shiki 依赖，对页面中的 `<pre><code>` 块做运行时语法高亮

## Capabilities

### New Capabilities
- `old-posts-highlight`: `/old-posts` 详情页的客户端代码语法高亮

### Modified Capabilities

（无）

## Impact

- **修改文件**: `app/old-posts/[slug]/page.jsx`（添加客户端高亮组件）
- **可能新增**: 客户端高亮组件文件
- **依赖**: shiki（项目已有，通过 nextra 间接依赖）
