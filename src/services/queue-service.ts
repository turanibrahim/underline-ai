export type QueueStatus = 'queued' | 'processing'

export class QueueService {
  private readonly delayMs: number

  private taskQueue: Array<{
    execute: () => Promise<unknown>
    resolve: (value: unknown) => void
    reject: (reason: unknown) => void
    onStatus?: (status: QueueStatus) => void
  }> = []

  private isProcessing = false
  private lastExecutionTime = 0

  constructor(delayMs: number) {
    this.delayMs = delayMs
  }

  async enqueue<T>(
    execute: () => Promise<T>,
    onStatus?: (status: QueueStatus) => void,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.taskQueue.push({
        execute,
        resolve: resolve as (value: unknown) => void,
        reject,
        onStatus,
      })
      onStatus?.('queued')
      void this.processQueue()
    })
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing)
      return

    this.isProcessing = true

    while (this.taskQueue.length > 0) {
      if (this.lastExecutionTime > 0) {
        const elapsed = Date.now() - this.lastExecutionTime
        if (elapsed < this.delayMs) {
          await new Promise(resolve => setTimeout(resolve, this.delayMs - elapsed))
        }
      }

      const task = this.taskQueue.shift()!
      task.onStatus?.('processing')
      try {
        const result = await task.execute()
        task.resolve(result)
      }
      catch (error) {
        task.reject(error)
      }
      this.lastExecutionTime = Date.now()
    }

    this.isProcessing = false
  }
}
