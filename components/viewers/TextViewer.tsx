'use client'

import { useEffect, useState } from 'react'
import { FileViewerProps } from '@/types/file'
import { Copy, Check, Download } from 'lucide-react'

export default function TextViewer({ file }: FileViewerProps) {
  const [content, setContent] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadText = async () => {
      try {
        const text = await file.text()
        setContent(text)
      } catch (err) {
        console.error('Error loading text:', err)
      }
    }

    loadText()
  }, [file])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const lines = content.split('\n')

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            {lines.length} lines • {content.length} characters
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Text Content */}
      <div className="overflow-auto max-h-[calc(100vh-400px)]">
        <div className="flex">
          {/* Line Numbers */}
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-right pr-4 pl-4 py-4 select-none">
            {lines.map((_, index) => (
              <div key={index} className="leading-6 font-mono text-sm">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Content */}
          <pre className="flex-1 p-4 font-mono text-sm leading-6 whitespace-pre-wrap break-words">
            {content}
          </pre>
        </div>
      </div>
    </div>
  )
}
