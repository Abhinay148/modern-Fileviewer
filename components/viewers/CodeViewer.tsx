'use client'

import { useEffect, useState } from 'react'
import Prism from 'prismjs'
import { FileViewerProps } from '@/types/file'
import { getFileExtension } from '@/lib/utils'
import { Copy, Check } from 'lucide-react'

// Import Prism themes and languages
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-scala'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-markdown'

const languageMap: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  py: 'python',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  php: 'php',
  rb: 'ruby',
  swift: 'swift',
  kt: 'kotlin',
  scala: 'scala',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  yaml: 'yaml',
  yml: 'yaml',
  json: 'json',
  html: 'markup',
  xml: 'markup',
  css: 'css',
  scss: 'scss',
  md: 'markdown',
  dockerfile: 'docker',
}

export default function CodeViewer({ file }: FileViewerProps) {
  const [code, setCode] = useState<string>('')
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [language, setLanguage] = useState<string>('plaintext')

  useEffect(() => {
    const loadCode = async () => {
      try {
        const text = await file.text()
        setCode(text)

        // Determine language from file extension
        const ext = getFileExtension(file.name)
        const lang = languageMap[ext] || 'plaintext'
        setLanguage(lang)

        // Highlight code
        if (lang !== 'plaintext' && Prism.languages[lang]) {
          const highlighted = Prism.highlight(text, Prism.languages[lang], lang)
          setHighlightedCode(highlighted)
        } else {
          setHighlightedCode(text)
        }
      } catch (err) {
        console.error('Error loading code:', err)
      }
    }

    loadCode()
  }, [file])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
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
          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium">
            {language}
          </span>
          <span className="text-sm text-slate-500">
            {code.split('\n').length} lines
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

      {/* Code Display */}
      <div className="overflow-auto max-h-[calc(100vh-400px)]">
        <pre className="!m-0 !bg-[#2d2d2d] !p-4">
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  )
}
