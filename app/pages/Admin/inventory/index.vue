<script setup lang="ts">
import { computed, ref } from "vue";
import { products } from "~/data/product";
import type { InventoryProduct } from "~/type/product";

definePageMeta({
  layout: "admin",
});

/* --------------------------------
   Inventory Data
-------------------------------- */

const inventoryProducts = ref<InventoryProduct[]>(
  products.map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    stock: product.stock,
    image: product.image,
  })),
);

/* --------------------------------
   Filters
-------------------------------- */

const search = ref("");
const selectedBrand = ref("All");
const selectedStatus = ref("All");
const sortBy = ref("Name A-Z");

const viewMode = ref<"table" | "grid">("table");

/* --------------------------------
   Brand List
-------------------------------- */

const brands = computed<string[]>(() => {
  return [
    "All",
    ...new Set(inventoryProducts.value.map((product) => product.brand)),
  ];
});

/* --------------------------------
   Product Status
-------------------------------- */

const getStockStatus = (stock: number) => {
  if (stock === 0) {
    return "Out of Stock";
  }

  if (stock <= 10) {
    return "Low Stock";
  }

  return "In Stock";
};

/* --------------------------------
   Filtered Inventory
-------------------------------- */

const filteredInventory = computed(() => {
  let result = [...inventoryProducts.value];

  /* Search */
  if (search.value.trim()) {
    const keyword = search.value.toLowerCase();

    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.brand.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        `#${product.id}`.includes(keyword),
    );
  }

  /* Brand */
  if (selectedBrand.value !== "All") {
    result = result.filter(
      (product) => product.brand === selectedBrand.value,
    );
  }

  /* Status */
  if (selectedStatus.value !== "All") {
    result = result.filter(
      (product) => getStockStatus(product.stock) === selectedStatus.value,
    );
  }

  /* Sort */
  if (sortBy.value === "Name A-Z") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortBy.value === "Name Z-A") {
    result.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (sortBy.value === "Stock High") {
    result.sort((a, b) => b.stock - a.stock);
  }

  if (sortBy.value === "Stock Low") {
    result.sort((a, b) => a.stock - b.stock);
  }

  if (sortBy.value === "Price High") {
    result.sort((a, b) => b.price - a.price);
  }

  if (sortBy.value === "Price Low") {
    result.sort((a, b) => a.price - b.price);
  }

  return result;
});

/* --------------------------------
   Statistics
-------------------------------- */

const totalProducts = computed(() => {
  return inventoryProducts.value.length;
});

const totalUnits = computed(() => {
  return inventoryProducts.value.reduce(
    (total, product) => total + product.stock,
    0,
  );
});

const lowStockProducts = computed(() => {
  return inventoryProducts.value.filter(
    (product) => product.stock > 0 && product.stock <= 10,
  ).length;
});

const outOfStockProducts = computed(() => {
  return inventoryProducts.value.filter(
    (product) => product.stock === 0,
  ).length;
});

const inventoryValue = computed(() => {
  return inventoryProducts.value.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  );
});

/* --------------------------------
   Modal
-------------------------------- */

const showStockModal = ref(false);
const selectedProduct = ref<InventoryProduct | null>(null);
const stockInput = ref(0);

const openStockModal = (product: InventoryProduct) => {
  selectedProduct.value = product;
  stockInput.value = product.stock;
  showStockModal.value = true;
};

const closeStockModal = () => {
  showStockModal.value = false;
  selectedProduct.value = null;
};

/* --------------------------------
   Update Stock
-------------------------------- */

const updateStock = () => {
  if (!selectedProduct.value) {
    return;
  }

  const product = inventoryProducts.value.find(
    (item) => item.id === selectedProduct.value?.id,
  );

  if (!product) {
    return;
  }

  const newStock = Number(stockInput.value);

  if (newStock < 0) {
    return;
  }

  product.stock = newStock;
  closeStockModal();
};

/* --------------------------------
   Quick Stock
-------------------------------- */

const increaseStock = (product: InventoryProduct) => {
  product.stock += 1;
};

const decreaseStock = (product: InventoryProduct) => {
  if (product.stock > 0) {
    product.stock -= 1;
  }
};

/* --------------------------------
   Clear Filters
-------------------------------- */

const clearFilters = () => {
  search.value = "";
  selectedBrand.value = "All";
  selectedStatus.value = "All";
  sortBy.value = "Name A-Z";
};

/* --------------------------------
   Format & Classes
-------------------------------- */

const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const stockPercentage = (stock: number) => {
  const maxStock = 100;
  return Math.min((stock / maxStock) * 100, 100);
};

const statusClass = (stock: number) => {
  if (stock === 0) {
    return "bg-red-50 text-red-600 border border-red-200/80";
  }

  if (stock <= 10) {
    return "bg-amber-50 text-amber-600 border border-amber-200/80";
  }

  return "bg-emerald-50 text-emerald-600 border border-emerald-200/80";
};
</script>

