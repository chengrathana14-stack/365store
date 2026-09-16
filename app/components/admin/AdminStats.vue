<script setup lang="ts">
import type { DashboardStat } from "~/type/admin";

defineProps<{
  stats: DashboardStat[];
}>();
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="stat in stats"
      :key="stat.title"
      class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm text-gray-500">
            {{ stat.title }}
          </p>

          <h3 class="mt-2 text-3xl font-bold text-gray-900">
            {{ stat.value }}
          </h3>

          <p class="mt-2 text-sm font-medium text-green-600">
            {{ stat.change }}

            <span class="font-normal text-gray-400"> from last month </span>
          </p>
        </div>

        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl"
        >
          {{ stat.icon }}
        </div>
      </div>
    </div>
  </div>
</template>
