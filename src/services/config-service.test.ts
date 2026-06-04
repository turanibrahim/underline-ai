import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configService } from './config-service'

const get = vi.fn<(key: string) => Promise<{ key: string, value: unknown } | undefined>>()
const put = vi.fn<(record: { key: string, value: unknown }) => Promise<void>>()

vi.mock('@/resources/db', () => ({
  db: {
    config: {
      get: async (key: string) => get(key),
      put: async (record: { key: string, value: unknown }) => put(record),
    },
  },
}))

beforeEach(() => {
  get.mockReset()
  put.mockReset()
  put.mockResolvedValue(undefined)
})

describe('configService.get / set', () => {
  it('returns the stored value when present', async () => {
    get.mockResolvedValue({ key: 'k', value: 'v' })
    await expect(configService.get('k')).resolves.toBe('v')
  })

  it('returns undefined when the record is missing', async () => {
    get.mockResolvedValue(undefined)
    await expect(configService.get('missing')).resolves.toBeUndefined()
  })

  it('persists a value via put', async () => {
    await configService.set('k', 'v')
    expect(put).toHaveBeenCalledWith({ key: 'k', value: 'v' })
  })
})

describe('configService encrypted key', () => {
  it('returns empty string when stored value is not a string', async () => {
    get.mockResolvedValue({ key: 'k', value: 123 })
    await expect(configService.getEncryptedKey()).resolves.toBe('')
  })

  it('returns empty string when no record exists', async () => {
    get.mockResolvedValue(undefined)
    await expect(configService.getEncryptedKey()).resolves.toBe('')
  })

  it('persists encrypted key', async () => {
    await configService.setEncryptedKey('cipher')
    expect(put).toHaveBeenCalledWith({ key: 'gemini.encryptedKey', value: 'cipher' })
  })
})

describe('configService typed getters', () => {
  it('getModel returns undefined for non-string values', async () => {
    get.mockResolvedValue({ key: 'k', value: 42 })
    await expect(configService.getModel()).resolves.toBeUndefined()
  })

  it('getSystemPrompt returns undefined for non-string values', async () => {
    get.mockResolvedValue({ key: 'k', value: null })
    await expect(configService.getSystemPrompt()).resolves.toBeUndefined()
  })

  it('getMaxDimension returns undefined for non-number values', async () => {
    get.mockResolvedValue({ key: 'k', value: 'big' })
    await expect(configService.getMaxDimension()).resolves.toBeUndefined()
  })

  it('getQuality returns undefined for non-number values', async () => {
    get.mockResolvedValue({ key: 'k', value: '0.5' })
    await expect(configService.getQuality()).resolves.toBeUndefined()
  })

  it('getGrayscale returns undefined for non-boolean values', async () => {
    get.mockResolvedValue({ key: 'k', value: 'true' })
    await expect(configService.getGrayscale()).resolves.toBeUndefined()
  })

  it('getFormat rejects anything other than jpeg/webp', async () => {
    get.mockResolvedValue({ key: 'k', value: 'png' })
    await expect(configService.getFormat()).resolves.toBeUndefined()
  })

  it('getFormat accepts jpeg and webp', async () => {
    get.mockResolvedValue({ key: 'k', value: 'webp' })
    await expect(configService.getFormat()).resolves.toBe('webp')
  })
})
