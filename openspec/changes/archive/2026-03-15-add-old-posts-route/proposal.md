## Why

博客存在 127 篇从 WordPress 导出的历史文章（89 篇已发布），目前没有入口展示这些内容。需要一个 `/old-posts` 路由来承载这些迁移文章，保留历史内容的可访问性。

## What Changes

- 新增 `/old-posts` 路由页面，展示从 WordPress XML 导出文件解析的历史文章列表
- 新增构建时 XML 解析脚本，将 WordPress WXR 格式转换为结构化 JSON 数据
- 在全局导航中添加 `old-posts` 入口
- 历史文章以列表形式展示，包含标题、日期、分类信息
- 点击文章可查看详情内容（HTML 内容直接渲染）

## Capabilities

### New Capabilities
- `wordpress-import`: WordPress WXR XML 解析与数据提取，构建时将 XML 转为 JSON
- `old-posts-page`: `/old-posts` 路由页面，展示历史文章列表与文章详情

### Modified Capabilities

（无需修改现有 spec）

## Impact

- **新增文件**: `app/old-posts/` 路由目录、XML 解析脚本、生成的 JSON 数据文件
- **修改文件**: `app/_meta.global.js`（添加导航项）
- **依赖**: 需要 XML 解析能力（Node.js 内置或轻量库）
- **数据源**: `/Users/zhou/Downloads/kangkangblog.WordPress.2023-02-10.xml`（127 篇文章，89 篇 publish 状态）
