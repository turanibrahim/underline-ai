<script setup lang="ts">
import { Image as ImageIcon, Play, UploadCloud, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

defineProps<{
  apiKey: string
}>()

const emit = defineEmits<{
  'click:extract': []
  'click:remove-file': [index: number]
}>()

const files = defineModel<File[]>('files', {
  type: Array,
  required: true,
})
const previewUrls = defineModel<string[]>('previewUrls', {
  type: Array,
  required: true,
})

const dragOver = ref(false)

const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0)
    return

  const newFiles = Array.from(target.files)
  const newPreviews = newFiles.map(f => URL.createObjectURL(f))
  files.value = [...files.value, ...newFiles]
  previewUrls.value = [...previewUrls.value, ...newPreviews]
  target.value = ''
  dragOver.value = false
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  if (!event.dataTransfer || event.dataTransfer.files.length === 0)
    return
  const newFiles = Array.from(event.dataTransfer.files)
  const newPreviews = newFiles.map(f => URL.createObjectURL(f))
  files.value = [...files.value, ...newFiles]
  previewUrls.value = [...previewUrls.value, ...newPreviews]
}
</script>

<template>
  <div class="space-y-6">
    <label
      class="relative flex flex-col items-center justify-center w-full min-h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 p-6"
      :class="[
        dragOver
          ? 'border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20'
          : files.length > 0
            ? 'border-emerald-500/60 bg-emerald-500/5'
            : 'border-muted-foreground/25 hover:border-emerald-500/40 hover:bg-muted/30',
      ]"
      @dragenter.prevent="dragOver = true"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop="onDrop"
    >
      <input
        type="file"
        class="hidden"
        accept="image/*"
        multiple
        @change="onInputChange"
      >

      <div
        v-if="files.length > 0"
        class="w-full space-y-4"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="font-semibold text-sm flex items-center gap-2">
            <ImageIcon class="h-4 w-4 text-emerald-500" />
            {{ files.length }} image{{ files.length === 1 ? '' : 's' }} — click to change
          </p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="(url, index) in previewUrls"
            :key="index"
            class="group relative aspect-square rounded-lg overflow-hidden border border-border/60 bg-background shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-500/40"
          >
            <img
              :src="url"
              :alt="files[index].name"
              class="h-full w-full object-cover"
            >
            <Button
              type="button"
              variant="destructive"
              size="icon"
              class="absolute top-1.5 right-1.5 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              @click.prevent.stop="emit('click:remove-file', index)"
            >
              <X class="h-3 w-3" />
            </Button>
            <div class="absolute bottom-0 inset-x-0 bg-background/85 backdrop-blur-sm text-[10px] px-1.5 py-1 truncate font-mono">
              {{ files[index].name }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center py-10 text-muted-foreground"
      >
        <div
          class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400"
        >
          <UploadCloud class="h-6 w-6" />
        </div>
        <p class="mb-1 text-lg font-semibold text-foreground">
          Click to upload or drag and drop
        </p>
        <p class="text-sm opacity-75">PNG, JPG or WEBP (multiple files supported)</p>
      </div>
    </label>

    <Button
      size="lg"
      class="w-full text-base h-12 font-semibold gap-2"
      :disabled="!files.length || !apiKey"
      @click="emit('click:extract')"
    >
      <Play class="h-4 w-4" />
      Start Extraction ({{ files.length }})
    </Button>
  </div>
</template>
