import { beforeEach, describe, expect, it, vi } from 'vitest'
import { historyService } from './history-service'

const add = vi.fn<(entry: unknown) => Promise<number>>()
const orderBy = vi.fn<(key: string) => unknown>()
const toArray = vi.fn<() => Promise<unknown[]>>()
const get = vi.fn<(id: number) => Promise<unknown>>()
const remove = vi.fn<(id: number) => Promise<void>>()
const clear = vi.fn<() => Promise<void>>()
const count = vi.fn<() => Promise<number>>()

vi.mock('@/resources/db', () => ({
  db: {
    history: {
      add: async (entry: unknown) => add(entry),
      orderBy: (key: string) => orderBy(key),
      toArray: async () => toArray(),
      get: async (id: number) => get(id),
      delete: async (id: number) => remove(id),
      clear: async () => clear(),
      count: async () => count(),
    },
  },
}))

beforeEach(() => {
  add.mockReset()
  orderBy.mockReset()
  toArray.mockReset()
  get.mockReset()
  remove.mockReset()
  clear.mockReset()
  count.mockReset()
})

const makeChain = (resolved: unknown[]) => {
  const chain = {
    reverse: vi.fn(),
    offset: vi.fn(),
    limit: vi.fn(),
    toArray: vi.fn(),
  }
  chain.reverse.mockReturnValue(chain)
  chain.offset.mockReturnValue(chain)
  chain.limit.mockReturnValue(chain)
  chain.toArray.mockResolvedValue(resolved)
  return chain
}

describe('historyService.add', () => {
  it('delegates to db.history.add and returns the new id', async () => {
    add.mockResolvedValue(7)
    const entry = { timestamp: 1 } as never
    await expect(historyService.add(entry)).resolves.toBe(7)
    expect(add).toHaveBeenCalledWith(entry)
  })
})

describe('historyService.list', () => {
  it('orders by timestamp descending', async () => {
    const chain = makeChain([{ id: 1 }, { id: 2 }])
    orderBy.mockReturnValue(chain)
    const out = await historyService.list()
    expect(orderBy).toHaveBeenCalledWith('timestamp')
    expect(chain.reverse).toHaveBeenCalled()
    expect(out).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('applies offset and limit when provided', async () => {
    const chain = makeChain([])
    orderBy.mockReturnValue(chain)
    await historyService.list({ limit: 5, offset: 10 })
    expect(chain.offset).toHaveBeenCalledWith(10)
    expect(chain.limit).toHaveBeenCalledWith(5)
  })

  it('skips offset/limit when not provided', async () => {
    const chain = makeChain([])
    orderBy.mockReturnValue(chain)
    await historyService.list({ limit: 5 })
    expect(chain.offset).not.toHaveBeenCalled()
    expect(chain.limit).toHaveBeenCalledWith(5)
  })
})

describe('historyService.get / remove / clearAll / count', () => {
  it('get returns the entry', async () => {
    get.mockResolvedValue({ id: 1 })
    await expect(historyService.get(1)).resolves.toEqual({ id: 1 })
  })

  it('remove deletes by id', async () => {
    remove.mockResolvedValue(undefined)
    await historyService.remove(1)
    expect(remove).toHaveBeenCalledWith(1)
  })

  it('clearAll clears the table', async () => {
    clear.mockResolvedValue(undefined)
    await historyService.clearAll()
    expect(clear).toHaveBeenCalled()
  })

  it('count returns the number of records', async () => {
    count.mockResolvedValue(42)
    await expect(historyService.count()).resolves.toBe(42)
  })
})
