<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Product } from "~/type/product";
import { products as fallbackProducts } from "~/data/product";
import { useApiBase } from "~/composables/useApi";

definePageMeta({
  layout: "user",
});

const apiBase = useApiBase();
const products = ref<Product[]>(fallbackProducts);
const isLoading = ref(true);

const loadProducts = async () => {
  try {
    const res = await fetch(`${apiBase}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        products.value = data;
      }
    }
  } catch (error) {
    console.error("Failed to fetch products from frontend:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});

// Popular Products = marked as popular
const popularProducts = computed(() => {
  return products.value
    .filter((product) => product.popular === true)
    .slice(0, 4);
});

// Discount Products = sorted by discount amount (highest first)
const discountProducts = computed(() => {
  return products.value
    .filter((product) => product.discount > 0 && !product.popular)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 4);
});
</script>

<template>
  <div>
    <!-- ================= HERO ================= -->
    <Hero />

    <!-- ================= HIGH-TECH TRUST TICKER ================= -->
    <section class="border-y border-white/10 bg-black/60 backdrop-blur-xl text-white">
      <div
        class="mx-auto grid max-w-7xl gap-6 px-6 py-6 text-xs sm:grid-cols-4 lg:px-8"
      >
        <div class="flex items-center gap-3">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400/10 border border-lime-400/30 text-lime-400 font-black text-sm">01</span>
          <div>
            <h4 class="font-bold text-white tracking-wide">Elite Gear</h4>
            <p class="text-[11px] text-gray-400">Tested for performance</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-black text-sm">02</span>
          <div>
            <h4 class="font-bold text-white tracking-wide">Fast Delivery</h4>
            <p class="text-[11px] text-gray-400">1-2 days across Cambodia</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/10 border border-purple-400/30 text-purple-400 font-black text-sm">03</span>
          <div>
            <h4 class="font-bold text-white tracking-wide">Easy Returns</h4>
            <p class="text-[11px] text-gray-400">30-day exchange guarantee</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-black text-sm">04</span>
          <div>
            <h4 class="font-bold text-white tracking-wide">KHQR Instant</h4>
            <p class="text-[11px] text-gray-400">Scan & pay with Bakong</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= POPULAR PRODUCTS ================= -->
    <section class="py-20 relative">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Section Header -->
        <div class="mb-10 flex items-end justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="h-6 w-1.5 rounded-full bg-lime-400 shadow-[0_0_12px_#b7f34a]"></span>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                Trending Popular Gear
              </h2>
            </div>

            <p class="mt-2 text-xs sm:text-sm text-gray-400">
              Top trending high-performance shoes and apparel selected for champions
            </p>
          </div>

          <!-- View All -->
          <NuxtLink
            to="/Product?type=popular"
            class="hidden text-xs font-black uppercase tracking-wider text-lime-400 transition hover:text-lime-300 hover:underline sm:inline-flex items-center gap-1.5"
          >
            <span>View All</span>
            <span aria-hidden="true">&rarr;</span>
          </NuxtLink>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard
            v-for="product in popularProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Mobile View All -->
        <div class="mt-8 text-center sm:hidden">
          <NuxtLink
            to="/Product?type=popular"
            class="inline-flex items-center justify-center rounded-xl bg-lime-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300"
          >
            View All Products &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ================= DISCOUNT PRODUCTS ================= -->
    <section class="py-20 border-t border-white/10 relative">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Section Header -->
        <div class="mb-10 flex items-end justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="h-6 w-1.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444]"></span>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                Special Discount Deals
              </h2>
            </div>

            <p class="mt-2 text-xs sm:text-sm text-gray-400">
              Get authentic gear at limited-time discounted prices
            </p>
          </div>

          <!-- View All -->
          <NuxtLink
            to="/Product?type=discount"
            class="hidden text-xs font-black uppercase tracking-wider text-lime-400 transition hover:text-lime-300 hover:underline sm:inline-flex items-center gap-1.5"
          >
            <span>View All Deals</span>
            <span aria-hidden="true">&rarr;</span>
          </NuxtLink>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard
            v-for="product in discountProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Mobile View All -->
        <div class="mt-8 text-center sm:hidden">
          <NuxtLink
            to="/Product?type=discount"
            class="inline-flex items-center justify-center rounded-xl bg-lime-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300"
          >
            View All Deals &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
