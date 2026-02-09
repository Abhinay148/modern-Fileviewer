'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { FileViewerProps, SupportedFileType } from '@/types/file'
import { getFileExtension } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// Dynamically import viewers to reduce initial bundle size
const PdfViewer = dynamic(() => import('./viewers/PdfViewer'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const ImageViewer = dynamic(() => import('./viewers/ImageViewer'), {
  loading: () => <LoadingSpinner />
})

const DocxViewer = dynamic(() => import('./viewers/DocxViewer'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const SpreadsheetViewer = dynamic(() => import('./viewers/SpreadsheetViewer'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const CodeViewer = dynamic(() => import('./viewers/CodeViewer'), {
  loading: () => <LoadingSpinner />
})

const TextViewer = dynamic(() => import('./viewers/TextViewer'), {
  loading: () => <LoadingSpinner />
})

const JsonViewer = dynamic(() => import('./viewers/JsonViewer'), {
  loading: () => <LoadingSpinner />
})

const XmlViewer = dynamic(() => import('./viewers/XmlViewer'), {
  loading: () => <LoadingSpinner />
})

const SvgViewer = dynamic(() => import('./viewers/SvgViewer'), {
  loading: () => <LoadingSpinner />
})

const MarkdownViewer = dynamic(() => import('./viewers/MarkdownViewer'), {
  loading: () => <LoadingSpinner />
})

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  )
}

function UnsupportedFile({ filename }: { filename: string }) {
  const extension = getFileExtension(filename)
  
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4">
        <span className="text-2xl">📄</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        Unsupported File Type
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        Cannot preview .{extension} files
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-500">
        You can still download this file
      </p>
    </div>
  )
}

export default function FileViewer({ file }: FileViewerProps) {
  const fileType = useMemo((): SupportedFileType => {
    const extension = getFileExtension(file.name)
    const mimeType = file.type

    // PDF
    if (extension === 'pdf' || mimeType === 'application/pdf') {
      return 'pdf'
    }

    // Images
    if (mimeType.startsWith('image/')) {
      if (extension === 'svg' || mimeType === 'image/svg+xml') {
        return 'svg'
      }
      return 'image'
    }

    // Word Documents
    if (
      extension === 'docx' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return 'docx'
    }

    // Spreadsheets
    if (
      extension === 'xlsx' ||
      extension === 'xls' ||
      extension === 'csv' ||
      mimeType.includes('spreadsheet') ||
      mimeType === 'text/csv'
    ) {
      return 'xlsx'
    }

    // JSON
    if (extension === 'json' || mimeType === 'application/json') {
      return 'json'
    }

    // XML
    if (extension === 'xml' || mimeType === 'application/xml' || mimeType === 'text/xml') {
      return 'xml'
    }

    // Markdown
    if (extension === 'md' || extension === 'markdown') {
      return 'markdown'
    }

    // Code files
    const codeExtensions = [
      'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs',
      'go', 'rs', 'php', 'rb', 'swift', 'kt', 'scala', 'r',
      'sql', 'sh', 'bash', 'yaml', 'yml', 'toml', 'ini',
      'html', 'css', 'scss', 'sass', 'less', 'dockerfile',
      'gitignore', 'env'
    ]
    if (codeExtensions.includes(extension)) {
      return 'code'
    }

    // Plain text
    if (mimeType.startsWith('text/') || extension === 'txt' || extension === 'log') {
      return 'text'
    }

    return 'unsupported'
  }, [file])

  // Render appropriate viewer
  switch (fileType) {
    case 'pdf':
      return <PdfViewer file={file} />
    
    case 'image':
      return <ImageViewer file={file} />
    
    case 'docx':
      return <DocxViewer file={file} />
    
    case 'xlsx':
      return <SpreadsheetViewer file={file} />
    
    case 'code':
      return <CodeViewer file={file} />
    
    case 'text':
      return <TextViewer file={file} />
    
    case 'json':
      return <JsonViewer file={file} />
    
    case 'xml':
      return <XmlViewer file={file} />
    
    case 'svg':
      return <SvgViewer file={file} />
    
    case 'markdown':
      return <MarkdownViewer file={file} />
    
    default:
      return <UnsupportedFile filename={file.name} />
  }
}
