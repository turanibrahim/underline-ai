<script setup lang="ts">
import HomeBackgroundBlob from '@/components/molecules/home-background-blob.vue'
import HomeCardGrid from '@/components/molecules/home-card-grid.vue'
import HomeHeroSection from '@/components/molecules/home-hero-section.vue'
</script>

<template>
  <div class="relative min-h-screen bg-background isolate flex flex-col justify-center py-12">
    <HomeBackgroundBlob />

    <div class="mx-auto max-w-5xl px-6 lg:px-8 space-y-12 w-full">
      <HomeHeroSection />

      <HomeCardGrid />
    </div>
  </div>
</template>
