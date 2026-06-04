import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { configService } from '@/services/config-service'
import { aiService } from '@/services/gemini-service'

export const DEFAULT_MODEL = 'gemini-3.5-flash'

export const AVAILABLE_MODELS = [
  { value: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro Preview' },
  { value: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
  { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
  { value: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite' },
  { value: 'gemma-4', label: 'Gemma 4' },
] as const

export const DEFAULT_SYSTEM_PROMPT = `You are an OCR assistant specialized in extracting only the underlined text from images.

Rules:
- Output only the underlined words or phrases, in the order they appear.
- Preserve the original spelling, capitalization, and punctuation of each underlined item.
- Return the result as a Markdown bulleted list (one item per bullet).
- If a line contains underlined text mixed with non-underlined text, extract only the underlined parts.
- If no underlined text is present, reply with: "No underlined text detected."
- Do not add any commentary, preamble, or explanation.`

export const useGeminiStore = defineStore('gemini', () => {
  const encryptedKey = ref<string>('')
  const selectedModel = ref<string>(DEFAULT_MODEL)
  const systemPrompt = ref<string>(DEFAULT_SYSTEM_PROMPT)
  const isReady = ref<boolean>(false)

  const apiKey = computed<string>(() => encryptedKey.value)
  const decryptedApiKey = computed<string>(() => aiService.getDecryptedKey())

  const hydrate = async (): Promise<void> => {
    const [storedKey, storedModel, storedPrompt] = await Promise.all([
      configService.getEncryptedKey(),
      configService.getModel(),
      configService.getSystemPrompt(),
    ])

    if (typeof storedKey === 'string' && storedKey.length > 0) {
      encryptedKey.value = storedKey
      aiService.initializeKey(storedKey)
    }
    if (typeof storedModel === 'string' && storedModel.length > 0)
      selectedModel.value = storedModel
    if (typeof storedPrompt === 'string' && storedPrompt.length > 0) {
      systemPrompt.value = storedPrompt
      aiService.setSystemPrompt(storedPrompt)
    }
    else {
      aiService.setSystemPrompt(systemPrompt.value)
    }
    isReady.value = true
  }

  const setApiKey = async (rawKey: string): Promise<void> => {
    const encrypted = aiService.encryptKey(rawKey)
    encryptedKey.value = encrypted
    aiService.initializeKey(encrypted)
    await configService.setEncryptedKey(encrypted)
  }

  const setModel = async (model: string): Promise<void> => {
    selectedModel.value = model
    await configService.setModel(model)
  }

  const setSystemPrompt = async (prompt: string): Promise<void> => {
    systemPrompt.value = prompt
    aiService.setSystemPrompt(prompt)
    await configService.setSystemPrompt(prompt)
  }

  const clearApiKey = async (): Promise<void> => {
    encryptedKey.value = ''
    aiService.initializeKey('')
    await configService.setEncryptedKey('')
  }

  return {
    apiKey,
    decryptedApiKey,
    selectedModel,
    systemPrompt,
    isReady,
    hydrate,
    setApiKey,
    setModel,
    setSystemPrompt,
    clearApiKey,
  }
})
