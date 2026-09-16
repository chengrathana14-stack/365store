<script setup lang="ts">
import { computed, ref } from "vue";
import { products } from "~/data/product";

definePageMeta({
  layout: "admin",
});

/* =========================================
   TYPES
========================================= */



/* =========================================
   STATE
========================================= */

const search = ref("");

const selectedBrand = ref("All");

const selectedCategory = ref("All");

const selectedStatus = ref<ProductStatus>("All");

const selectedSort = ref("Newest");

const viewMode = ref<ViewMode>("table");

const showDeleteModal = ref(false);

const productToDelete = ref<number | null>(null);

/* =========================================
   BRAND LIST
========================================= */

const brands = computed(() => {
  return [
    "All",
    ...new Set(products.map((product) => product.brand)),
  ];
});

/* =========================================
   CATEGORY LIST
========================================= */

const categories = computed(() => {
  return [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];
});

/* =========================================
   PRODUCT STATUS
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
        product.category.toLowerCase().includes(keyword),
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

  /* Stock */
  if (selectedStatus.value !== "All") {
    result = result.filter(
      (product) =>
        getProductStatus(product.stock) === selectedStatus.value,
    );
  }

  /* Sort */
  if (selectedSort.value === "Name A-Z") {
    result.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  if (selectedSort.value === "Name Z-A") {
    result.sort((a, b) =>
      b.name.localeCompare(a.name),
    );
  }

  if (selectedSort.value === "Price High") {
    result.sort((a, b) => b.price - a.price);
  }

  if (selectedSort.value === "Price Low") {
    result.sort((a, b) => a.price - b.price);
  }

  if (selectedSort.value === "Stock High") {
    result.sort((a, b) => b.stock - a.stock);
  }

  if (selectedSort.value === "Stock Low") {
    result.sort((a, b) => a.stock - b.stock);
  }

  if (selectedSort.value === "Rating") {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
});

/* =========================================
   STATISTICS
========================================= */

const totalProducts = computed(() => {
  return products.length;
});

const activeProducts = computed(() => {
  return products.filter(
    (product) => product.stock > 0,
  ).length;
});

const lowStockProducts = computed(() => {
  return products.filter(
    (product) =>
      product.stock > 0 &&
      product.stock <= 10,
  ).length;
});

const outOfStockProducts = computed(() => {
  return products.filter(
    (product) => product.stock === 0,
  ).length;
});

const totalStock = computed(() => {
  return products.reduce(
    (total, product) =>
      total + product.stock,
    0,
  );
});

const totalInventoryValue = computed(() => {
  return products.reduce(
    (total, product) =>
      total + product.price * product.stock,
    0,
  );
});

const discountedProducts = computed(() => {
  return products.filter(
    (product) => product.discount > 0,
  ).length;
});

const featuredProducts = computed(() => {
  return products.filter(
    (product) => product.featured,
  ).length;
});

/* =========================================
   CLEAR FILTERS
========================================= */

const clearFilters = () => {
  search.value = "";
  selectedBrand.value = "All";
  selectedCategory.value = "All";
  selectedStatus.value = "All";
  selectedSort.value = "Newest";
};

