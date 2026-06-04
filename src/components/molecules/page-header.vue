<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div
    class="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between"
  >
    <div class="flex items-start gap-3 min-w-0">
      <div
        v-if="$slots.icon"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20"
      >
        <slot name="icon" />
      </div>
      <div class="space-y-1 min-w-0">
        <h1 class="text-2xl font-semibold tracking-tight text-balance text-foreground">
          <slot>{{ title }}</slot>
        </h1>
        <p
          v-if="$slots.description"
          class="text-sm text-muted-foreground max-w-2xl text-pretty"
        >
          <slot name="description" />
        </p>
      </div>
    </div>

    <div
      v-if="$slots.actions"
      class="flex items-center gap-2 shrink-0"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
