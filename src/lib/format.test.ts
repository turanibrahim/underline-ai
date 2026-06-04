import { describe, expect, it, vi } from 'vitest'
import { formatDuration, formatSize, formatTimestamp } from './format'

vi.mock('@/lib/image-utils', () => ({
  formatBytes: (bytes: number) => `bytes(${bytes})`,
}))

describe('formatTimestamp', () => {
  it('returns em-dash for invalid timestamps', () => {
    expect(formatTimestamp(Number.NaN)).toBe('—')
    expect(formatTimestamp(Number.POSITIVE_INFINITY)).toBe('—')
  })

  it('formats a valid timestamp with year/month/day/time', () => {
    const out = formatTimestamp(new Date('2024-01-15T09:30:00Z').getTime())
    expect(out).toMatch(/2024/)
    expect(out).toMatch(/Jan/)
    expect(out).toMatch(/15/)
    expect(out).toMatch(/:\d{2}/)
  })
})

describe('formatDuration', () => {
  it('returns em-dash for non-finite or negative values', () => {
    expect(formatDuration(-5)).toBe('—')
    expect(formatDuration(Number.NaN)).toBe('—')
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('—')
  })

  it('formats sub-second values in ms', () => {
    expect(formatDuration(0)).toBe('0 ms')
    expect(formatDuration(750)).toBe('750 ms')
  })

  it('formats seconds under 10 with 2 decimals', () => {
    expect(formatDuration(1500)).toBe('1.50 s')
  })

  it('formats seconds 10 and above with 1 decimal', () => {
    expect(formatDuration(12500)).toBe('12.5 s')
  })

  it('formats minutes and remaining seconds', () => {
    expect(formatDuration(65_000)).toBe('1m 5s')
    expect(formatDuration(125_000)).toBe('2m 5s')
  })
})

describe('formatSize', () => {
  it('delegates to formatBytes from image-utils', () => {
    expect(formatSize(1024)).toBe('bytes(1024)')
  })
})
