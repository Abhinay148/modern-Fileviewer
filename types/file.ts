export interface FileViewerProps {
  file: File
}

export type SupportedFileType = 
  | 'pdf'
  | 'image'
  | 'docx'
  | 'xlsx'
  | 'csv'
  | 'code'
  | 'text'
  | 'json'
  | 'xml'
  | 'svg'
  | 'markdown'
  | 'unsupported'

export interface ViewerConfig {
  maxFileSize: number // in bytes
  supportedExtensions: string[]
  codeLanguages: string[]
}

export const VIEWER_CONFIG: ViewerConfig = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  supportedExtensions: [
    // Documents
    'pdf', 'docx', 'doc',
    // Spreadsheets
    'xlsx', 'xls', 'csv',
    // Images
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico',
    // Text & Code
    'txt', 'md', 'json', 'xml', 'html', 'css', 'scss', 'sass',
    'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs',
    'go', 'rs', 'php', 'rb', 'swift', 'kt', 'scala', 'r',
    'sql', 'sh', 'bash', 'yaml', 'yml', 'toml', 'ini', 'env',
    'log', 'gitignore', 'dockerfile'
  ],
  codeLanguages: [
    'javascript', 'typescript', 'jsx', 'tsx', 'python', 'java',
    'c', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift',
    'kotlin', 'scala', 'sql', 'bash', 'yaml', 'json', 'xml',
    'html', 'css', 'scss', 'markdown'
  ]
}
