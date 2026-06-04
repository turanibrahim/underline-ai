import { formatBytes } from '@/lib/image-utils'

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime()))
    return '—'
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDuration = (ms: number): string => {
  if (!Number.isFinite(ms) || ms < 0)
    return '—'
  if (ms < 1000)
    return `${ms} ms`
  const seconds = ms / 1000
  if (seconds < 60)
    return `${seconds.toFixed(seconds < 10 ? 2 : 1)} s`
  const minutes = Math.floor(seconds / 60)
  const remaining = Math.round(seconds % 60)
  return `${minutes}m ${remaining}s`
}

export const formatSize = (bytes: number): string => formatBytes(bytes)
