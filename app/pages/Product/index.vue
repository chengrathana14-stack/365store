<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { definePageMeta } from "#app/composables/pages";
import { products as fallbackProducts } from "~/data/product";
import { productFilterOptions } from "~/data/storefront";
import type { Product } from "~/type/product";
import { useApiBase } from "~/composables/useApi";

definePageMeta({
  layout: "user",
});

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
    console.error("Failed to fetch products:", error);
  }
};

onMounted(() => {
  loadProducts();
});

// =====================================================
// SEARCH & ROUTE
// =====================================================

const search = ref("");
const route = useRoute();

// =====================================================
// FILTERS (CHECKBOX ARRAYS)
// =====================================================

const selectedTypes = ref<string[]>([]);
const selectedCategories = ref<string[]>([]);
const selectedBrands = ref<string[]>([]);
const selectedGenders = ref<string[]>([]);

const minPrice = ref(0);
const maxPrice = ref(1000);
const sortBy = ref("featured");

// Initialize from route query
if (route.query.type === "popular") {
  selectedTypes.value = ["Popular"];
} else if (route.query.type === "discount") {
  selectedTypes.value = ["Discount"];
}

// Checkbox lists (without "All" placeholder)
const productTypes = productFilterOptions.types.filter((t) => t !== "All");
const categories = productFilterOptions.categories.filter((c) => c !== "All");
const brands = productFilterOptions.brands.filter((b) => b !== "All");
const genders = productFilterOptions.genders.filter((g) => g !== "All");

// Accordion Collapsible Sections
const openSections = ref({
  type: true,
  category: true,
  brand: true,
  gender: true,
  price: true,
});

const toggleSection = (section: keyof typeof openSections.value) => {
  openSections.value[section] = !openSections.value[section];
};

const toggleFilter = (list: string[], value: string) => {
  const index = list.indexOf(value);
  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(value);
  }
};

const handleCategorySelect = (categoryName: string) => {
  if (categoryName === "All") {
    selectedCategories.value = [];
  } else {
    selectedCategories.value = [categoryName];
  }
};

// Counts
const getTypeCount = (type: string) => {
  if (type === "Popular") return allProducts.value.filter((p) => p.popular).length;
  if (type === "Discount") return allProducts.value.filter((p) => p.discount > 0).length;
  return allProducts.value.length;
};

const getCategoryCount = (categoryName: string) => {
  return allProducts.value.filter((p) =>
    p.category.toLowerCase().includes(categoryName.toLowerCase()),
  ).length;
};

const getBrandCount = (brandName: string) => {
  return allProducts.value.filter(
    (p) => p.brand.toLowerCase() === brandName.toLowerCase(),
  ).length;
};

const getGenderCount = (gender: string) => {
  return allProducts.value.filter(
    (p) => p.gender.toLowerCase() === gender.toLowerCase(),
  ).length;
};

// =====================================================
// FILTER PRODUCTS
// =====================================================

