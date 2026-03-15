## ADDED Requirements

### Requirement: Old posts list page
系统 SHALL 在 `/old-posts` 路由提供一个页面，展示所有从 WordPress 迁移的历史文章列表。

#### Scenario: Display article list
- **WHEN** 用户访问 `/old-posts`
- **THEN** 页面 SHALL 展示所有已发布文章，每项包含标题、日期和分类

#### Scenario: Sort by date
- **WHEN** 文章列表渲染
- **THEN** 文章 SHALL 按发布日期倒序排列

### Requirement: Old post detail page
系统 SHALL 在 `/old-posts/[slug]` 路由提供文章详情页，渲染文章 HTML 内容。

#### Scenario: View article content
- **WHEN** 用户点击列表中的文章链接
- **THEN** 页面 SHALL 展示文章标题、日期、分类和完整 HTML 内容

#### Scenario: Static generation
- **WHEN** 构建项目
- **THEN** 系统 SHALL 使用 `generateStaticParams` 为所有文章预生成静态页面

### Requirement: Navigation entry
`_meta.global.js` SHALL 包含 `old-posts` 导航项，使其出现在站点导航中。

#### Scenario: Navigation visible
- **WHEN** 用户浏览站点
- **THEN** 导航栏 SHALL 显示 "Old Posts" 或类似入口
