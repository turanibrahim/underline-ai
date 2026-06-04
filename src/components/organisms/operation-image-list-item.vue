<script setup lang="ts">
import { AlertCircle, Loader2, Minimize2, RefreshCw } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import MarkdownView from '@/components/molecules/markdown-view.vue'
import ImagePreviewModal from '@/components/molecules/operation-image-preview-modal.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatBytes } from '@/lib/image-utils'

type ItemState = 'pending' | 'optimizing' | 'loading' | 'success' | 'error'

const props = defineProps<{
  file: File
  previewUrl: string
  state: ItemState
  response: string
  error?: string
  originalSize?: number
  optimizedSize?: number
  savedPercent?: number
  optimizedWidth?: number
  optimizedHeight?: number
}>()

const emit = defineEmits<{
  'click:retry': []
}>()

const isPreviewOpen = ref(false)

const stateBadgeVariant = computed<'default' | 'destructive' | 'secondary'>(() => {
  if (props.state === 'error')
    return 'destructive'
  if (props.state === 'success')
    return 'default'
  return 'secondary'
})

const optimizationSummary = computed<string | null>(() => {
  if (props.originalSize == null || props.optimizedSize == null)
    return null
  const parts: string[] = []
  parts.push(`${formatBytes(props.originalSize)} → ${formatBytes(props.optimizedSize)}`)
  if (props.savedPercent != null && props.savedPercent > 0)
    parts.push(`-${props.savedPercent}%`)
  if (props.optimizedWidth != null && props.optimizedHeight != null)
    parts.push(`${props.optimizedWidth}×${props.optimizedHeight}`)
  return parts.join(' · ')
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-card">
    <div class="flex flex-col gap-2 min-w-0">
      <div class="flex items-center gap-2 min-w-0">
        <Badge
          :variant="stateBadgeVariant"
          class="shrink-0"
        >
          {{ state }}
        </Badge>
        <span class="text-xs text-muted-foreground truncate" :title="file.name">
          {{ file.name }}
        </span>
      </div>
      <div class="flex-1 min-h-32 max-h-72 bg-muted/30 rounded-md overflow-hidden flex items-center justify-center">
        <button
          type="button"
          class="flex items-center justify-center w-full h-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          :aria-label="`Preview ${file.name}`"
          @click="isPreviewOpen = true"
        >
          <img
            :src="previewUrl"
            :alt="file.name"
            class="max-h-72 max-w-full object-contain"
          >
        </button>
      </div>
      <div
        v-if="optimizationSummary"
        class="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-mono"
      >
        <Minimize2 class="h-3 w-3 shrink-0" />
        <span class="truncate" :title="optimizationSummary">{{ optimizationSummary }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-2 min-w-0">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Response
        </span>
        <Button
          v-if="state !== 'loading' && state !== 'optimizing'"
          variant="ghost"
          size="sm"
          class="gap-1.5 h-7"
          @click="emit('click:retry')"
        >
          <RefreshCw class="h-3.5 w-3.5" />
          Retry
        </Button>
      </div>

      <div class="flex-1 min-h-32 max-h-72 overflow-auto rounded-md border bg-background p-3">
        <div
          v-if="state === 'optimizing'"
          class="flex items-center gap-2 text-sm text-muted-foreground h-full justify-center"
        >
          <Loader2 class="h-4 w-4 animate-spin" />
          Optimizing for AI…
        </div>
        <div
          v-else-if="state === 'loading'"
          class="flex items-center gap-2 text-sm text-muted-foreground h-full justify-center"
        >
          <Loader2 class="h-4 w-4 animate-spin" />
          Processing image…
        </div>
        <div
          v-else-if="state === 'error'"
          class="flex items-start gap-2 text-sm text-destructive"
        >
          <AlertCircle class="h-4 w-4 mt-0.5 shrink-0" />
          <span class="wrap-break-word">{{ error || 'Request failed.' }}</span>
        </div>
        <MarkdownView
          v-else-if="state === 'success' && response"
          :source="response"
        />
        <div
          v-else
          class="flex items-center justify-center h-full text-sm text-muted-foreground"
        >
          Waiting…
        </div>
      </div>
    </div>
  </div>

  <ImagePreviewModal
    v-model:open="isPreviewOpen"
    :src="previewUrl"
    :alt="file.name"
    :title="file.name"
  />
</template>
