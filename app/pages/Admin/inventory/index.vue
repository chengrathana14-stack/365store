<script setup lang="ts">
import { computed, ref } from "vue";
import { products } from "~/data/product";

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

const brands = computed(() => {
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
        product.category.toLowerCase().includes(keyword),
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
   Format
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
    return "bg-red-100 text-red-700";
  }

  if (stock <= 10) {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-green-100 text-green-700";
};
</script>

<template>
  <div class="space-y-6">

    <!-- =========================================
         HEADER
    ========================================== -->

    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >

      <div>
        <div class="flex items-center gap-3">

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-xl text-white"
          >
            📦
          </div>

          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Inventory
            </h1>

            <p class="text-sm text-gray-500">
              Monitor and manage product stock levels
            </p>
          </div>

        </div>
      </div>

      <button
        class="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        @click="clearFilters"
      >
        Refresh Inventory
      </button>

    </div>

    <!-- =========================================
         STATISTICS
    ========================================== -->

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

      <!-- Products -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >

        <div class="flex items-center justify-between">

          <div>
            <p class="text-sm text-gray-500">
              Total Products
            </p>

            <p class="mt-2 text-2xl font-bold">
              {{ totalProducts }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl"
          >
            🛍️
          </div>

        </div>

      </div>

      <!-- Units -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >

        <div class="flex items-center justify-between">

          <div>
            <p class="text-sm text-gray-500">
              Total Units
            </p>

            <p class="mt-2 text-2xl font-bold">
              {{ totalUnits }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl"
          >
            📦
          </div>

        </div>

      </div>

      <!-- Low -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >

        <div class="flex items-center justify-between">

          <div>
            <p class="text-sm text-gray-500">
              Low Stock
            </p>

            <p class="mt-2 text-2xl font-bold text-orange-600">
              {{ lowStockProducts }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-xl"
          >
            ⚠️
          </div>

        </div>

      </div>

      <!-- Out -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >

        <div class="flex items-center justify-between">

          <div>
            <p class="text-sm text-gray-500">
              Out of Stock
            </p>

            <p class="mt-2 text-2xl font-bold text-red-600">
              {{ outOfStockProducts }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-xl"
          >
            🚫
          </div>

        </div>

      </div>

      <!-- Value -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >

        <div class="flex items-center justify-between">

          <div>
            <p class="text-sm text-gray-500">
              Inventory Value
            </p>

            <p class="mt-2 text-2xl font-bold">
              {{ formatPrice(inventoryValue) }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl"
          >
            $
          </div>

        </div>

      </div>

    </div>

    <!-- =========================================
         ALERTS
    ========================================== -->

    <div
      v-if="lowStockProducts > 0 || outOfStockProducts > 0"
      class="grid gap-4 md:grid-cols-2"
    >

      <div
        v-if="lowStockProducts > 0"
        class="rounded-2xl border border-orange-200 bg-orange-50 p-5"
      >

        <div class="flex gap-4">

          <div class="text-2xl">
            ⚠️
          </div>

          <div>
            <h3 class="font-bold text-orange-800">
              Low Stock Alert
            </h3>

            <p class="mt-1 text-sm text-orange-700">
              {{ lowStockProducts }} product(s) have 10 or fewer units
              remaining.
            </p>
          </div>

        </div>

      </div>

      <div
        v-if="outOfStockProducts > 0"
        class="rounded-2xl border border-red-200 bg-red-50 p-5"
      >

        <div class="flex gap-4">

          <div class="text-2xl">
            🚨
          </div>

          <div>
            <h3 class="font-bold text-red-800">
              Out of Stock Alert
            </h3>

            <p class="mt-1 text-sm text-red-700">
              {{ outOfStockProducts }} product(s) are currently unavailable.
            </p>
          </div>

        </div>

      </div>

    </div>

    <!-- =========================================
         FILTERS
    ========================================== -->

    <div
      class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
    >

      <div class="flex flex-col gap-4 xl:flex-row xl:items-center">

        <!-- Search -->
        <div class="relative flex-1">

          <span
            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            🔍
          </span>

          <input
            v-model="search"
            type="text"
            placeholder="Search product, brand or category..."
            class="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
          />

        </div>

        <!-- Brand -->
        <select
          v-model="selectedBrand"
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
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
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
        >
          <option value="All">
            All Stock
          </option>

          <option value="In Stock">
            In Stock
          </option>

          <option value="Low Stock">
            Low Stock
          </option>

          <option value="Out of Stock">
            Out of Stock
          </option>
        </select>

        <!-- Sort -->
        <select
          v-model="sortBy"
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
        >
          <option value="Name A-Z">
            Name A-Z
          </option>

          <option value="Name Z-A">
            Name Z-A
          </option>

          <option value="Stock High">
            Highest Stock
          </option>

          <option value="Stock Low">
            Lowest Stock
          </option>

          <option value="Price High">
            Highest Price
          </option>

          <option value="Price Low">
            Lowest Price
          </option>
        </select>

        <!-- View -->
        <div class="flex rounded-xl border border-gray-200 p-1">

          <button
            class="rounded-lg px-3 py-2 text-sm"
            :class="
              viewMode === 'table'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-100'
            "
            @click="viewMode = 'table'"
          >
            ☰
          </button>

          <button
            class="rounded-lg px-3 py-2 text-sm"
            :class="
              viewMode === 'grid'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-100'
            "
            @click="viewMode = 'grid'"
          >
            ▦
          </button>

        </div>

        <button
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50"
          @click="clearFilters"
        >
          Clear
        </button>

      </div>

    </div>

    <!-- Result -->
    <div class="flex items-center justify-between">

      <p class="text-sm text-gray-500">
        Showing
        <span class="font-semibold text-gray-900">
          {{ filteredInventory.length }}
        </span>
        products
      </p>

    </div>

    <!-- =========================================
         TABLE VIEW
    ========================================== -->

    <div
      v-if="viewMode === 'table'"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >

      <div class="overflow-x-auto">

        <table class="w-full min-w-[1000px] text-left text-sm">

          <thead class="border-b border-gray-200 bg-gray-50">

            <tr>

              <th class="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                Product
              </th>

              <th class="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                Brand
              </th>

              <th class="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                Price
              </th>

              <th class="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                Stock
              </th>

              <th class="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                Status
              </th>

              <th class="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                Action
              </th>

            </tr>

          </thead>

          <tbody class="divide-y divide-gray-100">

            <tr
              v-for="product in filteredInventory"
              :key="product.id"
              class="transition hover:bg-gray-50"
            >

              <!-- Product -->
              <td class="px-6 py-5">

                <div class="flex items-center gap-4">

                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="h-14 w-14 rounded-xl object-cover"
                  />

                  <div>

                    <p class="font-semibold text-gray-900">
                      {{ product.name }}
                    </p>

                    <p class="mt-1 text-xs text-gray-400">
                      #{{ product.id }} · {{ product.category }}
                    </p>

                  </div>

                </div>

              </td>

              <!-- Brand -->
              <td class="px-6 py-5">
                {{ product.brand }}
              </td>

              <!-- Price -->
              <td class="px-6 py-5 font-semibold">
                {{ formatPrice(product.price) }}
              </td>

              <!-- Stock -->
              <td class="px-6 py-5">

                <div class="flex items-center gap-2">

                  <button
                    class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100"
                    @click="decreaseStock(product)"
                  >
                    −
                  </button>

                  <span class="w-10 text-center font-bold">
                    {{ product.stock }}
                  </span>

                  <button
                    class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100"
                    @click="increaseStock(product)"
                  >
                    +
                  </button>

                </div>

              </td>

              <!-- Status -->
              <td class="px-6 py-5">

                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusClass(product.stock)"
                >
                  {{ getStockStatus(product.stock) }}
                </span>

              </td>

              <!-- Action -->
              <td class="px-6 py-5">

                <div class="flex justify-end gap-2">

                  <NuxtLink
                    :to="`/admin/inventory/${product.id}`"
                    class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50"
                  >
                    View
                  </NuxtLink>

                  <button
                    class="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                    @click="openStockModal(product)"
                  >
                    Update
                  </button>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

      <!-- Empty -->
      <div
        v-if="filteredInventory.length === 0"
        class="py-16 text-center"
      >

        <div class="text-5xl">
          📦
        </div>

        <h3 class="mt-4 font-bold">
          No inventory found
        </h3>

        <p class="mt-2 text-sm text-gray-500">
          Try changing your search or filters.
        </p>

      </div>

    </div>

    <!-- =========================================
         GRID VIEW
    ========================================== -->

    <div
      v-if="viewMode === 'grid'"
      class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >

      <div
        v-for="product in filteredInventory"
        :key="product.id"
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >

        <div class="flex items-start justify-between">

          <img
            :src="product.image"
            :alt="product.name"
            class="h-20 w-20 rounded-xl object-cover"
          />

          <span
            class="rounded-full px-3 py-1 text-xs font-semibold"
            :class="statusClass(product.stock)"
          >
            {{ getStockStatus(product.stock) }}
          </span>

        </div>

        <h3 class="mt-5 font-bold">
          {{ product.name }}
        </h3>

        <p class="mt-1 text-sm text-gray-500">
          {{ product.brand }} · {{ product.category }}
        </p>

        <div class="mt-5 flex items-center justify-between">

          <span class="font-bold">
            {{ formatPrice(product.price) }}
          </span>

          <span class="text-sm text-gray-500">
            {{ product.stock }} units
          </span>

        </div>

        <!-- Progress -->
        <div class="mt-4">

          <div class="mb-2 flex justify-between text-xs text-gray-400">

            <span>
              Stock Level
            </span>

            <span>
              {{ product.stock }}/100
            </span>

          </div>

          <div class="h-2 overflow-hidden rounded-full bg-gray-100">

            <div
              class="h-full rounded-full transition-all"
              :class="
                product.stock === 0
                  ? 'bg-red-500'
                  : product.stock <= 10
                    ? 'bg-orange-500'
                    : 'bg-green-500'
              "
              :style="{
                width: `${stockPercentage(product.stock)}%`,
              }"
            ></div>

          </div>

        </div>

        <div class="mt-5 grid grid-cols-2 gap-2">

          <NuxtLink
            :to="`/admin/inventory/${product.id}`"
            class="rounded-xl border border-gray-200 py-2.5 text-center text-sm font-semibold hover:bg-gray-50"
          >
            View
          </NuxtLink>

          <button
            class="rounded-xl bg-black py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            @click="openStockModal(product)"
          >
            Update Stock
          </button>

        </div>

      </div>

    </div>

    <!-- =========================================
         UPDATE STOCK MODAL
    ========================================== -->

    <div
      v-if="showStockModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >

      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        <div class="flex items-start justify-between">

          <div>

            <h2 class="text-xl font-bold">
              Update Stock
            </h2>

            <p class="mt-1 text-sm text-gray-500">
              Change inventory quantity
            </p>

          </div>

          <button
            class="text-xl text-gray-400 hover:text-black"
            @click="closeStockModal"
          >
            ×
          </button>

        </div>

        <div
          v-if="selectedProduct"
          class="mt-6 rounded-xl bg-gray-50 p-4"
        >

          <p class="font-semibold">
            {{ selectedProduct.name }}
          </p>

          <p class="mt-1 text-sm text-gray-500">
            Current stock:
            <span class="font-bold text-gray-900">
              {{ selectedProduct.stock }}
            </span>
          </p>

        </div>

        <div class="mt-5">

          <label class="mb-2 block text-sm font-semibold">
            New Stock Quantity
          </label>

          <input
            v-model.number="stockInput"
            type="number"
            min="0"
            class="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-semibold outline-none focus:border-black"
          />

        </div>

        <div class="mt-6 flex justify-end gap-3">

          <button
            class="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50"
            @click="closeStockModal"
          >
            Cancel
          </button>

          <button
            class="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            @click="updateStock"
          >
            Save Stock
          </button>

        </div>

      </div>

    </div>

  </div>
</template>