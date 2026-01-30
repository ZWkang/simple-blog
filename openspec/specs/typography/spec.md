# typography Specification

## Purpose
TBD - created by archiving change refine-minimalist-theme. Update Purpose after archive.
## Requirements
### Requirement: 系统字体栈
博客 SHALL 使用系统字体栈以优化性能和可读性。

#### Scenario: 字体族选择
- **WHEN** 渲染文本时
- **THEN** 系统应当使用原生系统字体栈（-apple-system, BlinkMacSystemFont, Segoe UI, Roboto 等）
- **AND** 不应当加载自定义网络字体

#### Scenario: 性能优化
- **WHEN** 页面加载时
- **THEN** 不应当有字体加载延迟（FOUT/FOIT）
- **AND** 文本应当立即可读

### Requirement: 排版比例
博客 SHALL 实现清晰的排版层级，具有最佳的字号和间距。

#### Scenario: 正文字号
- **WHEN** 渲染正文时
- **THEN** 字号应当为 16px (1rem)
- **AND** 行高应当在 1.6 到 1.8 之间以优化可读性

#### Scenario: 标题层级
- **WHEN** 渲染标题时
- **THEN** H1 应当为 2.5rem (40px)
- **AND** H2 应当为 2rem (32px)
- **AND** H3 应当为 1.5rem (24px)
- **AND** 每个标题级别应当有适当的行高和间距

#### Scenario: 代码字号
- **WHEN** 渲染内联代码或代码块时
- **THEN** 字号应当为相对于正文的 0.9em
- **AND** 应当使用等宽字体栈

### Requirement: 排版间距
文本元素 SHALL 有适当的间距以提升可读性和视觉节奏。

#### Scenario: 段落间距
- **WHEN** 渲染段落时
- **THEN** 段落之间应当有 1.5em 的间距
- **AND** 标题后的第一段应当有减少的上边距

#### Scenario: 标题间距
- **WHEN** 渲染标题时
- **THEN** 它们应当有慷慨的上边距（1.5-2em）以分隔区块
- **AND** 它们应当有最小的下边距（0.5-0.75em）以与后续内容分组

#### Scenario: 列表间距
- **WHEN** 渲染列表时
- **THEN** 列表项之间应当有适当的间距（项间 0.5em）
- **AND** 嵌套列表应当有适当的缩进

### Requirement: 移除渐变标题
H1 元素上的自定义渐变样式 SHALL 被移除或替换为极简样式。

#### Scenario: H1 样式一致性
- **WHEN** 渲染 H1 标题时
- **THEN** 它们应当使用主题调色板中的纯色
- **AND** 它们不应当使用渐变背景或装饰效果

#### Scenario: 无装饰的视觉层级
- **WHEN** H1 标题需要强调时
- **THEN** 强调应当通过尺寸、字重和间距实现
- **AND** 而非通过渐变或阴影等装饰效果

