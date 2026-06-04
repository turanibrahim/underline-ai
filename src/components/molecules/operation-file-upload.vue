<script setup lang="ts">
import { Image as ImageIcon, Play, UploadCloud, X } from 'lucide-vue-next'
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

const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0)
    return

  const newFiles = Array.from(target.files)
  const newPreviews = newFiles.map(f => URL.createObjectURL(f))
  files.value = [...files.value, ...newFiles]
  previewUrls.value = [...previewUrls.value, ...newPreviews]
  target.value = ''
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <label
      class="relative flex flex-col items-center justify-center w-full min-h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors p-6"
      :class="[
        files.length > 0
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30',
      ]"
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
            <ImageIcon class="h-4 w-4" />
            {{ files.length }} image{{ files.length === 1 ? '' : 's' }} — click to change
          </p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="(url, index) in previewUrls"
            :key="index"
            class="relative group aspect-square rounded-md overflow-hidden border bg-background"
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
              class="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              @click.prevent.stop="emit('click:remove-file', index)"
            >
              <X class="h-3 w-3" />
            </Button>
            <div class="absolute bottom-0 inset-x-0 bg-background/80 text-[10px] px-1.5 py-1 truncate">
              {{ files[index].name }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center py-10 text-muted-foreground"
      >
        <UploadCloud class="w-12 h-12 mb-4 opacity-50" />
        <p class="mb-2 text-lg font-semibold">
          Click to upload or drag and drop
        </p>
        <p class="text-sm opacity-75">PNG, JPG or WEBP (multiple files supported)</p>
      </div>
    </label>

    <Button
      size="lg"
      class="w-full text-lg h-14"
      :disabled="!files.length || !apiKey"
      @click="emit('click:extract')"
    >
      <Play class="h-5 w-5 mr-2" />
      Start Extraction ({{ files.length }})
    </Button>
  </div>
</template>
