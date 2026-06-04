import type { NavigationGuard } from 'vue-router'
import { useGeminiStore } from '@/stores/gemini-store'

export const requireApiKey: NavigationGuard = async () => {
  const store = useGeminiStore()
  if (!store.isReady)
    await store.hydrate()
  if (!store.apiKey)
    return { name: 'settings-page', query: { reason: 'missing-api-key' } }
  return true
}
