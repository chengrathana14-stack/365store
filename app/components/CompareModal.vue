<template>
  <Teleport to="body">
    <div
      v-if="isCompareModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300 overflow-y-auto"
      @click.self="closeCompareModal"
    >
      <div
        class="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-[#0d1017]/95 text-white shadow-2xl backdrop-blur-2xl flex flex-col max-h-[92vh]"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-black/50">
          <div class="flex items-center gap-3">
            <span class="h-6 w-1.5 rounded-full bg-lime-400 shadow-[0_0_10px_#b7f34a]"></span>
            <div>
              <h2 class="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                Technical Gear Comparison
              </h2>
              <p class="text-xs text-gray-400">Side-by-side performance specs & pricing matrix</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="clearCompare"
              class="text-xs font-bold text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition"
            >
              Clear All
            </button>

            <button
              type="button"
              @click="closeCompareModal"
              class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition hover:bg-white/20 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Comparison Table (Horizontally Scrollable) -->
        <div class="flex-1 overflow-x-auto overflow-y-auto p-6 custom-scrollbar">
          <div class="min-w-[650px]">
            <!-- Top Product Cards Row -->
            <div class="grid grid-cols-12 gap-4 pb-6 border-b border-white/10">
              <div class="col-span-3 flex flex-col justify-end text-xs font-black uppercase tracking-wider text-gray-400">
                Products ({{ comparedProducts.length }})
              </div>

              <div
                v-for="product in comparedProducts"
                :key="product.id"
                :class="colSpanClass"
                class="relative rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between"
              >
                <!-- Remove from compare -->
                <button
                  type="button"
                  @click="removeFromCompare(product.id)"
                  class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-gray-400 hover:bg-red-500 hover:text-white text-xs transition"
                  title="Remove from comparison"
                >
                  ✕
                </button>

                <!-- Thumbnail -->
                <div class="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-900 border border-white/10 mb-3">
                  <img :src="product.image" :alt="product.name" class="h-full w-full object-cover" />
                  <span
                    v-if="product.id === lowestPriceId"
                    class="absolute bottom-2 left-2 rounded-md bg-lime-400 px-2 py-0.5 text-[10px] font-black text-black tracking-wide shadow-md"
                  >
                    Best Value
                  </span>
                  <span
                    v-else-if="product.id === highestRatingId"
                    class="absolute bottom-2 left-2 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-black text-black tracking-wide shadow-md"
                  >
                    Top Rated ★
                  </span>
                </div>

                <div>
                  <span class="text-[10px] font-black uppercase text-lime-400">{{ product.brand }} · {{ product.category }}</span>
                  <h4 class="text-xs font-bold text-white leading-snug line-clamp-2 mt-0.5">{{ product.name }}</h4>
                </div>

                <!-- Add to Bag CTA in card -->
                <button
                  type="button"
                  @click="handleAddToCart(product)"
                  class="mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl bg-lime-400 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_15px_rgba(183,243,74,0.4)]"
                >
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>

            <!-- Price Row -->
            <div class="grid grid-cols-12 gap-4 py-4 border-b border-white/10 items-center">
              <div class="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Price
              </div>
              <div
                v-for="product in comparedProducts"
                :key="product.id"
                :class="colSpanClass"
                class="flex items-baseline gap-2"
              >
                <span
                  class="text-base font-black"
                  :class="product.id === lowestPriceId ? 'text-lime-400 drop-shadow-[0_0_8px_rgba(183,243,74,0.4)]' : 'text-white'"
                >
                  ${{ product.price.toFixed(2) }}
                </span>
                <span v-if="product.discount" class="text-xs text-gray-500 line-through">
                  ${{ (product.price / (1 - product.discount / 100)).toFixed(2) }}
                </span>
                <span v-if="product.discount" class="rounded bg-red-600/80 px-1 text-[10px] font-bold text-white">
                  -{{ product.discount }}%
                </span>
              </div>
            </div>

            <!-- Rating Row -->
            <div class="grid grid-cols-12 gap-4 py-4 border-b border-white/10 items-center">
              <div class="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Rating & Reviews
              </div>
              <div
                v-for="product in comparedProducts"
                :key="product.id"
                :class="colSpanClass"
                class="flex items-center gap-1.5 text-xs"
              >
                <div class="flex text-amber-400">★</div>
                <span class="font-bold text-white">{{ product.rating }}</span>
                <span class="text-gray-400 text-[11px]">({{ product.reviews }} reviews)</span>
              </div>
            </div>

            <!-- Sizes Row -->
            <div class="grid grid-cols-12 gap-4 py-4 border-b border-white/10 items-center">
              <div class="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Available Sizes
              </div>
              <div
                v-for="product in comparedProducts"
                :key="product.id"
                :class="colSpanClass"
                class="flex flex-wrap gap-1"
              >
                <span
                  v-for="s in product.size"
                  :key="s"
                  class="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-gray-300 border border-white/10"
                >
                  {{ s }}
                </span>
              </div>
            </div>

            <!-- Stock Availability -->
            <div class="grid grid-cols-12 gap-4 py-4 border-b border-white/10 items-center">
              <div class="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Stock Status
              </div>
              <div
                v-for="product in comparedProducts"
                :key="product.id"
                :class="colSpanClass"
                class="text-xs"
              >
                <span
                  v-if="product.stock > 0"
                  class="inline-flex items-center gap-1.5 text-emerald-400 font-bold"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  In Stock ({{ product.stock }})
                </span>
                <span v-else class="text-red-400 font-bold">Sold Out</span>
              </div>
            </div>

            <!-- Cushioning & Tech Row -->
            <div class="grid grid-cols-12 gap-4 py-4 border-b border-white/10 items-center">
              <div class="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Cushioning Tech
              </div>
              <div
                v-for="product in comparedProducts"
                :key="product.id"
                :class="colSpanClass"
                class="text-xs font-bold text-lime-400"
              >
                Ultra-Responsive Bounce
              </div>
            </div>

            <!-- Weight Spec -->
            <div class="grid grid-cols-12 gap-4 py-4 border-b border-white/10 items-center">
              <div class="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Avg. Weight
              </div>
              <div
                v-for="product in comparedProducts"
                :key="product.id"
                :class="colSpanClass"
                class="text-xs text-gray-300"
              >
                ~280 grams
              </div>
            </div>

            <!-- Authentic Warranty -->
            <div class="grid grid-cols-12 gap-4 py-4 items-center">
              <div class="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Authenticity
              </div>
              <div
                v-for="product in comparedProducts"
                :key="product.id"
                :class="colSpanClass"
                class="text-xs font-bold text-emerald-400 flex items-center gap-1"
              >
                <span>✓</span>
                <span>100% Genuine 365</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-white/10 px-6 py-4 bg-black/40 flex items-center justify-between text-xs text-gray-400">
          <span>Compare up to 4 items simultaneously</span>
          <button
            type="button"
            @click="closeCompareModal"
            class="text-xs font-bold text-lime-400 hover:underline"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "~/type/product";
import { useProductCompare } from "~/composables/useProductCompare";
import { useCart } from "~/composables/useCart";
import { useToast } from "~/composables/useToast";

const { comparedProducts, isCompareModalOpen, removeFromCompare, clearCompare, closeCompareModal } = useProductCompare();
const { addToCart } = useCart();
const { success } = useToast();

const colSpanClass = computed(() => {
  const count = comparedProducts.value.length;
  if (count === 2) return "col-span-4 sm:col-span-4";
  if (count === 3) return "col-span-3 sm:col-span-3";
  return "col-span-2 sm:col-span-2";
});

const lowestPriceId = computed(() => {
  if (comparedProducts.value.length === 0) return null;
  const sorted = [...comparedProducts.value].sort((a, b) => a.price - b.price);
  return sorted[0]?.id || null;
});

const highestRatingId = computed(() => {
  if (comparedProducts.value.length === 0) return null;
  const sorted = [...comparedProducts.value].sort((a, b) => b.rating - a.rating);
  return sorted[0]?.id || null;
});

const handleAddToCart = (product: Product) => {
  const defaultSize = product.size?.[0] || "";
  addToCart(product, 1, defaultSize);
  success("Added to Bag!", `${product.name} (Size: ${defaultSize})`);
};
</script>
