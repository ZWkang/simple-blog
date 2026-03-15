## 1. WordPress XML 解析脚本

- [x] 1.1 将 WordPress XML 文件复制到项目中（如 `scripts/data/` 或 `data/` 目录）
- [x] 1.2 创建 `scripts/parse-wordpress.mjs` 解析脚本，提取 publish 状态的 post 文章
- [x] 1.3 输出 `app/old-posts/data/posts.json`，包含 title、slug、date、content、excerpt、categories 字段，按日期倒序

## 2. Old Posts 列表页

- [x] 2.1 创建 `app/old-posts/page.jsx`，读取 JSON 数据展示文章列表（标题、日期、分类）
- [x] 2.2 添加列表页样式，与现有 `/posts` 页面风格保持一致

## 3. Old Post 详情页

- [x] 3.1 创建 `app/old-posts/[slug]/page.jsx`，渲染单篇文章的 HTML 内容
- [x] 3.2 实现 `generateStaticParams` 为所有文章生成静态页面
- [x] 3.3 添加详情页基本样式

## 4. 导航与集成

- [x] 4.1 在 `app/_meta.global.js` 中添加 `old-posts` 导航项
- [x] 4.2 验证构建成功（`npm run build`）
