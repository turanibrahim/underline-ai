<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section
    class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-8"
  >
    <div class="space-y-1">
      <p class="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        Ready
      </p>
      <p class="text-lg font-medium text-foreground text-balance">
        Drop an image in, get a list back.
      </p>
    </div>
    <router-link :to="{ name: 'operation-page' }">
      <Button
        size="lg"
        class="gap-2 font-medium"
        :to="{ name: 'operation-page' }"
      >
        Open the operation page
        <ArrowRight class="h-4 w-4" />
      </Button>
    </router-link>
  </section>
</template>