const filteredProducts = computed(() => {
  let result = allProducts.value.filter((product) => {
    // SEARCH
    const matchSearch =
      !search.value.trim() ||
      product.name.toLowerCase().includes(search.value.toLowerCase().trim()) ||
      product.brand.toLowerCase().includes(search.value.toLowerCase().trim());

    // PRODUCT TYPE
    let matchType = true;
    if (selectedTypes.value.length > 0) {
      matchType = selectedTypes.value.some((type) => {
        if (type === "Popular") return product.popular === true;
        if (type === "Discount") return product.discount > 0;
        return true;
      });
    }

    // CATEGORY
    const matchCategory =
      selectedCategories.value.length === 0 ||
      selectedCategories.value.some((cat) =>
        product.category.toLowerCase().includes(cat.toLowerCase()),
      );

    // BRAND
    const matchBrand =
      selectedBrands.value.length === 0 ||
      selectedBrands.value.some((brand) =>
        product.brand.toLowerCase() === brand.toLowerCase(),
      );

    // GENDER
    const matchGender =
      selectedGenders.value.length === 0 ||
      selectedGenders.value.some((g) =>
        product.gender.toLowerCase() === g.toLowerCase(),
      );

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

  // SORT
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

const clearFilters = () => {
  search.value = "";
  selectedTypes.value = [];
  selectedCategories.value = [];
  selectedBrands.value = [];
  selectedGenders.value = [];
  minPrice.value = 0;
  maxPrice.value = 1000;
  sortBy.value = "featured";
};

const hasActiveFilters = computed(() => {
  return (
    search.value.trim() !== "" ||
    selectedTypes.value.length > 0 ||
    selectedCategories.value.length > 0 ||
    selectedBrands.value.length > 0 ||
    selectedGenders.value.length > 0 ||
    minPrice.value > 0 ||
    maxPrice.value < 1000 ||
    sortBy.value !== "featured"
  );
});

const isMobileSidebarOpen = ref(false);

const activeFilterCount = computed(() => {
  let count = 0;
  count += selectedTypes.value.length;
  count += selectedCategories.value.length;
  count += selectedBrands.value.length;
  count += selectedGenders.value.length;
  if (minPrice.value > 0 || maxPrice.value < 1000) count += 1;
  return count;
});
</script>

<template>
  <div class="min-h-screen pb-16 text-white">
    <!-- CATEGORY SLIDER -->
    <Categories
      :selected-category="selectedCategories.length === 1 ? (selectedCategories[0] ?? '') : (selectedCategories.length === 0 ? 'All' : '')"
      @select="handleCategorySelect"
    />

    <!-- PAGE CONTAINER WITH BALANCED PADDING -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
      <!-- SEARCH & SORT BAR -->
      <div
        class="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0d1017]/85 backdrop-blur-xl p-3.5 shadow-xl"
      >
        <div class="relative flex-1">
          <input
            v-model="search"
            type="text"
            placeholder="Search sports shoes, gear..."
            class="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:bg-white/10 focus:ring-1 focus:ring-lime-400/40"
          />
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <div class="flex items-center gap-2 sm:shrink-0">
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 hidden sm:inline">Sort:</span>
          <select
            v-model="sortBy"
            class="w-full sm:w-auto rounded-xl border border-white/15 bg-[#0d1017] py-2.5 px-3.5 text-xs sm:text-sm font-medium text-white outline-none transition focus:border-lime-400"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Product Name</option>
          </select>
        </div>
      </div>

      <!-- Backdrop for Mobile Sidebar Drawer -->
      <div
        v-if="isMobileSidebarOpen"
        class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-opacity lg:hidden"
        @click="isMobileSidebarOpen = false"
      />

      <!-- MAIN CONTENT: SIDEBAR + PRODUCT GRID -->
      <div class="flex w-full flex-col lg:flex-row gap-6">
        <!-- FILTER SIDEBAR (Drawer on mobile, Sticky Sidebar on desktop) -->
        <aside
          class="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#0d1017] shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-64 lg:shrink-0 lg:shadow-none lg:transition-none"
          :class="isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
        >
          <div
            class="h-full overflow-y-auto p-4 lg:h-auto lg:overflow-visible lg:p-5 lg:rounded-2xl lg:border lg:border-white/10 lg:bg-[#0d1017]/90 lg:backdrop-blur-xl lg:shadow-xl lg:sticky lg:top-20"
          >
            <!-- Sidebar Header -->
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 class="text-xs font-black text-white uppercase tracking-wider">Filters</h2>
                <p class="text-[11px] text-gray-400">Refine selection</p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  v-if="hasActiveFilters"
                  type="button"
                  @click="clearFilters"
                  class="text-xs font-bold text-gray-500 transition hover:text-black"
                >
                  Clear All
                </button>

                <!-- Mobile Close Button -->
                <button
                  type="button"
                  @click="isMobileSidebarOpen = false"
                  class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-black lg:hidden"
                  aria-label="Close sidebar"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 1. PRODUCT TYPE (COLLAPSIBLE) -->
            <div class="border-b border-gray-100 py-3.5">
              <button
                type="button"
                @click="toggleSection('type')"
                class="flex w-full items-center justify-between text-left group select-none"
              >
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
                    Product Type
                  </span>
                  <span
                    v-if="selectedTypes.length > 0"
                    class="flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-400 px-1 text-[9px] font-extrabold text-black"
                  >
                    {{ selectedTypes.length }}
                  </span>
                </div>
                <svg
                  class="h-4 w-4 text-gray-400 transition-transform duration-300 ease-out group-hover:text-gray-900"
                  :class="openSections.type ? 'rotate-180' : 'rotate-0'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                class="accordion-grid"
                :class="{ 'is-open': openSections.type }"
              >
                <div class="accordion-inner">
                  <div class="pt-2 space-y-1">
                    <label
                      v-for="type in productTypes"
                      :key="type"
                      class="group flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-gray-50 select-none"
                      @click.prevent="toggleFilter(selectedTypes, type)"
                    >
                      <div class="flex items-center gap-2.5">
                        <div
                          class="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all duration-150"
                          :class="
                            selectedTypes.includes(type)
                              ? 'border-black bg-black text-lime-400 shadow-xs'
                              : 'border-gray-300 bg-white group-hover:border-gray-400'
                          "
                        >
                          <svg
                            class="h-2.5 w-2.5 transition-transform duration-150 stroke-[3]"
                            :class="selectedTypes.includes(type) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span
                          class="transition-colors"
                          :class="selectedTypes.includes(type) ? 'font-bold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'"
                        >
                          {{ type }}
                        </span>
                      </div>

                      <span
                        class="text-[10px] font-medium transition-colors px-1.5 py-0.5 rounded"
                        :class="selectedTypes.includes(type) ? 'bg-lime-100 text-lime-800 font-bold' : 'text-gray-400 bg-gray-50 group-hover:bg-gray-100 group-hover:text-gray-600'"
                      >
                        {{ getTypeCount(type) }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. CATEGORY (COLLAPSIBLE) -->
            <div class="border-b border-gray-100 py-3.5">
              <button
                type="button"
                @click="toggleSection('category')"
                class="flex w-full items-center justify-between text-left group select-none"
              >
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
                    Category
                  </span>
                  <span
                    v-if="selectedCategories.length > 0"
                    class="flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-400 px-1 text-[9px] font-extrabold text-black"
                  >
                    {{ selectedCategories.length }}
                  </span>
                </div>
                <svg
                  class="h-4 w-4 text-gray-400 transition-transform duration-300 ease-out group-hover:text-gray-900"
                  :class="openSections.category ? 'rotate-180' : 'rotate-0'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                class="accordion-grid"
                :class="{ 'is-open': openSections.category }"
              >
                <div class="accordion-inner">
                  <div class="pt-2 space-y-1">
                    <label
                      v-for="category in categories"
                      :key="category"
                      class="group flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-gray-50 select-none"
                      @click.prevent="toggleFilter(selectedCategories, category)"
                    >
                      <div class="flex items-center gap-2.5">
                        <div
                          class="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all duration-150"
                          :class="
                            selectedCategories.includes(category)
                              ? 'border-black bg-black text-lime-400 shadow-xs'
                              : 'border-gray-300 bg-white group-hover:border-gray-400'
                          "
                        >
                          <svg
                            class="h-2.5 w-2.5 transition-transform duration-150 stroke-[3]"
                            :class="selectedCategories.includes(category) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span
                          class="transition-colors"
                          :class="selectedCategories.includes(category) ? 'font-bold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'"
                        >
                          {{ category }}
                        </span>
                      </div>

                      <span
                        class="text-[10px] font-medium transition-colors px-1.5 py-0.5 rounded"
                        :class="selectedCategories.includes(category) ? 'bg-lime-100 text-lime-800 font-bold' : 'text-gray-400 bg-gray-50 group-hover:bg-gray-100 group-hover:text-gray-600'"
                      >
                        {{ getCategoryCount(category) }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. BRAND (COLLAPSIBLE) -->
            <div class="border-b border-gray-100 py-3.5">
              <button
                type="button"
                @click="toggleSection('brand')"
                class="flex w-full items-center justify-between text-left group select-none"
              >
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
                    Brand
                  </span>
                  <span
                    v-if="selectedBrands.length > 0"
                    class="flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-400 px-1 text-[9px] font-extrabold text-black"
                  >
                    {{ selectedBrands.length }}
                  </span>
                </div>
                <svg
                  class="h-4 w-4 text-gray-400 transition-transform duration-300 ease-out group-hover:text-gray-900"
                  :class="openSections.brand ? 'rotate-180' : 'rotate-0'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                class="accordion-grid"
                :class="{ 'is-open': openSections.brand }"
              >
                <div class="accordion-inner">
                  <div class="pt-2 space-y-1">
                    <label
                      v-for="brand in brands"
                      :key="brand"
                      class="group flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-gray-50 select-none"
                      @click.prevent="toggleFilter(selectedBrands, brand)"
                    >
                      <div class="flex items-center gap-2.5">
                        <div
                          class="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all duration-150"
                          :class="
                            selectedBrands.includes(brand)
                              ? 'border-black bg-black text-lime-400 shadow-xs'
                              : 'border-gray-300 bg-white group-hover:border-gray-400'
                          "
                        >
                          <svg
                            class="h-2.5 w-2.5 transition-transform duration-150 stroke-[3]"
                            :class="selectedBrands.includes(brand) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span
                          class="transition-colors"
                          :class="selectedBrands.includes(brand) ? 'font-bold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'"
                        >
                          {{ brand }}
                        </span>
                      </div>

                      <span
                        class="text-[10px] font-medium transition-colors px-1.5 py-0.5 rounded"
                        :class="selectedBrands.includes(brand) ? 'bg-lime-100 text-lime-800 font-bold' : 'text-gray-400 bg-gray-50 group-hover:bg-gray-100 group-hover:text-gray-600'"
                      >
                        {{ getBrandCount(brand) }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. GENDER (COLLAPSIBLE) -->
            <div class="border-b border-gray-100 py-3.5">
              <button
                type="button"
                @click="toggleSection('gender')"
                class="flex w-full items-center justify-between text-left group select-none"
              >
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
                    Gender
                  </span>
                  <span
                    v-if="selectedGenders.length > 0"
                    class="flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-400 px-1 text-[9px] font-extrabold text-black"
                  >
                    {{ selectedGenders.length }}
                  </span>
                </div>
                <svg
                  class="h-4 w-4 text-gray-400 transition-transform duration-300 ease-out group-hover:text-gray-900"
                  :class="openSections.gender ? 'rotate-180' : 'rotate-0'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                class="accordion-grid"
                :class="{ 'is-open': openSections.gender }"
              >
                <div class="accordion-inner">
                  <div class="pt-2 space-y-1">
                    <label
                      v-for="gender in genders"
                      :key="gender"
                      class="group flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-gray-50 select-none"
                      @click.prevent="toggleFilter(selectedGenders, gender)"
                    >
                      <div class="flex items-center gap-2.5">
                        <div
                          class="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all duration-150"
                          :class="
                            selectedGenders.includes(gender)
                              ? 'border-black bg-black text-lime-400 shadow-xs'
                              : 'border-gray-300 bg-white group-hover:border-gray-400'
                          "
                        >
                          <svg
                            class="h-2.5 w-2.5 transition-transform duration-150 stroke-[3]"
                            :class="selectedGenders.includes(gender) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span
                          class="transition-colors"
                          :class="selectedGenders.includes(gender) ? 'font-bold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'"
                        >
                          {{ gender }}
                        </span>
                      </div>

                      <span
                        class="text-[10px] font-medium transition-colors px-1.5 py-0.5 rounded"
                        :class="selectedGenders.includes(gender) ? 'bg-lime-100 text-lime-800 font-bold' : 'text-gray-400 bg-gray-50 group-hover:bg-gray-100 group-hover:text-gray-600'"
                      >
                        {{ getGenderCount(gender) }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5. PRICE RANGE (COLLAPSIBLE) -->
            <div class="py-3.5">
              <button
                type="button"
                @click="toggleSection('price')"
                class="flex w-full items-center justify-between text-left group select-none"
              >
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
                    Price Range
                  </span>
                  <span
                    v-if="minPrice > 0 || maxPrice < 1000"
                    class="flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-400 px-1 text-[9px] font-extrabold text-black"
                  >
                    1
                  </span>
                </div>
                <svg
                  class="h-4 w-4 text-gray-400 transition-transform duration-300 ease-out group-hover:text-gray-900"
                  :class="openSections.price ? 'rotate-180' : 'rotate-0'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                class="accordion-grid"
                :class="{ 'is-open': openSections.price }"
              >
                <div class="accordion-inner">
                  <div class="pt-2">
                    <div class="flex items-center gap-2">
                      <div class="relative flex-1">
                        <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                        <input
                          v-model.number="minPrice"
                          type="number"
                          min="0"
                          placeholder="Min"
                          class="w-full rounded-md border border-gray-200 bg-gray-50/50 py-1.5 pl-6 pr-2 text-xs outline-none focus:border-black"
                        />
                      </div>
                      <span class="text-xs text-gray-400">&mdash;</span>
                      <div class="relative flex-1">
                        <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                        <input
                          v-model.number="maxPrice"
                          type="number"
                          min="0"
                          placeholder="Max"
                          class="w-full rounded-md border border-gray-200 bg-gray-50/50 py-1.5 pl-6 pr-2 text-xs outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- RESET BUTTON -->
            <button
              type="button"
              @click="clearFilters"
              class="mt-2 w-full rounded-md bg-black py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-lime-400 hover:text-black active:scale-95"
            >
              Reset Filters
            </button>

            <!-- Mobile Apply & Close Button -->
            <div class="mt-3 pt-3 border-t border-gray-100 lg:hidden">
              <button
                type="button"
                @click="isMobileSidebarOpen = false"
                class="w-full rounded-md bg-black py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-lime-400 hover:text-black active:scale-95"
              >
                Apply &amp; View ({{ filteredProducts.length }})
              </button>
            </div>
          </div>
        </aside>

        <!-- PRODUCT GRID -->
        <main class="min-w-0 flex-1">
          <!-- MOBILE OPEN SIDEBAR BUTTON (Sticky, matching screenshot) -->
          <div class="lg:hidden sticky top-16 sm:top-20 z-30 mb-3 -mt-1 py-1.5 pointer-events-none flex items-center justify-start">
            <button
              type="button"
              @click="isMobileSidebarOpen = true"
              class="pointer-events-auto inline-flex items-center gap-2 rounded-md border border-gray-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-gray-800 shadow-md transition-all hover:bg-gray-50 active:scale-95"
            >
              <svg
                class="h-4 w-4 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
              <span>Open sidebar</span>
              <span
                v-if="hasActiveFilters"
                class="flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-400 px-1 text-[9px] font-extrabold text-black"
              >
                {{ activeFilterCount }}
              </span>
            </button>
          </div>
          <!-- Active Filter Tags Bar -->
          <div v-if="hasActiveFilters" class="mb-4 flex flex-wrap items-center gap-1.5">
            <span class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mr-1">Active:</span>

            <!-- Type tags -->
            <button
              v-for="t in selectedTypes"
              :key="'tag-t-' + t"
              type="button"
              @click="toggleFilter(selectedTypes, t)"
              class="group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-xs hover:border-black hover:bg-black hover:text-white transition-all"
            >
              <span>{{ t }}</span>
              <svg class="h-3 w-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Category tags -->
            <button
              v-for="c in selectedCategories"
              :key="'tag-c-' + c"
              type="button"
              @click="toggleFilter(selectedCategories, c)"
              class="group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-xs hover:border-black hover:bg-black hover:text-white transition-all"
            >
              <span>{{ c }}</span>
              <svg class="h-3 w-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Brand tags -->
            <button
              v-for="b in selectedBrands"
              :key="'tag-b-' + b"
              type="button"
              @click="toggleFilter(selectedBrands, b)"
              class="group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-xs hover:border-black hover:bg-black hover:text-white transition-all"
            >
              <span>{{ b }}</span>
              <svg class="h-3 w-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Gender tags -->
            <button
              v-for="g in selectedGenders"
              :key="'tag-g-' + g"
              type="button"
              @click="toggleFilter(selectedGenders, g)"
              class="group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-xs hover:border-black hover:bg-black hover:text-white transition-all"
            >
              <span>{{ g }}</span>
              <svg class="h-3 w-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Price tag -->
            <button
              v-if="minPrice > 0 || maxPrice < 1000"
              type="button"
              @click="minPrice = 0; maxPrice = 1000;"
              class="group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-xs hover:border-black hover:bg-black hover:text-white transition-all"
            >
              <span>${{ minPrice }} - ${{ maxPrice }}</span>
              <svg class="h-3 w-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Clear all text button -->
            <button
              type="button"
              @click="clearFilters"
              class="text-xs font-semibold text-gray-400 hover:text-black underline ml-1"
            >
              Clear All 
            </button>
          </div>

          <div class="mb-5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="h-5 w-1 rounded-full bg-lime-500"></span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {{
                    selectedCategories.length === 1
                      ? selectedCategories[0]
                      : selectedCategories.length > 1
                        ? `${selectedCategories.length} Categories`
                        : "All Products"
                  }}
                </h1>
                <p class="text-xs text-gray-500">
                  {{ filteredProducts.length }} products found
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="filteredProducts.length"
            class="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          >
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- EMPTY STATE -->
          <div
            v-else
            class="flex min-h-80 items-center justify-center rounded-md border border-gray-200 bg-white p-8 text-center shadow-xs"
          >
            <div>
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 class="mt-4 text-sm font-bold text-gray-900">No products found</h2>
              <p class="mt-1 text-xs text-gray-500">Try adjusting your filters or search terms.</p>
              <button
                @click="clearFilters"
                class="mt-4 rounded-md bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-lime-400 hover:text-black"
              >
                Clear All Filters 
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
