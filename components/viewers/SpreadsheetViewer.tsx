'use client'

import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { FileViewerProps } from '@/types/file'
import { AlertCircle } from 'lucide-react'

interface SheetData {
  name: string
  data: any[][]
}

export default function SpreadsheetViewer({ file }: FileViewerProps) {
  const [sheets, setSheets] = useState<SheetData[]>([])
  const [activeSheet, setActiveSheet] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadSpreadsheet = async () => {
      try {
        setLoading(true)
        setError('')
        
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        
        const sheetsData: SheetData[] = workbook.SheetNames.map(sheetName => {
          const worksheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          return { name: sheetName, data: data as any[][] }
        })
        
        setSheets(sheetsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load spreadsheet')
      } finally {
        setLoading(false)
      }
    }

    loadSpreadsheet()
  }, [file])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg m-4">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    )
  }

  if (sheets.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        No sheets found in this file
      </div>
    )
  }

  const currentSheet = sheets[activeSheet]

  return (
    <div className="p-4">
      {/* Sheet Tabs */}
      {sheets.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {sheets.map((sheet, index) => (
            <button
              key={index}
              onClick={() => setActiveSheet(index)}
              className={`
                px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                ${activeSheet === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }
              `}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto max-h-[calc(100vh-400px)] border dark:border-slate-700 rounded-lg">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {currentSheet.data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 0 ? 'bg-slate-100 dark:bg-slate-800 font-semibold' : ''}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 text-sm border-r dark:border-slate-700 last:border-r-0 whitespace-nowrap"
                  >
                    {cell !== null && cell !== undefined ? String(cell) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        {currentSheet.data.length} rows × {currentSheet.data[0]?.length || 0} columns
      </div>
    </div>
  )
}
