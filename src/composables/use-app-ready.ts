import { computed } from 'vue'
import { useGeminiStore } from '@/stores/gemini-store'
import { useOptimizerStore } from '@/stores/optimizer-store'

export const useAppReady = () => {
  const gemini = useGeminiStore()
  const optimizer = useOptimizerStore()
  return computed<boolean>(() => gemini.isReady && optimizer.isReady)
}
