<script setup lang="ts">
import { Download } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps<{
  src: string
  alt: string
  title: string
}>()

const open = defineModel<boolean>('open', { required: true })

const downloadImage = () => {
  if (!props.src)
    return
  const link = document.createElement('a')
  link.href = props.src
  link.download = props.title
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <Dialog
    :open="open"
    @update:open="(v: boolean) => open = v"
  >
    <DialogContent
      class="max-w-5xl w-[min(95vw,1100px)] p-0 overflow-hidden gap-0 bg-background"
    >
      <DialogHeader class="sr-only">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ alt }}</DialogDescription>
      </DialogHeader>

      <div class="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-2.5 bg-muted/30">
        <span
          class="text-sm font-medium truncate"
          :title="title"
        >
          {{ title }}
        </span>
        <div class="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            class="gap-1.5 h-7"
            @click="downloadImage"
          >
            <Download class="h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </div>

      <div class="flex items-center justify-center bg-muted/40 p-4 max-h-[80vh]">
        <img
          v-if="src"
          :src="src"
          :alt="alt"
          class="max-h-[75vh] max-w-full object-contain rounded-md shadow-sm"
        >
      </div>
    </DialogContent>
  </Dialog>
</template>
