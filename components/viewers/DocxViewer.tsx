'use client'

import { useEffect, useState } from 'react'
import mammoth from 'mammoth'
import { FileViewerProps } from '@/types/file'
import { AlertCircle } from 'lucide-react'

export default function DocxViewer({ file }: FileViewerProps) {
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true)
        setError('')
        
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        
        setHtml(result.value)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document')
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [file])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg m-4">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div
        className="prose prose-slate dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontFamily: 'Times New Roman, serif',
          lineHeight: '1.6'
        }}
      />
    </div>
  )
}
