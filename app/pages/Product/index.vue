<script setup lang="ts">
import { computed, ref } from "vue";
import { definePageMeta } from "#app/composables/pages";
import { products } from "~/data/product";
import { productFilterOptions } from "~/data/storefront";

definePageMeta({
  layout: "user",
});

// =====================================================
// SEARCH
// =====================================================

const search = ref("");
const route = useRoute();

// =====================================================
// FILTERS
// =====================================================

const selectedType = ref(
  route.query.type === "popular"
    ? "Popular"
    : route.query.type === "discount"
      ? "Discount"
      : "All",
);
const selectedCategory = ref("All");
const selectedBrand = ref("All");
const selectedGender = ref("All");

const minPrice = ref(0);
const maxPrice = ref(1000);

// =====================================================
// SORT
// =====================================================

const sortBy = ref("featured");

// =====================================================
// FILTER OPTIONS
// =====================================================

const productTypes = productFilterOptions.types;
const categories = productFilterOptions.categories;
const brands = productFilterOptions.brands;
const genders = productFilterOptions.genders;

// =====================================================
// FILTER PRODUCTS
// =====================================================

const filteredProducts = computed(() => {
  let result = products.filter((product) => {
    // SEARCH

    const matchSearch = product.name
      .toLowerCase()
      .includes(search.value.toLowerCase());

    // PRODUCT TYPE

    const matchType =
      selectedType.value === "All" ||
      (selectedType.value === "Popular" && product.popular === true) ||
      (selectedType.value === "Discount" && product.discount > 0);

    // CATEGORY

    const matchCategory =
      selectedCategory.value === "All" ||
      product.category
        .toLowerCase()
        .includes(selectedCategory.value.toLowerCase());

    // BRAND

    const matchBrand =
      selectedBrand.value === "All" || product.brand === selectedBrand.value;

    // GENDER

    const matchGender =
      selectedGender.value === "All" || product.gender === selectedGender.value;

    // PRICE

    const matchPrice =
      product.price >= minPrice.value && product.price <= maxPrice.value;

    return (
      matchSearch &&
      matchType &&
      matchCategory &&
      matchBrand &&
      matchGender &&
      matchPrice
    );
  });

  // ===================================================
  // SORT
  // ===================================================

  if (sortBy.value === "low") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sortBy.value === "high") {
    result.sort((a, b) => b.price - a.price);
  }

  if (sortBy.value === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
});

// =====================================================
// CLEAR FILTERS
// =====================================================

