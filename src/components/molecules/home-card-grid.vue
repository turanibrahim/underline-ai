<script setup lang="ts">
import { Code, Coins, EyeOff } from "lucide-vue-next";
import HomeCardGridCard from "@/components/molecules/home-card-grid-card.vue";
</script>

<template>
  <section class="grid gap-6 md:grid-cols-3 pt-6">
    <home-card-grid-card>
      <template #icon>
        <EyeOff class="h-5 w-5" />
      </template>
      <template #title> Privacy First </template>
      <template #description>
        Zero trackers, logs, or analytics backend.
      </template>
      <template #content>
        Your Gemini API key and uploaded source images never hit an intermediate
        server. All calculations, Base64 conversions, and API payloads happen
        exclusively inside your browser's runtime.
      </template>
    </home-card-grid-card>

    <home-card-grid-card>
      <template #icon>
        <Code class="h-5 w-5" />
      </template>
      <template #title> Open Source </template>
      <template #description>
        Completely transparent runtime execution.
      </template>
      <template #content>
        Audit the network layer yourself. The code is structured explicitly to
        guarantee no hidden telemetries or third-party tracking scripts are
        injected into your environment.
      </template>
    </home-card-grid-card>

    <home-card-grid-card>
      <template #icon>
        <Coins class="h-5 w-5" />
      </template>
      <template #title> 100% Free </template>
      <template #description> Bring Your Own Key (BYOK) paradigm. </template>
      <template #content>
        §No subscription paywalls, account creation traps, or daily caps. Use
        your standard Google AI Studio API credentials to power your extraction
        models directly.
      </template>
    </home-card-grid-card>
  </section>
</template>
