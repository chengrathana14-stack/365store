<script setup lang="ts">
import { computed, ref } from "vue";
import { products } from "~/data/product";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const productId = Number(route.params.id);

const product = ref(
  products.find((item) => item.id === productId),
);

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Product not found in inventory catalog",
  });
}

/* --------------------------------
   Stock Management State
-------------------------------- */

const stock = ref(product.value?.stock ?? 0);
const minimumStock = ref(10);

const stockStatus = computed(() => {
  if (stock.value === 0) {
    return "Out of Stock";
  }

  if (stock.value <= minimumStock.value) {
    return "Low Stock";
  }

  return "In Stock";
});

const statusClass = computed(() => {
  if (stockStatus.value === "Out of Stock") {
    return "bg-red-50 text-red-600 border border-red-200/80";
  }

  if (stockStatus.value === "Low Stock") {
    return "bg-amber-50 text-amber-600 border border-amber-200/80";
  }

  return "bg-emerald-50 text-emerald-600 border border-emerald-200/80";
});

/* --------------------------------
   Stock Update
-------------------------------- */

const stockInput = ref(stock.value);

const updateStock = () => {
  const value = Number(stockInput.value);

  if (value < 0) {
    return;
  }

  stock.value = value;

  if (product.value) {
    product.value.stock = value;
  }

  alert(`Stock updated to ${value} units for "${product.value?.name}".`);
};

/* --------------------------------
   Quick Actions
-------------------------------- */

const addStock = (amount: number) => {
  stock.value += amount;
  stockInput.value = stock.value;

  if (product.value) {
    product.value.stock = stock.value;
  }
};

const removeStock = (amount: number) => {
  stock.value = Math.max(0, stock.value - amount);
  stockInput.value = stock.value;

  if (product.value) {
    product.value.stock = stock.value;
  }
};

/* --------------------------------
   Format
-------------------------------- */

const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
</script>

