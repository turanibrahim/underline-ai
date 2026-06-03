<script setup lang="ts">
import { Image as ImageIcon, UploadCloud } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps<{
  imagePreviewUrl: string | null
  selectedFile: File | null
  apiKey: string
}>()

defineEmits<{
  'file-select': [event: Event]
  'extract': []
}>()
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <label
      class="relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
      :class="[
        imagePreviewUrl
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30',
      ]"
    >
      <input
        type="file"
        class="hidden"
        accept="image/*"
        @change="$emit('file-select', $event)"
      >

      <div
        v-if="imagePreviewUrl"
        class="absolute inset-0 p-4 flex items-center justify-center"
      >
        <img
          :src="imagePreviewUrl"
          alt="Upload preview"
          class="max-h-full max-w-full object-contain rounded-lg shadow-sm"
        >
        <div
          class="absolute inset-0 bg-background/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-sm"
        >
          <p
            class="font-semibold text-foreground flex items-center gap-2"
          >
            <ImageIcon class="h-5 w-5" /> Click to change image
          </p>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground"
      >
        <UploadCloud class="w-12 h-12 mb-4 opacity-50" />
        <p class="mb-2 text-lg font-semibold">
          Click to upload or drag and drop
        </p>
        <p class="text-sm opacity-75">PNG, JPG or WEBP (Max 4MB)</p>
      </div>
    </label>

    <Button
      size="lg"
      class="w-full text-lg h-14"
      :disabled="!selectedFile || !apiKey"
      @click="$emit('extract')"
    >
      Extract Underlined Text
    </Button>
  </div>
</template>
