<template>
  <div
    class="group relative w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <!-- Discount -->

    <div
      v-if="product.discount"
      class="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white"
    >
      -{{ product.discount }}%
    </div>

    <!-- New -->

    <div
      v-if="product.isNew"
      class="absolute right-3 top-3 z-10 rounded-full bg-black px-3 py-1 text-xs font-bold text-white"
    >
      NEW
    </div>

    <!-- Wishlist -->

    <button
      @click.stop="toggleWishlist(product)"
      class="absolute right-3 top-14 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
      title="Wishlist"
    >
      <span
        class="text-xl"
        :class="isFavorite(product.id) ? 'text-red-500' : 'text-gray-500'"
      >
        {{ isFavorite(product.id) ? "♥" : "♡" }}
      </span>
    </button>

    <!-- Image -->

    <NuxtLink
      :to="`/Product/${product.id}`"
      class="block h-64 w-full overflow-hidden bg-gray-100"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <img
        :src="isHovered && product.hoverimg ? product.hoverimg : product.image"
        :alt="product.name"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    </NuxtLink>

    <!-- Information -->

    <div class="p-5">
      <!-- Brand / Category -->

      <div class="flex items-center justify-between">
        <p class="text-xs font-bold uppercase tracking-wider text-gray-400">
          {{ product.brand }}
        </p>

        <p class="text-xs text-gray-400">
          {{ product.category }}
        </p>
      </div>

      <!-- Name -->

      <NuxtLink :to="`/Product/${product.id}`">
        <h2
          class="line-clamp-2 min-h-12 text-lg font-bold text-gray-900 transition hover:text-lime-700"
        >
          {{ product.name }}
        </h2>
      </NuxtLink>

      <!-- Rating -->

      <div class="mt-2 flex items-center gap-2">
        <div class="text-sm text-yellow-400">★★★★★</div>

        <span class="text-sm text-gray-500">
          {{ product.rating }}
        </span>

        <span class="text-xs text-gray-400"> ({{ product.reviews }}) </span>
      </div>

      <!-- Description -->

      <p class="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
        {{ product.description }}
      </p>

      <!-- Color -->

      <div class="mt-3 flex items-center gap-2">
        <span class="text-xs font-medium text-gray-500"> Color: </span>

        <span class="text-xs font-semibold text-gray-700">
          {{ product.color }}
        </span>
      </div>

      <!-- Price -->

      <div class="mt-4 flex items-center gap-3">
        <span class="text-2xl font-bold text-gray-900">
          ${{ product.price.toFixed(2) }}
        </span>

        <span
          v-if="product.discount"
          class="text-sm text-gray-400 line-through"
        >
          ${{ originalPrice }}
        </span>
      </div>

      <!-- Stock -->

      <div class="mt-2">
        <span
          v-if="product.stock > 0"
          class="text-xs font-medium text-green-600"
        >
          ✓ {{ product.stock }} in stock
        </span>

        <span v-else class="text-xs font-medium text-red-500">
          Out of stock
        </span>
      </div>

      <!-- Buttons -->

      <div class="mt-5 flex gap-2">
        <!-- Add To Cart -->

        <button
          :disabled="product.stock === 0"
          @click="goToProductDetail"
          class="flex-1 rounded-xl bg-black px-4 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          🔍 View Details
        </button>

        <!-- Buy -->

        <button
          :disabled="product.stock === 0"
          @click="goToProductDetail"
          class="rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:border-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Product } from "~/type/product";
import { useWishlist } from "~/composables/useWishlist";
import { navigateTo } from "#app/composables/router";

// =====================================================
// Props
// =====================================================

const props = defineProps<{
  product: Product;
}>();

// =====================================================
// Hover Image
// =====================================================

const isHovered = ref(false);

// =====================================================
// Wishlist
// =====================================================

const { isFavorite, toggleWishlist } = useWishlist();

// =====================================================
// Original Price
// =====================================================

const originalPrice = computed(() => {
  if (!props.product.discount) {
    return props.product.price.toFixed(2);
  }

  return (props.product.price / (1 - props.product.discount / 100)).toFixed(2);
});

// =====================================================
// Go Product Detail
// =====================================================

const goToProductDetail = () => {
  navigateTo(`/Product/${props.product.id}`);
};
</script>
