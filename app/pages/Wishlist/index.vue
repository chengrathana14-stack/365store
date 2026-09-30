<template>
  <div class="min-h-screen py-10 text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Back Navigation & Quick Info -->
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink
          to="/Product"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-400 transition hover:-translate-x-1 hover:text-white"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Continue Shopping</span>
        </NuxtLink>

        <span class="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-bold text-red-400">
          <span class="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
          {{ wishlist.length }} Saved Favorites
        </span>
      </div>

      <!-- Header Banner -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-[#0d1017]/85 p-6 backdrop-blur-2xl">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="h-6 w-1.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444]"></span>
            <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              My Saved Wishlist
            </h1>
          </div>
          <p class="mt-1 text-xs sm:text-sm text-gray-400">
            Keep track of your dream athletic gear and move them directly to bag anytime
          </p>
        </div>

        <div v-if="wishlist.length > 0" class="flex items-center gap-3">
          <button
            type="button"
            @click="handleMoveAllToCart"
            class="flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_15px_rgba(183,243,74,0.4)] active:scale-95"
          >
            <span>Move All to Bag</span>
            <span>&rarr;</span>
          </button>

          <button
            type="button"
            @click="clearWishlist"
            class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-if="wishlist.length === 0"
        class="rounded-3xl border border-white/10 bg-[#0d1017]/85 backdrop-blur-2xl px-6 py-20 text-center shadow-xl text-white"
      >
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-3xl">
          ❤️
        </div>

        <h2 class="mt-5 text-2xl font-black text-white">
          Your wishlist is currently empty
        </h2>

        <p class="mx-auto mt-2 max-w-md text-xs sm:text-sm text-gray-400">
          You haven't saved any performance shoes or sportswear yet. Tap the heart icon on any gear card to save it here.
        </p>

        <NuxtLink
          to="/Product"
          class="mt-6 inline-flex rounded-xl bg-lime-400 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(183,243,74,0.4)] active:scale-95"
        >
          Explore Catalog &rarr;
        </NuxtLink>
      </div>

      <!-- WISHLIST PRODUCTS GRID -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard
          v-for="product in wishlist"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Recently Viewed Section -->
      <div class="mt-12">
        <RecentlyViewed />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWishlist } from "~/composables/useWishlist";
import { useCart } from "~/composables/useCart";
import { useToast } from "~/composables/useToast";
import ProductCard from "~/components/ProductCard.vue";
import RecentlyViewed from "~/components/RecentlyViewed.vue";

definePageMeta({
  layout: "user",
});

const { wishlist, clearWishlist } = useWishlist();
const { addToCart, openCartDrawer } = useCart();
const { success } = useToast();

const handleMoveAllToCart = () => {
  if (wishlist.value.length === 0) return;
  wishlist.value.forEach((prod) => {
    const size = prod.size?.[0] || "";
    addToCart(prod, 1, size, false);
  });
  success("Moved All Items!", `${wishlist.value.length} items added to your bag`);
  openCartDrawer();
};
</script>
