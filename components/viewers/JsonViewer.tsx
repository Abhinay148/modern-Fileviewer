'use client'

import { useEffect, useState } from 'react'
import { FileViewerProps } from '@/types/file'
import { Copy, Check, AlertCircle } from 'lucide-react'

export default function JsonViewer({ file }: FileViewerProps) {
  const [jsonData, setJsonData] = useState<any>(null)
  const [formatted, setFormatted] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadJson = async () => {
      try {
        const text = await file.text()
        const parsed = JSON.parse(text)
        setJsonData(parsed)
        setFormatted(JSON.stringify(parsed, null, 2))
        setError('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid JSON')
      }
    }

    loadJson()
  }, [file])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg m-4">
        <AlertCircle className="w-5 h-5" />
        <div>
          <p className="font-semibold">Invalid JSON</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm font-medium">
            Valid JSON
          </span>
          <span className="text-sm text-slate-500">
            {formatted.split('\n').length} lines
          </span>
        </div>
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
      </div>

      {/* JSON Display */}
      <div className="overflow-auto max-h-[calc(100vh-400px)]">
        <pre className="p-4 bg-slate-50 dark:bg-slate-900 font-mono text-sm">
          <code className="language-json">{formatted}</code>
        </pre>
      </div>
    </div>
  )
}
