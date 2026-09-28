<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useAdminStore } from "~/composables/useAdminStore";
import { useToast } from "~/composables/useToast";
import type { ProductStatus, ViewMode } from "~/type/product";

definePageMeta({
  layout: "admin",
});

const { allProducts, deleteProduct: removeProductStore } = useAdminStore();
const { success } = useToast();

const products = allProducts;

/* =========================================
   STATE
========================================= */

const search = ref("");
const selectedBrand = ref("All");
const selectedCategory = ref("All");
const selectedStatus = ref<ProductStatus>("All");
const selectedSort = ref("Newest");
const viewMode = ref<ViewMode>("table");
const showFilterPanel = ref(false);

const currentPage = ref(1);
const itemsPerPage = ref(8);

const showDeleteModal = ref(false);
const productToDelete = ref<number | null>(null);

/* =========================================
   RESET PAGE ON FILTER CHANGE
========================================= */
watch([search, selectedBrand, selectedCategory, selectedStatus, selectedSort], () => {
  currentPage.value = 1;
});

/* =========================================
   BRAND LIST
========================================= */

const brands = computed<string[]>(() => {
  return [
    "All",
    ...new Set(products.map((product) => product.brand)),
  ];
});

/* =========================================
   CATEGORY LIST
========================================= */

const categories = computed<string[]>(() => {
  return [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];
});

/* =========================================
   PRODUCT STATUS HELPER
========================================= */

const getProductStatus = (stock: number): ProductStatus => {
  if (stock === 0) {
    return "Out of Stock";
  }

  if (stock <= 10) {
    return "Low Stock";
  }

  return "In Stock";
};

/* =========================================
   FILTER PRODUCTS
========================================= */

const filteredProducts = computed(() => {
  let result = [...products];

  /* Search */
  if (search.value.trim()) {
    const keyword = search.value.toLowerCase();

    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.brand.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        `PRD-${String(product.id).padStart(6, "0")}`.toLowerCase().includes(keyword),
    );
  }

  /* Brand */
  if (selectedBrand.value !== "All") {
    result = result.filter(
      (product) => product.brand === selectedBrand.value,
    );
  }

  /* Category */
  if (selectedCategory.value !== "All") {
    result = result.filter(
      (product) => product.category === selectedCategory.value,
    );
  }

  /* Stock Status */
  if (selectedStatus.value !== "All") {
    result = result.filter(
      (product) =>
        getProductStatus(product.stock) === selectedStatus.value,
    );
  }

  /* Sort */
  if (selectedSort.value === "Name A-Z") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedSort.value === "Name Z-A") {
    result.sort((a, b) => b.name.localeCompare(a.name));
  } else if (selectedSort.value === "Price High") {
    result.sort((a, b) => b.price - a.price);
  } else if (selectedSort.value === "Price Low") {
    result.sort((a, b) => a.price - b.price);
  } else if (selectedSort.value === "Stock High") {
    result.sort((a, b) => b.stock - a.stock);
  } else if (selectedSort.value === "Stock Low") {
    result.sort((a, b) => a.stock - b.stock);
  } else if (selectedSort.value === "Rating") {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
});

/* =========================================
   PAGINATION
========================================= */

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredProducts.value.slice(start, start + itemsPerPage.value);
});

const paginationStart = computed(() => {
  if (filteredProducts.value.length === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredProducts.value.length);
});

/* =========================================
   STATISTICS & BADGE COUNTS
========================================= */

const totalProducts = computed(() => products.length);

const inStockCount = computed(() => {
  return products.filter((p) => getProductStatus(p.stock) === "In Stock").length;
});

const lowStockCount = computed(() => {
  return products.filter((p) => getProductStatus(p.stock) === "Low Stock").length;
});

const outOfStockCount = computed(() => {
  return products.filter((p) => getProductStatus(p.stock) === "Out of Stock").length;
});

const totalStock = computed(() => {
  return products.reduce((total, product) => total + product.stock, 0);
});

const totalInventoryValue = computed(() => {
  return products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  );
});

/* =========================================
   FILTER ACTIONS
========================================= */

const clearFilters = () => {
  search.value = "";
  selectedBrand.value = "All";
  selectedCategory.value = "All";
  selectedStatus.value = "All";
  selectedSort.value = "Newest";
  currentPage.value = 1;
};

/* =========================================
   DELETE MODAL
========================================= */

const openDeleteModal = (id: number) => {
  productToDelete.value = id;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  productToDelete.value = null;
  showDeleteModal.value = false;
};

const deleteProduct = () => {
  if (productToDelete.value === null) return;

  const product = products.value.find((item) => item.id === productToDelete.value);
  if (product) {
    removeProductStore(product.id);
    success("Product Deleted", `Product "${product.name}" has been removed from catalog.`);
  }

  closeDeleteModal();
};

