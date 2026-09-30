<script setup lang="ts">
import { useAutoSync } from "~/composables/useAutoSync";

// Initialize global silent background auto-refresh across all pages
useAutoSync();
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>