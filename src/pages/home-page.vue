<script setup lang="ts">
import HomeApiKeySection from '@/components/molecules/home-api-key-section.vue'
import HomeCardGrid from '@/components/molecules/home-card-grid.vue'
import HomeFinalCta from '@/components/molecules/home-final-cta.vue'
import HomeHeroSection from '@/components/molecules/home-hero-section.vue'
import HomeProcessSection from '@/components/molecules/home-process-section.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="mx-auto max-w-5xl px-6 py-14 sm:py-20 space-y-20 sm:space-y-24">
      <HomeHeroSection />
      <HomeProcessSection />
      <HomeCardGrid />
      <HomeApiKeySection />
      <HomeFinalCta />
    </div>
  </div>
</template>
