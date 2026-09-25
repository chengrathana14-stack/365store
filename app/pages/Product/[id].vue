<template>
  <div class="min-h-screen bg-[#f8f9fa] py-8 sm:py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Back Navigation -->
      <div class="mb-6">
        <NuxtLink
          to="/Product"
          class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 transition hover:-translate-x-0.5 hover:text-black"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Products</span>
        </NuxtLink>
      </div>

      <!-- Product Card Container -->
      <div
        v-if="product"
        class="overflow-hidden rounded-md border border-gray-200 bg-white shadow-xs"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <!-- IMAGES -->
          <div class="p-4 sm:p-6 lg:p-8 bg-gray-50/50">
            <!-- Main Image -->
            <div class="relative aspect-square w-full overflow-hidden rounded-md border border-gray-200/80 bg-white">
              <!-- Discount Badge -->
              <span
                v-if="product.discount"
                class="absolute left-3 top-3 z-10 rounded-xs bg-red-600 px-2 py-0.5 text-xs font-bold text-white tracking-wide shadow-xs"
              >
                -{{ product.discount }}%
              </span>

              <!-- New Badge -->
              <span
                v-if="product.isNew"
                class="absolute right-3 top-3 z-10 rounded-xs bg-black px-2 py-0.5 text-xs font-bold text-white tracking-wide shadow-xs"
              >
                NEW
              </span>

              <img
                :src="selectedImage || product.image"
                :alt="product.name"
                class="h-full w-full object-cover"
              />
            </div>

            <!-- Thumbnails -->
            <div class="mt-3 grid grid-cols-4 gap-3">
              <button
                type="button"
                @click="selectedImage = product.image"
                class="aspect-square overflow-hidden rounded-md border-2 bg-white transition"
                :class="
                  (selectedImage || product.image) === product.image
                    ? 'border-black'
                    : 'border-gray-200 hover:border-gray-400'
                "
              >
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="h-full w-full object-cover"
                />
              </button>

              <button
                v-if="product.hoverimg"
                type="button"
                @click="selectedImage = product.hoverimg"
                class="aspect-square overflow-hidden rounded-md border-2 bg-white transition"
                :class="
                  selectedImage === product.hoverimg
                    ? 'border-black'
                    : 'border-gray-200 hover:border-gray-400'
                "
              >
                <img
                  :src="product.hoverimg"
                  :alt="product.name"
                  class="h-full w-full object-cover"
                />
              </button>
            </div>
          </div>

          <!-- PRODUCT INFORMATION -->
          <div class="flex flex-col justify-between p-5 sm:p-8 lg:p-10">
            <div>
              <!-- Brand and Stock -->
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {{ product.brand }}
                </span>

                <span
                  v-if="product.stock > 0"
                  class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {{ product.stock }} in stock
                </span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600"
                >
                  Out of stock
                </span>
              </div>

              <!-- Name -->
              <h1 class="mt-2 text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {{ product.name }}
              </h1>

              <!-- Rating -->
              <div class="mt-3 flex items-center gap-2">
                <div class="flex items-center text-amber-400">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    class="h-4 w-4"
                    :class="star <= Math.round(product.rating) ? 'fill-amber-400' : 'fill-gray-200'"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
                <span class="text-xs font-bold text-gray-900">{{ product.rating }}</span>
                <span class="text-xs text-gray-400">({{ product.reviews }} reviews)</span>
              </div>

              <!-- Price -->
              <div class="mt-4 flex items-baseline gap-3">
                <span class="text-2xl sm:text-3xl font-black text-gray-900">
                  ${{ product.price.toFixed(2) }}
                </span>
                <span
                  v-if="product.discount"
                  class="text-sm sm:text-base text-gray-400 line-through"
                >
                  ${{ originalPrice }}
                </span>
              </div>

              <!-- Description -->
              <p class="mt-4 text-xs sm:text-sm leading-relaxed text-gray-600">
                {{ product.description }}
              </p>

              <!-- Spec Grid -->
              <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-md border border-gray-100 bg-gray-50/70 p-3 text-xs">
                <div>
                  <span class="block text-[10px] uppercase font-bold text-gray-400">Category</span>
                  <span class="mt-0.5 block font-semibold text-gray-800">{{ product.category }}</span>
                </div>
                <div>
                  <span class="block text-[10px] uppercase font-bold text-gray-400">Brand</span>
                  <span class="mt-0.5 block font-semibold text-gray-800">{{ product.brand }}</span>
                </div>
                <div>
                  <span class="block text-[10px] uppercase font-bold text-gray-400">Gender</span>
                  <span class="mt-0.5 block font-semibold text-gray-800">{{ product.gender }}</span>
                </div>
                <div>
                  <span class="block text-[10px] uppercase font-bold text-gray-400">Color</span>
                  <span class="mt-0.5 block font-semibold text-gray-800">{{ product.color }}</span>
                </div>
              </div>

              <!-- Size Selection -->
              <div class="mt-6">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-gray-900">Select Size</span>
                </div>
                <div class="mt-2.5 flex flex-wrap gap-2">
                  <button
                    v-for="size in product.size"
                    :key="size"
                    type="button"
                    @click="selectedSize = size"
                    class="min-w-12 rounded-md border px-3 py-1.5 text-xs font-semibold transition"
                    :class="
                      selectedSize === size
                        ? 'border-black bg-black text-lime-400 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-black'
                    "
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- Quantity Selector -->
              <div class="mt-5 flex items-center gap-4">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-900">Quantity</span>
                <div class="flex items-center rounded-md border border-gray-200 bg-white shadow-xs">
                  <button
                    type="button"
                    @click="decreaseQuantity"
                    class="px-3 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
                    :disabled="quantity <= 1"
                  >
                    &minus;
                  </button>
                  <span class="min-w-8 text-center text-xs font-bold text-gray-900">
                    {{ quantity }}
                  </span>
                  <button
                    type="button"
                    @click="increaseQuantity"
                    class="px-3 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
                    :disabled="quantity >= product.stock"
                  >
                    &#43;
                  </button>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 pt-6 border-t border-gray-100">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  :disabled="product.stock === 0 || !selectedSize"
                  @click="handleAddToCart"
                  class="flex h-11 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-xs font-bold uppercase tracking-wider text-gray-900 transition hover:border-black hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>{{ justAdded ? "Added!" : "Add to Cart" }}</span>
                </button>

                <button
                  type="button"
                  :disabled="product.stock === 0 || !selectedSize"
                  @click="handleBuyNow"
                  class="flex h-11 items-center justify-center gap-2 rounded-md bg-black text-xs font-bold uppercase tracking-wider text-white transition hover:bg-lime-400 hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:col-span-1"
                >
                  <span>Buy Now</span>
                </button>

                <button
                  type="button"
                  @click="handleWishlist"
                  class="flex h-11 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-xs font-semibold transition hover:border-gray-300 hover:bg-gray-50 active:scale-95"
                  :class="isFavorite(product.id) ? 'text-red-500' : 'text-gray-700'"
                >
                  <svg
                    class="h-4 w-4 transition-colors"
                    :class="isFavorite(product.id) ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <span>{{ isFavorite(product.id) ? "Wishlisted" : "Wishlist" }}</span>
                </button>
              </div>

              <!-- Trust Features with clean SVGs -->
              <div class="mt-6 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5 text-center">
                <div class="flex flex-col items-center">
                  <div class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span class="mt-1.5 text-[11px] font-bold text-gray-900">Fast Shipping</span>
                  <span class="text-[10px] text-gray-400">2-4 business days</span>
                </div>

                <div class="flex flex-col items-center">
                  <div class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span class="mt-1.5 text-[11px] font-bold text-gray-900">Easy Returns</span>
                  <span class="text-[10px] text-gray-400">30 days exchange</span>
                </div>

                <div class="flex flex-col items-center">
                  <div class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span class="mt-1.5 text-[11px] font-bold text-gray-900">Authentic Gear</span>
                  <span class="text-[10px] text-gray-400">100% original</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- NOT FOUND -->
      <div v-else class="rounded-md border border-gray-200 bg-white p-12 text-center shadow-xs">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="mt-4 text-base font-bold text-gray-900">Product Not Found</h2>
        <p class="mt-1 text-xs text-gray-500">The product you're looking for doesn't exist.</p>
        <NuxtLink
          to="/Product"
          class="mt-4 inline-block rounded-md bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-lime-400 hover:text-black"
        >
          Back to Products
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useWishlist } from "~/composables/useWishlist";
import { useCart } from "~/composables/useCart";
import { navigateTo } from "#app/composables/router";
import { products as fallbackProducts } from "~/data/product";
import type { Product } from "~/type/product";
import { useApiBase } from "~/composables/useApi";

