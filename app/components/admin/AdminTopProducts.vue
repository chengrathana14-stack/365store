<script setup lang="ts">
import { topProductSeedData } from "~/data/admin";

const products = topProductSeedData;
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-bold text-gray-900">Top Products</h3>

        <p class="text-sm text-gray-500">Best selling products</p>
      </div>

      <NuxtLink
        to="/admin/products"
        class="text-sm font-semibold text-gray-900 hover:underline"
      >
        View all
      </NuxtLink>
    </div>

    <!-- Products -->
    <div class="mt-6 space-y-5">
      <div
        v-for="(product, index) in products"
        :key="product.name"
        class="flex items-center gap-4"
      >
        <!-- Ranking -->
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-700"
        >
          {{ index + 1 }}
        </div>

        <!-- Product -->
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-gray-900">
            {{ product.name }}
          </p>

          <p class="mt-1 text-xs text-gray-500">{{ product.sold }} sold</p>
        </div>

        <!-- Arrow -->
        <span class="text-gray-400"> → </span>
      </div>
    </div>
  </div>
</template>
