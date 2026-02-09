'use client'

import { useEffect, useState } from 'react'
import { FileViewerProps } from '@/types/file'
import { Eye, Code } from 'lucide-react'

export default function MarkdownViewer({ file }: FileViewerProps) {
  const [content, setContent] = useState<string>('')
  const [html, setHtml] = useState<string>('')
  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    const loadMarkdown = async () => {
      const text = await file.text()
      setContent(text)
      
      // Basic markdown to HTML conversion
      const converted = convertMarkdownToHtml(text)
      setHtml(converted)
    }

    loadMarkdown()
  }, [file])

  // Simple markdown parser
  const convertMarkdownToHtml = (md: string): string => {
    let html = md
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    
    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Code blocks
    html = html.replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
    
    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>')
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>')
    html = '<p>' + html + '</p>'
    
    return html
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-sm font-medium">
            Markdown
          </span>
        </div>
        <button
          onClick={() => setShowRaw(!showRaw)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showRaw
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          {showRaw ? (
            <>
              <Eye className="w-4 h-4" />
              Show Preview
            </>
          ) : (
            <>
              <Code className="w-4 h-4" />
              Show Raw
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="overflow-auto max-h-[calc(100vh-400px)] p-6">
        {showRaw ? (
          <pre className="p-4 bg-slate-50 dark:bg-slate-900 font-mono text-sm rounded-lg whitespace-pre-wrap">
            {content}
          </pre>
        ) : (
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  )
}