<template>
  <div
    v-if="product"
    class="space-y-5"
  >

    <!-- Header Navigation & Title -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <NuxtLink
          to="/admin/inventory"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition mb-2"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Inventory</span>
        </NuxtLink>

        <div class="flex items-center gap-3.5 mt-1">
          <img
            :src="product.image"
            :alt="product.name"
            class="h-12 w-12 rounded-md object-cover border border-gray-100 shadow-2xs shrink-0 bg-gray-50"
          />

          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
                {{ product.name }}
              </h1>

              <span
                class="rounded-md px-2 py-0.5 text-xs font-semibold"
                :class="statusClass"
              >
                {{ stockStatus }}
              </span>
            </div>

            <p class="text-xs text-gray-400 mt-0.5">
              #PRD-{{ product.id }} · {{ product.brand }} · {{ product.category }}
            </p>
          </div>
        </div>
      </div>

      <!-- Action: View in Catalog -->
      <NuxtLink
        :to="`/admin/products/${product.id}`"
        class="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-black transition active:scale-95"
      >
        <svg class="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>View Product Details</span>
      </NuxtLink>
    </div>

    <!-- KPI Statistics (Clean Small-Radius) -->
    <div class="grid gap-3 grid-cols-2 lg:grid-cols-4">
      <!-- Current Stock -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Current Stock</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <p
          class="mt-2 text-2xl font-black"
          :class="stock === 0 ? 'text-red-600' : stock <= minimumStock ? 'text-amber-600' : 'text-gray-900'"
        >
          {{ stock }} <span class="text-xs font-normal text-gray-400">units</span>
        </p>
      </div>

      <!-- Retail Price -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Unit Retail Price</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">
          {{ formatPrice(product.price) }}
        </p>
      </div>

      <!-- Total Stock Value -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Inventory Asset Value</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-emerald-600">
          {{ formatPrice(product.price * stock) }}
        </p>
      </div>

      <!-- Minimum Stock Threshold -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Min. Stock Alert Level</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">
          {{ minimumStock }} <span class="text-xs font-normal text-gray-400">units</span>
        </p>
      </div>
    </div>

    <!-- Main Stock Controls & Info -->
    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Stock Management Panel -->
      <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs lg:col-span-2">
        <div>
          <h2 class="text-sm font-bold text-gray-900">
            Stock Adjustment & Inventory Control
          </h2>
          <p class="text-xs text-gray-400 mt-0.5">
            Modify warehouse quantities or log quick additions and removals
          </p>
        </div>

        <!-- Current Status Progress -->
        <div class="mt-4 rounded-lg bg-gray-50/70 p-4 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-gray-500">Available Warehouse Inventory</p>
              <p class="mt-1 text-3xl font-black text-gray-900">
                {{ stock }} <span class="text-xs font-medium text-gray-400">units</span>
              </p>
            </div>

            <span
              class="rounded-md px-2.5 py-1 text-xs font-semibold"
              :class="statusClass"
            >
              {{ stockStatus }}
            </span>
          </div>

          <!-- Progress bar -->
          <div class="mt-3">
            <div class="mb-1 flex justify-between text-[11px] text-gray-400">
              <span>Capacity Level</span>
              <span>{{ stock }}/100 max safe stock</span>
            </div>

            <div class="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                class="h-full rounded-full transition-all"
                :class="
                  stock === 0
                    ? 'bg-red-500'
                    : stock <= minimumStock
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                "
                :style="{
                  width: `${Math.min((stock / 100) * 100, 100)}%`,
                }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Set Stock Input -->
        <div class="mt-5">
          <label class="mb-1.5 block text-xs font-semibold text-gray-700">
            Override Stock Quantity
          </label>

          <div class="flex gap-2">
            <input
              v-model.number="stockInput"
              type="number"
              min="0"
              placeholder="Enter units..."
              class="flex-1 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-bold text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition active:scale-95"
              @click="updateStock"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Quantity</span>
            </button>
          </div>
        </div>

        <!-- Quick Adjustment Buttons -->
        <div class="mt-5 border-t border-gray-100 pt-4">
          <p class="text-xs font-semibold text-gray-700 mb-2">
            Quick Stock Adjustment
          </p>

          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              class="rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-2xs"
              @click="addStock(1)"
            >
              +1 Unit
            </button>

            <button
              type="button"
              class="rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-2xs"
              @click="addStock(10)"
            >
              +10 Units
            </button>

            <button
              type="button"
              class="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition shadow-2xs"
              @click="removeStock(1)"
            >
              -1 Unit
            </button>

            <button
              type="button"
              class="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition shadow-2xs"
              @click="removeStock(10)"
            >
              -10 Units
            </button>
          </div>
        </div>
      </div>

      <!-- Product Information Card -->
      <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs flex flex-col justify-between">
        <div>
          <h2 class="text-sm font-bold text-gray-900">
            Product Profile
          </h2>
          <p class="text-xs text-gray-400 mt-0.5">
            Catalog specifications and categorization
          </p>

          <div class="mt-4 space-y-3.5 text-xs">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Product Name</p>
              <p class="mt-0.5 font-bold text-gray-900">{{ product.name }}</p>
            </div>

            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Brand Partner</p>
              <p class="mt-0.5 font-semibold text-gray-700">{{ product.brand }}</p>
            </div>

            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Category Taxonomy</p>
              <p class="mt-0.5 font-semibold text-gray-700">{{ product.category }}</p>
            </div>

            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Retail Unit Price</p>
              <p class="mt-0.5 font-bold text-gray-900">{{ formatPrice(product.price) }}</p>
            </div>

            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Status Indicator</p>
              <span
                class="mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-semibold"
                :class="statusClass"
              >
                {{ stockStatus }}
              </span>
            </div>
          </div>
        </div>

        <NuxtLink
          :to="`/admin/products/${product.id}`"
          class="mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
        >
          <svg class="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit Product in Catalog</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Inventory History Log -->
    <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">
      <div class="border-b border-gray-100 p-4">
        <h2 class="text-sm font-bold text-gray-900">
          Stock Movement History
        </h2>
        <p class="text-xs text-gray-400 mt-0.5">
          Recent audit log of incoming restocks, customer orders, and adjustments
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-gray-100 bg-white text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <tr>
              <th class="px-6 py-3.5">Date</th>
              <th class="px-6 py-3.5">Activity Type</th>
              <th class="px-6 py-3.5">Quantity Change</th>
              <th class="px-6 py-3.5">Stock Level After</th>
              <th class="px-6 py-3.5">Log Note</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100/80">
            <tr class="transition hover:bg-gray-50/60">
              <td class="px-6 py-4 font-medium text-gray-600">September 3, 2026</td>
              <td class="px-6 py-4">
                <span class="rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 text-xs font-semibold">
                  Stock Added
                </span>
              </td>
              <td class="px-6 py-4 font-bold text-emerald-600">+10 units</td>
              <td class="px-6 py-4 font-bold text-gray-900">{{ stock }} units</td>
              <td class="px-6 py-4 text-gray-500">Supplier shipment arrived</td>
            </tr>

            <tr class="transition hover:bg-gray-50/60">
              <td class="px-6 py-4 font-medium text-gray-600">September 1, 2026</td>
              <td class="px-6 py-4">
                <span class="rounded-md bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 text-xs font-semibold">
                  Customer Sale
                </span>
              </td>
              <td class="px-6 py-4 font-bold text-red-600">-2 units</td>
              <td class="px-6 py-4 font-bold text-gray-900">{{ Math.max(stock - 2, 0) }} units</td>
              <td class="px-6 py-4 text-gray-500">Store order fulfillment</td>
            </tr>

            <tr class="transition hover:bg-gray-50/60">
              <td class="px-6 py-4 font-medium text-gray-600">August 28, 2026</td>
              <td class="px-6 py-4">
                <span class="rounded-md bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 text-xs font-semibold">
                  Manual Adjustment
                </span>
              </td>
              <td class="px-6 py-4 font-bold text-blue-600">+5 units</td>
              <td class="px-6 py-4 font-bold text-gray-900">{{ Math.max(stock - 5, 0) }} units</td>
              <td class="px-6 py-4 text-gray-500">Physical stock count audit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>