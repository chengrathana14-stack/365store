<template>
  <div class="min-h-screen pt-10 pb-24 sm:pt-8 sm:pb-16 lg:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Back Navigation & Breadcrumb -->
      <div class="mb-5 sm:mb-6 flex items-center justify-between">
        <NuxtLink
          to="/Product"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-400 transition hover:-translate-x-1 hover:text-white"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Catalog</span>
        </NuxtLink>

        <!-- QR Quick Indicator -->
        <div class="flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3.5 py-1 text-xs font-black uppercase text-lime-400 shadow-[0_0_12px_rgba(183,243,74,0.2)]">
          <span class="h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
          <span>KHQR · Bakong Instant Checkout</span>
        </div>
      </div>

      <!-- Main Product Container -->
      <div
        v-if="product"
        class="mt-3 mb-14 sm:mt-0 sm:mb-12 overflow-hidden rounded-3xl border border-white/10 bg-[#0d1017]/85 backdrop-blur-2xl shadow-2xl text-white"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12">
          <!-- LEFT: Interactive Image Gallery (6 cols) -->
          <div class="lg:col-span-6 p-6 sm:p-10 bg-black/40 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            <!-- Main Zoomable Image -->
            <div
              @click="openZoom"
              class="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-xl group cursor-zoom-in select-none"
              title="Click or tap to zoom image"
            >
              <!-- Discount Badge -->
              <span
                v-if="product.discount"
                class="absolute left-4 top-4 z-10 rounded-lg bg-red-600 px-3 py-1 text-xs font-black text-white tracking-wide shadow-lg"
              >
                -{{ product.discount }}% OFF
              </span>

              <!-- New Badge -->
              <span
                v-if="product.isNew"
                class="absolute right-4 top-4 z-10 rounded-lg bg-lime-400 px-3 py-1 text-xs font-black text-black tracking-wide shadow-lg shadow-lime-400/30"
              >
                NEW GEAR
              </span>

              <!-- Tap to Zoom Hint Button -->
              <button
                type="button"
                @click.stop="openZoom"
                class="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-lime-400 hover:text-black hover:border-lime-400 shadow-lg active:scale-95"
              >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                <span>Tap to Zoom</span>
              </button>

              <img
                :src="selectedImage || product.image"
                :alt="product.name"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
            </div>

            <!-- Thumbnail Carousel / Switcher -->
            <div class="mt-5 flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
              <button
                type="button"
                @click="selectedImage = product.image"
                class="h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-900 transition duration-200"
                :class="
                  (selectedImage || product.image) === product.image
                    ? 'border-lime-400 ring-2 ring-lime-400/40 shadow-[0_0_12px_rgba(183,243,74,0.3)]'
                    : 'border-white/15 hover:border-white/40'
                "
              >
                <img :src="product.image" :alt="product.name" class="h-full w-full object-cover" />
              </button>

              <button
                v-if="product.hoverimg"
                type="button"
                @click="selectedImage = product.hoverimg"
                class="h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-900 transition duration-200"
                :class="
                  selectedImage === product.hoverimg
                    ? 'border-lime-400 ring-2 ring-lime-400/40 shadow-[0_0_12px_rgba(183,243,74,0.3)]'
                    : 'border-white/15 hover:border-white/40'
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
                  class="h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-900 transition duration-200"
                  :class="
                    selectedImage === img
                      ? 'border-lime-400 ring-2 ring-lime-400/40 shadow-[0_0_12px_rgba(183,243,74,0.3)]'
                      : 'border-white/15 hover:border-white/40'
                  "
                >
                  <img :src="img" :alt="product.name" class="h-full w-full object-cover" />
                </button>
              </template>
            </div>
          </div>

          <!-- RIGHT: Product Info & Buy/QR Panel (6 cols) -->
          <div class="lg:col-span-6 flex flex-col justify-between p-6 pt-8 pb-10 sm:p-10">
            <div>
              <!-- Brand & Stock Status -->
              <div class="flex items-center justify-between">
                <span class="text-xs font-black uppercase tracking-widest text-lime-400">
                  {{ product.brand }} · {{ product.category }}
                </span>

                <span
                  v-if="product.stock > 0"
                  class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400"
                >
                  <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {{ product.stock }} in stock
                </span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-400"
                >
                  Sold out
                </span>
              </div>

              <!-- Product Title -->
              <h1 class="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {{ product.name }}
              </h1>

              <!-- Star Rating & Review count -->
              <div class="mt-3 flex items-center gap-3 text-xs">
                <div class="flex items-center text-amber-400">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    class="h-4 w-4"
                    :class="star <= Math.round(product.rating) ? 'fill-amber-400' : 'fill-gray-700'"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
                <span class="font-bold text-white">{{ product.rating }}</span>
                <span class="text-gray-400">({{ product.reviews }} verified reviews)</span>
                <span class="text-gray-600">|</span>
                <span class="font-bold text-emerald-400">Authentic 365 Gear</span>
              </div>

              <!-- Price Box with Glowing Accent -->
              <div class="mt-6 flex items-baseline gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <span class="text-3xl sm:text-4xl font-black text-lime-400 drop-shadow-[0_0_12px_rgba(183,243,74,0.4)]">
                  ${{ product.price.toFixed(2) }}
                </span>
                <span
                  v-if="product.discount"
                  class="text-lg text-gray-500 line-through font-bold"
                >
                  ${{ originalPrice }}
                </span>
                <span class="text-xs font-bold text-gray-400 ml-auto">
                  ≈ {{ (product.price * 4100).toLocaleString() }} KHR
                </span>
              </div>

              <!-- Description -->
              <p class="mt-4 text-xs sm:text-sm leading-relaxed text-gray-300">
                {{ product.description }}
              </p>

              <!-- Size Selection -->
              <div class="mt-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-black uppercase tracking-wider text-white">
                    Select Size <span v-if="selectedSize" class="text-lime-400">({{ selectedSize }})</span>
                  </span>
                  <button
                    type="button"
                    @click="showSizeGuide = !showSizeGuide"
                    class="text-xs font-bold text-gray-400 underline hover:text-white"
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
                    class="min-w-12 h-11 rounded-xl border text-xs font-black transition flex items-center justify-center"
                    :class="
                      selectedSize === size
                        ? 'border-lime-400 bg-lime-400 text-black shadow-[0_0_15px_rgba(183,243,74,0.35)]'
                        : 'border-white/15 bg-white/5 text-gray-300 hover:border-lime-400/60 hover:text-white'
                    "
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- Size Guide Drawer -->
              <div
                v-if="showSizeGuide"
                class="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300"
              >
                <p class="font-bold text-white mb-2">Standard Shoe Size Conversion:</p>
                <div class="grid grid-cols-4 gap-2 text-[11px] text-center font-mono">
                  <div class="bg-black/50 p-2 rounded-lg border border-white/10">US 7 = 40 EU</div>
                  <div class="bg-black/50 p-2 rounded-lg border border-white/10">US 8 = 41 EU</div>
                  <div class="bg-black/50 p-2 rounded-lg border border-white/10">US 9 = 42.5 EU</div>
                  <div class="bg-black/50 p-2 rounded-lg border border-white/10">US 10 = 44 EU</div>
                </div>
              </div>

              <!-- Quantity Selector -->
              <div class="mt-6 flex items-center gap-4">
                <span class="text-xs font-black uppercase tracking-wider text-white">Quantity</span>
                <div class="flex items-center rounded-xl border border-white/15 bg-white/5">
                  <button
                    type="button"
                    @click="decreaseQuantity"
                    class="px-4 py-2 text-base font-bold text-gray-300 transition hover:text-white disabled:opacity-30"
                    :disabled="quantity <= 1"
                  >
                    −
                  </button>
                  <span class="min-w-10 text-center text-xs font-black text-white">
                    {{ quantity }}
                  </span>
                  <button
                    type="button"
                    @click="increaseQuantity"
                    class="px-4 py-2 text-base font-bold text-gray-300 transition hover:text-white disabled:opacity-30"
                    :disabled="quantity >= product.stock"
                  >
                    +
                  </button>
                </div>
                <span class="text-xs text-gray-400">
                  Subtotal: <strong class="text-lime-400">${{ (product.price * quantity).toFixed(2) }}</strong>
                </span>
              </div>
            </div>

            <!-- PRIMARY ACTIONS: BUY NOW OR PRE-ORDER -->
            <div class="mt-8 pt-6 border-t border-white/10">
              <!-- When OUT OF STOCK (stock === 0) -->
              <div v-if="product.stock === 0" class="space-y-4">
                <div class="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
                  <div class="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <span class="h-2 w-2 rounded-full bg-amber-400"></span>
                    <span>Currently Sold Out Online</span>
                  </div>
                  <p class="text-[11px] text-gray-300 mt-1">
                    This gear is currently sold out online. You can place a pre-order reservation to secure your pair once restocked!
                  </p>
                </div>

                <!-- Pre-Order Modal Trigger -->
                <button
                  type="button"
                  @click="openPreOrderModal"
                  class="w-full flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-lime-400 px-6 font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/30 transition hover:bg-lime-300 hover:scale-[1.01] active:scale-98"
                >
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span class="text-xs sm:text-sm font-black uppercase tracking-wider">Reserve / Pre-Order</span>
                </button>
              </div>

              <!-- When IN STOCK (stock > 0) -->
              <div v-else class="flex flex-col sm:flex-row gap-3">
                <!-- BUY NOW -->
                <button
                  type="button"
                  @click="handleBuyNow"
                  class="flex-1 flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-lime-400 px-6 font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/30 transition hover:bg-lime-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(183,243,74,0.5)] active:scale-98"
                >
                  <span class="text-sm font-black uppercase tracking-wider">Buy Now</span>
                </button>

                <!-- ADD TO CART -->
                <button
                  type="button"
                  @click="handleAddToCart"
                  class="flex-1 flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 text-sm font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20 hover:border-lime-400/50 active:scale-98"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>{{ justAdded ? "✓ Added!" : "Add to Cart" }}</span>
                </button>
              </div>

              <!-- Shared Secondary Actions: Wishlist & Compare -->
              <div class="mt-3 flex gap-3">

                <!-- WISHLIST -->
                <button
                  type="button"
                  @click="handleWishlist"
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 transition hover:border-white/40 active:scale-95"
                  :class="isFavorite(product.id) ? 'text-red-400 border-red-500/40' : 'text-gray-400'"
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

                <!-- COMPARE -->
                <button
                  type="button"
                  @click="toggleCompare(product)"
                  class="flex h-14 items-center justify-center gap-2 rounded-2xl border px-4 text-xs font-black uppercase tracking-wider transition active:scale-95 shrink-0"
                  :class="isInCompare(product.id) ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_15px_rgba(183,243,74,0.4)]' : 'border-white/15 bg-white/5 text-gray-300 hover:border-white/40 hover:text-white'"
                  :title="isInCompare(product.id) ? 'Remove from comparison' : 'Compare technical specs'"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                  <span class="hidden sm:inline">{{ isInCompare(product.id) ? "In Compare" : "Compare" }}</span>
                </button>
              </div>

              <!-- Trust Features -->
              <div class="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                <div class="flex flex-col items-center">
                  <span class="text-xl">⚡</span>
                  <span class="mt-1 text-[11px] font-black text-white">Card or KHQR</span>
                  <span class="text-[10px] text-gray-400">Instant Checkout</span>
                </div>

                <div class="flex flex-col items-center">
                  <span class="text-xl">🚚</span>
                  <span class="mt-1 text-[11px] font-black text-white">Fast Delivery</span>
                  <span class="text-[10px] text-gray-400">1-2 days in PP</span>
                </div>

                <div class="flex flex-col items-center">
                  <span class="text-xl">🛡️</span>
                  <span class="mt-1 text-[11px] font-black text-white">100% Genuine</span>
                  <span class="text-[10px] text-gray-400">Authentic gear</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SPECIFICATIONS & REVIEWS TABS SECTION -->
        <div class="border-t border-white/10 bg-black/40 p-6 sm:p-10">
          <div class="flex border-b border-white/10 gap-6 text-xs sm:text-sm font-black uppercase tracking-wider mb-6">
            <button
              type="button"
              @click="activeTab = 'specs'"
              class="pb-3 transition relative"
              :class="activeTab === 'specs' ? 'text-lime-400' : 'text-gray-400 hover:text-white'"
            >
              <span>Product Specifications</span>
              <span v-if="activeTab === 'specs'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400 shadow-[0_0_8px_#b7f34a]"></span>
            </button>

            <button
              type="button"
              @click="activeTab = 'reviews'"
              class="pb-3 transition relative"
              :class="activeTab === 'reviews' ? 'text-lime-400' : 'text-gray-400 hover:text-white'"
            >
              <span>Verified Customer Reviews ({{ product.reviews }})</span>
              <span v-if="activeTab === 'reviews'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400 shadow-[0_0_8px_#b7f34a]"></span>
            </button>
          </div>

          <!-- Specs Tab -->
          <div v-if="activeTab === 'specs'" class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Category</span>
              <span class="mt-1 block font-bold text-white text-sm">{{ product.category }}</span>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Brand</span>
              <span class="mt-1 block font-bold text-white text-sm">{{ product.brand }}</span>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Gender</span>
              <span class="mt-1 block font-bold text-white text-sm">{{ product.gender }}</span>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Colorway</span>
              <span class="mt-1 block font-bold text-white text-sm">{{ product.color }}</span>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Cushioning</span>
              <span class="mt-1 block font-bold text-lime-400 text-sm">Ultra-Responsive</span>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Weight</span>
              <span class="mt-1 block font-bold text-white text-sm">approx. 280g</span>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Warranty</span>
              <span class="mt-1 block font-bold text-white text-sm">6 Months Official</span>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span class="block text-[10px] uppercase font-bold text-gray-400">Authenticity</span>
              <span class="mt-1 block font-bold text-emerald-400 text-sm">100% Genuine</span>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-else class="space-y-4">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-white text-sm">Rothana C.</span>
                  <span class="ml-2 inline-flex items-center text-[11px] font-bold text-emerald-400">✓ Verified Buyer</span>
                </div>
                <div class="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <p class="mt-2 text-xs text-gray-300 leading-relaxed">
                Super fast delivery! Scanned the KHQR code and paid in less than 10 seconds. The gear looks stunning in dark mode!
              </p>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-white text-sm">Vannthai K.</span>
                  <span class="ml-2 inline-flex items-center text-[11px] font-bold text-emerald-400">✓ Verified Buyer</span>
                </div>
                <div class="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <p class="mt-2 text-xs text-gray-300 leading-relaxed">
                Premium materials and perfect fit. The site animation is so smooth and interactive!
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Recently Viewed Gear Section -->
      <div class="mt-10 sm:mt-6">
        <RecentlyViewed />
      </div>
    </div>

    <!-- FULLSCREEN INTERACTIVE IMAGE ZOOM LIGHTBOX (Mobile Pinch/Tap Zoomable) -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isZoomOpen"
          class="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl text-white select-none touch-none"
        >
          <!-- Top Header Bar -->
          <div class="flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-3.5 bg-black/60">
            <div class="flex items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 text-black font-black text-xs shadow-[0_0_10px_#b7f34a]">
                🔍
              </span>
              <div>
                <h3 class="text-xs sm:text-sm font-black uppercase text-white truncate max-w-[180px] sm:max-w-md">
                  {{ product?.name }}
                </h3>
                <p class="text-[10px] sm:text-[11px] text-gray-400">
                  Pinch or double-tap to zoom · Drag to pan
                </p>
              </div>
            </div>

            <!-- Controls: Zoom Out (-), Scale %, Zoom In (+), Reset (1x), Close (✕) -->
            <div class="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                @click="zoomOut"
                :disabled="zoomScale <= 1"
                class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-sm font-bold transition hover:bg-white/15 disabled:opacity-30 active:scale-95"
                title="Zoom Out"
              >
                −
              </button>

              <span class="min-w-12 sm:min-w-14 text-center font-mono text-xs font-black text-lime-400">
                {{ Math.round(zoomScale * 100) }}%
              </span>

              <button
                type="button"
                @click="zoomIn"
                :disabled="zoomScale >= 4"
                class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-sm font-bold transition hover:bg-white/15 disabled:opacity-30 active:scale-95"
                title="Zoom In"
              >
                +
              </button>

              <button
                type="button"
                @click="resetZoom"
                class="rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition active:scale-95"
                title="Reset zoom"
              >
                1x
              </button>

              <button
                type="button"
                @click="closeZoom"
                class="ml-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gray-300 hover:bg-red-500 hover:text-white transition active:scale-95"
                title="Close Zoom"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Zoom Canvas (Middle) -->
          <div
            class="relative flex-1 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            @dblclick="toggleDoubleTapZoom"
          >
            <div
              class="transition-transform duration-75 ease-out will-change-transform flex items-center justify-center"
              :style="{
                transform: `translate3d(${panX}px, ${panY}px, 0) scale(${zoomScale})`,
              }"
            >
              <img
                :src="selectedImage || product?.image"
                :alt="product?.name"
                class="max-h-[70vh] max-w-[90vw] object-contain pointer-events-none select-none rounded-xl shadow-2xl"
                draggable="false"
              />
            </div>
          </div>

          <!-- Bottom Thumbnails Strip (Switch angles while zoomed) -->
          <div
            v-if="product"
            class="border-t border-white/10 bg-black/80 px-4 py-3 flex items-center justify-center gap-3 overflow-x-auto custom-scrollbar"
          >
            <button
              type="button"
              @click="switchZoomImage(product.image)"
              class="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition duration-200"
              :class="
                (selectedImage || product.image) === product.image
                  ? 'border-lime-400 ring-2 ring-lime-400/40'
                  : 'border-white/15 opacity-60 hover:opacity-100'
              "
            >
              <img :src="product.image" :alt="product.name" class="h-full w-full object-cover" />
            </button>

            <button
              v-if="product.hoverimg"
              type="button"
              @click="switchZoomImage(product.hoverimg)"
              class="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition duration-200"
              :class="
                selectedImage === product.hoverimg
                  ? 'border-lime-400 ring-2 ring-lime-400/40'
                  : 'border-white/15 opacity-60 hover:opacity-100'
              "
            >
              <img :src="product.hoverimg" :alt="product.name" class="h-full w-full object-cover" />
            </button>

            <template v-if="product.images && product.images.length">
              <button
                v-for="(img, idx) in product.images"
                :key="idx"
                type="button"
                @click="switchZoomImage(img)"
                class="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition duration-200"
                :class="
                  selectedImage === img
                    ? 'border-lime-400 ring-2 ring-lime-400/40'
                    : 'border-white/15 opacity-60 hover:opacity-100'
                "
              >
                <img :src="img" :alt="product.name" class="h-full w-full object-cover" />
              </button>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useWishlist } from "~/composables/useWishlist";
