<script setup lang="ts">
import { computed, ref } from "vue";
import { brandDetailProductSeedData, brandSeedData } from "~/data/admin";
import type { BrandProduct } from "~/type/admin";

definePageMeta({
  layout: "admin",
});

// =====================================================
// ROUTE
// =====================================================

const route = useRoute();
const brandId = Number(route.params.id);

// =====================================================
// BRAND DATA (CENTRALIZED IN app/data/admin.ts)
// =====================================================

const matchedBrand = brandSeedData.find((item) => item.id === brandId) || brandSeedData[0];

const brand = ref({
  id: matchedBrand.id,
  name: matchedBrand.name,
  description: matchedBrand.description || "Global sportswear and athletic equipment manufacturer partner.",
  status: matchedBrand.status,
  products: matchedBrand.products,
  totalSales: 4820,
  totalRevenue: 145680,
  created: matchedBrand.created || "January 12, 2026",
  updated: "August 28, 2026",
});

// =====================================================
// PRODUCTS
// =====================================================

const products = ref<BrandProduct[]>(
  brandDetailProductSeedData.map((product) => ({ ...product })),
);

// =====================================================
// SEARCH
// =====================================================

const search = ref("");

const filteredProducts = computed(() => {
  if (!search.value.trim()) {
    return products.value;
  }

  const keyword = search.value.toLowerCase();

  return products.value.filter(
    (product) =>
      product.name.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword),
  );
});

// =====================================================
// STATISTICS
// =====================================================

const totalStock = computed(() => {
  return products.value.reduce((total, product) => total + product.stock, 0);
});

const totalSold = computed(() => {
  return products.value.reduce((total, product) => total + product.sold, 0);
});

const lowStockProducts = computed(() => {
  return products.value.filter(
    (product) => product.stock > 0 && product.stock <= 10,
  ).length;
});

const outOfStockProducts = computed(() => {
  return products.value.filter((product) => product.stock === 0).length;
});

// =====================================================
// STATUS
// =====================================================

const toggleStatus = () => {
  brand.value.status = brand.value.status === "Active" ? "Inactive" : "Active";
};

// =====================================================
// BRAND DELETE MODAL
// =====================================================

const showDeleteBrandModal = ref(false);

const openDeleteBrandModal = () => {
  showDeleteBrandModal.value = true;
};

const closeDeleteBrandModal = () => {
  showDeleteBrandModal.value = false;
};

const deleteBrand = async () => {
  showDeleteBrandModal.value = false;
  alert(`Brand "${brand.value.name}" deleted.`);
  await navigateTo("/admin/brands");
};

// =====================================================
// PRODUCT DELETE ACTION
// =====================================================

const productToDelete = ref<number | null>(null);
const showDeleteProductModal = ref(false);

const openDeleteProductModal = (id: number) => {
  productToDelete.value = id;
  showDeleteProductModal.value = true;
};

const closeDeleteProductModal = () => {
  productToDelete.value = null;
  showDeleteProductModal.value = false;
};

const confirmDeleteProduct = () => {
  if (productToDelete.value === null) return;
  const target = products.value.find((p) => p.id === productToDelete.value);
  products.value = products.value.filter((p) => p.id !== productToDelete.value);
  if (target) {
    alert(`Product "${target.name}" removed from brand catalog.`);
  }
  closeDeleteProductModal();
};

// =====================================================
// FORMAT PRICE
// =====================================================

const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// =====================================================
// STATUS CLASS
// =====================================================

const getProductStatusClass = (status: string) => {
  if (status === "In Stock") {
    return "bg-emerald-50 text-emerald-600 border border-emerald-200/80";
  }

  if (status === "Low Stock") {
    return "bg-amber-50 text-amber-600 border border-amber-200/80";
  }

  return "bg-red-50 text-red-600 border border-red-200/80";
};
</script>

