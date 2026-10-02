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
  <section class="relative w-full border-b border-white/10 bg-[#07090e]/95 backdrop-blur-2xl py-6 sm:py-8 overflow-hidden shadow-2xl">
    <!-- Subtle dark cyber ambient glows -->
    <div class="pointer-events-none absolute -top-24 left-1/4 h-48 w-96 rounded-full bg-lime-400/10 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 right-1/4 h-48 w-96 rounded-full bg-cyan-400/10 blur-3xl"></div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- HEADER -->
      <div class="mb-5 flex items-end justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="h-4 w-1 rounded-full bg-lime-400 shadow-[0_0_8px_#b7f34a]"></span>
            <p class="text-xs font-black uppercase tracking-[0.2em] text-lime-400">
              Categories
            </p>
          </div>

          <h2 class="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl drop-shadow-sm">
            Shop By Sport
          </h2>
        </div>
      </div>

      <!-- HORIZONTAL SLIDER -->
      <div
        class="flex w-full gap-4 overflow-x-auto pb-2 custom-scrollbar"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <button
          v-for="category in categories"
          :key="category.name"
          type="button"
          @click="emit('select', category.name)"
          class="group relative h-[185px] min-w-[240px] flex-1 overflow-hidden rounded-xl border transition-all duration-300 hardware-accelerated hover:-translate-y-1 hover:shadow-2xl cursor-pointer text-left"
          :class="
            selectedCategory === category.name
              ? 'border-lime-400 shadow-[0_0_24px_rgba(183,243,74,0.35)] ring-2 ring-lime-400/60'
              : 'border-white/10 hover:border-white/30 bg-[#111420]/80'
          "
        >
          <!-- IMAGE -->
          <img
            :src="category.image"
            :alt="category.name"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          />

          <!-- DARK GRADIENT OVERLAY -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-black/20 transition-opacity duration-300 group-hover:opacity-90"
          ></div>

          <!-- LIME CORNER ACCENT ON HOVER -->
          <div
            class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            :class="{ '!opacity-100': selectedCategory === category.name }"
          ></div>

          <!-- CONTENT -->
          <div class="absolute inset-x-0 bottom-0 p-4 text-left">
            <h3 class="text-xl font-black text-white tracking-tight drop-shadow-sm group-hover:text-lime-300 transition-colors">
              {{ category.name }}
            </h3>
            <p class="mt-0.5 text-xs font-bold text-gray-300 transition-colors group-hover:text-lime-400 inline-flex items-center gap-1">
              <span>Browse</span>
              <span class="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
            </p>
          </div>

          <!-- SELECTED BADGE -->
          <div
            v-if="selectedCategory === category.name"
            class="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-lime-400/50 bg-[#07090e]/90 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-lime-400 backdrop-blur-md shadow-[0_0_12px_rgba(183,243,74,0.35)]"
          >
            <svg class="h-3 w-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Selected</span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
