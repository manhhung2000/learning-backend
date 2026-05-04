import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import AmplifyProvider from '@lib/AmplifyProvider'
import './globals.css'

const font = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Learning App',
  description: 'Learning Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`h-full antialiased ${font.variable}`}>
      <body className="h-full font-sans custom-scrollbar bg-slate-50">
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  )
}
