'use client'

import { useEffect, useState } from 'react'
import { FileViewerProps } from '@/types/file'
import { ZoomIn, ZoomOut, Download, Code } from 'lucide-react'

export default function SvgViewer({ file }: FileViewerProps) {
  const [svgUrl, setSvgUrl] = useState<string>('')
  const [svgCode, setSvgCode] = useState<string>('')
  const [showCode, setShowCode] = useState(false)
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    const loadSvg = async () => {
      const url = URL.createObjectURL(file)
      setSvgUrl(url)
      
      const text = await file.text()
      setSvgCode(text)
      
      return () => URL.revokeObjectURL(url)
    }

    loadSvg()
  }, [file])

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25))
  
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = svgUrl
    a.download = file.name
    a.click()
  }

  return (
    <div className="p-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b dark:border-slate-700">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            disabled={zoom <= 25}
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            disabled={zoom >= 300}
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showCode
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <Code className="w-4 h-4" />
            {showCode ? 'Show Preview' : 'Show Code'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* SVG Display or Code */}
      {showCode ? (
        <div className="overflow-auto max-h-[calc(100vh-400px)]">
          <pre className="p-4 bg-slate-50 dark:bg-slate-900 font-mono text-sm rounded-lg">
            <code>{svgCode}</code>
          </pre>
        </div>
      ) : (
        <div className="overflow-auto max-h-[calc(100vh-400px)] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
          <img
            src={svgUrl}
            alt={file.name}
            style={{ width: `${zoom}%` }}
            className="max-w-none"
          />
        </div>
      )}
    </div>
  )
}
