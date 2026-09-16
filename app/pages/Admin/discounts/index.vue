<script setup lang="ts">
import { computed, ref } from "vue";
import { products } from "~/data/product";
import { discountSeedData } from "~/data/admin";
definePageMeta({
  layout: "admin",
});

const discounts = ref<Discount[]>(
  discountSeedData.map((discount) => ({ ...discount })),
);

const search = ref("");
const selectedStatus = ref("All");
const selectedType = ref("All");

const filteredDiscounts = computed(() => {
  return discounts.value.filter((discount) => {
    const searchMatch =
      discount.code.toLowerCase().includes(search.value.toLowerCase()) ||
      discount.description.toLowerCase().includes(search.value.toLowerCase());

    const statusMatch =
      selectedStatus.value === "All" ||
      discount.status === selectedStatus.value;

    const typeMatch =
      selectedType.value === "All" || discount.type === selectedType.value;

    return searchMatch && statusMatch && typeMatch;
  });
});

const totalDiscounts = computed(() => discounts.value.length);

const activeDiscounts = computed(
  () =>
    discounts.value.filter((discount) => discount.status === "Active").length,
);

const scheduledDiscounts = computed(
  () =>
    discounts.value.filter((discount) => discount.status === "Scheduled")
      .length,
);

const expiredDiscounts = computed(
  () =>
    discounts.value.filter((discount) => discount.status === "Expired").length,
);

const usagePercentage = (discount: Discount) => {
  if (discount.usageLimit === 0) return 0;

  return Math.min(Math.round((discount.used / discount.usageLimit) * 100), 100);
};

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    alert(`Discount code "${code}" copied!`);
  } catch {
    alert(`Discount code: ${code}`);
  }
};

const toggleStatus = (discount: Discount) => {
  if (discount.status === "Expired" || discount.status === "Scheduled") {
    return;
  }

  discount.status = discount.status === "Active" ? "Inactive" : "Active";
};

const deleteDiscount = (id: number) => {
  const confirmed = confirm("Are you sure you want to delete this discount?");

  if (!confirmed) return;

  discounts.value = discounts.value.filter((discount) => discount.id !== id);
};

