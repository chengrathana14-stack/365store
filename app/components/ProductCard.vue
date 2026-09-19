<template>
  <div
    class="group relative flex flex-col w-full overflow-hidden rounded-2xl bg-[#0d1017]/85 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(183,243,74,0.2)] hover:-translate-y-1.5 hover:border-lime-400/60 shimmer-effect"
  >
    <!-- Top Image Container -->
    <div class="relative block w-full aspect-square overflow-hidden bg-neutral-900/70 rounded-t-2xl">
      <!-- Badges -->
      <div class="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        <span
          v-if="product.discount"
          class="inline-flex items-center rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-black text-white tracking-wide shadow-md"
        >
          -{{ product.discount }}%
        </span>
        <span
          v-if="product.isNew"
          class="inline-flex items-center rounded-md bg-lime-400 px-2 py-0.5 text-[11px] font-black text-black tracking-wide shadow-md"
        >
          NEW
        </span>
      </div>

      <!-- Wishlist Button -->
      <button
        type="button"
        @click.stop.prevent="toggleWishlist(product)"
        class="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-white/15 backdrop-blur-md shadow-xs transition-transform duration-150 hover:scale-110 hover:bg-black active:scale-95"
        :title="isFavorite(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="h-4 w-4 transition-colors"
          :class="
            isFavorite(product.id)
              ? 'fill-red-500 stroke-red-500'
              : 'fill-none stroke-gray-300 hover:stroke-white'
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
          class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          loading="lazy"
        />
      </NuxtLink>

      <!-- Quick Check Detail Button (appears on card hover) -->
      <div class="absolute inset-x-3 bottom-3 z-20 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
        <button
          type="button"
          @click.stop.prevent="openQuickDetail(product)"
          class="w-full flex items-center justify-center gap-1.5 rounded-xl bg-black/90 py-2.5 text-xs font-black uppercase tracking-wider text-lime-400 shadow-xl border border-white/20 backdrop-blur-md transition hover:bg-lime-400 hover:text-black hover:border-lime-400"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Check Details</span>
        </button>
      </div>
    </div>

    <!-- Product Details -->
    <div class="flex flex-1 flex-col p-4 text-white">
      <!-- Brand & Rating row -->
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-black uppercase tracking-widest text-lime-400/90">
          {{ product.brand }} · {{ product.category }}
        </span>

        <div class="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
          <svg class="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <span>{{ product.rating }}</span>
        </div>
      </div>

      <!-- Title -->
      <NuxtLink :to="`/Product/${product.id}`" class="mt-1.5 block">
        <h3
          class="text-sm font-bold text-white leading-snug line-clamp-1 transition hover:text-lime-400"
          :title="product.name"
        >
          {{ product.name }}
        </h3>
      </NuxtLink>

      <!-- Price in Glowing Lime -->
      <div class="mt-2.5 flex items-baseline gap-2">
        <span class="text-base sm:text-lg font-black text-lime-400 drop-shadow-[0_0_8px_rgba(183,243,74,0.3)]">
          ${{ product.price.toFixed(2) }}
        </span>
        <span
          v-if="product.discount"
          class="text-xs text-gray-400 line-through"
        >
          ${{ originalPrice }}
        </span>
        <span
          v-if="product.stock === 0"
          class="ml-auto text-[10px] font-bold uppercase tracking-wider text-red-400"
        >
          Sold Out
        </span>
      </div>

      <!-- Buttons: Add to Cart & Instant QR Buy -->
      <div class="mt-3.5 grid grid-cols-2 gap-2">
        <button
          type="button"
          :disabled="product.stock === 0"
          @click="handleAddToCart"
          class="flex h-8.5 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[11px] font-bold text-white transition hover:bg-white/15 hover:border-white/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ justAdded ? "✓ Added" : "Add to Cart" }}
        </button>

        <button
          type="button"
          :disabled="product.stock === 0"
          @click="handleInstantQr"
          class="flex h-8.5 items-center justify-center gap-1 rounded-xl bg-lime-400 text-[11px] font-black uppercase text-black transition hover:bg-lime-300 hover:shadow-[0_0_15px_rgba(183,243,74,0.4)] active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
        >
          <span>⚡ QR Pay</span>
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
import { useQuickDetail } from "~/composables/useQuickDetail";
import { useQrPayment } from "~/composables/useQrPayment";
import { useToast } from "~/composables/useToast";

const props = defineProps<{
  product: Product;
}>();

const isHovered = ref(false);
const justAdded = ref(false);

const { isFavorite, toggleWishlist } = useWishlist();
const { addToCart } = useCart();
const { openQuickDetail } = useQuickDetail();
const { openQrPayment } = useQrPayment();
const { success } = useToast();

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
  success("Added to Cart!", `${props.product.name} (Size: ${defaultSize})`);

  justAdded.value = true;
  setTimeout(() => {
    justAdded.value = false;
  }, 1400);
};

const handleInstantQr = () => {
  if (props.product.stock <= 0) return;
  const defaultSize = props.product.size?.[0] || "";
  openQrPayment({
    items: [
      {
        product: props.product,
        quantity: 1,
        size: defaultSize,
      },
    ],
    subtotal: props.product.price,
    shipping: 0,
    total: props.product.price,
  });
};
</script>
