<script setup lang="ts">
import DOMPurify from 'dompurify'
import { AlertCircle, Loader2, RefreshCw } from 'lucide-vue-next'
import { marked } from 'marked'
import { computed, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ImagePreviewModal from '@/components/molecules/operation-image-preview-modal.vue'

type ItemState = 'pending' | 'loading' | 'success' | 'error'

const props = defineProps<{
  file: File
  previewUrl: string
  state: ItemState
  response: string
  error?: string
}>()

const emit = defineEmits<{
  'click:retry': []
}>()

const renderedMarkdown = computed(() => {
  if (!props.response)
    return ''
  const rawHtml = marked.parse(props.response) as string
  return DOMPurify.sanitize(rawHtml)
})

const isPreviewOpen = ref(false)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-card">
    <div class="flex flex-col gap-2 min-w-0">
      <div class="flex items-center gap-2 min-w-0">
        <Badge
          :variant="state === 'error' ? 'destructive' : state === 'success' ? 'default' : 'secondary'"
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
    </div>

    <div class="flex flex-col gap-2 min-w-0">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Response
        </span>
        <Button
          v-if="state !== 'loading'"
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
          v-if="state === 'loading'"
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
        <div
          v-else-if="state === 'success' && response"
          class="prose prose-sm dark:prose-invert max-w-none prose-emerald"
          v-html="renderedMarkdown"
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
