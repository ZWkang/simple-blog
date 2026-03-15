## ADDED Requirements

### Requirement: Parse WordPress WXR XML export
系统 SHALL 提供一个 Node.js 脚本，解析 WordPress WXR 格式的 XML 导出文件，提取所有 `post` 类型且 `publish` 状态的文章数据。

#### Scenario: Successful XML parsing
- **WHEN** 运行解析脚本并指定 WordPress XML 文件路径
- **THEN** 脚本 SHALL 输出 JSON 文件，包含所有已发布文章的结构化数据

#### Scenario: Filter non-publish posts
- **WHEN** XML 文件包含 draft、private 状态的文章
- **THEN** 脚本 SHALL 仅提取 `wp:status` 为 `publish` 且 `wp:post_type` 为 `post` 的条目

### Requirement: Extract structured post data
每篇文章 SHALL 提取以下字段：title、slug（`wp:post_name`）、date（`wp:post_date`）、content（`content:encoded`）、excerpt（`excerpt:encoded`）、categories（`category` 标签）。

#### Scenario: Complete data extraction
- **WHEN** 解析一篇已发布文章
- **THEN** 输出 JSON 对象 MUST 包含 `title`、`slug`、`date`、`content`、`excerpt`、`categories` 字段

#### Scenario: Handle empty title
- **WHEN** 文章标题为空
- **THEN** 使用 slug 作为 fallback 标题

### Requirement: Output JSON data file
脚本 SHALL 将解析结果输出为 JSON 文件，存放在 `app/old-posts/data/posts.json`。

#### Scenario: JSON output format
- **WHEN** 解析完成
- **THEN** 输出文件 SHALL 包含一个按日期倒序排列的文章数组
