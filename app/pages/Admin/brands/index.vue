<script setup lang="ts">
import { computed, ref } from "vue";
import { brandSeedData } from "~/data/admin";

definePageMeta({
  layout: "admin",
});

useHead({
  title: "Brands",
});

// =====================================================
// BRAND DATA
// =====================================================

const brands = ref(brandSeedData.map((brand) => ({ ...brand })));

// =====================================================
// FILTERS
// =====================================================

const search = ref("");
const statusFilter = ref("All");
const sortBy = ref("Newest");

const viewMode = ref<"grid" | "table">("grid");

// =====================================================
// MODAL
// =====================================================

const showDeleteModal = ref(false);
const selectedBrand = ref<any>(null);

// =====================================================
// PAGINATION
// =====================================================

const currentPage = ref(1);
const itemsPerPage = 6;

// =====================================================
// COMPUTED
// =====================================================

const totalProducts = computed(() => {
  return brands.value.reduce((total, brand) => total + brand.products, 0);
});

const activeBrands = computed(() => {
  return brands.value.filter((brand) => brand.status === "Active").length;
});

const inactiveBrands = computed(() => {
  return brands.value.filter((brand) => brand.status === "Inactive").length;
});

const filteredBrands = computed(() => {
  let result = [...brands.value];

  // Search
  if (search.value.trim()) {
    const keyword = search.value.toLowerCase();

    result = result.filter(
      (brand) =>
        brand.name.toLowerCase().includes(keyword) ||
        brand.description.toLowerCase().includes(keyword),
    );
  }

  // Status
  if (statusFilter.value !== "All") {
    result = result.filter((brand) => brand.status === statusFilter.value);
  }

  // Sorting
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

  if (sortBy.value === "Newest") {
    result.sort((a, b) => b.id - a.id);
  }

  if (sortBy.value === "Oldest") {
    result.sort((a, b) => a.id - b.id);
  }

  return result;
});

const totalPages = computed(() => {
  return Math.ceil(filteredBrands.value.length / itemsPerPage);
});

const paginatedBrands = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;

  return filteredBrands.value.slice(start, start + itemsPerPage);
});

// =====================================================
// METHODS
// =====================================================

const resetPage = () => {
  currentPage.value = 1;
};

const clearFilters = () => {
  search.value = "";
  statusFilter.value = "All";
  sortBy.value = "Newest";
  currentPage.value = 1;
};

// =====================================================
// STATUS
// =====================================================

const toggleStatus = (brand: any) => {
  brand.status = brand.status === "Active" ? "Inactive" : "Active";
};

// =====================================================
// DELETE
// =====================================================

const openDeleteModal = (brand: any) => {
  selectedBrand.value = brand;
  showDeleteModal.value = true;
};

const deleteBrand = () => {
  if (!selectedBrand.value) return;

  brands.value = brands.value.filter(
    (brand) => brand.id !== selectedBrand.value.id,
  );

  selectedBrand.value = null;
  showDeleteModal.value = false;

  if (currentPage.value > totalPages.value && currentPage.value > 1) {
    currentPage.value--;
  }
};

// =====================================================
// PAGINATION
// =====================================================

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// =====================================================
// FORMAT
// =====================================================

const getBrandInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};
</script>

