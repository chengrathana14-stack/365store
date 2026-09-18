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

    <section class="border-b border-black/10 bg-black text-white">
      <div
        class="mx-auto grid max-w-7xl gap-5 px-6 py-5 text-sm sm:grid-cols-3 lg:px-8"
      >
        <div class="flex items-center gap-3">
          <span class="text-xl text-lime-400">01</span>
          <span class="font-semibold">Performance-first gear</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xl text-lime-400">02</span>
          <span class="font-semibold">Fast delivery on every order</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xl text-lime-400">03</span>
          <span class="font-semibold">Easy returns within 30 days</span>
        </div>
      </div>
    </section>

    <!-- ================= POPULAR PRODUCTS ================= -->
    <section class="bg-[#f4f6ef] py-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Section Header -->
        <div class="mb-8 flex items-end justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="h-6 w-1 rounded-full bg-lime-500"></span>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 uppercase">
                Popular Products
              </h2>
            </div>

            <p class="mt-2 text-sm text-gray-500">
              Top trending performance shoes and apparel
            </p>
          </div>

          <!-- View All -->
          <NuxtLink
            to="/Product?type=popular"
            class="hidden text-sm font-bold text-black transition hover:text-lime-600 sm:inline-flex items-center gap-1"
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
            class="inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lime-400 hover:text-black"
          >
            View All Products &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ================= DISCOUNT PRODUCTS ================= -->
    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Section Header -->
        <div class="mb-8 flex items-end justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="h-6 w-1 rounded-full bg-lime-500"></span>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 uppercase">
                Discount Deals
              </h2>
            </div>

            <p class="mt-2 text-sm text-gray-500">
              Get your favorite sports products at special discounted prices
            </p>
          </div>

          <!-- View All -->
          <NuxtLink
            to="/Product?type=discount"
            class="hidden text-sm font-bold text-black transition hover:text-lime-600 sm:inline-flex items-center gap-1"
          >
            <span>View All</span>
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
            class="inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lime-400 hover:text-black"
          >
            View All Products &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
