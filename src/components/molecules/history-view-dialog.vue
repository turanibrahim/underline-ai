<script setup lang="ts">
import type { HistoryEntry } from '@/services/history-service'
import { Download } from 'lucide-vue-next'
import { onBeforeUnmount, ref, watch } from 'vue'
import CopyButtons from '@/components/molecules/copy-buttons.vue'
import MarkdownView from '@/components/molecules/markdown-view.vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatTimestamp } from '@/lib/format'

const props = defineProps<{
  open: boolean
  entry: HistoryEntry | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const previewUrl = ref<string>('')

watch(
  () => [props.open, props.entry] as const,
  ([isOpen, entry]) => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    }
    if (isOpen && entry?.originalBlob) {
      previewUrl.value = URL.createObjectURL(entry.originalBlob)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (previewUrl.value)
    URL.revokeObjectURL(previewUrl.value)
})

const downloadImage = () => {
  if (!props.entry || !previewUrl.value)
    return
  const link = document.createElement('a')
  link.href = previewUrl.value
  link.download = props.entry.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <Dialog
    :open="open"
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <DialogContent class="max-w-6xl max-h-[90vh] flex flex-col gap-6 p-8 min-w-full md:min-w-[70vw]">
      <DialogHeader class="space-y-2">
        <DialogTitle
          class="truncate text-lg font-semibold"
          :title="entry?.fileName"
        >
          {{ entry?.fileName }}
        </DialogTitle>
        <DialogDescription v-if="entry">
          {{ formatTimestamp(entry.timestamp) }} ·
          <span class="font-mono">{{ entry.model }}</span>
        </DialogDescription>
      </DialogHeader>

      <div
        v-if="entry"
        class="flex items-center justify-end gap-1.5"
      >
        <Button
          variant="ghost"
          size="sm"
          class="gap-1.5 h-8"
          @click="downloadImage"
        >
          <Download class="h-3.5 w-3.5" />
          Download image
        </Button>
        <CopyButtons :value="entry.response" />
      </div>

      <div
        v-if="entry"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 flex-1"
      >
        <div class="flex flex-col gap-2 min-h-0">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Image
          </span>
          <div class="flex-1 min-h-64 max-h-[28rem] bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center border border-border/60">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              :alt="entry.fileName"
              class="max-h-[28rem] max-w-full object-contain"
            >
          </div>
        </div>

        <div class="flex flex-col gap-2 min-h-0">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Response
          </span>
          <div class="flex-1 min-h-64 max-h-[28rem] overflow-auto rounded-lg border border-border/60 bg-background p-4">
            <MarkdownView :source="entry.response" />
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
