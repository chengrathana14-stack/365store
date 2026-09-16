<script setup lang="ts">
import { computed, ref } from "vue";
import { brandDetailProductSeedData } from "~/data/admin";
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
// BRAND DATA
// =====================================================

const brand = ref({
  id: brandId,
  name: "Nike",
  description:
    "Nike is one of the world's leading sportswear brands, offering football boots, running shoes, clothing and sports accessories.",
  status: "Active",
  products: 125,
  totalSales: 4820,
  totalRevenue: 145680,
  created: "January 12, 2026",
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
// DELETE
// =====================================================

const showDeleteModal = ref(false);

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const deleteBrand = async () => {
  showDeleteModal.value = false;

  alert(`Brand "${brand.value.name}" deleted.`);

  await navigateTo("/admin/brands");
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
    return "bg-green-100 text-green-700";
  }

  if (status === "Low Stock") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
};
</script>

<template>
  <div class="space-y-6">
    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <!-- BACK -->

        <NuxtLink
          to="/admin/brands"
          class="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black"
        >
          <span class="text-lg">←</span>
          Back to Brands
        </NuxtLink>

        <!-- TITLE -->

        <div class="flex items-center gap-4">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-2xl font-black text-white shadow-sm"
          >
            {{ brand.name.charAt(0) }}
          </div>

          <div>
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-2xl font-bold text-gray-900">
                {{ brand.name }}
              </h2>

              <span
                class="rounded-full px-3 py-1 text-xs font-bold"
                :class="
                  brand.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                {{ brand.status }}
              </span>
            </div>

            <p class="mt-1 text-sm text-gray-500">Brand ID: #{{ brand.id }}</p>
          </div>
        </div>
      </div>

      <!-- ACTIONS -->

      <div class="flex flex-wrap gap-2">
        <button
          @click="toggleStatus"
          class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
        >
          {{ brand.status === "Active" ? "Deactivate" : "Activate" }}
        </button>

        <NuxtLink
          :to="`/admin/brands/${brand.id}/edit`"
          class="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          Edit Brand
        </NuxtLink>

        <button
          @click="openDeleteModal"
          class="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- BRAND INFORMATION -->
    <!-- ================================================= -->

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- DESCRIPTION -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900">Brand Information</h3>

            <p class="mt-1 text-xs text-gray-400">
              Basic information about this brand
            </p>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 font-black"
          >
            B
          </div>
        </div>

        <div class="mt-6">
          <p class="text-sm leading-7 text-gray-600">
            {{ brand.description }}
          </p>
        </div>

        <div class="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-wide text-gray-400"
            >
              Created
            </p>

            <p class="mt-1 text-sm font-semibold text-gray-900">
              {{ brand.created }}
            </p>
          </div>

          <div>
            <p
              class="text-xs font-semibold uppercase tracking-wide text-gray-400"
            >
              Last Updated
            </p>

            <p class="mt-1 text-sm font-semibold text-gray-900">
              {{ brand.updated }}
            </p>
          </div>
        </div>
      </div>

      <!-- BRAND STATUS -->

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-bold text-gray-900">Brand Status</p>

        <div
          class="mt-6 flex items-center justify-center rounded-2xl bg-gray-50 py-8"
        >
          <div class="text-center">
            <div
              class="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl"
              :class="
                brand.status === 'Active'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              "
            >
              {{ brand.status === "Active" ? "✓" : "!" }}
            </div>

            <p class="mt-4 text-lg font-bold">
              {{ brand.status }}
            </p>

            <p class="mt-1 text-xs text-gray-400">
              {{
                brand.status === "Active"
                  ? "Brand is visible in the store"
                  : "Brand is hidden from the store"
              }}
            </p>
          </div>
        </div>

        <button
          @click="toggleStatus"
          class="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          {{
            brand.status === "Active" ? "Deactivate Brand" : "Activate Brand"
          }}
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- STATISTICS -->
    <!-- ================================================= -->

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <!-- Products -->

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100"
        >
          📦
        </div>

        <p class="mt-4 text-sm text-gray-500">Products</p>

        <p class="mt-1 text-2xl font-bold">
          {{ brand.products }}
        </p>
      </div>

      <!-- Sales -->

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100"
        >
          🛒
        </div>

        <p class="mt-4 text-sm text-gray-500">Total Sales</p>

        <p class="mt-1 text-2xl font-bold">
          {{ brand.totalSales.toLocaleString() }}
        </p>
      </div>

      <!-- Revenue -->

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100"
        >
          $
        </div>

        <p class="mt-4 text-sm text-gray-500">Revenue</p>

        <p class="mt-1 text-2xl font-bold">
          {{ formatPrice(brand.totalRevenue) }}
        </p>
      </div>

      <!-- Stock -->

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100"
        >
          📊
        </div>

        <p class="mt-4 text-sm text-gray-500">Current Stock</p>

        <p class="mt-1 text-2xl font-bold">
          {{ totalStock }}
        </p>
      </div>

      <!-- Sold -->

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100"
        >
          ↑
        </div>

        <p class="mt-4 text-sm text-gray-500">Units Sold</p>

        <p class="mt-1 text-2xl font-bold">
          {{ totalSold }}
        </p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- INVENTORY ALERTS -->
    <!-- ================================================= -->

    <div
      v-if="lowStockProducts || outOfStockProducts"
      class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100"
        >
          ⚠️
        </div>

        <div>
          <h3 class="font-bold">Inventory Alerts</h3>

          <p class="text-xs text-gray-400">Products that need your attention</p>
        </div>
      </div>

      <div class="mt-5 grid gap-4 sm:grid-cols-2">
        <!-- LOW -->

        <div class="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p class="text-sm font-semibold text-yellow-800">Low Stock</p>

          <p class="mt-1 text-2xl font-bold text-yellow-900">
            {{ lowStockProducts }}
          </p>

          <p class="mt-1 text-xs text-yellow-700">
            Products have 10 or fewer items
          </p>
        </div>

        <!-- OUT -->

        <div class="rounded-xl border border-red-200 bg-red-50 p-4">
          <p class="text-sm font-semibold text-red-800">Out of Stock</p>

          <p class="mt-1 text-2xl font-bold text-red-900">
            {{ outOfStockProducts }}
          </p>

          <p class="mt-1 text-xs text-red-700">
            Products currently unavailable
          </p>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- PRODUCTS -->
    <!-- ================================================= -->

    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <!-- PRODUCTS HEADER -->

      <div
        class="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 class="font-bold text-gray-900">Brand Products</h3>

          <p class="mt-1 text-xs text-gray-400">
            Products belonging to {{ brand.name }}
          </p>
        </div>

        <div class="relative w-full sm:w-72">
          <span
            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            🔍
          </span>

          <input
            v-model="search"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
          />
        </div>
      </div>

      <!-- TABLE -->

      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Product
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Category
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Price
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Stock
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Sold
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Status
              </th>

              <th
                class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="transition hover:bg-gray-50"
            >
              <!-- PRODUCT -->

              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-lg"
                  >
                    👟
                  </div>

                  <div>
                    <p class="font-semibold text-gray-900">
                      {{ product.name }}
                    </p>

                    <p class="mt-1 text-xs text-gray-400">#{{ product.id }}</p>
                  </div>
                </div>
              </td>

              <!-- CATEGORY -->

              <td class="px-6 py-5 text-sm text-gray-600">
                {{ product.category }}
              </td>

              <!-- PRICE -->

              <td class="px-6 py-5 text-sm font-semibold">
                {{ formatPrice(product.price) }}
              </td>

              <!-- STOCK -->

              <td class="px-6 py-5">
                <span
                  class="font-bold"
                  :class="
                    product.stock === 0
                      ? 'text-red-600'
                      : product.stock <= 10
                        ? 'text-yellow-600'
                        : 'text-gray-900'
                  "
                >
                  {{ product.stock }}
                </span>
              </td>

              <!-- SOLD -->

              <td class="px-6 py-5 text-sm font-semibold">
                {{ product.sold }}
              </td>

              <!-- STATUS -->

              <td class="px-6 py-5">
                <span
                  class="rounded-full px-3 py-1 text-xs font-bold"
                  :class="getProductStatusClass(product.status)"
                >
                  {{ product.status }}
                </span>
              </td>

              <!-- ACTION -->

              <td class="px-6 py-5 text-right">
                <NuxtLink
                  :to="`/admin/products/${product.id}`"
                  class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- EMPTY -->

      <div v-if="filteredProducts.length === 0" class="py-16 text-center">
        <div
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-xl"
        >
          🔍
        </div>

        <h3 class="mt-4 font-bold">No products found</h3>

        <p class="mt-1 text-sm text-gray-500">Try another product name.</p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- DELETE MODAL -->
    <!-- ================================================= -->

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl"
        >
          🗑️
        </div>

        <h3 class="mt-5 text-xl font-bold">Delete Brand?</h3>

        <p class="mt-2 text-sm leading-6 text-gray-500">
          Are you sure you want to delete

          <span class="font-bold text-gray-900">
            {{ brand.name }}
          </span>

          ? This action cannot be undone.
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            @click="deleteBrand"
            class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Delete Brand
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