/* =========================================
   DELETE
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
  if (productToDelete.value === null) {
    return;
  }

  const product = products.find(
    (item) => item.id === productToDelete.value,
  );

  if (product) {
    alert(`Product "${product.name}" deleted.`);
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

/* =========================================
   STATUS CLASS
========================================= */

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

    <!-- =====================================
         HEADER
    ====================================== -->

    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >

      <div>

        <div class="flex items-center gap-3">

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-xl text-white"
          >
            🛍️
          </div>

          <div>

            <h1 class="text-2xl font-bold text-gray-900">
              Products
            </h1>

            <p class="text-sm text-gray-500">
              Manage your sports products
            </p>

          </div>

        </div>

      </div>

      <NuxtLink
        to="/admin/products/create"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        <span class="mr-2 text-lg">
          +
        </span>

        Add Product
      </NuxtLink>

    </div>


    <!-- =====================================
         STATISTICS
    ====================================== -->

    <div
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >

      <!-- Total -->
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


      <!-- In Stock -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >

        <div class="flex items-center justify-between">

          <div>

            <p class="text-sm text-gray-500">
              In Stock
            </p>

            <p class="mt-2 text-2xl font-bold text-green-600">
              {{ activeProducts }}
            </p>

          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl"
          >
            ✓
          </div>

        </div>

      </div>


      <!-- Low Stock -->
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

    </div>


    <!-- =====================================
         SECONDARY STATS
    ====================================== -->

    <div
      class="grid gap-4 sm:grid-cols-3"
    >

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >

        <p class="text-sm text-gray-500">
          Total Stock Units
        </p>

        <p class="mt-2 text-xl font-bold">
          {{ totalStock }}
        </p>

      </div>


      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >

        <p class="text-sm text-gray-500">
          Inventory Value
        </p>

        <p class="mt-2 text-xl font-bold">
          {{ formatPrice(totalInventoryValue) }}
        </p>

      </div>


      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >

        <div class="flex items-center justify-between">

          <div>

            <p class="text-sm text-gray-500">
              Promotions
            </p>

            <p class="mt-2 text-xl font-bold">
              {{ discountedProducts }}
              <span class="text-sm font-normal text-gray-400">
                discounted
              </span>
            </p>

          </div>

          <span
            class="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white"
          >
            {{ featuredProducts }} Featured
          </span>

        </div>

      </div>

    </div>


    <!-- =====================================
         FILTERS
    ====================================== -->

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >

      <div
        class="grid gap-4 lg:grid-cols-2 xl:grid-cols-5"
      >

        <!-- Search -->
        <div class="relative xl:col-span-2">

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


        <!-- Category -->
        <select
          v-model="selectedCategory"
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
        >

          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category === "All" ? "All Categories" : category }}
          </option>

        </select>


        <!-- Stock -->
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

      </div>


      <!-- Second filter row -->
      <div
        class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >

        <div class="flex flex-wrap gap-3">

          <select
            v-model="selectedSort"
            class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
          >

            <option value="Newest">
              Newest
            </option>

            <option value="Name A-Z">
              Name A-Z
            </option>

            <option value="Name Z-A">
              Name Z-A
            </option>

            <option value="Price High">
              Highest Price
            </option>

            <option value="Price Low">
              Lowest Price
            </option>

            <option value="Stock High">
              Highest Stock
            </option>

            <option value="Stock Low">
              Lowest Stock
            </option>

            <option value="Rating">
              Highest Rating
            </option>

          </select>


          <button
            class="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50"
            @click="clearFilters"
          >
            Clear Filters
          </button>

        </div>


        <!-- View Mode -->
        <div
          class="flex w-fit rounded-xl border border-gray-200 p-1"
        >

          <button
            class="rounded-lg px-4 py-2 text-sm"
            :class="
              viewMode === 'table'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-100'
            "
            @click="viewMode = 'table'"
          >
            ☰ Table
          </button>

          <button
            class="rounded-lg px-4 py-2 text-sm"
            :class="
              viewMode === 'grid'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-100'
            "
            @click="viewMode = 'grid'"
          >
            ▦ Grid
          </button>

        </div>

      </div>

    </div>


    <!-- =====================================
         RESULT HEADER
    ====================================== -->

    <div class="flex items-center justify-between">

      <p class="text-sm text-gray-500">

        Showing

        <span class="font-semibold text-gray-900">
          {{ filteredProducts.length }}
        </span>

        of

        <span class="font-semibold text-gray-900">
          {{ products.length }}
        </span>

        products

      </p>

    </div>


    <!-- =====================================
         TABLE VIEW
    ====================================== -->

    <div
      v-if="viewMode === 'table'"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >

      <div class="overflow-x-auto">

        <table
          class="w-full min-w-[1100px] text-left text-sm"
        >

          <thead
            class="border-b border-gray-200 bg-gray-50"
          >

            <tr>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Product
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Brand
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Category
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Price
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Discount
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Rating
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Stock
              </th>

              <th
                class="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500"
              >
                Action
              </th>

            </tr>

          </thead>


          <tbody class="divide-y divide-gray-100">

            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="transition hover:bg-gray-50"
            >

              <!-- Product -->
              <td class="px-6 py-5">

                <div class="flex items-center gap-4">

                  <div class="relative">

                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="h-16 w-16 rounded-xl object-cover"
                    />

                    <span
                      v-if="product.isNew"
                      class="absolute -right-2 -top-2 rounded-full bg-black px-2 py-1 text-[9px] font-bold text-white"
                    >
                      NEW
                    </span>

                  </div>

                  <div class="max-w-[260px]">

                    <p
                      class="font-semibold text-gray-900"
                    >
                      {{ product.name }}
                    </p>

                    <p class="mt-1 text-xs text-gray-400">
                      ID: #{{ product.id }}
                    </p>

                  </div>

                </div>

              </td>


              <!-- Brand -->
              <td class="px-6 py-5">
                {{ product.brand }}
              </td>


              <!-- Category -->
              <td class="px-6 py-5">
                {{ product.category }}
              </td>


              <!-- Price -->
              <td class="px-6 py-5">

                <div>

                  <p class="font-bold">
                    {{ formatPrice(product.price) }}
                  </p>

                  <p
                    v-if="product.discount > 0"
                    class="mt-1 text-xs text-gray-400"
                  >
                    Sale price
                  </p>

                </div>

              </td>


              <!-- Discount -->
              <td class="px-6 py-5">

                <span
                  v-if="product.discount > 0"
                  class="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                >
                  -{{ product.discount }}%
                </span>

                <span
                  v-else
                  class="text-gray-400"
                >
                  —
                </span>

              </td>


              <!-- Rating -->
              <td class="px-6 py-5">

                <div class="flex items-center gap-1">

                  <span class="text-yellow-500">
                    ★
                  </span>

                  <span class="font-semibold">
                    {{ product.rating }}
                  </span>

                  <span class="text-xs text-gray-400">
                    ({{ product.reviews }})
                  </span>

                </div>

              </td>


              <!-- Stock -->
              <td class="px-6 py-5">

                <div>

                  <span
                    class="font-bold"
                    :class="
                      product.stock === 0
                        ? 'text-red-600'
                        : product.stock <= 10
                          ? 'text-orange-600'
                          : 'text-green-600'
                    "
                  >
                    {{ product.stock }}
                  </span>

                  <span class="ml-1 text-xs text-gray-400">
                    units
                  </span>

                  <div
                    class="mt-2 h-1.5 w-20 overflow-hidden rounded-full bg-gray-100"
                  >

                    <div
                      class="h-full rounded-full"
                      :class="
                        product.stock === 0
                          ? 'bg-red-500'
                          : product.stock <= 10
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                      "
                      :style="{
                        width: `${Math.min(
                          product.stock,
                          100,
                        )}%`,
                      }"
                    ></div>

                  </div>

                  <span
                    class="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    :class="statusClass(product.stock)"
                  >
                    {{ getProductStatus(product.stock) }}
                  </span>

                </div>

              </td>


              <!-- Actions -->
              <td class="px-6 py-5">

                <div class="flex justify-end gap-2">

                  <NuxtLink
                    :to="`/admin/products/${product.id}`"
                    title="View Product"
                    class="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                  >
                    View
                  </NuxtLink>

                  <NuxtLink
                    :to="`/admin/products/${product.id}/edit`"
                    title="Edit Product"
                    class="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold hover:bg-gray-200"
                  >
                    Edit
                  </NuxtLink>

                  <button
                    title="Delete Product"
                    class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                    @click="openDeleteModal(product.id)"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>


      <!-- Empty -->
      <div
        v-if="filteredProducts.length === 0"
        class="py-16 text-center"
      >

        <div class="text-5xl">
          🛍️
        </div>

        <h3 class="mt-4 text-lg font-bold">
          No products found
        </h3>

        <p class="mt-2 text-sm text-gray-500">
          Try changing your search or filters.
        </p>

        <button
          class="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          @click="clearFilters"
        >
          Clear Filters
        </button>

      </div>

    </div>


    <!-- =====================================
         GRID VIEW
    ====================================== -->

    <div
      v-if="
        viewMode === 'grid' &&
        filteredProducts.length
      "
      class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >

      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >

        <!-- Image -->
        <div
          class="relative h-56 overflow-hidden bg-gray-100"
        >

          <img
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <!-- New -->
          <span
            v-if="product.isNew"
            class="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-bold text-white"
          >
            NEW
          </span>

          <!-- Discount -->
          <span
            v-if="product.discount > 0"
            class="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white"
          >
            -{{ product.discount }}%
          </span>

        </div>


        <!-- Content -->
        <div class="p-5">

          <div
            class="flex items-center justify-between gap-3"
          >

            <p class="text-xs font-semibold uppercase text-gray-400">
              {{ product.brand }}
            </p>

            <span
              class="rounded-full px-2.5 py-1 text-[10px] font-semibold"
              :class="statusClass(product.stock)"
            >
              {{ getProductStatus(product.stock) }}
            </span>

          </div>


          <h3
            class="mt-2 min-h-[48px] font-bold text-gray-900"
          >
            {{ product.name }}
          </h3>


          <p class="mt-1 text-sm text-gray-500">
            {{ product.category }}
          </p>


          <!-- Price -->
          <div
            class="mt-4 flex items-center justify-between"
          >

            <p class="text-lg font-bold">
              {{ formatPrice(product.price) }}
            </p>

            <p class="text-sm text-gray-500">
              {{ product.stock }} units
            </p>

          </div>


          <!-- Rating -->
          <div
            class="mt-3 flex items-center gap-2"
          >

            <span class="text-yellow-500">
              ★
            </span>

            <span class="text-sm font-semibold">
              {{ product.rating }}
            </span>

            <span class="text-xs text-gray-400">
              ({{ product.reviews }} reviews)
            </span>

          </div>


          <!-- Actions -->
          <div class="mt-5 grid grid-cols-3 gap-2">

            <NuxtLink
              :to="`/admin/products/${product.id}`"
              class="rounded-xl border border-gray-200 py-2.5 text-center text-xs font-semibold hover:bg-gray-50"
            >
              View
            </NuxtLink>

            <NuxtLink
              :to="`/admin/products/${product.id}/edit`"
              class="rounded-xl bg-black py-2.5 text-center text-xs font-semibold text-white hover:bg-gray-800"
            >
              Edit
            </NuxtLink>

            <button
              class="rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100"
              @click="openDeleteModal(product.id)"
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>


    <!-- =====================================
         EMPTY GRID
    ====================================== -->

    <div
      v-if="
        viewMode === 'grid' &&
        filteredProducts.length === 0
      "
      class="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center"
    >

      <div class="text-5xl">
        🛍️
      </div>

      <h3 class="mt-4 text-lg font-bold">
        No products found
      </h3>

      <p class="mt-2 text-sm text-gray-500">
        Try changing your search or filters.
      </p>

      <button
        class="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
        @click="clearFilters"
      >
        Clear Filters
      </button>

    </div>


    <!-- =====================================
         DELETE MODAL
    ====================================== -->

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >

      <div
        class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >

        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl"
        >
          🗑️
        </div>


        <h2 class="mt-5 text-xl font-bold">
          Delete Product?
        </h2>


        <p class="mt-2 text-sm leading-6 text-gray-500">

          Are you sure you want to delete this product?

          <span class="font-semibold text-gray-900">
            This action cannot be undone.
          </span>

        </p>


        <div class="mt-6 flex justify-end gap-3">

          <button
            class="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50"
            @click="closeDeleteModal"
          >
            Cancel
          </button>

          <button
            class="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white hover:bg-red-600"
            @click="deleteProduct"
          >
            Delete Product
          </button>

        </div>

      </div>

    </div>

  </div>
</template>