## ADDED Requirements

### Requirement: Client-side code syntax highlighting
`/old-posts/[slug]` 详情页 SHALL 对页面中所有 `<pre><code class="language-*">` 元素应用 shiki 语法高亮。

#### Scenario: Code block with language class
- **WHEN** 页面包含 `<pre><code class="language-jsx">` 代码块
- **THEN** 代码块 SHALL 显示对应语言的语法高亮

#### Scenario: Code block without language class
- **WHEN** 页面包含 `<pre><code>` 但无 language class
- **THEN** 代码块 SHALL 保持原样（纯文本），不做高亮

#### Scenario: Progressive enhancement
- **WHEN** 页面首次加载
- **THEN** 代码块先以无高亮形式显示，shiki 加载完成后替换为高亮版本
