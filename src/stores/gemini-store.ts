import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { aiService } from '@/services/gemini-service'

const STORAGE_KEY = 'gemini.encryptedKey'

const SYSTEM_PROMPT = `You are an OCR assistant specialized in extracting only the underlined text from images.

Rules:
- Output only the underlined words or phrases, in the order they appear.
- Preserve the original spelling, capitalization, and punctuation of each underlined item.
- Return the result as a Markdown bulleted list (one item per bullet).
- If a line contains underlined text mixed with non-underlined text, extract only the underlined parts.
- If no underlined text is present, reply with: "No underlined text detected."
- Do not add any commentary, preamble, or explanation.`

export const useGeminiStore = defineStore('gemini', () => {
  const encryptedKey = ref<string>(localStorage.getItem(STORAGE_KEY) ?? '')

  const apiKey = computed<string>(() => encryptedKey.value)

  watch(encryptedKey, (value) => {
    if (value) {
      localStorage.setItem(STORAGE_KEY, value)
    }
    else {
      localStorage.removeItem(STORAGE_KEY)
    }
  })

  if (encryptedKey.value) {
    aiService.initializeKey(encryptedKey.value)
  }
  aiService.setSystemPrompt(SYSTEM_PROMPT)

  function setApiKey(rawKey: string): void {
    const encrypted = aiService.encryptKey(rawKey)
    encryptedKey.value = encrypted
    aiService.initializeKey(encrypted)
    aiService.setSystemPrompt(SYSTEM_PROMPT)
  }

  function clearApiKey(): void {
    encryptedKey.value = ''
  }

  return {
    apiKey,
    setApiKey,
    clearApiKey,
  }
})
