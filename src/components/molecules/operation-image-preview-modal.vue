<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const open = defineModel<boolean>('open', { required: true })

defineProps<{
  src: string
  alt: string
  title: string
}>()

const close = () => {
  open.value = false
}

const onBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget)
    close()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape')
    close()
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  }
  else {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
}, { immediate: true })

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      @click="onBackdropClick"
    >
      <div class="absolute top-4 right-4 flex items-center gap-2">
        <span class="text-xs text-white/80 hidden sm:inline">
          Press Esc to close
        </span>
        <Button
          variant="ghost"
          size="icon"
          class="text-white hover:bg-white/10 hover:text-white"
          aria-label="Close preview"
          @click="close"
        >
          <X class="h-5 w-5" />
        </Button>
      </div>

      <div class="w-full max-w-5xl flex flex-col items-center gap-3">
        <h2 class="text-sm font-medium text-white/90 truncate max-w-full" :title="title">
          {{ title }}
        </h2>
        <img
          :src="src"
          :alt="alt"
          class="max-h-[85vh] max-w-full object-contain rounded-md shadow-2xl"
        >
      </div>
    </div>
  </Teleport>
</template>
