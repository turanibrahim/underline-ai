import { onBeforeUnmount, ref } from 'vue'
import { markdownToPlainText } from '@/lib/markdown'

export const useCopyActions = (source: () => string) => {
  const justCopiedText = ref(false)
  const justCopiedMarkdown = ref(false)
  let textResetTimer: ReturnType<typeof setTimeout> | null = null
  let markdownResetTimer: ReturnType<typeof setTimeout> | null = null

  const writeToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch (error) {
      console.error('Failed to copy to clipboard.', error)
      return false
    }
  }

  const flashCopied = (
    flag: { value: boolean },
    existingTimer: ReturnType<typeof setTimeout> | null,
  ): ReturnType<typeof setTimeout> => {
    if (existingTimer)
      clearTimeout(existingTimer)
    flag.value = true
    return setTimeout(() => {
      flag.value = false
    }, 1500)
  }

  const copyAsText = async (): Promise<void> => {
    if (await writeToClipboard(markdownToPlainText(source())))
      textResetTimer = flashCopied(justCopiedText, textResetTimer)
  }

  const copyAsMarkdown = async (): Promise<void> => {
    if (await writeToClipboard(source()))
      markdownResetTimer = flashCopied(justCopiedMarkdown, markdownResetTimer)
  }

  onBeforeUnmount(() => {
    if (textResetTimer)
      clearTimeout(textResetTimer)
    if (markdownResetTimer)
      clearTimeout(markdownResetTimer)
  })

  return {
    copyAsText,
    copyAsMarkdown,
    justCopiedText,
    justCopiedMarkdown,
  }
}
