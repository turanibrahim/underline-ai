<script setup lang="ts">
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { computed } from 'vue'

const props = defineProps<{
  source: string
}>()

const rendered = computed<string>(() => {
  if (!props.source)
    return ''
  const rawHtml = marked.parse(props.source) as string
  return DOMPurify.sanitize(rawHtml)
})
</script>

<template>
  <div
    class="prose prose-sm dark:prose-invert max-w-none prose-emerald leading-relaxed prose-headings:tracking-tight prose-headings:font-semibold prose-p:my-2 prose-pre:bg-muted prose-pre:border prose-pre:border-border/60"
    v-html="rendered"
  />
</template>
