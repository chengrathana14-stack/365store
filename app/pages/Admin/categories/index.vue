<script setup lang="ts">
import { computed, ref } from "vue";
import { products } from "~/data/product";
import { categorySeedData } from "~/data/admin";
definePageMeta({
  layout: "admin",
});

const categories = ref<Category[]>(
  categorySeedData.map((category) => ({ ...category })),
);

/* --------------------------------
   Search / Filter / Sort
-------------------------------- */

const search = ref("");
const statusFilter = ref("All");
const sortBy = ref("Newest");

const filteredCategories = computed(() => {
  let result = [...categories.value];

  // Search
  if (search.value.trim()) {
    const keyword = search.value.toLowerCase();

    result = result.filter(
      (category) =>
        category.name.toLowerCase().includes(keyword) ||
        category.description.toLowerCase().includes(keyword),
    );
  }

  // Status
  if (statusFilter.value !== "All") {
    result = result.filter(
      (category) => category.status === statusFilter.value,
    );
  }

  // Sort
  if (sortBy.value === "Newest") {
    result.sort((a, b) => b.id - a.id);
  }

  if (sortBy.value === "Oldest") {
    result.sort((a, b) => a.id - b.id);
  }

  if (sortBy.value === "A-Z") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortBy.value === "Z-A") {
    result.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (sortBy.value === "Most Products") {
    result.sort((a, b) => b.products - a.products);
  }

  if (sortBy.value === "Least Products") {
    result.sort((a, b) => a.products - b.products);
  }

  return result;
});

/* --------------------------------
   Statistics
-------------------------------- */

const totalCategories = computed(() => categories.value.length);

const activeCategories = computed(
  () =>
    categories.value.filter((category) => category.status === "Active").length,
);

const inactiveCategories = computed(
  () =>
    categories.value.filter((category) => category.status === "Inactive")
      .length,
);

const totalProducts = computed(() =>
  categories.value.reduce((total, category) => total + category.products, 0),
);

/* --------------------------------
   View
-------------------------------- */

const viewMode = ref<"grid" | "list">("grid");

/* --------------------------------
   Delete
-------------------------------- */

const showDeleteModal = ref(false);
const categoryToDelete = ref<Category | null>(null);

const openDeleteModal = (category: Category) => {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
};

const deleteCategory = () => {
  if (!categoryToDelete.value) return;

  categories.value = categories.value.filter(
    (category) => category.id !== categoryToDelete.value?.id,
  );

  categoryToDelete.value = null;
  showDeleteModal.value = false;
};

/* --------------------------------
   Toggle Status
-------------------------------- */

const toggleStatus = (category: Category) => {
  category.status = category.status === "Active" ? "Inactive" : "Active";
};

/* --------------------------------
   Clear Filters
-------------------------------- */