<template>
  <div class="space-y-5">

    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <!-- BACK LINK -->
        <NuxtLink
          to="/admin/brands"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition mb-2.5"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Brands</span>
        </NuxtLink>

        <!-- TITLE & BRAND IDENTITY -->
        <div class="flex items-center gap-3.5">
          <div class="flex h-12 w-12 items-center justify-center rounded-md bg-gray-900 text-white font-black text-lg shadow-2xs">
            {{ brand.name.charAt(0) }}
          </div>

          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
                {{ brand.name }}
              </h1>

              <span
                class="rounded-md px-2 py-0.5 text-xs font-semibold"
                :class="
                  brand.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                "
              >
                {{ brand.status }}
              </span>
            </div>

            <p class="text-xs text-gray-400 mt-0.5">
              Brand Partner ID: #{{ brand.id }} • Store Catalog
            </p>
          </div>
        </div>
      </div>

      <!-- HEADER ACTIONS -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="toggleStatus"
          class="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
        >
          {{ brand.status === "Active" ? "Deactivate" : "Activate" }}
        </button>

        <NuxtLink
          to="/admin/brands"
          class="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-black active:scale-95"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit Brand</span>
        </NuxtLink>

        <button
          type="button"
          @click="openDeleteBrandModal"
          class="rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition shadow-2xs"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- BRAND INFORMATION & STATUS (CLEAN SMALL-RADIUS CARDS) -->
    <!-- ================================================= -->
    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Description & Information -->
      <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs lg:col-span-2">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900 text-sm">Brand Information</h3>
            <p class="text-xs text-gray-400 mt-0.5">Basic information about this brand</p>
          </div>

          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shadow-2xs">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        <div class="mt-4">
          <p class="text-xs leading-relaxed text-gray-600">
            {{ brand.description }}
          </p>
        </div>

        <div class="mt-5 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Created</p>
            <p class="mt-1 text-xs font-semibold text-gray-900 flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ brand.created }}</span>
            </p>
          </div>

          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Last Updated</p>
            <p class="mt-1 text-xs font-semibold text-gray-900 flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ brand.updated }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Brand Status Card -->
      <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs flex flex-col justify-between">
        <div>
          <p class="text-xs font-bold text-gray-900">Brand Status</p>

          <div class="mt-4 flex flex-col items-center justify-center rounded-lg bg-gray-50/70 p-6 border border-gray-100/80">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full shadow-2xs"
              :class="
                brand.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-amber-100 text-amber-600'
              "
            >
              <svg v-if="brand.status === 'Active'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <p class="mt-3 text-sm font-bold text-gray-900">
              {{ brand.status }}
            </p>

            <p class="mt-0.5 text-center text-xs text-gray-400">
              {{
                brand.status === "Active"
                  ? "Brand is visible in the store"
                  : "Brand is paused and hidden"
              }}
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="toggleStatus"
          class="mt-4 w-full rounded-lg px-3 py-2.5 text-xs font-semibold transition shadow-2xs"
          :class="
            brand.status === 'Active'
              ? 'bg-gray-900 text-white hover:bg-black'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          "
        >
          {{ brand.status === "Active" ? "Deactivate Brand" : "Activate Brand" }}
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- STATISTICS CARDS (CLEAN SMALL-RADIUS METRICS) -->
    <!-- ================================================= -->
    <div class="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
      <!-- Products -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Products</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xl font-black text-gray-900">{{ brand.products }}</p>
      </div>

      <!-- Total Sales -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Sales</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xl font-black text-emerald-600">{{ brand.totalSales.toLocaleString() }}</p>
      </div>

      <!-- Revenue -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Revenue</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xl font-black text-gray-900">{{ formatPrice(brand.totalRevenue) }}</p>
      </div>

      <!-- Current Stock -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Current Stock</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10l8 4 8-4V7M4 7l8 4m0 0l8-4M12 11v10" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xl font-black text-amber-600">{{ totalStock }}</p>
      </div>

      <!-- Units Sold -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Units Sold</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xl font-black text-gray-900">{{ totalSold }}</p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- INVENTORY ALERTS (CLEAN CARD) -->
    <!-- ================================================= -->
    <div
      v-if="lowStockProducts || outOfStockProducts"
      class="rounded-md border border-amber-200/70 bg-amber-50/40 p-4 shadow-2xs"
    >
      <div class="flex items-center gap-2.5">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 shadow-2xs">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div>
          <h3 class="text-xs font-bold text-gray-900">Inventory Alerts</h3>
          <p class="text-[11px] text-gray-500">Products that need your attention</p>
        </div>
      </div>

      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <!-- Low Stock Alert -->
        <div class="rounded-lg border border-amber-200/80 bg-white p-3 shadow-2xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-amber-800">Low Stock Items</span>
            <span class="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
              {{ lowStockProducts }}
            </span>
          </div>
          <p class="mt-1 text-[11px] text-gray-400">Products with 10 or fewer units remaining</p>
        </div>

        <!-- Out of Stock Alert -->
        <div class="rounded-lg border border-red-200/80 bg-white p-3 shadow-2xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-red-800">Out of Stock Items</span>
            <span class="rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
              {{ outOfStockProducts }}
            </span>
          </div>
          <p class="mt-1 text-[11px] text-gray-400">Products currently with zero stock</p>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- BRAND PRODUCTS TABLE (MATCHING REFERENCE STYLE) -->
    <!-- ================================================= -->
    <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">
      <!-- HEADER & CONTROLS -->
      <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
        <div>
          <h3 class="text-sm font-bold text-gray-900">Products belonging to {{ brand.name }}</h3>
          <p class="text-xs text-gray-400 mt-0.5">{{ filteredProducts.length }} items cataloged under this brand</p>
        </div>

        <!-- Search Input -->
        <div class="relative w-full sm:w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">
        <table class="w-full min-w-[850px] text-left text-xs">
          <thead class="border-b border-gray-100 bg-white">
            <tr>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                PRODUCT
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                CATEGORY
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                PRICE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                STOCK
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                SOLD
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                STATUS
              </th>
              <th class="px-6 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100/80">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="transition hover:bg-gray-50/60"
            >
              <!-- PRODUCT -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 border border-gray-100 shadow-2xs">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>

                  <div>
                    <p class="font-bold text-gray-900 text-xs sm:text-sm">
                      {{ product.name }}
                    </p>
                    <p class="mt-0.5 text-[11px] text-gray-400">#{{ product.id }}</p>
                  </div>
                </div>
              </td>

              <!-- CATEGORY -->
              <td class="px-6 py-4 text-gray-600 font-medium">
                {{ product.category }}
              </td>

              <!-- PRICE -->
              <td class="px-6 py-4 font-bold text-gray-900">
                {{ formatPrice(product.price) }}
              </td>

              <!-- STOCK -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="font-bold"
                  :class="
                    product.stock === 0
                      ? 'text-red-600'
                      : product.stock <= 10
                        ? 'text-amber-600'
                        : 'text-gray-900'
                  "
                >
                  {{ product.stock }}
                </span>
              </td>

              <!-- SOLD -->
              <td class="px-6 py-4 font-semibold text-gray-600">
                {{ product.sold }}
              </td>

              <!-- STATUS -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="rounded-md px-2.5 py-1 text-xs font-semibold"
                  :class="getProductStatusClass(product.status)"
                >
                  {{ product.status }}
                </span>
              </td>

              <!-- ACTIONS (BORDERLESS NAKED INLINE ICONS MATCHING PRODUCTS INDEX) -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-3">
                  <!-- Green Checkmark (Edit / Active) -->
                  <NuxtLink
                    :to="`/admin/products/${product.id}`"
                    title="Edit Product"
                    class="text-emerald-500 hover:text-emerald-700 hover:scale-125 transition-transform p-0.5"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </NuxtLink>

                  <!-- Red Cross (Delete / Remove) -->
                  <button
                    type="button"
                    title="Remove from Catalog"
                    class="text-red-400 hover:text-red-600 hover:scale-125 transition-transform p-0.5"
                    @click="openDeleteProductModal(product.id)"
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

      <!-- EMPTY STATE -->
      <div v-if="filteredProducts.length === 0" class="py-14 text-center">
        <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="mt-3 text-xs font-bold text-gray-900">No products found</h3>
        <p class="mt-0.5 text-[11px] text-gray-400">Try searching for another product name or category.</p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- PRODUCT DELETE CONFIRMATION MODAL -->
    <!-- ================================================= -->
    <div
      v-if="showDeleteProductModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-sm rounded-md bg-white p-5 shadow-xl border border-gray-100">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 class="mt-3 text-sm font-bold text-gray-900">Remove Product?</h3>
        <p class="mt-1 text-xs leading-relaxed text-gray-500">
          Are you sure you want to remove this product from the brand catalog?
        </p>

        <div class="mt-5 flex justify-end gap-2 text-xs font-semibold">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition"
            @click="closeDeleteProductModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 transition"
            @click="confirmDeleteProduct"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- BRAND DELETE MODAL -->
    <!-- ================================================= -->
    <div
      v-if="showDeleteBrandModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-sm rounded-md bg-white p-5 shadow-xl border border-gray-100">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 class="mt-3 text-sm font-bold text-gray-900">Delete Brand Partner?</h3>
        <p class="mt-1 text-xs leading-relaxed text-gray-500">
          Are you sure you want to delete <span class="font-semibold text-gray-900">{{ brand.name }}</span>? All associated product relationships will be affected.
        </p>

        <div class="mt-5 flex justify-end gap-2 text-xs font-semibold">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition"
            @click="closeDeleteBrandModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 transition"
            @click="deleteBrand"
          >
            Delete Brand
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
