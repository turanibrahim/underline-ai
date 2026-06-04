import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useHistoryStore } from './history-store'

const list = vi.fn<() => Promise<unknown[]>>().mockResolvedValue([])
const add = vi.fn<(entry: unknown) => Promise<unknown>>().mockResolvedValue(undefined)
const remove = vi.fn<(id: number) => Promise<void>>().mockResolvedValue(undefined)
const clearAll = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)

vi.mock('@/services/history-service', () => ({
  historyService: {
    list: async () => list(),
    add: async (entry: unknown) => add(entry),
    remove: async (id: number) => remove(id),
    clearAll: async () => clearAll(),
  },
}))

beforeEach(() => {
  setActivePinia(createPinia())
  list.mockReset()
  add.mockReset()
  remove.mockReset()
  clearAll.mockReset()
  list.mockResolvedValue([])
  add.mockResolvedValue(undefined)
  remove.mockResolvedValue(undefined)
  clearAll.mockResolvedValue(undefined)
})

describe('useHistoryStore.load', () => {
  it('populates entries on success', async () => {
    list.mockResolvedValue([{ id: 1 }, { id: 2 }])
    const store = useHistoryStore()
    await store.load()
    expect(store.entries).toEqual([{ id: 1 }, { id: 2 }])
    expect(store.isLoading).toBe(false)
    expect(store.lastError).toBeNull()
  })

  it('captures error message and stops loading on failure', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    list.mockRejectedValue(new Error('db down'))
    const store = useHistoryStore()
    await store.load()
    expect(store.lastError).toBe('db down')
    expect(store.isLoading).toBe(false)
    expect(errorSpy).toHaveBeenCalled()
  })

  it('uses a generic message for non-Error rejections', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    list.mockRejectedValue('string-failure')
    const store = useHistoryStore()
    await store.load()
    expect(store.lastError).toBe('Failed to load history.')
    expect(errorSpy).toHaveBeenCalled()
  })
})

describe('useHistoryStore.record', () => {
  it('writes to the service without surfacing errors', async () => {
    const store = useHistoryStore()
    await store.record({ timestamp: 1 } as never)
    expect(add).toHaveBeenCalled()
  })

  it('captures and logs errors from the service', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    add.mockRejectedValue(new Error('write failed'))
    const store = useHistoryStore()
    await store.record({ timestamp: 1 } as never)
    expect(store.lastError).toBe('write failed')
    expect(errorSpy).toHaveBeenCalled()
  })
})

describe('useHistoryStore.remove / clearAll / refresh', () => {
  it('remove deletes and reloads', async () => {
    list.mockResolvedValueOnce([{ id: 1 }]).mockResolvedValueOnce([])
    const store = useHistoryStore()
    await store.load()
    await store.remove(1)
    expect(remove).toHaveBeenCalledWith(1)
    expect(list).toHaveBeenCalledTimes(2)
    expect(store.entries).toEqual([])
  })

  it('clearAll empties the entries and the table', async () => {
    list.mockResolvedValueOnce([{ id: 1 }])
    const store = useHistoryStore()
    await store.load()
    await store.clearAll()
    expect(clearAll).toHaveBeenCalled()
    expect(store.entries).toEqual([])
  })

  it('refresh is an alias for load', async () => {
    const store = useHistoryStore()
    await store.refresh()
    expect(list).toHaveBeenCalled()
  })
})
