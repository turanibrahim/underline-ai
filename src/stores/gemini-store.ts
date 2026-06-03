import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { aiService } from '@/services/gemini-service'

const STORAGE_KEY = 'gemini.encryptedKey'
const STORAGE_KEY_MODEL = 'gemini.model'
const STORAGE_KEY_PROMPT = 'gemini.systemPrompt'

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
  const encryptedKey = ref<string>(localStorage.getItem(STORAGE_KEY) ?? '')
  const selectedModel = ref<string>(localStorage.getItem(STORAGE_KEY_MODEL) ?? DEFAULT_MODEL)
  const systemPrompt = ref<string>(localStorage.getItem(STORAGE_KEY_PROMPT) ?? DEFAULT_SYSTEM_PROMPT)

  const apiKey = computed<string>(() => encryptedKey.value)
  const decryptedApiKey = computed<string>(() => aiService.getDecryptedKey())

  watch(encryptedKey, (value) => {
    if (value) {
      localStorage.setItem(STORAGE_KEY, value)
    }
    else {
      localStorage.removeItem(STORAGE_KEY)
    }
  })

  watch(selectedModel, (value) => {
    if (value) {
      localStorage.setItem(STORAGE_KEY_MODEL, value)
    }
    else {
      localStorage.removeItem(STORAGE_KEY_MODEL)
    }
  })

  watch(systemPrompt, (value) => {
    if (value) {
      localStorage.setItem(STORAGE_KEY_PROMPT, value)
    }
    else {
      localStorage.removeItem(STORAGE_KEY_PROMPT)
    }
  })

  if (encryptedKey.value) {
    aiService.initializeKey(encryptedKey.value)
  }
  aiService.setSystemPrompt(systemPrompt.value)

  function setApiKey(rawKey: string): void {
    const encrypted = aiService.encryptKey(rawKey)
    encryptedKey.value = encrypted
    aiService.initializeKey(encrypted)
  }

  function setModel(model: string): void {
    selectedModel.value = model
  }

  function setSystemPrompt(prompt: string): void {
    systemPrompt.value = prompt
    aiService.setSystemPrompt(prompt)
  }

  function clearApiKey(): void {
    encryptedKey.value = ''
  }

  return {
    apiKey,
    decryptedApiKey,
    selectedModel,
    systemPrompt,
    setApiKey,
    setModel,
    setSystemPrompt,
    clearApiKey,
  }
})
