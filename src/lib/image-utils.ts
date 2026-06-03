export interface OptimizerOptions {
  maxDimension?: number
  quality?: number
  grayscale?: boolean
  format?: 'jpeg' | 'webp'
}

export interface ResolvedOptions {
  maxDimension: number
  quality: number
  grayscale: boolean
  format: 'jpeg' | 'webp'
}

export const DEFAULT_OPTIONS: ResolvedOptions = {
  maxDimension: 2048,
  quality: 0.85,
  grayscale: true,
  format: 'jpeg',
}

export const MAX_DIMENSION_CHOICES = [1024, 1536, 2048, 3072] as const

export const DEFAULT_MAX_DIMENSION: MaxDimensionChoice = 2048

export const FORMAT_CHOICES = ['jpeg', 'webp'] as const

export const DEFAULT_FORMAT: FormatChoice = 'jpeg'

export const QUALITY_PERCENT_CHOICES = [60, 70, 75, 80, 85, 90, 95] as const

export const DEFAULT_QUALITY_PERCENT: QualityPercentChoice = 85

export const DEFAULT_GRAYSCALE = true

export type MaxDimensionChoice = typeof MAX_DIMENSION_CHOICES[number]
export type FormatChoice = typeof FORMAT_CHOICES[number]
export type QualityPercentChoice = typeof QUALITY_PERCENT_CHOICES[number]

export function resolveOptions(opts?: OptimizerOptions): ResolvedOptions {
  return {
    maxDimension: opts?.maxDimension ?? DEFAULT_OPTIONS.maxDimension,
    quality: opts?.quality ?? DEFAULT_OPTIONS.quality,
    grayscale: opts?.grayscale ?? DEFAULT_OPTIONS.grayscale,
    format: opts?.format ?? DEFAULT_OPTIONS.format,
  }
}

export function calculateTargetSize(
  srcW: number,
  srcH: number,
  maxDim: number,
): { w: number, h: number } {
  if (srcW <= maxDim && srcH <= maxDim)
    return { w: srcW, h: srcH }
  const ratio = Math.min(maxDim / srcW, maxDim / srcH)
  return {
    w: Math.max(1, Math.round(srcW * ratio)),
    h: Math.max(1, Math.round(srcH * ratio)),
  }
}

export function createCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

export function getCanvasContext(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = c.getContext('2d')
  if (!ctx)
    throw new Error('Failed to obtain 2D canvas context.')
  return ctx
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0)
    return '0 B'
  if (bytes < 1024)
    return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }
  const fixed = value < 10 ? value.toFixed(2) : value.toFixed(1)
  return `${fixed} ${units[unitIndex]}`
}