import { useCart } from "~/composables/useCart";
import { useQrPayment } from "~/composables/useQrPayment";
import { useProductCompare } from "~/composables/useProductCompare";
import { useRecentlyViewed } from "~/composables/useRecentlyViewed";
import { usePreOrder } from "~/composables/usePreOrder";
import { useToast } from "~/composables/useToast";
import { products as fallbackProducts } from "~/data/product";
import type { Product } from "~/type/product";
import { useApiBase } from "~/composables/useApi";
import { useAdminStore } from "~/composables/useAdminStore";
import RecentlyViewed from "~/components/RecentlyViewed.vue";

definePageMeta({
  layout: "user",
});

const route = useRoute();
const apiBase = useApiBase();
const { applyOverrides } = useAdminStore();
const allProducts = ref<Product[]>(applyOverrides(fallbackProducts));

const loadProducts = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${apiBase}/products`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allProducts.value = applyOverrides(
          data.map((p: any) => ({
            ...p,
            id: Number(p.id),
          }))
        );
      }
    }
  } catch {
    // allProducts already pre-populated synchronously with fallbackProducts
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
const showSizeGuide = ref(false);
const activeTab = ref<"specs" | "reviews">("specs");

const { isFavorite, toggleWishlist } = useWishlist();
const { addToCart } = useCart();
const { openQrPayment } = useQrPayment();
const { isInCompare, toggleCompare } = useProductCompare();
const { addRecentlyViewed } = useRecentlyViewed();
const { openPreOrder } = usePreOrder();
const { success } = useToast();

const openPreOrderModal = () => {
  if (!product.value) return;
  const size = selectedSize.value || product.value.size?.[0] || "";
  openPreOrder(product.value, size);
};

watch(
  product,
  (newVal) => {
    if (newVal) {
      addRecentlyViewed(newVal);
    }
  },
  { immediate: true },
);

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

const handleBuyNow = () => {
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

// =====================================================
// FULLSCREEN INTERACTIVE IMAGE ZOOM VIEWER (Mobile Touch & Pinch)
// =====================================================
const isZoomOpen = ref(false);
const zoomScale = ref(1);
const panX = ref(0);
const panY = ref(0);

let lastTouchDist = 0;
let lastTapTime = 0;
let isPanning = false;
let startTouchX = 0;
let startTouchY = 0;
let initialPanX = 0;
let initialPanY = 0;

const openZoom = () => {
  isZoomOpen.value = true;
  zoomScale.value = 1;
  panX.value = 0;
  panY.value = 0;
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeydown);
  }
};

const closeZoom = () => {
  isZoomOpen.value = false;
  zoomScale.value = 1;
  panX.value = 0;
  panY.value = 0;
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeydown);
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") closeZoom();
};

const zoomIn = () => {
  zoomScale.value = Math.min(4, Number((zoomScale.value + 0.5).toFixed(1)));
};

const zoomOut = () => {
  zoomScale.value = Math.max(1, Number((zoomScale.value - 0.5).toFixed(1)));
  if (zoomScale.value === 1) {
    panX.value = 0;
    panY.value = 0;
  }
};

const resetZoom = () => {
  zoomScale.value = 1;
  panX.value = 0;
  panY.value = 0;
};

const toggleDoubleTapZoom = () => {
  if (zoomScale.value > 1.2) {
    resetZoom();
  } else {
    zoomScale.value = 2.2;
  }
};

const switchZoomImage = (img: string) => {
  selectedImage.value = img;
  resetZoom();
};

// Touch Gestures: Pinch & Pan
const handleTouchStart = (e: TouchEvent) => {
  const t0 = e.touches[0];
  const t1 = e.touches[1];
  if (e.touches.length === 2 && t0 && t1) {
    // Pinch to zoom start
    lastTouchDist = Math.hypot(
      t0.clientX - t1.clientX,
      t0.clientY - t1.clientY
    );
  } else if (e.touches.length === 1 && t0) {
    // Double tap check
    const now = Date.now();
    if (now - lastTapTime < 300) {
      toggleDoubleTapZoom();
      lastTapTime = 0;
      return;
    }
    lastTapTime = now;

    // Pan start
    isPanning = true;
    startTouchX = t0.clientX;
    startTouchY = t0.clientY;
    initialPanX = panX.value;
    initialPanY = panY.value;
  }
};

const handleTouchMove = (e: TouchEvent) => {
  const t0 = e.touches[0];
  const t1 = e.touches[1];
  if (e.touches.length === 2 && t0 && t1) {
    // Pinch to zoom move
    const currentDist = Math.hypot(
      t0.clientX - t1.clientX,
      t0.clientY - t1.clientY
    );
    if (lastTouchDist > 0) {
      const delta = (currentDist - lastTouchDist) * 0.008;
      zoomScale.value = Math.min(4, Math.max(1, zoomScale.value + delta));
    }
    lastTouchDist = currentDist;
  } else if (e.touches.length === 1 && t0 && isPanning && zoomScale.value > 1) {
    // 1-finger pan move when zoomed
    const deltaX = t0.clientX - startTouchX;
    const deltaY = t0.clientY - startTouchY;
    panX.value = initialPanX + deltaX;
    panY.value = initialPanY + deltaY;
  }
};

const handleTouchEnd = () => {
  isPanning = false;
  lastTouchDist = 0;
  if (zoomScale.value <= 1) {
    panX.value = 0;
    panY.value = 0;
  }
};

// Mouse Drag
const handleMouseDown = (e: MouseEvent) => {
  if (zoomScale.value <= 1) return;
  isPanning = true;
  startTouchX = e.clientX;
  startTouchY = e.clientY;
  initialPanX = panX.value;
  initialPanY = panY.value;
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isPanning || zoomScale.value <= 1) return;
  const deltaX = e.clientX - startTouchX;
  const deltaY = e.clientY - startTouchY;
  panX.value = initialPanX + deltaX;
  panY.value = initialPanY + deltaY;
};

const handleMouseUp = () => {
  isPanning = false;
};

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeydown);
  }
});
</script>
