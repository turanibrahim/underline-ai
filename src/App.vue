<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/app-layout.vue'
import EmptyLayout from '@/layouts/empty-layout.vue'

const route = useRoute()
const LayoutComponent = computed(() =>
  route.meta.layout === 'empty' ? EmptyLayout : AppLayout,
)
</script>

<template>
  <component :is="LayoutComponent" />
</template>
