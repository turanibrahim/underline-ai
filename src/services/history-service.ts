import type { HistoryEntry, HistoryEntryInput } from '@/resources/db/types'
import { db } from '@/resources/db'

class HistoryService {
  public async add(entry: HistoryEntryInput): Promise<number> {
    return db.history.add(entry)
  }

  public async list(opts?: { limit?: number, offset?: number }): Promise<HistoryEntry[]> {
    const collection = db.history.orderBy('timestamp').reverse()
    if (opts?.offset != null && opts.offset > 0)
      collection.offset(opts.offset)
    if (opts?.limit != null)
      collection.limit(opts.limit)
    return collection.toArray()
  }

  public async get(id: number): Promise<HistoryEntry | undefined> {
    return db.history.get(id)
  }

  public async remove(id: number): Promise<void> {
    await db.history.delete(id)
  }

  public async clearAll(): Promise<void> {
    await db.history.clear()
  }

  public async count(): Promise<number> {
    return db.history.count()
  }
}

export const historyService = new HistoryService()

export type { HistoryEntry, HistoryEntryInput }
