<script setup lang="ts">
import { products } from "~/data/product";

definePageMeta({
  layout: "user",
});

// Popular Products = marked as popular
const popularProducts = products
  .filter((product) => product.popular === true)
  .slice(0, 4);

// Discount Products = sorted by discount amount (highest first)
const discountProducts = products
  .filter((product) => product.discount > 0 && !product.popular)
  .sort((a, b) => b.discount - a.discount)
  .slice(0, 4);
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
            <div class="flex items-center gap-2">
              <span class="text-2xl"> 🔥 </span>

              <h2 class="text-3xl font-bold text-gray-900">Popular Products</h2>
            </div>

            <p class="mt-2 text-gray-500">
              Popular products with limited stock
            </p>
          </div>

          <!-- View All -->
          <NuxtLink
            to="/Product?type=popular"
            class="hidden font-semibold text-blue-600 transition hover:text-blue-800 sm:block"
          >
            View All →
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
            class="font-semibold text-blue-600 transition hover:text-blue-800"
          >
            View All Products →
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
            <div class="flex items-center gap-2">
              <span class="text-2xl"> 🏷️ </span>

              <h2 class="text-3xl font-bold text-gray-900">
                Discount Products
              </h2>
            </div>

            <p class="mt-2 text-gray-500">
              Get your favorite sports products at special prices
            </p>
          </div>

          <!-- View All -->
          <NuxtLink
            to="/Product?type=discount"
            class="hidden font-semibold text-blue-600 transition hover:text-blue-800 sm:block"
          >
            View All →
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
            class="font-semibold text-blue-600 transition hover:text-blue-800"
          >
            View All Products →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
