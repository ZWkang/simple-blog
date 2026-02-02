import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-blog/style.css'
import './globals.css'

export const metadata = {
  title: 'Blog Example'
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head backgroundColor={{ dark: '#0a0a0a', light: '#ffffff' }} />
      <body>
        <Layout>
          <Navbar pageMap={await getPageMap()}>
            <ThemeSwitch />
          </Navbar>
 
          {children}
 
          <Footer>
            <abbr
              title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
              style={{ cursor: 'help' }}
            >
            </abbr>{' '}
            {new Date().getFullYear()} © zwkang.
            <a href="/rss.xml" style={{ float: 'right' }}>
              RSS
            </a>
          </Footer>
        </Layout>
      </body>
    </html>
  )
}