<script setup lang="ts">
import DOMPurify from 'dompurify'
import { ArrowLeft } from 'lucide-vue-next'
import { marked } from 'marked'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const props = defineProps<{
  markdownOutput: string
}>()

const emit = defineEmits<{
  'click:reset': []
}>()

// Safely parse and sanitize the markdown
const renderedMarkdown = computed(() => {
  if (!props.markdownOutput)
    return ''

  // 1. Parse markdown to raw HTML
  const rawHtml = marked.parse(props.markdownOutput) as string

  // 2. Sanitize to prevent XSS (Crucial when rendering AI output)
  return DOMPurify.sanitize(rawHtml)
})
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <div class="flex items-center justify-between border-b pb-4">
      <h2 class="text-2xl font-bold tracking-tight">
        Extraction Result
      </h2>
      <Button
        variant="outline"
        size="sm"
        class="gap-2"
        @click="emit('click:reset')"
      >
        <ArrowLeft class="h-4 w-4" /> Start Over
      </Button>
    </div>

    <Card class="bg-muted/30 border-muted">
      <CardContent class="p-6">
        <div
          class="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-emerald"
          v-html="renderedMarkdown"
        />
      </CardContent>
    </Card>
  </div>
</template>
