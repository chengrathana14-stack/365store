<script setup lang="ts">
import { computed, ref } from "vue";
import { categoryDetailProductSeedData } from "~/data/admin";
import type { CategoryProduct } from "~/type/admin";

definePageMeta({
  layout: "admin",
});

const route = useRoute();

const categoryId = Number(route.params.id);

const category = ref({
  id: categoryId,
  name: "Football Boots",
  description:
    "Football shoes and professional soccer boots for training, matches and competitive football.",
  status: "Active",
  products: 85,
  totalSales: 1248,
  revenue: 184520,
  created: "January 10, 2026",
  updated: "August 28, 2026",
});

const products = ref<CategoryProduct[]>(
  categoryDetailProductSeedData.map((product) => ({ ...product })),
);

const search = ref("");

const filteredProducts = computed(() => {
  if (!search.value.trim()) {
    return products.value;
  }

  const keyword = search.value.toLowerCase();

  return products.value.filter(
    (product) =>
      product.name.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword),
  );
});

const totalStock = computed(() =>
  products.value.reduce((total, product) => total + product.stock, 0),
);

const totalSold = computed(() =>
  products.value.reduce((total, product) => total + product.sold, 0),
);

const lowStock = computed(
  () =>
    products.value.filter((product) => product.stock > 0 && product.stock <= 10)
      .length,
);

const outOfStock = computed(
  () => products.value.filter((product) => product.stock === 0).length,
);

const toggleStatus = () => {
  category.value.status =
    category.value.status === "Active" ? "Inactive" : "Active";
};

const showDeleteModal = ref(false);

const deleteCategory = async () => {
  showDeleteModal.value = false;

  alert(`Category "${category.value.name}" deleted.`);

  await navigateTo("/admin/categories");
};

const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const productStatusClass = (status: string) => {
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
    <!-- Back -->
    <NuxtLink
      to="/admin/categories"
      class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black"
    >
      ← Back to Categories
    </NuxtLink>

    <!-- Category Header -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div
        class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="flex items-center gap-5">
          <div
            class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-4xl"
          >
            📂
          </div>

          <div>
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ category.name }}
              </h1>

              <span
                class="rounded-full px-3 py-1 text-xs font-bold"
                :class="
                  category.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                {{ category.status }}
              </span>
            </div>

            <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              {{ category.description }}
            </p>

            <p class="mt-2 text-xs text-gray-400">
              Category ID: #{{ category.id }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            class="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50"
            @click="toggleStatus"
          >
            {{ category.status === "Active" ? "Deactivate" : "Activate" }}
          </button>

          <NuxtLink
            :to="`/admin/categories/${category.id}/edit`"
            class="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Edit Category
          </NuxtLink>

          <button
            class="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
            @click="showDeleteModal = true"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Products</p>

        <p class="mt-2 text-2xl font-bold">
          {{ category.products }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Total Sales</p>

        <p class="mt-2 text-2xl font-bold">
          {{ category.totalSales }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Revenue</p>

        <p class="mt-2 text-2xl font-bold">
          ${{ category.revenue.toLocaleString() }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Current Stock</p>

        <p class="mt-2 text-2xl font-bold">
          {{ totalStock }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Units Sold</p>

        <p class="mt-2 text-2xl font-bold">
          {{ totalSold }}
        </p>
      </div>
    </div>

    <!-- Information + Alerts -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Information -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"
      >
        <h2 class="text-lg font-bold">Category Information</h2>

        <div class="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p class="text-xs font-semibold uppercase text-gray-400">
              Category Name
            </p>

            <p class="mt-2 font-semibold">
              {{ category.name }}
            </p>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase text-gray-400">Status</p>

            <p class="mt-2 font-semibold">
              {{ category.status }}
            </p>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase text-gray-400">Created</p>

            <p class="mt-2 font-semibold">
              {{ category.created }}
            </p>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase text-gray-400">
              Last Updated
            </p>

            <p class="mt-2 font-semibold">
              {{ category.updated }}
            </p>
          </div>
        </div>

        <div class="mt-6 border-t border-gray-100 pt-5">
          <p class="text-xs font-semibold uppercase text-gray-400">
            Description
          </p>

          <p class="mt-2 text-sm leading-6 text-gray-600">
            {{ category.description }}
          </p>
        </div>
      </div>

      <!-- Alerts -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-bold">Inventory Alerts</h2>

        <div class="mt-5 space-y-3">
          <div class="rounded-xl bg-yellow-50 p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-yellow-700">
                Low Stock
              </span>

              <span class="text-xl font-bold text-yellow-700">
                {{ lowStock }}
              </span>
            </div>

            <p class="mt-1 text-xs text-yellow-600">
              Products need restocking soon.
            </p>
          </div>

          <div class="rounded-xl bg-red-50 p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-red-700">
                Out of Stock
              </span>

              <span class="text-xl font-bold text-red-700">
                {{ outOfStock }}
              </span>
            </div>

            <p class="mt-1 text-xs text-red-600">
              Products currently unavailable.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Products -->
    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div
        class="flex flex-col gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="text-lg font-bold">Category Products</h2>

          <p class="mt-1 text-sm text-gray-500">
            Products belonging to {{ category.name }}
          </p>
        </div>

        <div class="relative sm:w-72">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          <input
            v-model="search"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-black"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[850px] text-left">
          <thead class="border-b border-gray-200 bg-gray-50">
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
                Price
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Stock
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Sold
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Status
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
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100"
                  >
                    ⚽
                  </div>

                  <div>
                    <p class="font-semibold">
                      {{ product.name }}
                    </p>

                    <p class="mt-1 text-xs text-gray-400">#{{ product.id }}</p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-5 text-sm">
                {{ product.brand }}
              </td>

              <td class="px-6 py-5 font-semibold">
                {{ formatPrice(product.price) }}
              </td>

              <td class="px-6 py-5 font-semibold">
                {{ product.stock }}
              </td>

              <td class="px-6 py-5">
                {{ product.sold }}
              </td>

              <td class="px-6 py-5">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="productStatusClass(product.status)"
                >
                  {{ product.status }}
                </span>
              </td>

              <td class="px-6 py-5 text-right">
                <NuxtLink
                  :to="`/admin/products/${product.id}`"
                  class="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                >
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No products -->
      <div v-if="!filteredProducts.length" class="py-14 text-center">
        <div class="text-4xl">🛍️</div>

        <h3 class="mt-3 font-bold">No products found</h3>

        <p class="mt-1 text-sm text-gray-500">Try another search term.</p>
      </div>
    </div>

    <!-- Delete Modal -->
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

        <h3 class="mt-5 text-xl font-bold">Delete Category?</h3>

        <p class="mt-2 text-sm leading-6 text-gray-500">
          Are you sure you want to delete
          <span class="font-semibold text-gray-900"> {{ category.name }} </span
          >?
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
            @click="showDeleteModal = false"
          >
            Cancel
          </button>

          <button
            class="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
            @click="deleteCategory"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
