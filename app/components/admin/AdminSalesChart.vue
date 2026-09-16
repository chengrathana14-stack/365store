<script setup lang="ts">
import { computed, ref } from "vue";
import { salesChartPeriods, salesChartSeedData } from "~/data/admin";
import type { SalesChartPeriod } from "~/type/admin";

const selectedPeriod = ref<SalesChartPeriod>("Last 30 days");

const periods = salesChartPeriods;

const chartData = computed(() => {
  return salesChartSeedData[selectedPeriod.value];
});
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <!-- Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 class="font-bold text-gray-900">Sales Overview</h3>

        <p class="text-sm text-gray-500">Revenue performance</p>
      </div>

      <select
        v-model="selectedPeriod"
        class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
      >
        <option v-for="period in periods" :key="period" :value="period">
          {{ period }}
        </option>
      </select>
    </div>

    <!-- Revenue -->
    <div class="mt-6">
      <p class="text-sm text-gray-500">Total Revenue</p>

      <p class="mt-1 text-2xl font-bold text-gray-900">$24,580</p>
    </div>

    <!-- Chart -->
    <div class="mt-8 flex h-64 items-end gap-2 sm:gap-3">
      <div
        v-for="item in chartData"
        :key="item.label"
        class="group flex h-full flex-1 flex-col justify-end"
      >
        <div class="relative flex h-full items-end">
          <!-- Tooltip -->
          <div
            class="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg bg-black px-2 py-1 text-xs text-white group-hover:block"
          >
            {{ item.value }}%
          </div>

          <!-- Bar -->
          <div
            class="w-full rounded-t-lg bg-black transition-all duration-300 group-hover:bg-gray-600"
            :style="{ height: `${item.value}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Labels -->
    <div class="mt-4 flex justify-between text-xs text-gray-400">
      <span v-for="item in chartData" :key="item.label">
        {{ item.label }}
      </span>
    </div>
  </div>
</template>
