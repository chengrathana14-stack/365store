<template>
  <div
    class="group relative flex flex-col w-full overflow-hidden rounded-md bg-white border border-gray-200/90 shadow-xs transition-all duration-200 hover:shadow-sm hover:border-gray-300"
  >
    <!-- Top Image Container -->
    <div class="relative block w-full aspect-square overflow-hidden bg-neutral-50 rounded-t-md">
      <!-- Badges -->
      <div class="absolute left-2 top-2 z-10 flex flex-col gap-1 pointer-events-none">
        <span
          v-if="product.discount"
          class="inline-flex items-center rounded-xs bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wide"
        >
          -{{ product.discount }}%
        </span>
        <span
          v-if="product.isNew"
          class="inline-flex items-center rounded-none bg-black px-2 py-0.5 text-[11px] font-semibold text-white tracking-normal"
        >
          New
        </span>
      </div>

      <!-- Wishlist Button -->
      <button
        type="button"
        @click.stop.prevent="toggleWishlist(product)"
        class="absolute right-2 top-2 z-20 flex h-7.5 w-7.5 items-center justify-center rounded-md bg-white/95 border border-gray-200/70 shadow-xs transition-transform duration-150 hover:scale-105 hover:bg-white active:scale-95"
        :title="isFavorite(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="h-3.5 w-3.5 transition-colors"
          :class="
            isFavorite(product.id)
              ? 'fill-red-500 stroke-red-500'
              : 'fill-none stroke-gray-500 hover:stroke-black'
          "
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>

      <!-- Clickable Product Image Link -->
      <NuxtLink
        :to="`/Product/${product.id}`"
        class="block h-full w-full"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <img
          :src="isHovered && product.hoverimg ? product.hoverimg : product.image"
          :alt="product.name"
          class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </NuxtLink>
    </div>

    <!-- Product Details -->
    <div class="flex flex-1 flex-col p-3">
      <!-- Brand & Rating row -->
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {{ product.brand }}
        </span>

        <div class="flex items-center gap-1 text-[11px] text-gray-600">
          <svg class="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <span class="font-semibold">{{ product.rating }}</span>
        </div>
      </div>

      <!-- Title -->
      <NuxtLink :to="`/Product/${product.id}`" class="mt-1 block">
        <h3
          class="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-1 transition hover:text-lime-600"
          :title="product.name"
        >
          {{ product.name }}
        </h3>
      </NuxtLink>

      <!-- Price -->
      <div class="mt-2 flex items-baseline gap-2">
        <span class="text-sm sm:text-base font-extrabold text-gray-900">
          ${{ product.price.toFixed(2) }}
        </span>
        <span
          v-if="product.discount"
          class="text-[11px] text-gray-400 line-through"
        >
          ${{ originalPrice }}
        </span>
        <span
          v-if="product.stock === 0"
          class="ml-auto text-[10px] font-bold uppercase tracking-wider text-red-500"
        >
          Sold Out
        </span>
      </div>

      <!-- Buttons: Add to Cart & Buy Now -->
      <div class="mt-2.5 grid grid-cols-2 gap-1.5">
        <button
          type="button"
          :disabled="product.stock === 0"
          @click="handleAddToCart"
          class="flex h-7 sm:h-8 items-center justify-center rounded-md border border-gray-200 bg-white text-[10px] sm:text-[11px] font-semibold text-gray-800 transition hover:border-black hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ justAdded ? "Added!" : "Add to Cart" }}
        </button>

        <button
          type="button"
          :disabled="product.stock === 0"
          @click="handleBuyNow"
          class="flex h-7 sm:h-8 items-center justify-center rounded-md bg-black text-[10px] sm:text-[11px] font-semibold text-white transition hover:bg-lime-400 hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          Buy Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Product } from "~/type/product";
import { useWishlist } from "~/composables/useWishlist";
import { useCart } from "~/composables/useCart";

const props = defineProps<{
  product: Product;
}>();

const isHovered = ref(false);
const justAdded = ref(false);

const { isFavorite, toggleWishlist } = useWishlist();
const { addToCart } = useCart();

const originalPrice = computed(() => {
  if (!props.product.discount) {
    return props.product.price.toFixed(2);
  }
  return (props.product.price / (1 - props.product.discount / 100)).toFixed(2);
});

const handleAddToCart = () => {
  if (props.product.stock <= 0) return;
  const defaultSize = props.product.size?.[0] || "";
  addToCart(props.product, 1, defaultSize);

  justAdded.value = true;
  setTimeout(() => {
    justAdded.value = false;
  }, 1400);
};

const handleBuyNow = () => {
  if (props.product.stock <= 0) return;
  const defaultSize = props.product.size?.[0] || "";
  addToCart(props.product, 1, defaultSize);
  navigateTo("/Cart");
};
</script>