const clearFilters = () => {
  search.value = "";

  selectedType.value = "All";
  selectedCategory.value = "All";
  selectedBrand.value = "All";
  selectedGender.value = "All";

  minPrice.value = 0;
  maxPrice.value = 1000;

  sortBy.value = "featured";
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 px-5 py-6">
    <div class="bg-gray-100">
      <Categories
        :selected-category="selectedCategory"
        @select="selectedCategory = $event"
      />

      <div class="px-5 py-6"></div>
    </div>

    <div
      class="mb-6 flex h-21.25 w-full items-center rounded-2xl border border-gray-200 bg-white px-5 shadow-sm"
    >
      <div class="relative flex-1">
        <input
          v-model="search"
          type="text"
          placeholder="Search products..."
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 pl-12 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />

        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      <select
        v-model="sortBy"
        class="ml-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
      >
        <option value="featured">Featured</option>
        <option value="low">Price: Low to High</option>
        <option value="high">Price: High to Low</option>
        <option value="name">Name</option>
      </select>
    </div>

    <div class="flex w-full gap-6">
      <aside class="hidden w-72 shrink-0 lg:block">
        <div
          class="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          style="scrollbar-width: thin"
        >
          <div
            class="flex items-center justify-between border-b border-gray-100 pb-5"
          >
            <div>
              <h2 class="text-xl font-bold text-gray-900">Filters</h2>
              <p class="mt-1 text-xs text-gray-500">Refine your products</p>
            </div>

            <button
              type="button"
              @click="clearFilters"
              class="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
            >
              Clear
            </button>
          </div>

          <div class="mt-6">
            <h3
              class="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900"
            >
              Product Type
            </h3>

            <div class="space-y-2">
              <label
                v-for="type in productTypes"
                :key="type"
                class="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-gray-50"
                :class="
                  selectedType === type
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600'
                "
              >
                <div class="flex items-center gap-3">
                  <input
                    v-model="selectedType"
                    type="radio"
                    :value="type"
                    class="h-4 w-4 accent-blue-600"
                  />

                  <span v-if="type === 'Popular'"> 🔥 </span>
                  <span v-if="type === 'Discount'"> 🏷️ </span>
                  <span>{{ type }}</span>
                </div>

                <span v-if="selectedType === type" class="text-blue-600">
                  ✓
                </span>
              </label>
            </div>
          </div>

          <div class="mt-7 border-t border-gray-100 pt-6">
            <h3
              class="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900"
            >
              Category
            </h3>

            <div class="space-y-2">
              <label
                v-for="category in categories"
                :key="category"
                class="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-gray-50"
                :class="
                  selectedCategory === category
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600'
                "
              >
                <div class="flex items-center gap-3">
                  <input
                    v-model="selectedCategory"
                    type="radio"
                    :value="category"
                    class="h-4 w-4 accent-blue-600"
                  />

                  <span>{{ category }}</span>
                </div>

                <span
                  v-if="selectedCategory === category"
                  class="font-bold text-blue-600"
                >
                  ✓
                </span>
              </label>
            </div>
          </div>

          <div class="mt-7 border-t border-gray-100 pt-6">
            <h3
              class="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900"
            >
              Brand
            </h3>

            <div class="space-y-2">
              <label
                v-for="brand in brands"
                :key="brand"
                class="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-gray-50"
                :class="
                  selectedBrand === brand
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600'
                "
              >
                <div class="flex items-center gap-3">
                  <input
                    v-model="selectedBrand"
                    type="radio"
                    :value="brand"
                    class="h-4 w-4 accent-blue-600"
                  />

                  <span>{{ brand }}</span>
                </div>

                <span
                  v-if="selectedBrand === brand"
                  class="font-bold text-blue-600"
                >
                  ✓
                </span>
              </label>
            </div>
          </div>

          <div class="mt-7 border-t border-gray-100 pt-6">
            <h3
              class="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900"
            >
              Gender
            </h3>

            <div class="space-y-2">
              <label
                v-for="gender in genders"
                :key="gender"
                class="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-gray-50"
                :class="
                  selectedGender === gender
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600'
                "
              >
                <div class="flex items-center gap-3">
                  <input
                    v-model="selectedGender"
                    type="radio"
                    :value="gender"
                    class="h-4 w-4 accent-blue-600"
                  />

                  <span>{{ gender }}</span>
                </div>

                <span
                  v-if="selectedGender === gender"
                  class="font-bold text-blue-600"
                >
                  ✓
                </span>
              </label>
            </div>
          </div>

          <div class="mt-7 border-t border-gray-100 pt-6">
            <h3
              class="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900"
            >
              Price Range
            </h3>

            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                >
                  $
                </span>

                <input
                  v-model.number="minPrice"
                  type="number"
                  min="0"
                  placeholder="Min"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-7 pr-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <span class="text-gray-400"> — </span>

              <div class="relative flex-1">
                <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                >
                  $
                </span>

                <input
                  v-model.number="maxPrice"
                  type="number"
                  min="0"
                  placeholder="Max"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-7 pr-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="clearFilters"
            class="mt-7 w-full rounded-xl bg-black py-3 text-sm font-bold text-white transition hover:bg-blue-600 hover:shadow-lg"
          >
            Reset All Filters
          </button>
        </div>
      </aside>

      <main class="min-w-0 flex-1">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{
                selectedCategory === "All" ? "All Products" : selectedCategory
              }}
            </h1>

            <p class="mt-1 text-sm text-gray-500">
              {{ filteredProducts.length }} products found
            </p>
          </div>
        </div>

        <div
          v-if="filteredProducts.length"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <div
          v-else
          class="flex min-h-125 items-center justify-center rounded-2xl bg-white"
        >
          <div class="text-center">
            <div class="text-5xl">🔍</div>

            <h2 class="mt-4 text-xl font-bold text-gray-900">
              No products found
            </h2>

            <p class="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              @click="clearFilters"
              class="mt-5 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
