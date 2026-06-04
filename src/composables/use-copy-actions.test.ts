import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useCopyActions } from './use-copy-actions'

const Harness = defineComponent({
  props: {
    source: { type: String, required: true },
  },
  setup: (props) => {
    const actions = useCopyActions(() => props.source)
    return { ...actions }
  },
  render: () => h('div'),
})

const mountHarness = (source: string) => mount(Harness, { props: { source } })

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useCopyActions.copyAsText', () => {
  it('writes plain text (not markdown) to the clipboard', async () => {
    const write = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: write },
      configurable: true,
    })

    const wrapper = mountHarness('# Hello\n\n**bold**')
    await wrapper.vm.copyAsText()

    expect(write).toHaveBeenCalledTimes(1)
    const written = write.mock.calls[0]?.[0] ?? ''
    expect(written).not.toContain('**')
    expect(written).toContain('Hello')
    expect(written).toContain('bold')
    expect(wrapper.vm.justCopiedText).toBe(true)
  })
})

describe('useCopyActions.copyAsMarkdown', () => {
  it('writes the raw markdown to the clipboard', async () => {
    const write = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: write },
      configurable: true,
    })

    const raw = '# Hello'
    const wrapper = mountHarness(raw)
    await wrapper.vm.copyAsMarkdown()

    expect(write).toHaveBeenCalledWith(raw)
    expect(wrapper.vm.justCopiedMarkdown).toBe(true)
  })
})

describe('useCopyActions copied flag lifecycle', () => {
  it('resets the text flag after the timeout', async () => {
    const write = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: write },
      configurable: true,
    })

    const wrapper = mountHarness('text')
    await wrapper.vm.copyAsText()
    expect(wrapper.vm.justCopiedText).toBe(true)

    vi.advanceTimersByTime(1500)
    expect(wrapper.vm.justCopiedText).toBe(false)
  })

  it('does not set the flag when the clipboard write fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const write = vi.fn<(text: string) => Promise<void>>().mockRejectedValue(new Error('denied'))
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: write },
      configurable: true,
    })

    const wrapper = mountHarness('text')
    await wrapper.vm.copyAsText()

    expect(wrapper.vm.justCopiedText).toBe(false)
    expect(errorSpy).toHaveBeenCalled()
  })
})
