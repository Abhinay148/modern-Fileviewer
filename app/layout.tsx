import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Modern File Viewer',
  description: 'Universal file viewer supporting PDF, DOCX, XLSX, images, code, and more',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
