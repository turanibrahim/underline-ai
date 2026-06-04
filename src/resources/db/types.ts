export interface ConfigRecord {
  key: string
  value: unknown
}

export interface HistoryEntry {
  id?: number
  timestamp: number
  fileName: string
  mimeType: string
  originalSize: number
  optimizedSize: number
  originalBlob: Blob
  optimizedBlob: Blob
  model: string
  systemPrompt: string
  response: string
  status: 'success' | 'error'
  durationMs: number
}

export type HistoryEntryInput = Omit<HistoryEntry, 'id'>
