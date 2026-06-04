<script setup lang="ts">
import type { HistoryEntry } from '@/services/history-service'
import { Check, Copy, Eye, Image as ImageIcon, MoreHorizontal, Trash2 } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCopyActions } from '@/composables/use-copy-actions'
import { formatDuration, formatSize, formatTimestamp } from '@/lib/format'

const props = defineProps<{
  entry: HistoryEntry
}>()

const emit = defineEmits<{
  view: [entry: HistoryEntry]
  delete: [entry: HistoryEntry]
}>()

const thumbnailUrl = ref<string>('')

onMounted(() => {
  if (props.entry.originalBlob)
    thumbnailUrl.value = URL.createObjectURL(props.entry.originalBlob)
})

onBeforeUnmount(() => {
  if (thumbnailUrl.value)
    URL.revokeObjectURL(thumbnailUrl.value)
})

const { copyAsText, copyAsMarkdown, justCopiedText, justCopiedMarkdown } = useCopyActions(() => props.entry.response)
</script>

<template>
  <tr class="group border-b align-top transition-colors duration-200 hover:bg-muted/40">
    <td class="p-3 w-20">
      <div class="h-12 w-12 rounded-md overflow-hidden bg-muted ring-1 ring-border/60 flex items-center justify-center transition-shadow duration-200 group-hover:shadow-sm">
        <img
          v-if="thumbnailUrl"
          :src="thumbnailUrl"
          :alt="entry.fileName"
          class="h-full w-full object-cover"
        >
        <ImageIcon
          v-else
          class="h-5 w-5 text-muted-foreground"
        />
      </div>
    </td>
    <td class="p-3">
      <div
        class="font-medium truncate max-w-xs"
        :title="entry.fileName"
      >
        {{ entry.fileName }}
      </div>
      <div class="text-xs text-muted-foreground font-mono">
        {{ entry.mimeType || 'unknown' }}
      </div>
    </td>
    <td class="p-3 text-sm text-muted-foreground whitespace-nowrap">
      {{ formatTimestamp(entry.timestamp) }}
    </td>
    <td class="p-3 text-sm font-mono whitespace-nowrap">
      {{ entry.model }}
    </td>
    <td class="p-3 text-sm text-muted-foreground whitespace-nowrap">
      <div>{{ formatSize(entry.originalSize) }} → {{ formatSize(entry.optimizedSize) }}</div>
      <div class="text-xs font-mono">
        {{ formatDuration(entry.durationMs) }}
      </div>
    </td>
    <td class="p-3">
      <div class="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity"
              :aria-label="`Actions for ${entry.fileName}`"
            >
              <MoreHorizontal class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="min-w-44">
            <DropdownMenuItem @select="emit('view', entry)">
              <Eye class="h-3.5 w-3.5" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem @select="copyAsText">
              <Check
                v-if="justCopiedText"
                class="h-3.5 w-3.5 text-emerald-500"
              />
              <Copy
                v-else
                class="h-3.5 w-3.5"
              />
              {{ justCopiedText ? 'Copied as text' : 'Copy as text' }}
            </DropdownMenuItem>
            <DropdownMenuItem @select="copyAsMarkdown">
              <Check
                v-if="justCopiedMarkdown"
                class="h-3.5 w-3.5 text-emerald-500"
              />
              <Copy
                v-else
                class="h-3.5 w-3.5"
              />
              {{ justCopiedMarkdown ? 'Copied as markdown' : 'Copy as markdown' }}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              @select="emit('delete', entry)"
            >
              <Trash2 class="h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </td>
  </tr>
</template>