const clearFilters = () => {
  search.value = "";
  selectedStatus.value = "All";
  selectedType.value = "All";
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <!-- ================= HEADER ================= -->
    <div
      class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Discounts</h1>

        <p class="mt-1 text-sm text-gray-500">
          Create and manage promotional discounts for your store.
        </p>
      </div>

      <NuxtLink
        to="/admin/discounts/create"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        + Create Discount
      </NuxtLink>
    </div>

    <!-- ================= STATISTICS ================= -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Total -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Discounts</p>

            <p class="mt-2 text-3xl font-bold text-gray-900">
              {{ totalDiscounts }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl"
          >
            %
          </div>
        </div>
      </div>

      <!-- Active -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Active</p>

            <p class="mt-2 text-3xl font-bold text-green-600">
              {{ activeDiscounts }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600"
          >
            ✓
          </div>
        </div>
      </div>

      <!-- Scheduled -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Scheduled</p>

            <p class="mt-2 text-3xl font-bold text-blue-600">
              {{ scheduledDiscounts }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600"
          >
            →
          </div>
        </div>
      </div>

      <!-- Expired -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Expired</p>

            <p class="mt-2 text-3xl font-bold text-red-600">
              {{ expiredDiscounts }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600"
          >
            !
          </div>
        </div>
      </div>
    </div>

    <!-- ================= FILTER ================= -->
    <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <!-- Search -->
        <div class="lg:col-span-2">
          <label
            class="mb-2 block text-xs font-semibold uppercase text-gray-500"
          >
            Search
          </label>

          <div class="relative">
            <span
              class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              🔍
            </span>

            <input
              v-model="search"
              type="text"
              placeholder="Search discount code or description..."
              class="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
            />
          </div>
        </div>

        <!-- Status -->
        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase text-gray-500"
          >
            Status
          </label>

          <select
            v-model="selectedStatus"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="All">All Status</option>

            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>

            <option value="Scheduled">Scheduled</option>

            <option value="Expired">Expired</option>
          </select>
        </div>

        <!-- Type -->
        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase text-gray-500"
          >
            Type
          </label>

          <select
            v-model="selectedType"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="All">All Types</option>

            <option value="Percentage">Percentage</option>

            <option value="Fixed">Fixed Amount</option>
          </select>
        </div>
      </div>

      <!-- Filter footer -->
      <div
        class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm text-gray-500">
          Showing
          <span class="font-semibold text-gray-900">
            {{ filteredDiscounts.length }}
          </span>
          discount{{ filteredDiscounts.length === 1 ? "" : "s" }}
        </p>

        <button
          @click="clearFilters"
          class="text-sm font-semibold text-gray-600 hover:text-black hover:underline"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- ================= DISCOUNT TABLE ================= -->
    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <!-- Table Header -->
      <div
        class="flex flex-col gap-2 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="text-lg font-bold text-gray-900">All Discounts</h2>

          <p class="mt-1 text-sm text-gray-500">
            Manage your promotional codes and campaigns.
          </p>
        </div>

        <span
          class="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
        >
          {{ filteredDiscounts.length }} Results
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1100px]">
          <thead class="bg-gray-50">
            <tr class="border-b border-gray-200">
              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Discount
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Value
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Usage
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Products
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Duration
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Status
              </th>

              <th
                class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="discount in filteredDiscounts"
              :key="discount.id"
              class="transition hover:bg-gray-50"
            >
              <!-- Discount -->
              <td class="px-6 py-5">
                <div>
                  <div class="flex items-center gap-2">
                    <span
                      class="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-1.5 font-mono text-sm font-bold text-gray-900"
                    >
                      {{ discount.code }}
                    </span>

                    <button
                      @click="copyCode(discount.code)"
                      class="text-xs text-gray-400 hover:text-black"
                      title="Copy code"
                    >
                      Copy
                    </button>
                  </div>

                  <p class="mt-2 text-sm text-gray-500">
                    {{ discount.description }}
                  </p>
                </div>
              </td>

              <!-- Value -->
              <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                  <span
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold"
                  >
                    {{ discount.type === "Percentage" ? "%" : "$" }}
                  </span>

                  <div>
                    <p class="font-bold text-gray-900">
                      {{ discount.value
                      }}{{ discount.type === "Percentage" ? "%" : "$" }}
                    </p>

                    <p class="text-xs text-gray-400">
                      {{ discount.type }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Usage -->
              <td class="px-6 py-5">
                <div class="w-40">
                  <div class="mb-2 flex items-center justify-between">
                    <span class="text-sm font-semibold">
                      {{ discount.used }} / {{ discount.usageLimit }}
                    </span>

                    <span class="text-xs text-gray-400">
                      {{ usagePercentage(discount) }}%
                    </span>
                  </div>

                  <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="
                        usagePercentage(discount) >= 90
                          ? 'bg-red-500'
                          : usagePercentage(discount) >= 70
                            ? 'bg-yellow-500'
                            : 'bg-black'
                      "
                      :style="{
                        width: `${usagePercentage(discount)}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </td>

              <!-- Products -->
              <td class="px-6 py-5">
                <span
                  class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                >
                  {{ discount.products }} Products
                </span>
              </td>

              <!-- Duration -->
              <td class="px-6 py-5">
                <div class="text-sm">
                  <p class="font-medium text-gray-900">
                    {{ discount.startDate }}
                  </p>

                  <p class="mt-1 text-xs text-gray-400">
                    to {{ discount.endDate }}
                  </p>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-5">
                <button
                  @click="toggleStatus(discount)"
                  class="rounded-full px-3 py-1.5 text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-700': discount.status === 'Active',

                    'bg-red-100 text-red-700': discount.status === 'Expired',

                    'bg-blue-100 text-blue-700':
                      discount.status === 'Scheduled',

                    'bg-gray-100 text-gray-600': discount.status === 'Inactive',
                  }"
                >
                  {{ discount.status }}
                </button>
              </td>

              <!-- Actions -->
              <td class="px-6 py-5">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/discounts/${discount.id}`"
                    class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    View
                  </NuxtLink>

                  <NuxtLink
                    :to="`/admin/discounts/${discount.id}`"
                    class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </NuxtLink>

                  <button
                    @click="deleteDiscount(discount.id)"
                    class="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="filteredDiscounts.length === 0">
              <td colspan="7" class="px-6 py-16 text-center">
                <div class="mx-auto max-w-sm">
                  <div
                    class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl"
                  >
                    %
                  </div>

                  <h3 class="mt-4 font-bold text-gray-900">
                    No discounts found
                  </h3>

                  <p class="mt-1 text-sm text-gray-500">
                    Try changing your filters or create a new discount.
                  </p>

                  <button
                    @click="clearFilters"
                    class="mt-4 text-sm font-semibold text-black underline"
                  >
                    Clear Filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div
        class="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm text-gray-500">
          Showing
          <span class="font-semibold text-gray-900">
            {{ filteredDiscounts.length }}
          </span>
          of
          <span class="font-semibold text-gray-900">
            {{ totalDiscounts }}
          </span>
          discounts
        </p>

        <div class="flex gap-2">
          <button
            disabled
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-400"
          >
            Previous
          </button>

          <button
            class="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            1
          </button>

          <button
            disabled
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