/* =========================================
   FORMAT PRICE
========================================= */

const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
</script>

<template>
  <div class="space-y-5">

    <!-- =====================================
         PAGE HEADER
    ====================================== -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
          Products
        </h1>
        <p class="text-xs text-gray-400 mt-0.5">
          Manage your sports catalog, inventory, and availability
        </p>
      </div>

      <NuxtLink
        to="/admin/products/create"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Product</span>
      </NuxtLink>
    </div>

    <!-- =====================================
         MINI KPI METRICS
    ====================================== -->
    <div class="grid gap-3 grid-cols-2 lg:grid-cols-4">
      <!-- Total Products -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Products</p>
        <p class="mt-1 text-2xl font-black text-gray-900">{{ totalProducts }}</p>
      </div>

      <!-- In Stock -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">In Stock</p>
        <p class="mt-1 text-2xl font-black text-emerald-600">{{ inStockCount }}</p>
      </div>

      <!-- Low Stock -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Low Stock</p>
        <p class="mt-1 text-2xl font-black text-amber-500">{{ lowStockCount }}</p>
      </div>

      <!-- Out of Stock -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Out of Stock</p>
        <p class="mt-1 text-2xl font-black text-red-500">{{ outOfStockCount }}</p>
      </div>
    </div>

    <!-- =====================================
         MAIN CARD (MATCHING REFERENCE STYLE)
    ====================================== -->
    <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">

      <!-- 1. TOP CONTROLS BAR -->
      <div class="flex flex-col gap-3.5 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
        
        <!-- Left: Search input, Filter button, Live badge -->
        <div class="flex flex-wrap items-center gap-2">
          
          <!-- Search Box -->
          <div class="relative w-60 sm:w-72">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              v-model="search"
              type="text"
              placeholder="Search product name, SKU, brand..."
              class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Filter Funnel Icon Button -->
          <button
            type="button"
            title="Filter options"
            class="flex h-8 w-8 items-center justify-center rounded-lg border transition"
            :class="
              showFilterPanel || selectedBrand !== 'All' || selectedCategory !== 'All'
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            "
            @click="showFilterPanel = !showFilterPanel"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>

          <!-- Live Badge -->
          <div class="flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Live</span>
          </div>
        </div>

        <!-- Right: Status Filter Pills Tab -->
        <div class="flex items-center rounded-md bg-gray-100/80 p-1 text-xs font-medium">
          <!-- All -->
          <button
            type="button"
            class="rounded-lg px-3 py-1 transition"
            :class="
              selectedStatus === 'All'
                ? 'bg-white font-bold text-blue-600 shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            "
            @click="selectedStatus = 'All'"
          >
            All
          </button>

          <!-- In Stock -->
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1 transition"
            :class="
              selectedStatus === 'In Stock'
                ? 'bg-white font-bold text-blue-600 shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            "
            @click="selectedStatus = 'In Stock'"
          >
            <span>In Stock</span>
            <span
              class="rounded-full px-1.5 py-0.2 text-[10px] font-bold"
              :class="
                selectedStatus === 'In Stock'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              "
            >
              {{ inStockCount }}
            </span>
          </button>

          <!-- Low Stock -->
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1 transition"
            :class="
              selectedStatus === 'Low Stock'
                ? 'bg-white font-bold text-blue-600 shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            "
            @click="selectedStatus = 'Low Stock'"
          >
            <span>Low Stock</span>
            <span
              class="rounded-full px-1.5 py-0.2 text-[10px] font-bold"
              :class="
                selectedStatus === 'Low Stock'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              "
            >
              {{ lowStockCount }}
            </span>
          </button>

          <!-- Out of Stock -->
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1 transition"
            :class="
              selectedStatus === 'Out of Stock'
                ? 'bg-white font-bold text-blue-600 shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            "
            @click="selectedStatus = 'Out of Stock'"
          >
            <span>Out of Stock</span>
            <span
              class="rounded-full px-1.5 py-0.2 text-[10px] font-bold"
              :class="
                selectedStatus === 'Out of Stock'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              "
            >
              {{ outOfStockCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- 2. EXPANDABLE FILTER OPTIONS (Brand, Category, Sort, ViewMode) -->
      <div
        v-if="showFilterPanel"
        class="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-gray-50/60 px-4 py-3 text-xs"
      >
        <!-- Brand -->
        <div class="flex items-center gap-1.5">
          <span class="text-gray-500 font-medium">Brand:</span>
          <select
            v-model="selectedBrand"
            class="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 outline-none focus:border-blue-500"
          >
            <option v-for="b in brands" :key="b" :value="b">
              {{ b === "All" ? "All Brands" : b }}
            </option>
          </select>
        </div>

        <!-- Category -->
        <div class="flex items-center gap-1.5">
          <span class="text-gray-500 font-medium">Category:</span>
          <select
            v-model="selectedCategory"
            class="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 outline-none focus:border-blue-500"
          >
            <option v-for="c in categories" :key="c" :value="c">
              {{ c === "All" ? "All Categories" : c }}
            </option>
          </select>
        </div>

        <!-- Sort -->
        <div class="flex items-center gap-1.5">
          <span class="text-gray-500 font-medium">Sort:</span>
          <select
            v-model="selectedSort"
            class="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="Newest">Newest</option>
            <option value="Name A-Z">Name A-Z</option>
            <option value="Name Z-A">Name Z-A</option>
            <option value="Price High">Price: High to Low</option>
            <option value="Price Low">Price: Low to High</option>
            <option value="Stock High">Stock: High to Low</option>
            <option value="Stock Low">Stock: Low to High</option>
            <option value="Rating">Rating</option>
          </select>
        </div>

        <!-- View Mode Toggle -->
        <div class="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 ml-auto">
          <button
            type="button"
            class="rounded px-2 py-0.5 text-xs font-medium transition"
            :class="viewMode === 'table' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'"
            @click="viewMode = 'table'"
          >
            Table
          </button>
          <button
            type="button"
            class="rounded px-2 py-0.5 text-xs font-medium transition"
            :class="viewMode === 'grid' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'"
            @click="viewMode = 'grid'"
          >
            Grid
          </button>
        </div>

        <!-- Clear Button -->
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
          @click="clearFilters"
        >
          Reset
        </button>
      </div>

      <!-- 3. TABLE VIEW -->
      <div v-if="viewMode === 'table'" class="overflow-x-auto">
        <table class="w-full min-w-[900px] text-left text-xs">
          <!-- Table Header -->
          <thead class="border-b border-gray-100 bg-white">
            <tr>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                PRODUCT CODE / DATE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                PRODUCT INFO
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                CATEGORY & BRAND
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                STOCK AVAILABLE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                STATUS
              </th>
              <th class="px-6 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
                ACTIONS
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="divide-y divide-gray-100/80">
            <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              class="transition hover:bg-gray-50/60"
            >
              <!-- 1. REQUEST NO. / DATE -->
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="font-bold text-gray-900 text-xs sm:text-sm tracking-tight">
                  REQ-1789{{ String(product.id).padStart(4, "0") }}-{{ 2300 + product.id }}
                </p>
                <p class="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
                  <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>13 Sept 2026, 15:51</span>
                </p>
              </td>

              <!-- 2. PRODUCT INFO (Thumbnail + Name + SKU) -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <!-- Thumbnail -->
                  <div class="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="h-full w-full object-cover"
                    />
                  </div>

                  <div class="min-w-0 max-w-[200px]">
                    <p class="truncate text-xs font-bold text-gray-900" :title="product.name">
                      {{ product.name }}
                    </p>
                    <p class="mt-0.5 text-[11px] text-gray-400 truncate">
                      ID: PRD-00{{ product.id }} • {{ product.brand }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- 3. REQUESTED BOOK (Category & Details) -->
              <td class="px-6 py-4">
                <p class="text-xs font-bold text-gray-900 line-clamp-1">
                  {{ product.category }}
                </p>
                <p class="mt-0.5 text-[11px] text-gray-400">
                  {{ formatPrice(product.price) }}
                  <span v-if="product.discount > 0" class="text-red-500 font-semibold ml-1">
                    (-{{ product.discount }}%)
                  </span>
                </p>
              </td>

              <!-- 4. STOCK AVAILABLE -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-block rounded-md px-2.5 py-1 text-xs font-semibold"
                  :class="
                    product.stock === 0
                      ? 'bg-red-50 text-red-600'
                      : product.stock <= 10
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-emerald-600'
                  "
                >
                  {{ product.stock }} units
                </span>
              </td>

              <!-- 5. STATUS -->
              <td class="px-6 py-4 whitespace-nowrap">
                <!-- Low Stock -->
                <span
                  v-if="product.stock > 0 && product.stock <= 10"
                  class="inline-flex items-center gap-1.5 rounded-md border border-amber-200/80 bg-amber-50/50 px-2.5 py-1 text-xs font-medium text-amber-600"
                >
                  <svg class="h-3 w-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Low Stock</span>
                </span>

                <!-- In Stock / Available -->
                <span
                  v-else-if="product.stock > 10"
                  class="inline-flex items-center gap-1.5 rounded-md border border-emerald-200/80 bg-emerald-50/50 px-2.5 py-1 text-xs font-medium text-emerald-600"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Available</span>
                </span>

                <!-- Out of stock -->
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 rounded-md border border-red-200/80 bg-red-50/50 px-2.5 py-1 text-xs font-medium text-red-600"
                >
                  <svg class="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Out of Stock</span>
                </span>
              </td>

              <!-- 6. ACTIONS (Naked, borderless inline icons: ✓ green, ✕ red, 👁 blue) -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-3">
                  <!-- Green Checkmark (Edit / Approve) -->
                  <NuxtLink
                    :to="`/admin/products/${product.id}/edit`"
                    title="Edit Product"
                    class="text-emerald-500 hover:text-emerald-700 hover:scale-125 transition-transform p-0.5"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </NuxtLink>

                  <!-- Red Cross (Delete / Reject) -->
                  <button
                    type="button"
                    title="Delete Product"
                    class="text-red-400 hover:text-red-600 hover:scale-125 transition-transform p-0.5"
                    @click="openDeleteModal(product.id)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <!-- Blue Eye (View Details) -->
                  <NuxtLink
                    :to="`/admin/products/${product.id}`"
                    title="View Product"
                    class="text-blue-400 hover:text-blue-600 hover:scale-125 transition-transform p-0.5"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 4. GRID VIEW (When switched to grid) -->
      <div
        v-if="viewMode === 'grid' && filteredProducts.length"
        class="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="overflow-hidden rounded-md border border-gray-100 bg-white p-4 shadow-2xs transition hover:shadow-xs"
        >
          <div class="relative h-44 overflow-hidden rounded-lg bg-gray-50">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-cover"
            />
            <span
              class="absolute right-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-semibold"
              :class="
                product.stock === 0
                  ? 'bg-red-50 text-red-600'
                  : product.stock <= 10
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-emerald-50 text-emerald-600'
              "
            >
              {{ product.stock }} units
            </span>
          </div>

          <div class="mt-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {{ product.brand }}
            </p>
            <h3 class="font-bold text-xs text-gray-900 line-clamp-1 mt-0.5">
              {{ product.name }}
            </h3>

            <div class="mt-2 flex items-center justify-between">
              <span class="text-xs font-extrabold text-gray-900">
                {{ formatPrice(product.price) }}
              </span>
              <span class="text-[11px] text-gray-400">
                {{ product.category }}
              </span>
            </div>

            <!-- Borderless naked actions -->
            <div class="mt-3 flex items-center justify-end gap-3 border-t border-gray-100 pt-2.5">
              <NuxtLink
                :to="`/admin/products/${product.id}/edit`"
                title="Edit Product"
                class="text-emerald-500 hover:text-emerald-700 transition"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </NuxtLink>

              <button
                type="button"
                title="Delete Product"
                class="text-red-400 hover:text-red-600 transition"
                @click="openDeleteModal(product.id)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <NuxtLink
                :to="`/admin/products/${product.id}`"
                title="View Product"
                class="text-blue-400 hover:text-blue-600 transition"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. EMPTY STATE -->
      <div
        v-if="filteredProducts.length === 0"
        class="py-16 text-center"
      >
        <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="mt-3 text-sm font-bold text-gray-900">No products found</h3>
        <p class="mt-1 text-xs text-gray-400">Try changing your search keywords or filter status.</p>
        <button
          type="button"
          class="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>

      <!-- 6. TABLE FOOTER -->
      <div
        v-if="filteredProducts.length > 0"
        class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 bg-white text-xs text-gray-400 font-medium"
      >
        <p>
          Showing {{ paginationStart }} to {{ paginationEnd }} of {{ filteredProducts.length }} products
        </p>

        <!-- Pagination Controls -->
        <div class="flex items-center gap-2">
          <!-- Prev -->
          <button
            type="button"
            :disabled="currentPage === 1"
            class="text-xs font-medium text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            @click="currentPage--"
          >
            Prev
          </button>

          <!-- Pages -->
          <div class="flex items-center gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              class="h-7 min-w-[28px] px-2 rounded-md border text-xs font-semibold transition"
              :class="
                currentPage === page
                  ? 'border-blue-500 bg-white text-blue-600 font-bold shadow-2xs'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              "
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>

          <!-- Next -->
          <button
            type="button"
            :disabled="currentPage === totalPages"
            class="text-xs font-medium text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- =====================================
         DELETE CONFIRMATION MODAL
    ====================================== -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-sm rounded-md bg-white p-5 shadow-xl border border-gray-100">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h2 class="mt-3 text-sm font-bold text-gray-900">Delete Request?</h2>
        <p class="mt-1 text-xs leading-relaxed text-gray-500">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>

        <div class="mt-5 flex justify-end gap-2 text-xs font-semibold">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition"
            @click="closeDeleteModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 transition"
            @click="deleteProduct"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

  </div>
</template>