'use client'

import { useEffect, useState } from 'react'
import { FileViewerProps } from '@/types/file'
import { Copy, Check } from 'lucide-react'

export default function XmlViewer({ file }: FileViewerProps) {
  const [content, setContent] = useState<string>('')
  const [formatted, setFormatted] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadXml = async () => {
      try {
        const text = await file.text()
        setContent(text)
        
        // Format XML with indentation
        const formatted = formatXml(text)
        setFormatted(formatted)
      } catch (err) {
        console.error('Error loading XML:', err)
      }
    }

    loadXml()
  }, [file])

  const formatXml = (xml: string): string => {
    let formatted = ''
    let indent = 0
    const tab = '  '
    
    xml.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) indent--
      formatted += tab.repeat(indent) + '<' + node + '>\n'
      if (node.match(/^<?\w[^>]*[^\/]$/)) indent++
    })
    
    return formatted.substring(1, formatted.length - 2)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-sm font-medium">
            XML
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

      {/* XML Display */}
      <div className="overflow-auto max-h-[calc(100vh-400px)]">
        <pre className="p-4 bg-slate-50 dark:bg-slate-900 font-mono text-sm">
          <code className="language-xml">{formatted}</code>
        </pre>
      </div>
    </div>
  )
}