<template>
  <div class="space-y-6">
    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-lg font-black text-white"
          >
            B
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900">Brands</h2>

            <p class="text-sm text-gray-500">Manage your sports brands</p>
          </div>
        </div>
      </div>

      <NuxtLink
        to="/admin/brands/create"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
      >
        <span class="text-lg">+</span>
        Add Brand
      </NuxtLink>
    </div>

    <!-- ================================================= -->
    <!-- STATISTICS -->
    <!-- ================================================= -->

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Total Brands -->

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-lg"
          >
            🏷️
          </div>

          <span
            class="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600"
          >
            Total
          </span>
        </div>

        <p class="mt-5 text-sm text-gray-500">Total Brands</p>

        <p class="mt-1 text-3xl font-bold">
          {{ brands.length }}
        </p>
      </div>

      <!-- Active -->

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg"
          >
            ✓
          </div>

          <span
            class="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700"
          >
            Active
          </span>
        </div>

        <p class="mt-5 text-sm text-gray-500">Active Brands</p>

        <p class="mt-1 text-3xl font-bold">
          {{ activeBrands }}
        </p>
      </div>

      <!-- Inactive -->

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-lg"
          >
            !
          </div>

          <span
            class="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700"
          >
            Inactive
          </span>
        </div>

        <p class="mt-5 text-sm text-gray-500">Inactive Brands</p>

        <p class="mt-1 text-3xl font-bold">
          {{ inactiveBrands }}
        </p>
      </div>

      <!-- Products -->

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-lg"
          >
            📦
          </div>

          <span
            class="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600"
          >
            Products
          </span>
        </div>

        <p class="mt-5 text-sm text-gray-500">Total Products</p>

        <p class="mt-1 text-3xl font-bold">
          {{ totalProducts }}
        </p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- FILTER BAR -->
    <!-- ================================================= -->

    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div
        class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
      >
        <!-- SEARCH -->

        <div class="relative w-full xl:max-w-md">
          <span
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            🔍
          </span>

          <input
            v-model="search"
            @input="resetPage"
            type="text"
            placeholder="Search brands..."
            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
          />
        </div>

        <!-- FILTERS -->

        <div class="flex flex-col gap-3 sm:flex-row">
          <!-- STATUS -->

          <select
            v-model="statusFilter"
            @change="resetPage"
            class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-black"
          >
            <option value="All">All Status</option>

            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>
          </select>

          <!-- SORT -->

          <select
            v-model="sortBy"
            @change="resetPage"
            class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-black"
          >
            <option value="Newest">Newest</option>

            <option value="Oldest">Oldest</option>

            <option value="A-Z">A-Z</option>

            <option value="Z-A">Z-A</option>

            <option value="Most Products">Most Products</option>

            <option value="Least Products">Least Products</option>
          </select>

          <!-- CLEAR -->

          <button
            @click="clearFilters"
            class="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            Clear
          </button>

          <!-- VIEW -->

          <div class="flex rounded-xl border border-gray-200 p-1">
            <button
              @click="viewMode = 'grid'"
              class="rounded-lg px-3 py-2 text-sm transition"
              :class="
                viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              "
              title="Grid View"
            >
              ▦
            </button>

            <button
              @click="viewMode = 'table'"
              class="rounded-lg px-3 py-2 text-sm transition"
              :class="
                viewMode === 'table'
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              "
              title="Table View"
            >
              ☷
            </button>
          </div>
        </div>
      </div>

      <!-- RESULTS -->

      <div class="mt-4 border-t pt-4 text-sm text-gray-500">
        Showing
        <span class="font-bold text-gray-900">
          {{ filteredBrands.length }}
        </span>
        brands
      </div>
    </div>

    <!-- ================================================= -->
    <!-- GRID VIEW -->
    <!-- ================================================= -->

    <div
      v-if="viewMode === 'grid' && paginatedBrands.length"
      class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="brand in paginatedBrands"
        :key="brand.id"
        class="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <!-- CARD TOP -->

        <div class="flex items-start justify-between">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-2xl font-black text-white shadow-sm"
          >
            {{ getBrandInitial(brand.name) }}
          </div>

          <div class="relative">
            <button
              class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
            >
              ⋮
            </button>
          </div>
        </div>

        <!-- NAME -->

        <div class="mt-5">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-bold text-gray-900">
              {{ brand.name }}
            </h3>

            <span
              class="h-2 w-2 rounded-full"
              :class="brand.status === 'Active' ? 'bg-green-500' : 'bg-red-500'"
            ></span>
          </div>

          <p class="mt-1 min-h-[40px] text-sm text-gray-500">
            {{ brand.description }}
          </p>
        </div>

        <!-- PRODUCT COUNT -->

        <div
          class="mt-5 flex items-center justify-between rounded-xl bg-gray-50 p-4"
        >
          <div>
            <p class="text-xs text-gray-400">Products</p>

            <p class="mt-1 text-xl font-bold">
              {{ brand.products }}
            </p>
          </div>

          <div class="text-2xl">📦</div>
        </div>

        <!-- STATUS -->

        <div class="mt-4 flex items-center justify-between">
          <button
            @click="toggleStatus(brand)"
            class="rounded-full px-3 py-1 text-xs font-bold transition"
            :class="
              brand.status === 'Active'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            "
          >
            {{ brand.status }}
          </button>

          <span class="text-xs text-gray-400">
            {{ brand.created }}
          </span>
        </div>

        <!-- ACTIONS -->

        <div class="mt-5 flex gap-2 border-t pt-5">
          <NuxtLink
            :to="`/admin/brands/${brand.id}`"
            class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            View
          </NuxtLink>

          <NuxtLink
            :to="`/admin/brands/${brand.id}/edit`"
            class="flex-1 rounded-xl bg-black px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Edit
          </NuxtLink>

          <button
            @click="openDeleteModal(brand)"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- TABLE VIEW -->
    <!-- ================================================= -->

    <div
      v-if="viewMode === 'table' && paginatedBrands.length"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead class="border-b bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Brand
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Products
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Status
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Created
              </th>

              <th
                class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr
              v-for="brand in paginatedBrands"
              :key="brand.id"
              class="transition hover:bg-gray-50"
            >
              <!-- BRAND -->

              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-xl bg-black font-bold text-white"
                  >
                    {{ getBrandInitial(brand.name) }}
                  </div>

                  <div>
                    <p class="font-bold text-gray-900">
                      {{ brand.name }}
                    </p>

                    <p class="mt-1 text-xs text-gray-400">
                      {{ brand.description }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- PRODUCTS -->

              <td class="px-6 py-5">
                <span class="font-bold">
                  {{ brand.products }}
                </span>

                <span class="ml-1 text-xs text-gray-400"> products </span>
              </td>

              <!-- STATUS -->

              <td class="px-6 py-5">
                <button
                  @click="toggleStatus(brand)"
                  class="rounded-full px-3 py-1 text-xs font-bold"
                  :class="
                    brand.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  "
                >
                  {{ brand.status }}
                </button>
              </td>

              <!-- CREATED -->

              <td class="px-6 py-5 text-sm text-gray-500">
                {{ brand.created }}
              </td>

              <!-- ACTIONS -->

              <td class="px-6 py-5">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/brands/${brand.id}`"
                    class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
                  >
                    View
                  </NuxtLink>

                  <NuxtLink
                    :to="`/admin/brands/${brand.id}/edit`"
                    class="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                  >
                    Edit
                  </NuxtLink>

                  <button
                    @click="openDeleteModal(brand)"
                    class="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
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

    <!-- ================================================= -->
    <!-- EMPTY STATE -->
    <!-- ================================================= -->

    <div
      v-if="filteredBrands.length === 0"
      class="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center"
    >
      <div
        class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl"
      >
        🔍
      </div>

      <h3 class="mt-5 text-lg font-bold">No brands found</h3>

      <p class="mt-2 text-sm text-gray-500">
        Try changing your search or filter.
      </p>

      <button
        @click="clearFilters"
        class="mt-5 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white"
      >
        Clear Filters
      </button>
    </div>

    <!-- ================================================= -->
    <!-- PAGINATION -->
    <!-- ================================================= -->

    <div
      v-if="filteredBrands.length > itemsPerPage"
      class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm text-gray-500">
        Page
        <span class="font-bold text-gray-900">
          {{ currentPage }}
        </span>

        of

        <span class="font-bold text-gray-900">
          {{ totalPages }}
        </span>
      </p>

      <div class="flex gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
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
            {{ selectedBrand?.name }}
          </span>
          ? This action cannot be undone.
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            @click="deleteBrand"
            class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete Brand
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
