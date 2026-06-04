<script setup lang="ts">
import { History, Image as ImageIcon, Loader2, Settings as SettingsIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Logo } from '@/components/ui/logo'
import { useGeminiStore } from '@/stores/gemini-store'
import { useOptimizerStore } from '@/stores/optimizer-store'

const geminiStore = useGeminiStore()
const optimizerStore = useOptimizerStore()
const route = useRoute()

const isReady = ref<boolean>(false)
const bootError = ref<string | null>(null)

interface NavItem {
  label: string
  to: string
  icon: typeof ImageIcon
}

const navItems: NavItem[] = [
  { label: 'Operation', to: '/operation', icon: ImageIcon },
  { label: 'History', to: '/history', icon: History },
  { label: 'Settings', to: '/settings', icon: SettingsIcon },
]

const isActive = (path: string): boolean => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

const init = async (): Promise<void> => {
  try {
    await Promise.all([geminiStore.hydrate(), optimizerStore.hydrate()])
    isReady.value = true
  }
  catch (err) {
    bootError.value = err instanceof Error ? err.message : 'Failed to initialize the app.'
    console.error('App bootstrap failed.', err)
  }
}
init()
</script>

<template>
  <div
    v-if="!isReady && !bootError"
    class="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-muted-foreground"
  >
    <Loader2 class="h-6 w-6 animate-spin text-emerald-500" />
    <p class="text-sm">
      Loading…
    </p>
  </div>
  <div
    v-else-if="bootError"
    class="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-destructive p-6"
  >
    <p class="text-sm font-semibold">
      Could not start the app
    </p>
    <p class="text-sm text-muted-foreground max-w-md text-center">
      {{ bootError }}
    </p>
  </div>
  <div
    v-else
    class="min-h-screen flex flex-col bg-background text-foreground"
  >
    <header
      class="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <RouterLink
          to="/"
          class="inline-flex text-sm rounded-md focus-visible:outline-none"
        >
          <Logo />
        </RouterLink>

        <nav class="flex items-center gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="group relative inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none hover:text-foreground"
            :class="isActive(item.to)
              ? 'text-foreground bg-accent ring-1 ring-border/60'
              : 'text-muted-foreground'"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >
            <component
              :is="item.icon"
              class="h-4 w-4"
              :class="isActive(item.to) ? 'text-emerald-500' : ''"
            />
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="flex-1 w-full">
      <router-view />
    </main>

    <footer class="border-t border-border bg-background">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1 px-6 py-4 text-xs text-muted-foreground sm:flex-row"
      >
        <p>© {{ new Date().getFullYear() }} Underline AI</p>
        <p class="font-mono">
          v1.0.0 // Client-Side Architecture
        </p>
      </div>
    </footer>
  </div>
</template>
