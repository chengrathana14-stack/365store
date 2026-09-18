<script setup lang="ts">
import { categoryCardSeedData } from "~/data/storefront";

defineProps<{
  selectedCategory: string;
}>();

const emit = defineEmits<{
  select: [category: string];
}>();

const categories = categoryCardSeedData;
</script>

<template>
  <section class="w-full border-b border-gray-100 bg-white py-6 sm:py-8">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- HEADER -->
      <div class="mb-5 flex items-end justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="h-4 w-1 rounded-full bg-lime-500"></span>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Categories
            </p>
          </div>

          <h2 class="mt-1 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
            Shop By Sport
          </h2>
        </div>
      </div>

      <!-- HORIZONTAL SLIDER -->
      <div
        class="flex w-full gap-4 overflow-x-auto pb-2"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <button
          v-for="category in categories"
          :key="category.name"
          type="button"
          @click="emit('select', category.name)"
          class="group relative h-[180px] min-w-[240px] flex-1 overflow-hidden rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
          :class="
            selectedCategory === category.name
              ? 'ring-2 ring-lime-500 ring-offset-2'
              : 'ring-1 ring-black/5'
          "
        >
          <!-- IMAGE -->
          <img
            :src="category.image"
            :alt="category.name"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <!-- DARK GRADIENT -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"
          ></div>

          <!-- CONTENT -->
          <div class="absolute inset-x-0 bottom-0 p-4 text-left">
            <h3 class="text-xl font-bold text-white">
              {{ category.name }}
            </h3>
            <p class="mt-0.5 text-xs font-semibold text-gray-300 transition group-hover:text-lime-400">
              Browse &rarr;
            </p>
          </div>

          <!-- SELECTED BADGE -->
          <div
            v-if="selectedCategory === category.name"
            class="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-black/90 px-2.5 py-1 text-[11px] font-bold text-lime-400 backdrop-blur-xs shadow-xs"
          >
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Selected</span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
