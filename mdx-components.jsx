import { useMDXComponents as getBlogMDXComponents } from 'nextra-theme-blog'

const blogComponents = getBlogMDXComponents({
  h1: ({ children, ...props }) => (
    <h1
      {...props}
      style={{
        color: 'var(--color-fg)',
        fontWeight: 700
      }}
    >
      {children}
    </h1>
  ),
  DateFormatter: ({ date }) =>
    `Last updated at ${date.toLocaleDateString('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}`
})

export function useMDXComponents(components) {
  return {
    ...blogComponents,
    ...components
  }
}
