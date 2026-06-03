<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col items-center justify-center py-32 space-y-6 animate-in zoom-in-95 duration-500">
    <div class="p-6 bg-primary/10 rounded-full">
      <Loader2 class="h-12 w-12 text-primary animate-spin" />
    </div>
    <div class="text-center space-y-2">
      <h3 class="text-2xl font-bold tracking-tight">
        Processing Image
      </h3>
      <p class="text-muted-foreground">
        Isolating underlined vectors via Gemini engine...
      </p>
    </div>
  </div>
</template>
