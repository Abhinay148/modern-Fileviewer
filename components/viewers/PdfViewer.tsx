'use client'

import { useState } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { FileViewerProps } from '@/types/file'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

export default function PdfViewer({ file }: FileViewerProps) {
  const [fileUrl, setFileUrl] = useState<string>('')
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  // Create object URL for the file
  useState(() => {
    const url = URL.createObjectURL(file)
    setFileUrl(url)
    return () => URL.revokeObjectURL(url)
  })

  return (
    <div className="w-full h-[calc(100vh-300px)] min-h-[600px]">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  )
}
