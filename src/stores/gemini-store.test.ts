import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_MODEL, DEFAULT_SYSTEM_PROMPT, useGeminiStore } from './gemini-store'

const getEncryptedKey = vi.fn<() => Promise<string>>().mockResolvedValue('')
const getModel = vi.fn<() => Promise<string | undefined>>().mockResolvedValue(undefined)
const getSystemPrompt = vi.fn<() => Promise<string | undefined>>().mockResolvedValue(undefined)
const setEncryptedKey = vi.fn<(v: string) => Promise<void>>().mockResolvedValue(undefined)
const setModel = vi.fn<(v: string) => Promise<void>>().mockResolvedValue(undefined)
const setSystemPrompt = vi.fn<(v: string) => Promise<void>>().mockResolvedValue(undefined)

const encryptKey = vi.fn<(raw: string) => string>()
const initializeKey = vi.fn<(key: string) => void>()
const setSystemPromptOnAi = vi.fn<(prompt: string) => void>()
const getDecryptedKey = vi.fn<() => string>()

vi.mock('@/services/config-service', () => ({
  configService: {
    getEncryptedKey: async () => getEncryptedKey(),
    getModel: async () => getModel(),
    getSystemPrompt: async () => getSystemPrompt(),
    setEncryptedKey: async (v: string) => setEncryptedKey(v),
    setModel: async (v: string) => setModel(v),
    setSystemPrompt: async (v: string) => setSystemPrompt(v),
  },
}))

vi.mock('@/services/gemini-service', () => ({
  aiService: {
    encryptKey: (raw: string) => encryptKey(raw),
    initializeKey: (key: string) => initializeKey(key),
    setSystemPrompt: (prompt: string) => setSystemPromptOnAi(prompt),
    getDecryptedKey: () => getDecryptedKey(),
  },
}))

beforeEach(() => {
  setActivePinia(createPinia())
  getEncryptedKey.mockReset()
  getModel.mockReset()
  getSystemPrompt.mockReset()
  setEncryptedKey.mockReset()
  setModel.mockReset()
  setSystemPrompt.mockReset()
  encryptKey.mockReset()
  initializeKey.mockReset()
  setSystemPromptOnAi.mockReset()
  getDecryptedKey.mockReset()

  getEncryptedKey.mockResolvedValue('')
  getModel.mockResolvedValue(undefined)
  getSystemPrompt.mockResolvedValue(undefined)
  setEncryptedKey.mockResolvedValue(undefined)
  setModel.mockResolvedValue(undefined)
  setSystemPrompt.mockResolvedValue(undefined)
  encryptKey.mockImplementation((raw: string) => `enc(${raw})`)
  getDecryptedKey.mockReturnValue('decrypted')
})

describe('useGeminiStore.hydrate', () => {
  it('uses defaults when nothing is stored', async () => {
    const store = useGeminiStore()
    await store.hydrate()
    expect(store.selectedModel).toBe(DEFAULT_MODEL)
    expect(store.systemPrompt).toBe(DEFAULT_SYSTEM_PROMPT)
    expect(store.isReady).toBe(true)
  })

  it('loads stored model, prompt, and initializes the AI service with the key', async () => {
    getEncryptedKey.mockResolvedValue('enc-stored')
    getModel.mockResolvedValue('gemini-3-flash-preview')
    getSystemPrompt.mockResolvedValue('custom prompt')

    const store = useGeminiStore()
    await store.hydrate()

    expect(store.apiKey).toBe('enc-stored')
    expect(initializeKey).toHaveBeenCalledWith('enc-stored')
    expect(store.selectedModel).toBe('gemini-3-flash-preview')
    expect(store.systemPrompt).toBe('custom prompt')
    expect(setSystemPromptOnAi).toHaveBeenCalledWith('custom prompt')
  })

  it('falls back to the default prompt on the AI service when none is stored', async () => {
    const store = useGeminiStore()
    await store.hydrate()
    expect(setSystemPromptOnAi).toHaveBeenCalledWith(DEFAULT_SYSTEM_PROMPT)
  })
})

describe('useGeminiStore setters', () => {
  it('setApiKey encrypts, updates state, initializes AI, and persists', async () => {
    const store = useGeminiStore()
    await store.setApiKey('plain')

    expect(encryptKey).toHaveBeenCalledWith('plain')
    expect(store.apiKey).toBe('enc(plain)')
    expect(initializeKey).toHaveBeenCalledWith('enc(plain)')
    expect(setEncryptedKey).toHaveBeenCalledWith('enc(plain)')
  })

  it('setModel updates the model and persists', async () => {
    const store = useGeminiStore()
    await store.setModel('gemini-3.1-flash-lite')
    expect(store.selectedModel).toBe('gemini-3.1-flash-lite')
    expect(setModel).toHaveBeenCalledWith('gemini-3.1-flash-lite')
  })

  it('setSystemPrompt updates prompt, AI service, and persists', async () => {
    const store = useGeminiStore()
    await store.setSystemPrompt('new prompt')
    expect(store.systemPrompt).toBe('new prompt')
    expect(setSystemPromptOnAi).toHaveBeenCalledWith('new prompt')
    expect(setSystemPrompt).toHaveBeenCalledWith('new prompt')
  })

  it('clearApiKey resets the encrypted key, AI service, and persisted value', async () => {
    const store = useGeminiStore()
    await store.clearApiKey()
    expect(store.apiKey).toBe('')
    expect(initializeKey).toHaveBeenCalledWith('')
    expect(setEncryptedKey).toHaveBeenCalledWith('')
  })
})

describe('useGeminiStore computed', () => {
  it('decryptedApiKey reflects the AI service', async () => {
    getDecryptedKey.mockReturnValue('plain-key')
    const store = useGeminiStore()
    expect(store.decryptedApiKey).toBe('plain-key')
  })
})