<template>
  <div class="space-y-5">

    <!-- =========================================
         HEADER
    ========================================== -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-md bg-gray-900 text-white shadow-2xs">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>

          <div>
            <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
              Inventory
            </h1>
            <p class="text-xs text-gray-400 mt-0.5">
              Monitor and manage product stock levels across all sports catalogs
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
        @click="clearFilters"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Reset Filters</span>
      </button>
    </div>

    <!-- =========================================
         STATISTICS (CLEAN SMALL-RADIUS METRICS)
    ========================================== -->
    <div class="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
      <!-- Products -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Products</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xl font-black text-gray-900">{{ totalProducts }}</p>
      </div>

      <!-- Total Units -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Units</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xl font-black text-gray-900">{{ totalUnits.toLocaleString() }}</p>
      </div>

      <!-- Low Stock -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Low Stock</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xl font-black text-amber-600">{{ lowStockProducts }}</p>
      </div>

      <!-- Out of Stock -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Out of Stock</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xl font-black text-red-500">{{ outOfStockProducts }}</p>
      </div>

      <!-- Inventory Value -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Inventory Value</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xl font-black text-emerald-600">{{ formatPrice(inventoryValue) }}</p>
      </div>
    </div>

    <!-- =========================================
         FILTERS BAR
    ========================================== -->
    <div class="rounded-md border border-gray-100 bg-white p-3.5 shadow-xs">
      <div class="flex flex-col gap-2.5 lg:flex-row lg:items-center">
        <!-- Search -->
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Search product, brand or category..."
            class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <!-- Brand -->
        <select
          v-model="selectedBrand"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option
            v-for="brand in brands"
            :key="brand"
            :value="brand"
          >
            {{ brand === "All" ? "All Brands" : brand }}
          </option>
        </select>

        <!-- Status -->
        <select
          v-model="selectedStatus"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="All">All Stock Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <!-- Sort -->
        <select
          v-model="sortBy"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="Name A-Z">Sort: Name A-Z</option>
          <option value="Name Z-A">Sort: Name Z-A</option>
          <option value="Stock High">Sort: Highest Stock</option>
          <option value="Stock Low">Sort: Lowest Stock</option>
          <option value="Price High">Sort: Highest Price</option>
          <option value="Price Low">Sort: Lowest Price</option>
        </select>

        <!-- View Mode Toggle -->
        <div class="flex items-center rounded-lg bg-gray-100/80 p-0.5 border border-gray-100">
          <button
            type="button"
            title="Table View"
            class="flex h-7 w-7 items-center justify-center rounded-md text-xs transition"
            :class="
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-2xs font-bold'
                : 'text-gray-400 hover:text-gray-700'
            "
            @click="viewMode = 'table'"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>

          <button
            type="button"
            title="Grid View"
            class="flex h-7 w-7 items-center justify-center rounded-md text-xs transition"
            :class="
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-2xs font-bold'
                : 'text-gray-400 hover:text-gray-700'
            "
            @click="viewMode = 'grid'"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Result Count -->
    <div class="flex items-center justify-between px-1 text-xs text-gray-400">
      <p>
        Showing
        <span class="font-bold text-gray-900">{{ filteredInventory.length }}</span>
        products in inventory
      </p>
    </div>

    <!-- =========================================
         TABLE VIEW (WITH BORDERLESS ACTION ICONS)
    ========================================== -->
    <div
      v-if="viewMode === 'table'"
      class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-[900px] text-left text-xs">
          <thead class="border-b border-gray-100 bg-white">
            <tr>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                PRODUCT
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                BRAND
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                PRICE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                STOCK UNITS
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                STATUS
              </th>
              <th class="px-6 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100/80">
            <tr
              v-for="product in filteredInventory"
              :key="product.id"
              class="transition hover:bg-gray-50/60"
            >
              <!-- Product -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="h-10 w-10 shrink-0 rounded-lg object-cover bg-gray-50 border border-gray-100 shadow-2xs"
                  />

                  <div>
                    <p class="font-bold text-gray-900 text-xs sm:text-sm">
                      {{ product.name }}
                    </p>
                    <p class="mt-0.5 text-[11px] text-gray-400">
                      #PRD-{{ product.id }} · {{ product.category }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Brand -->
              <td class="px-6 py-4 font-semibold text-gray-700">
                {{ product.brand }}
              </td>

              <!-- Price -->
              <td class="px-6 py-4 font-bold text-gray-900">
                {{ formatPrice(product.price) }}
              </td>

              <!-- Stock Counter -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    title="Decrease Stock"
                    class="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                    @click="decreaseStock(product)"
                  >
                    −
                  </button>

                  <span
                    class="w-12 text-center font-extrabold text-xs"
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

                  <button
                    type="button"
                    title="Increase Stock"
                    class="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                    @click="increaseStock(product)"
                  >
                    +
                  </button>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="rounded-md px-2.5 py-1 text-xs font-semibold"
                  :class="statusClass(product.stock)"
                >
                  {{ getStockStatus(product.stock) }}
                </span>
              </td>

              <!-- ACTIONS: BORDERLESS INLINE ICONS (UPDATE & VIEW) -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-3">
                  <!-- Update Stock Action (Green Edit / Adjust Icon) -->
                  <button
                    type="button"
                    title="Update Stock"
                    class="text-emerald-500 hover:text-emerald-700 hover:scale-125 transition-transform p-0.5"
                    @click="openStockModal(product)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <!-- View Details Action (Blue Eye Icon) -->
                  <NuxtLink
                    :to="`/admin/inventory/${product.id}`"
                    title="View Inventory Details"
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

      <!-- Empty State -->
      <div
        v-if="filteredInventory.length === 0"
        class="py-14 text-center"
      >
        <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="mt-3 text-xs font-bold text-gray-900">No inventory products found</h3>
        <p class="mt-0.5 text-[11px] text-gray-400">Try changing your search keywords or stock filters.</p>
      </div>
    </div>

    <!-- =========================================
         GRID VIEW (WITH BORDERLESS ACTION ICONS)
    ========================================== -->
    <div
      v-if="viewMode === 'grid'"
      class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="product in filteredInventory"
        :key="product.id"
        class="rounded-md border border-gray-100 bg-white p-4 shadow-xs transition hover:shadow-md flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between gap-3">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-16 w-16 rounded-lg object-cover bg-gray-50 border border-gray-100 shadow-2xs shrink-0"
            />

            <span
              class="rounded-md px-2 py-0.5 text-[10px] font-semibold"
              :class="statusClass(product.stock)"
            >
              {{ getStockStatus(product.stock) }}
            </span>
          </div>

          <h3 class="mt-3 font-bold text-xs text-gray-900 line-clamp-1">
            {{ product.name }}
          </h3>

          <p class="text-[11px] text-gray-400 mt-0.5">
            {{ product.brand }} · {{ product.category }}
          </p>

          <div class="mt-3 flex items-center justify-between">
            <span class="font-extrabold text-xs text-gray-900">
              {{ formatPrice(product.price) }}
            </span>

            <span class="text-[11px] font-semibold text-gray-500">
              {{ product.stock }} units
            </span>
          </div>

          <!-- Stock Level Progress Bar -->
          <div class="mt-2.5">
            <div class="mb-1 flex justify-between text-[10px] text-gray-400">
              <span>Stock Level</span>
              <span>{{ product.stock }}/100</span>
            </div>

            <div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full transition-all"
                :class="
                  product.stock === 0
                    ? 'bg-red-500'
                    : product.stock <= 10
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                "
                :style="{
                  width: `${stockPercentage(product.stock)}%`,
                }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Card Footer Actions (Borderless Icons) -->
        <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-2.5">
          <span class="text-[10px] font-semibold text-gray-400">#PRD-{{ product.id }}</span>

          <div class="flex items-center gap-3">
            <!-- Update Stock Action -->
            <button
              type="button"
              title="Update Stock"
              class="text-emerald-500 hover:text-emerald-700 hover:scale-125 transition-transform p-0.5"
              @click="openStockModal(product)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <!-- View Details Action -->
            <NuxtLink
              :to="`/admin/inventory/${product.id}`"
              title="View Inventory Details"
              class="text-blue-400 hover:text-blue-600 hover:scale-125 transition-transform p-0.5"
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

    <!-- =========================================
         UPDATE STOCK MODAL
    ========================================== -->
    <div
      v-if="showStockModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-sm rounded-md bg-white p-5 shadow-xl border border-gray-100">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shadow-2xs">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Update Stock
              </h2>
              <p class="text-[11px] text-gray-400">
                Adjust warehouse quantity
              </p>
            </div>
          </div>

          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 transition"
            @click="closeStockModal"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          v-if="selectedProduct"
          class="mt-4 rounded-lg bg-gray-50/80 p-3 border border-gray-100"
        >
          <p class="font-bold text-xs text-gray-900">
            {{ selectedProduct.name }}
          </p>
          <p class="mt-0.5 text-[11px] text-gray-500">
            Current stock:
            <span class="font-bold text-gray-900">
              {{ selectedProduct.stock }} units
            </span>
          </p>
        </div>

        <div class="mt-4">
          <label class="mb-1.5 block text-xs font-semibold text-gray-700">
            New Stock Quantity
          </label>

          <input
            v-model.number="stockInput"
            type="number"
            min="0"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div class="mt-5 flex justify-end gap-2 text-xs font-semibold">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition"
            @click="closeStockModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-white hover:bg-emerald-700 transition shadow-2xs active:scale-95"
            @click="updateStock"
          >
            Save Stock
          </button>
        </div>
      </div>
    </div>

  </div>
</template>