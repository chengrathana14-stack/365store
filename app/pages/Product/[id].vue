<template>
  <div class="min-h-screen py-8 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Back Navigation & Breadcrumb -->
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink
          to="/Product"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 transition hover:-translate-x-1 hover:text-black"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Catalog</span>
        </NuxtLink>

        <!-- QR Quick Indicator -->
        <div class="flex items-center gap-1.5 rounded-full border border-lime-500/30 bg-lime-400/10 px-3 py-1 text-[11px] font-bold text-lime-700">
          <span class="h-2 w-2 rounded-full bg-lime-500 animate-pulse"></span>
          <span>Instant KHQR / Bakong Ready</span>
        </div>
      </div>

      <!-- Main Product Container -->
      <div
        v-if="product"
        class="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-md shadow-lg"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12">
          <!-- LEFT: Interactive Image Gallery (5 cols) -->
          <div class="lg:col-span-6 p-5 sm:p-8 bg-neutral-50/60 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200/70">
            <!-- Main Zoomable Image -->
            <div class="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm group">
              <!-- Discount Badge -->
              <span
                v-if="product.discount"
                class="absolute left-3.5 top-3.5 z-10 rounded-md bg-red-600 px-2.5 py-1 text-xs font-black text-white tracking-wide shadow-md"
              >
                -{{ product.discount }}% OFF
              </span>

              <!-- New Badge -->
              <span
                v-if="product.isNew"
                class="absolute right-3.5 top-3.5 z-10 rounded-md bg-black px-2.5 py-1 text-xs font-black text-white tracking-wide shadow-md"
              >
                NEW ARRIVAL
              </span>

              <img
                :src="selectedImage || product.image"
                :alt="product.name"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <!-- Thumbnail Carousel / Switcher -->
            <div class="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
              <button
                type="button"
                @click="selectedImage = product.image"
                class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition duration-150"
                :class="
                  (selectedImage || product.image) === product.image
                    ? 'border-black ring-2 ring-lime-400'
                    : 'border-gray-200 hover:border-gray-400'
                "
              >
                <img :src="product.image" :alt="product.name" class="h-full w-full object-cover" />
              </button>

              <button
                v-if="product.hoverimg"
                type="button"
                @click="selectedImage = product.hoverimg"
                class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition duration-150"
                :class="
                  selectedImage === product.hoverimg
                    ? 'border-black ring-2 ring-lime-400'
                    : 'border-gray-200 hover:border-gray-400'
                "
              >
                <img :src="product.hoverimg" :alt="product.name" class="h-full w-full object-cover" />
              </button>

              <template v-if="product.images && product.images.length">
                <button
                  v-for="(img, idx) in product.images"
                  :key="idx"
                  type="button"
                  @click="selectedImage = img"
                  class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition duration-150"
                  :class="
                    selectedImage === img
                      ? 'border-black ring-2 ring-lime-400'
                      : 'border-gray-200 hover:border-gray-400'
                  "
                >
                  <img :src="img" :alt="product.name" class="h-full w-full object-cover" />
                </button>
              </template>
            </div>
          </div>

          <!-- RIGHT: Product Info & Buy/QR Panel (7 cols) -->
          <div class="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10">
            <div>
              <!-- Brand & Stock Status -->
              <div class="flex items-center justify-between">
                <span class="text-xs font-black uppercase tracking-widest text-gray-500">
                  {{ product.brand }} · {{ product.category }}
                </span>

                <span
                  v-if="product.stock > 0"
                  class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700"
                >
                  <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {{ product.stock }} items available
                </span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-600"
                >
                  Sold out
                </span>
              </div>

              <!-- Product Title -->
              <h1 class="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                {{ product.name }}
              </h1>

              <!-- Star Rating & Review count -->
              <div class="mt-3 flex items-center gap-3">
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
                <span class="text-sm font-bold text-gray-900">{{ product.rating }}</span>
                <span class="text-xs text-gray-500">({{ product.reviews }} verified reviews)</span>
                <span class="text-gray-300">|</span>
                <span class="text-xs font-semibold text-emerald-600">✓ In Stock</span>
              </div>

              <!-- Price Box -->
              <div class="mt-5 flex items-baseline gap-3 rounded-xl bg-neutral-50 p-4 border border-gray-200/70">
                <span class="text-3xl sm:text-4xl font-black text-gray-950">
                  ${{ product.price.toFixed(2) }}
                </span>
                <span
                  v-if="product.discount"
                  class="text-base text-gray-400 line-through font-semibold"
                >
                  ${{ originalPrice }}
                </span>
                <span class="text-xs font-bold text-gray-500 ml-auto">
                  ≈ {{ (product.price * 4100).toLocaleString() }} KHR
                </span>
              </div>

              <!-- Short Description -->
              <p class="mt-4 text-xs sm:text-sm leading-relaxed text-gray-600">
                {{ product.description }}
              </p>

              <!-- Size Selection -->
              <div class="mt-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-black uppercase tracking-wider text-gray-900">
                    Select Size <span v-if="selectedSize" class="text-lime-600">({{ selectedSize }})</span>
                  </span>
                  <button
                    type="button"
                    @click="showSizeGuide = !showSizeGuide"
                    class="text-xs font-bold text-gray-600 underline hover:text-black"
                  >
                    Size Guide
                  </button>
                </div>

                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="size in product.size"
                    :key="size"
                    type="button"
                    @click="selectedSize = size"
                    class="min-w-12 h-10 rounded-lg border text-xs font-black transition flex items-center justify-center"
                    :class="
                      selectedSize === size
                        ? 'border-black bg-black text-lime-400 shadow-md ring-2 ring-lime-400'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-black'
                    "
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- Size Guide Drawer / Notice -->
              <div
                v-if="showSizeGuide"
                class="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700"
              >
                <p class="font-bold text-gray-900 mb-1">Standard Shoe & Apparel Size Matrix:</p>
                <div class="grid grid-cols-4 gap-2 text-[11px] text-center font-mono">
                  <div class="bg-white p-1 rounded border border-gray-200">US 7 = 40 EU</div>
                  <div class="bg-white p-1 rounded border border-gray-200">US 8 = 41 EU</div>
                  <div class="bg-white p-1 rounded border border-gray-200">US 9 = 42.5 EU</div>
                  <div class="bg-white p-1 rounded border border-gray-200">US 10 = 44 EU</div>
                </div>
              </div>

              <!-- Quantity Selector -->
              <div class="mt-6 flex items-center gap-4">
                <span class="text-xs font-black uppercase tracking-wider text-gray-900">Quantity</span>
                <div class="flex items-center rounded-lg border border-gray-200 bg-white shadow-xs">
                  <button
                    type="button"
                    @click="decreaseQuantity"
                    class="px-3.5 py-1.5 text-base font-bold text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
                    :disabled="quantity <= 1"
                  >
                    −
                  </button>
                  <span class="min-w-10 text-center text-xs font-black text-gray-950">
                    {{ quantity }}
                  </span>
                  <button
                    type="button"
                    @click="increaseQuantity"
                    class="px-3.5 py-1.5 text-base font-bold text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
                    :disabled="quantity >= product.stock"
                  >
                    +
                  </button>
                </div>
                <span class="text-xs text-gray-500">
                  Subtotal: <strong class="text-gray-900">${{ (product.price * quantity).toFixed(2) }}</strong>
                </span>
              </div>
            </div>

            <!-- PRIMARY ACTIONS: BUY NOW WITH QR + ADD TO CART -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <div class="flex flex-col sm:flex-row gap-3">
                <!-- ⚡ INSTANT BUY WITH QR (PROMINENT HIGHLIGHT) -->
                <button
                  type="button"
                  :disabled="product.stock === 0"
                  @click="handleInstantQr"
                  class="flex-1 flex h-13 items-center justify-center gap-2.5 rounded-xl bg-lime-400 px-6 font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/20 transition hover:bg-lime-300 hover:scale-[1.02] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span class="text-base">⚡</span>
                  <span class="text-sm">Instant Buy with QR</span>
                </button>

                <!-- ADD TO CART -->
                <button
                  type="button"
                  :disabled="product.stock === 0"
                  @click="handleAddToCart"
                  class="flex-1 flex h-13 items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-6 text-sm font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>{{ justAdded ? "✓ Added!" : "Add to Cart" }}</span>
                </button>

                <!-- WISHLIST -->
                <button
                  type="button"
                  @click="handleWishlist"
                  class="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:border-black active:scale-95"
                  :class="isFavorite(product.id) ? 'text-red-500 border-red-200' : 'text-gray-700'"
                  :title="isFavorite(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
                >
                  <svg
                    class="h-5 w-5 transition-colors"
                    :class="isFavorite(product.id) ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

              <!-- Trust Features with clean SVGs -->
              <div class="mt-6 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5 text-center">
                <div class="flex flex-col items-center">
                  <span class="text-lg">⚡</span>
                  <span class="mt-1 text-[11px] font-black text-gray-900">KHQR Payment</span>
                  <span class="text-[10px] text-gray-500">Scan & pay in 5s</span>
                </div>

                <div class="flex flex-col items-center">
                  <span class="text-lg">🚚</span>
                  <span class="mt-1 text-[11px] font-black text-gray-900">Fast Delivery</span>
                  <span class="text-[10px] text-gray-500">1-2 days in PP</span>
                </div>

                <div class="flex flex-col items-center">
                  <span class="text-lg">🛡️</span>
                  <span class="mt-1 text-[11px] font-black text-gray-900">100% Genuine</span>
                  <span class="text-[10px] text-gray-500">Authentic gear</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SPECIFICATIONS & REVIEWS TABS SECTION -->
        <div class="border-t border-gray-200 bg-white p-6 sm:p-10">
          <div class="flex border-b border-gray-200 gap-6 text-sm font-black uppercase tracking-wider mb-6">
            <button
              type="button"
              @click="activeTab = 'specs'"
              class="pb-3 transition relative"
              :class="activeTab === 'specs' ? 'text-black' : 'text-gray-400 hover:text-black'"
            >
              <span>Product Specifications</span>
              <span v-if="activeTab === 'specs'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-500"></span>
            </button>

            <button
              type="button"
              @click="activeTab = 'reviews'"
              class="pb-3 transition relative"
              :class="activeTab === 'reviews' ? 'text-black' : 'text-gray-400 hover:text-black'"
            >
              <span>Verified Customer Reviews ({{ product.reviews }})</span>
              <span v-if="activeTab === 'reviews'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-500"></span>
            </button>
          </div>

          <!-- Specs Tab -->
          <div v-if="activeTab === 'specs'" class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div class="rounded-xl border border-gray-200/80 bg-neutral-50 p-3.5">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Category</span>
              <span class="mt-1 block font-bold text-gray-900 text-sm">{{ product.category }}</span>
            </div>
            <div class="rounded-xl border border-gray-200/80 bg-neutral-50 p-3.5">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Brand</span>
              <span class="mt-1 block font-bold text-gray-900 text-sm">{{ product.brand }}</span>
            </div>
            <div class="rounded-xl border border-gray-200/80 bg-neutral-50 p-3.5">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Gender</span>
              <span class="mt-1 block font-bold text-gray-900 text-sm">{{ product.gender }}</span>
            </div>
            <div class="rounded-xl border border-gray-200/80 bg-neutral-50 p-3.5">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Colorway</span>
              <span class="mt-1 block font-bold text-gray-900 text-sm">{{ product.color }}</span>
            </div>
            <div class="rounded-xl border border-gray-200/80 bg-neutral-50 p-3.5">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Arch Support</span>
              <span class="mt-1 block font-bold text-gray-900 text-sm">Neutral / Responsive</span>
            </div>
            <div class="rounded-xl border border-gray-200/80 bg-neutral-50 p-3.5">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Weight</span>
              <span class="mt-1 block font-bold text-gray-900 text-sm">approx. 280g (Size 9)</span>
            </div>
            <div class="rounded-xl border border-gray-200/80 bg-neutral-50 p-3.5">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Warranty</span>
              <span class="mt-1 block font-bold text-gray-900 text-sm">6 Months Official</span>
            </div>
            <div class="rounded-xl border border-gray-200/80 bg-neutral-50 p-3.5">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Authenticity</span>
              <span class="mt-1 block font-bold text-emerald-600 text-sm">100% Guaranteed</span>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-else class="space-y-4">
            <div class="rounded-xl border border-gray-200 bg-neutral-50 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-gray-900 text-sm">Rothana C.</span>
                  <span class="ml-2 inline-flex items-center text-[11px] font-bold text-emerald-600">✓ Verified Buyer</span>
                </div>
                <div class="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <p class="mt-2 text-xs text-gray-600 leading-relaxed">
                Super fast delivery! Paid using KHQR Bakong in less than 10 seconds. The shoes fit true to size and the cushioning is top-tier.
              </p>
            </div>

            <div class="rounded-xl border border-gray-200 bg-neutral-50 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-gray-900 text-sm">Vannthai K.</span>
                  <span class="ml-2 inline-flex items-center text-[11px] font-bold text-emerald-600">✓ Verified Buyer</span>
                </div>
                <div class="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <p class="mt-2 text-xs text-gray-600 leading-relaxed">
                Great quality. The design looks even better in real life than on the photos. Definitely shopping here again!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- PRODUCT NOT FOUND STATE -->
      <div v-else class="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          ✕
        </div>
        <h2 class="mt-4 text-base font-bold text-gray-900">Product Not Found</h2>
        <p class="mt-1 text-xs text-gray-500">The product you are looking for does not exist.</p>
        <NuxtLink
          to="/Product"
          class="mt-4 inline-block rounded-xl bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-lime-400 hover:text-black"
        >
          Back to Catalog
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
import { useQrPayment } from "~/composables/useQrPayment";
import { useToast } from "~/composables/useToast";
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
        allProducts.value = data;
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
  return allProducts.value.find((item) => item.id === Number(route.params.id));
});

const selectedImage = ref("");
const selectedSize = ref("");
const quantity = ref(1);
const justAdded = ref(false);
const showSizeGuide = ref(false);
const activeTab = ref<"specs" | "reviews">("specs");

const { isFavorite, toggleWishlist } = useWishlist();
const { addToCart } = useCart();
const { openQrPayment } = useQrPayment();
const { success } = useToast();

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
  const sizeToUse = selectedSize.value || product.value.size?.[0] || "";
  addToCart(product.value, quantity.value, sizeToUse);
  success("Added to Cart!", `${quantity.value}x ${product.value.name} (Size: ${sizeToUse})`);

  justAdded.value = true;
  setTimeout(() => {
    justAdded.value = false;
  }, 1800);
};

const handleWishlist = () => {
  if (!product.value) return;
  toggleWishlist(product.value);
};

const handleInstantQr = () => {
  if (!product.value) return;
  const sizeToUse = selectedSize.value || product.value.size?.[0] || "";
  const total = product.value.price * quantity.value;

  openQrPayment({
    items: [
      {
        product: product.value,
        quantity: quantity.value,
        size: sizeToUse,
      },
    ],
    subtotal: total,
    shipping: 0,
    total: total,
  });
};
</script>
