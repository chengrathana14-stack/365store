<template>
  <section v-if="recentlyViewed.length > 0" class="py-12 border-t border-white/10 relative">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="h-5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]"></span>
          <h3 class="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
            Recently Viewed Gear
          </h3>
        </div>

        <button
          type="button"
          @click="clearRecentlyViewed"
          class="text-xs font-bold text-gray-500 hover:text-white transition"
        >
          Clear History
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="product in recentlyViewed"
          :key="product.id"
          class="group relative flex flex-col rounded-2xl border border-white/10 bg-[#0d1017]/80 p-3 transition hover:border-lime-400/50 hover:-translate-y-1 hover:shadow-lg"
        >
          <NuxtLink :to="`/Product/${product.id}`" class="block aspect-square w-full overflow-hidden rounded-xl bg-neutral-900 border border-white/10 mb-2">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-cover transition duration-300 group-hover:scale-108"
            />
          </NuxtLink>

          <div class="flex flex-1 flex-col justify-between">
            <div>
              <span class="text-[9px] font-black uppercase text-lime-400">{{ product.brand }}</span>
              <NuxtLink :to="`/Product/${product.id}`" class="block">
                <h4 class="text-xs font-bold text-white line-clamp-1 group-hover:text-lime-400 transition" :title="product.name">
                  {{ product.name }}
                </h4>
              </NuxtLink>
            </div>

            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-xs font-black text-lime-400">${{ product.price.toFixed(2) }}</span>
              <button
                type="button"
                @click="quickAdd(product)"
                class="rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold text-white hover:bg-lime-400 hover:text-black transition"
              >
                + Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { Product } from "~/type/product";
import { useRecentlyViewed } from "~/composables/useRecentlyViewed";
import { useCart } from "~/composables/useCart";
import { useToast } from "~/composables/useToast";

const { recentlyViewed, loadRecentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
const { addToCart } = useCart();
const { success } = useToast();

const quickAdd = (product: Product) => {
  const defaultSize = product.size?.[0] || "";
  addToCart(product, 1, defaultSize);
  success("Added to Bag!", `${product.name} (Size: ${defaultSize})`);
};

onMounted(() => {
  loadRecentlyViewed();
});
</script>
