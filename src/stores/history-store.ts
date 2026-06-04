import type { HistoryEntry, HistoryEntryInput } from '@/services/history-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { historyService } from '@/services/history-service'

export const useHistoryStore = defineStore('history', () => {
  const entries = ref<HistoryEntry[]>([])
  const isLoading = ref<boolean>(false)
  const lastError = ref<string | null>(null)

  const load = async (): Promise<void> => {
    isLoading.value = true
    lastError.value = null
    try {
      entries.value = await historyService.list()
    }
    catch (error) {
      lastError.value = error instanceof Error ? error.message : 'Failed to load history.'
      console.error('Failed to load history.', error)
    }
    finally {
      isLoading.value = false
    }
  }

  const refresh = load

  const record = async (entry: HistoryEntryInput): Promise<void> => {
    try {
      await historyService.add(entry)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save history entry.'
      lastError.value = message
      console.error('Failed to record history entry.', error)
    }
  }

  const remove = async (id: number): Promise<void> => {
    await historyService.remove(id)
    await load()
  }

  const clearAll = async (): Promise<void> => {
    await historyService.clearAll()
    entries.value = []
  }

  return {
    entries,
    isLoading,
    lastError,
    load,
    refresh,
    record,
    remove,
    clearAll,
  }
})
