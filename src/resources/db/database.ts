import type { Table } from 'dexie'
import type { ConfigRecord, HistoryEntry } from './types'
import Dexie from 'dexie'

class UnderlineAIDB extends Dexie {
  config!: Table<ConfigRecord, string>
  history!: Table<HistoryEntry, number>

  constructor() {
    super('underline-ai')
    this.version(1).stores({
      config: 'key',
      history: '++id, timestamp, fileName, model, status',
    })
  }
}

export const db = new UnderlineAIDB()
