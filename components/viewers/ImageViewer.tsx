'use client'

import { useEffect, useState } from 'react'
import { FileViewerProps } from '@/types/file'
import { ZoomIn, ZoomOut, Download } from 'lucide-react'

export default function ImageViewer({ file }: FileViewerProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25))
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = imageUrl
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
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Image Container */}
      <div className="overflow-auto max-h-[calc(100vh-400px)] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
        <img
          src={imageUrl}
          alt={file.name}
          style={{ width: `${zoom}%` }}
          className="max-w-none object-contain"
        />
      </div>
    </div>
  )
}
