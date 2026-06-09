import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QueueService } from './queue-service'

describe('queueService', () => {
  let queue: QueueService

  beforeEach(() => {
    vi.useFakeTimers()
    queue = new QueueService(5000)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('executes a single task and returns its result', async () => {
    const result = queue.enqueue(async () => 'hello')
    await vi.advanceTimersByTimeAsync(0)
    await expect(result).resolves.toBe('hello')
  })

  it('executes tasks sequentially', async () => {
    const order: number[] = []

    const p1 = queue.enqueue(async () => {
      order.push(1)
      return 'a'
    })

    const p2 = queue.enqueue(async () => {
      order.push(2)
      return 'b'
    })

    await vi.advanceTimersByTimeAsync(0)
    expect(order).toEqual([1])

    await vi.advanceTimersByTimeAsync(5000)
    expect(order).toEqual([1, 2])

    await expect(p1).resolves.toBe('a')
    await expect(p2).resolves.toBe('b')
  })

  it('waits delayMs between task completions', async () => {
    const timestamps: number[] = []

    const p1 = queue.enqueue(async () => {
      timestamps.push(Date.now())
      return 'a'
    })

    const p2 = queue.enqueue(async () => {
      timestamps.push(Date.now())
      return 'b'
    })

    await vi.advanceTimersByTimeAsync(0)
    await vi.advanceTimersByTimeAsync(5000)

    expect(timestamps[1] - timestamps[0]).toBeGreaterThanOrEqual(5000)
    await expect(p1).resolves.toBe('a')
    await expect(p2).resolves.toBe('b')
  })

  it('continues after a task error', async () => {
    const order: number[] = []

    const p1 = queue.enqueue(async () => {
      order.push(1)
      throw new Error('fail')
    })

    // Attach handler immediately to suppress Node.js unhandled rejection warning
    void p1.catch(() => {})

    const p2 = queue.enqueue(async () => {
      order.push(2)
      return 'ok'
    })

    await vi.advanceTimersByTimeAsync(0)
    try {
      await p1
      expect.unreachable('expected p1 to reject')
    }
    catch (err) {
      const error = err as Error
      expect(error.message).toMatch('fail')
    }
    expect(order).toEqual([1])

    await vi.advanceTimersByTimeAsync(5000)
    await expect(p2).resolves.toBe('ok')
    expect(order).toEqual([1, 2])
  })

  it('fires onStatus callbacks', async () => {
    const statuses: string[] = []

    const p = queue.enqueue(
      async () => 'done',
      (status) => {
        statuses.push(status)
      },
    )

    expect(statuses).toEqual(['queued', 'processing'])
    await expect(p).resolves.toBe('done')
  })

  it('processes tasks enqueued during execution', async () => {
    const order: number[] = []

    const p1 = queue.enqueue(async () => {
      order.push(1)
      void queue.enqueue(async () => {
        order.push(2)
        return 'b'
      })
      return 'a'
    })

    await vi.advanceTimersByTimeAsync(0)
    expect(order).toEqual([1])

    await vi.advanceTimersByTimeAsync(5000)
    expect(order).toEqual([1, 2])

    await expect(p1).resolves.toBe('a')
  })
})
