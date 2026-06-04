import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_FORMAT,
  DEFAULT_GRAYSCALE,
  DEFAULT_MAX_DIMENSION,
  DEFAULT_QUALITY_PERCENT,
} from '@/lib/image-utils'
import { useOptimizerStore } from './optimizer-store'

const getMaxDimension = vi.fn<() => Promise<number | undefined>>()
const getQuality = vi.fn<() => Promise<number | undefined>>()
const getGrayscale = vi.fn<() => Promise<boolean | undefined>>()
const getFormat = vi.fn<() => Promise<'jpeg' | 'webp' | undefined>>()
const setMaxDimension = vi.fn<(v: number) => Promise<void>>()
const setQuality = vi.fn<(v: number) => Promise<void>>()
const setGrayscale = vi.fn<(v: boolean) => Promise<void>>()
const setFormat = vi.fn<(v: 'jpeg' | 'webp') => Promise<void>>()

vi.mock('@/services/config-service', () => ({
  configService: {
    getMaxDimension: async () => getMaxDimension(),
    getQuality: async () => getQuality(),
    getGrayscale: async () => getGrayscale(),
    getFormat: async () => getFormat(),
    setMaxDimension: async (v: number) => setMaxDimension(v),
    setQuality: async (v: number) => setQuality(v),
    setGrayscale: async (v: boolean) => setGrayscale(v),
    setFormat: async (v: 'jpeg' | 'webp') => setFormat(v),
  },
}))

beforeEach(() => {
  setActivePinia(createPinia())
  getMaxDimension.mockReset()
  getQuality.mockReset()
  getGrayscale.mockReset()
  getFormat.mockReset()
  setMaxDimension.mockReset()
  setQuality.mockReset()
  setGrayscale.mockReset()
  setFormat.mockReset()

  getMaxDimension.mockResolvedValue(undefined)
  getQuality.mockResolvedValue(undefined)
  getGrayscale.mockResolvedValue(undefined)
  getFormat.mockResolvedValue(undefined)
  setMaxDimension.mockResolvedValue(undefined)
  setQuality.mockResolvedValue(undefined)
  setGrayscale.mockResolvedValue(undefined)
  setFormat.mockResolvedValue(undefined)
})

describe('useOptimizerStore.hydrate', () => {
  it('uses defaults when nothing is stored', async () => {
    const store = useOptimizerStore()
    await store.hydrate()
    expect(store.maxDimension).toBe(DEFAULT_MAX_DIMENSION)
    expect(store.qualityPercent).toBe(DEFAULT_QUALITY_PERCENT)
    expect(store.quality).toBe(DEFAULT_QUALITY_PERCENT / 100)
    expect(store.grayscale).toBe(DEFAULT_GRAYSCALE)
    expect(store.format).toBe(DEFAULT_FORMAT)
    expect(store.isReady).toBe(true)
  })

  it('falls back to defaults for out-of-range stored values', async () => {
    getMaxDimension.mockResolvedValue(9999)
    getQuality.mockResolvedValue(13)
    const store = useOptimizerStore()
    await store.hydrate()
    expect(store.maxDimension).toBe(DEFAULT_MAX_DIMENSION)
    expect(store.qualityPercent).toBe(DEFAULT_QUALITY_PERCENT)
  })

  it('falls back to default grayscale for non-boolean stored value', async () => {
    getGrayscale.mockResolvedValue('yes' as never)
    const store = useOptimizerStore()
    await store.hydrate()
    expect(store.grayscale).toBe(DEFAULT_GRAYSCALE)
  })

  it('falls back to jpeg when stored format is not webp or jpeg', async () => {
    getFormat.mockResolvedValue('png' as never)
    const store = useOptimizerStore()
    await store.hydrate()
    expect(store.format).toBe('jpeg')
  })

  it('uses stored values when valid', async () => {
    getMaxDimension.mockResolvedValue(3072)
    getQuality.mockResolvedValue(75)
    getGrayscale.mockResolvedValue(false)
    getFormat.mockResolvedValue('webp')
    const store = useOptimizerStore()
    await store.hydrate()
    expect(store.maxDimension).toBe(3072)
    expect(store.qualityPercent).toBe(75)
    expect(store.quality).toBeCloseTo(0.75)
    expect(store.grayscale).toBe(false)
    expect(store.format).toBe('webp')
  })
})

describe('useOptimizerStore.asOptions', () => {
  it('returns the current options in resolved form', async () => {
    const store = useOptimizerStore()
    await store.hydrate()
    expect(store.asOptions()).toEqual({
      maxDimension: store.maxDimension,
      quality: store.quality,
      grayscale: store.grayscale,
      format: store.format,
    })
  })
})

describe('useOptimizerStore setters', () => {
  it('setMaxDimension rejects out-of-range values', async () => {
    const store = useOptimizerStore()
    await store.hydrate()
    await store.setMaxDimension(9999 as never)
    expect(store.maxDimension).toBe(DEFAULT_MAX_DIMENSION)
    expect(setMaxDimension).not.toHaveBeenCalled()
  })

  it('setMaxDimension persists valid choices', async () => {
    const store = useOptimizerStore()
    await store.hydrate()
    await store.setMaxDimension(1536)
    expect(store.maxDimension).toBe(1536)
    expect(setMaxDimension).toHaveBeenCalledWith(1536)
  })

  it('setQuality snaps to the nearest allowed percent', async () => {
    const store = useOptimizerStore()
    await store.hydrate()
    await store.setQuality(72)
    expect(store.qualityPercent).toBe(70)
    expect(store.quality).toBeCloseTo(0.7)
    expect(setQuality).toHaveBeenCalledWith(70)
  })

  it('setQuality rounds and snaps upward when closer', async () => {
    const store = useOptimizerStore()
    await store.hydrate()
    await store.setQuality(78)
    expect(store.qualityPercent).toBe(80)
  })

  it('setGrayscale updates and persists', async () => {
    const store = useOptimizerStore()
    await store.hydrate()
    await store.setGrayscale(false)
    expect(store.grayscale).toBe(false)
    expect(setGrayscale).toHaveBeenCalledWith(false)
  })

  it('setFormat rejects invalid values', async () => {
    const store = useOptimizerStore()
    await store.hydrate()
    await store.setFormat('png' as never)
    expect(store.format).toBe(DEFAULT_FORMAT)
    expect(setFormat).not.toHaveBeenCalled()
  })

  it('setFormat persists webp', async () => {
    const store = useOptimizerStore()
    await store.hydrate()
    await store.setFormat('webp')
    expect(store.format).toBe('webp')
    expect(setFormat).toHaveBeenCalledWith('webp')
  })
})