definePageMeta({
  layout: "user",
});

const route = useRoute();
const apiBase = useApiBase();
const allProducts = ref<Product[]>(fallbackProducts);

const loadProducts = async () => {
  try {
    const res = await fetch(`${apiBase}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allProducts.value = data.map((p: any) => ({
          ...p,
          id: Number(p.id),
        }));
      }
    }
  } catch (error) {
    console.error("Failed to fetch product details:", error);
  }
};

onMounted(() => {
  loadProducts();
});

const product = computed(() => {
  return allProducts.value.find((item) => String(item.id) === String(route.params.id));
});

const selectedImage = ref("");
const selectedSize = ref("");
const quantity = ref(1);
const justAdded = ref(false);

const { isFavorite, toggleWishlist } = useWishlist();
const { addToCart } = useCart() as any;

const originalPrice = computed(() => {
  if (!product.value?.discount) {
    return (product.value?.price || 0).toFixed(2);
  }
  return (product.value.price / (1 - product.value.discount / 100)).toFixed(2);
});

const increaseQuantity = () => {
  if (!product.value) return;
  if (quantity.value < product.value.stock) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = () => {
  if (!product.value) return;
  if (!selectedSize.value) {
    if (product.value.size && product.value.size.length > 0) {
      selectedSize.value = product.value.size[0] ?? "";
    }
  }

  addToCart(product.value, quantity.value, selectedSize.value);
  justAdded.value = true;
  setTimeout(() => {
    justAdded.value = false;
  }, 2000);
};

const handleWishlist = () => {
  if (!product.value) return;
  toggleWishlist(product.value);
};

const handleBuyNow = () => {
  if (!product.value) return;
  if (!selectedSize.value) {
    if (product.value.size && product.value.size.length > 0) {
      selectedSize.value = product.value.size[0] ?? "";
    }
  }
  addToCart(product.value, quantity.value, selectedSize.value);
  navigateTo("/Order");
};
</script>
