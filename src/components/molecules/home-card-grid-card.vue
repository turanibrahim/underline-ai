<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
</script>

<template>
  <Card
    class="bg-card/50 backdrop-blur-sm border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
  >
    <CardHeader class="space-y-1">
      <div
        class="p-2 bg-emerald-500/10 w-fit rounded-lg text-emerald-600 dark:text-emerald-400 mb-2"
      >
        <slot name="icon" />
      </div>
      <CardTitle class="text-lg font-bold">
        <slot name="title" />
      </CardTitle>
      <CardDescription>
        <slot name="description" />
      </CardDescription>
    </CardHeader>
    <CardContent class="text-sm text-muted-foreground leading-relaxed">
      <slot name="content" />
    </CardContent>
  </Card>
</template>
