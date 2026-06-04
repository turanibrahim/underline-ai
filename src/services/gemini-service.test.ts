import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { aiService } from './gemini-service'

const { generateContent, GoogleGenAIMock } = vi.hoisted(() => {
  const generateContent = vi.fn()
  const GoogleGenAIMock = vi.fn().mockImplementation(class { models = { generateContent } })
  return { generateContent, GoogleGenAIMock }
})

vi.mock('@google/genai', () => ({
  GoogleGenAI: GoogleGenAIMock,
}))

beforeEach(() => {
  generateContent.mockReset()
  GoogleGenAIMock.mockClear()
  vi.spyOn(console, 'error').mockImplementation(() => {})
  aiService.setSystemPrompt('')
  aiService.initializeKey('')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('aiService encrypt / decrypt round-trip', () => {
  it('produces a key that decrypts back to the original', () => {
    const raw = 'super-secret-key'
    const encrypted = aiService.encryptKey(raw)
    aiService.initializeKey(encrypted)
    expect(aiService.getDecryptedKey()).toBe(raw)
  })

  it('resets to empty string on bad ciphertext', () => {
    aiService.encryptKey('good')
    aiService.initializeKey('not-a-valid-ciphertext')
    expect(aiService.getDecryptedKey()).toBe('')
  })
})

describe('aiService.generate', () => {
  it('rejects when the API key is missing', async () => {
    const file = new File([new Uint8Array([0])], 'a.png', { type: 'image/png' })
    await expect(aiService.generate([file], 'gemini-3.5-flash')).rejects.toThrow(/API Key/)
  })

  it('rejects when no images are provided', async () => {
    aiService.initializeKey(aiService.encryptKey('raw'))
    await expect(aiService.generate([], 'gemini-3.5-flash')).rejects.toThrow(/image/)
  })

  it('rejects when no model is provided', async () => {
    aiService.initializeKey(aiService.encryptKey('raw'))
    const file = new File([new Uint8Array([0])], 'a.png', { type: 'image/png' })
    await expect(aiService.generate([file], '')).rejects.toThrow(/Model/)
  })

  it('returns the generated text on success', async () => {
    aiService.initializeKey(aiService.encryptKey('raw'))
    aiService.setSystemPrompt('be terse')
    generateContent.mockResolvedValue({ text: 'hello' })

    const file = new File([new Uint8Array([0])], 'a.png', { type: 'image/png' })
    const out = await aiService.generate([file], 'gemini-3.5-flash')
    expect(out).toBe('hello')
    expect(generateContent).toHaveBeenCalled()
  })

  it('returns empty string when the response has no text', async () => {
    aiService.initializeKey(aiService.encryptKey('raw'))
    generateContent.mockResolvedValue({})
    const file = new File([new Uint8Array([0])], 'a.png', { type: 'image/png' })
    await expect(aiService.generate([file], 'gemini-3.5-flash')).resolves.toBe('')
  })

  it('wraps thrown errors with the original message', async () => {
    aiService.initializeKey(aiService.encryptKey('raw'))
    generateContent.mockRejectedValue(new Error('boom'))
    const file = new File([new Uint8Array([0])], 'a.png', { type: 'image/png' })
    await expect(aiService.generate([file], 'gemini-3.5-flash')).rejects.toThrow('boom')
  })
})
