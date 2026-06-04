<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { useCopyActions } from '@/composables/use-copy-actions'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  value: string
  compact?: boolean
}>(), {
  compact: false,
})

const { copyAsText, copyAsMarkdown, justCopiedText, justCopiedMarkdown } = useCopyActions(() => props.value)

const buttonClass = computed(() =>
  cn(
    'gap-1.5 h-8',
    props.compact && 'opacity-70 group-hover:opacity-100 transition-opacity',
  ),
)
</script>

<template>
  <div class="flex items-center gap-1">
    <Button
      variant="ghost"
      size="sm"
      :class="buttonClass"
      @click="copyAsText"
    >
      <Check
        v-if="justCopiedText"
        class="h-3.5 w-3.5 text-emerald-500"
      />
      <Copy
        v-else
        class="h-3.5 w-3.5"
      />
      {{ justCopiedText ? 'Copied' : 'Copy as text' }}
    </Button>
    <Button
      variant="ghost"
      size="sm"
      :class="buttonClass"
      @click="copyAsMarkdown"
    >
      <Check
        v-if="justCopiedMarkdown"
        class="h-3.5 w-3.5 text-emerald-500"
      />
      <Copy
        v-else
        class="h-3.5 w-3.5"
      />
      {{ justCopiedMarkdown ? 'Copied' : 'Copy as markdown' }}
    </Button>
  </div>
</template>
