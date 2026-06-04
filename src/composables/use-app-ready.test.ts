import { createPinia, defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useAppReady } from './use-app-ready'

const geminiReady = ref(false)
const optimizerReady = ref(false)

vi.mock('@/stores/gemini-store', () => ({
  useGeminiStore: defineStore('gemini', () => ({
    isReady: geminiReady,
  })),
}))

vi.mock('@/stores/optimizer-store', () => ({
  useOptimizerStore: defineStore('optimizer', () => ({
    isReady: optimizerReady,
  })),
}))

beforeEach(() => {
  setActivePinia(createPinia())
  geminiReady.value = false
  optimizerReady.value = false
})

describe('useAppReady', () => {
  it('returns false when neither store is ready', () => {
    const ready = useAppReady()
    expect(ready.value).toBe(false)
  })

  it('returns false when only one store is ready', () => {
    const ready = useAppReady()
    geminiReady.value = true
    expect(ready.value).toBe(false)
  })

  it('returns true when both stores are ready', () => {
    const ready = useAppReady()
    geminiReady.value = true
    optimizerReady.value = true
    expect(ready.value).toBe(true)
  })
})