const clearFilters = () => {
  search.value = "";
  statusFilter.value = "All";
  sortBy.value = "Newest";
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <div class="flex items-center gap-2">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-xl text-white"
          >
            📂
          </div>

          <div>
            <h1 class="text-2xl font-bold text-gray-900">Categories</h1>

            <p class="text-sm text-gray-500">Manage your product categories</p>
          </div>
        </div>
      </div>

      <NuxtLink
        to="/admin/categories/create"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        <span class="mr-2 text-lg">+</span>
        Add Category
      </NuxtLink>
    </div>

    <!-- Statistics -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Categories</p>

            <h2 class="mt-2 text-2xl font-bold">
              {{ totalCategories }}
            </h2>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl"
          >
            📂
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Active</p>

            <h2 class="mt-2 text-2xl font-bold text-green-600">
              {{ activeCategories }}
            </h2>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl"
          >
            ✓
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Inactive</p>

            <h2 class="mt-2 text-2xl font-bold text-red-600">
              {{ inactiveCategories }}
            </h2>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-xl"
          >
            ×
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Products</p>

            <h2 class="mt-2 text-2xl font-bold">
              {{ totalProducts }}
            </h2>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl"
          >
            🛍️
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
        <!-- Search -->
        <div class="relative flex-1">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          <input
            v-model="search"
            type="text"
            placeholder="Search categories..."
            class="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
          />
        </div>

        <!-- Status -->
        <select
          v-model="statusFilter"
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
        >
          <option value="All">All Status</option>

          <option value="Active">Active</option>

          <option value="Inactive">Inactive</option>
        </select>

        <!-- Sort -->
        <select
          v-model="sortBy"
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
        >
          <option value="Newest">Newest</option>

          <option value="Oldest">Oldest</option>

          <option value="A-Z">A-Z</option>

          <option value="Z-A">Z-A</option>

          <option value="Most Products">Most Products</option>

          <option value="Least Products">Least Products</option>
        </select>

        <!-- View -->
        <div class="flex rounded-xl border border-gray-200 p-1">
          <button
            class="rounded-lg px-3 py-2 text-sm transition"
            :class="
              viewMode === 'grid'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-100'
            "
            @click="viewMode = 'grid'"
          >
            ▦
          </button>

          <button
            class="rounded-lg px-3 py-2 text-sm transition"
            :class="
              viewMode === 'list'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-100'
            "
            @click="viewMode = 'list'"
          >
            ☰
          </button>
        </div>

        <button
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium hover:bg-gray-50"
          @click="clearFilters"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Result Count -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-500">
        Showing
        <span class="font-semibold text-gray-900">
          {{ filteredCategories.length }}
        </span>
        categories
      </p>
    </div>

    <!-- GRID VIEW -->
    <div
      v-if="viewMode === 'grid' && filteredCategories.length"
      class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
      >
        <!-- Top -->
        <div class="flex items-start justify-between">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl"
          >
            📂
          </div>

          <button
            class="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
            @click="openDeleteModal(category)"
          >
            🗑️
          </button>
        </div>

        <!-- Content -->
        <div class="mt-5">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-bold text-gray-900">
              {{ category.name }}
            </h3>

            <span
              class="rounded-full px-2.5 py-1 text-[10px] font-bold"
              :class="
                category.status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ category.status }}
            </span>
          </div>

          <p class="mt-2 min-h-[40px] text-sm leading-5 text-gray-500">
            {{ category.description }}
          </p>
        </div>

        <!-- Stats -->
        <div
          class="mt-5 flex items-center justify-between border-t border-gray-100 pt-4"
        >
          <div>
            <p class="text-xs text-gray-400">Products</p>

            <p class="mt-1 font-bold">
              {{ category.products }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs text-gray-400">Created</p>

            <p class="mt-1 text-xs font-medium">
              {{ category.created }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-5 grid grid-cols-2 gap-2">
          <NuxtLink
            :to="`/admin/categories/${category.id}`"
            class="rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold hover:bg-gray-50"
          >
            View
          </NuxtLink>

          <NuxtLink
            :to="`/admin/categories/${category.id}/edit`"
            class="rounded-xl bg-black px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-800"
          >
            Edit
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- LIST VIEW -->
    <div
      v-if="viewMode === 'list' && filteredCategories.length"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px] text-left">
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Category
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Products
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Status
              </th>

              <th
                class="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
              >
                Created
              </th>

              <th
                class="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="category in filteredCategories"
              :key="category.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100"
                  >
                    📂
                  </div>

                  <div>
                    <p class="font-semibold">
                      {{ category.name }}
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                      {{ category.description }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-5 font-semibold">
                {{ category.products }}
              </td>

              <td class="px-6 py-5">
                <button
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="
                    category.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  "
                  @click="toggleStatus(category)"
                >
                  {{ category.status }}
                </button>
              </td>

              <td class="px-6 py-5 text-sm text-gray-500">
                {{ category.created }}
              </td>

              <td class="px-6 py-5">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/categories/${category.id}`"
                    class="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    View
                  </NuxtLink>

                  <NuxtLink
                    :to="`/admin/categories/${category.id}/edit`"
                    class="rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-gray-800"
                  >
                    Edit
                  </NuxtLink>

                  <button
                    class="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                    @click="openDeleteModal(category)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty -->
    <div
      v-if="!filteredCategories.length"
      class="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center"
    >
      <div class="text-5xl">📂</div>

      <h3 class="mt-4 text-lg font-bold">No categories found</h3>

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
          <span class="font-semibold text-gray-900">
            {{ categoryToDelete?.name }} </span
          >? This action cannot be undone.
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
