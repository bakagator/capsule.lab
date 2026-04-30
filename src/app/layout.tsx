import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'capsule',
  description: '友達と「やりたいこと」を共有しよう',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
