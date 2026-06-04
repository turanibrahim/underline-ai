import { describe, expect, it } from 'vitest'
import {
  calculateTargetSize,
  DEFAULT_OPTIONS,
  formatBytes,
  resolveOptions,
} from './image-utils'

describe('resolveOptions', () => {
  it('returns defaults when called with no arguments', () => {
    expect(resolveOptions()).toEqual(DEFAULT_OPTIONS)
  })

  it('returns defaults when called with an empty object', () => {
    expect(resolveOptions({})).toEqual(DEFAULT_OPTIONS)
  })

  it('merges partial options with defaults', () => {
    expect(resolveOptions({ quality: 0.5 })).toEqual({
      ...DEFAULT_OPTIONS,
      quality: 0.5,
    })
  })

  it('overrides every field when fully provided', () => {
    expect(resolveOptions({
      maxDimension: 1024,
      quality: 0.7,
      grayscale: false,
      format: 'webp',
    })).toEqual({
      maxDimension: 1024,
      quality: 0.7,
      grayscale: false,
      format: 'webp',
    })
  })
})

describe('calculateTargetSize', () => {
  it('returns the source size when both dimensions fit', () => {
    expect(calculateTargetSize(800, 600, 1024)).toEqual({ w: 800, h: 600 })
  })

  it('scales down by the limiting dimension', () => {
    const target = calculateTargetSize(4000, 1000, 1024)
    expect(target).toEqual({ w: 1024, h: 256 })
  })

  it('never returns a dimension below 1', () => {
    const target = calculateTargetSize(10000, 8000, 1)
    expect(target.w).toBeGreaterThanOrEqual(1)
    expect(target.h).toBeGreaterThanOrEqual(1)
  })
})

describe('formatBytes', () => {
  it('returns 0 B for non-finite or negative input', () => {
    expect(formatBytes(-1)).toBe('0 B')
    expect(formatBytes(Number.NaN)).toBe('0 B')
    expect(formatBytes(Number.POSITIVE_INFINITY)).toBe('0 B')
  })

  it('formats sub-kilobyte values as B', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(512)).toBe('512 B')
  })

  it('formats KB with 2 decimals under 10', () => {
    expect(formatBytes(1024)).toBe('1.00 KB')
    expect(formatBytes(5 * 1024)).toBe('5.00 KB')
  })

  it('formats KB with 1 decimal at or above 10', () => {
    expect(formatBytes(15 * 1024)).toBe('15.0 KB')
  })

  it('rolls over to MB and GB', () => {
    expect(formatBytes(2 * 1024 * 1024)).toBe('2.00 MB')
    expect(formatBytes(3 * 1024 * 1024 * 1024)).toBe('3.00 GB')
  })

  it('caps the unit at GB even for huge values', () => {
    expect(formatBytes(1024 ** 5)).toMatch(/GB$/)
    expect(formatBytes(1024 ** 5)).not.toMatch(/TB|PB/)
  })
})
