'use client'

import { useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import FileViewer from '@/components/FileViewer'
import { formatFileSize } from '@/lib/utils'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const clearFile = () => {
    setFile(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Modern File Viewer
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Support for PDF, DOCX, XLSX, Images, Code, Text, CSV, JSON, XML, and more
          </p>
        </div>

        {/* File Upload Area */}
        {!file && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-all
              ${isDragging 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
              }
            `}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h2 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Drop your file here
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              or click to browse
            </p>
            <label className="inline-block">
              <input
                type="file"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              <span className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block">
                Choose File
              </span>
            </label>
          </div>
        )}

        {/* File Info & Viewer */}
        {file && (
          <div className="space-y-4">
            {/* File Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {file.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                  </p>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Clear file"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* File Viewer */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
              <FileViewer file={file} />
            </div>
          </div>
        )}

        {/* Supported Formats */}
        {!file && (
          <div className="mt-12 text-center">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">
              SUPPORTED FORMATS
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'PDF', 'DOCX', 'XLSX', 'XLS', 'CSV', 
                'PNG', 'JPG', 'GIF', 'WEBP', 'SVG',
                'TXT', 'JSON', 'XML', 'HTML', 'CSS', 'JS', 'TS',
                'MD', 'YAML', 'LOG'
              ].map((format) => (
                <span
                  key={format}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
