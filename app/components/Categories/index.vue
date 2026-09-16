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
  <!-- FULL WIDTH CATEGORY SECTION -->

  <section class="w-full bg-white py-8">
    <div class="w-full px-5 sm:px-8 lg:px-10">
      <!-- HEADER -->

      <div class="mb-6 flex items-end justify-between">
        <div>
          <p
            class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600"
          >
            Explore
          </p>

          <h2 class="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Shop By Category
          </h2>

          <p class="mt-2 text-sm text-gray-500">
            Find the perfect products for your sport
          </p>
        </div>
      </div>

      <!-- ================================================= -->
      <!-- HORIZONTAL SLIDER -->
      <!-- ================================================= -->

      <div
        class="flex w-full gap-6 overflow-x-auto pb-4 py-4 px-4"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <!-- CATEGORY CARD -->

        <button
          v-for="category in categories"
          :key="category.name"
          type="button"
          @click="emit('select', category.name)"
          class="group relative h-[210px] min-w-[280px] flex-1 overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          :class="
            selectedCategory === category.name
              ? 'ring-4 ring-blue-500'
              : 'ring-1 ring-gray-200'
          "
        >
          <!-- IMAGE -->

          <img
            :src="category.image"
            :alt="category.name"
            class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />

          <!-- DARK GRADIENT -->

          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"
          ></div>

          <!-- CONTENT -->

          <div class="absolute inset-x-0 bottom-0 p-6 text-left">
            <h3 class="text-2xl font-bold text-white">
              {{ category.name }}
            </h3>

            <p
              class="mt-1 text-sm text-gray-200 transition group-hover:text-white"
            >
              Shop now →
            </p>
          </div>

          <!-- SELECTED BADGE -->

          <div
            v-if="selectedCategory === category.name"
            class="absolute right-4 top-4 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg"
          >
            ✓ Selected
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
