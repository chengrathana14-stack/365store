<script setup lang="ts">
import { computed, ref } from "vue";
import { useAdminStore } from "~/composables/useAdminStore";
import { useToast } from "~/composables/useToast";
import type { Discount } from "~/type/product";

definePageMeta({
  layout: "admin",
});

const { allDiscounts, toggleDiscountStatus, deleteDiscount } = useAdminStore();
const { success, info } = useToast();

const discounts = allDiscounts;

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
    success("Code Copied!", `Discount code "${code}" copied to clipboard.`);
  } catch {
    info("Discount Code", code);
  }
};

const toggleStatus = (discount: Discount) => {
  toggleDiscountStatus(discount.code);
  success("Status Updated", `Campaign "${discount.code}" is now ${discount.status}.`);
};

// =========================================
// DELETE MODAL
// =========================================

const discountToDelete = ref<Discount | null>(null);
const showDeleteModal = ref(false);

const openDeleteModal = (discount: Discount) => {
  discountToDelete.value = discount;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  discountToDelete.value = null;
  showDeleteModal.value = false;
};

const confirmDeleteDiscount = () => {
  if (discountToDelete.value) {
    deleteDiscount(discountToDelete.value.code);
    success("Discount Removed", `Code "${discountToDelete.value.code}" has been deleted.`);
  }
  closeDeleteModal();
};

// =========================================
// VIEW MODAL
// =========================================

const discountToView = ref<Discount | null>(null);
const showViewModal = ref(false);

const openViewModal = (discount: Discount) => {
  discountToView.value = discount;
  showViewModal.value = true;
};

const closeViewModal = () => {
  discountToView.value = null;
  showViewModal.value = false;
};

const clearFilters = () => {
  search.value = "";
  selectedStatus.value = "All";
  selectedType.value = "All";
};

const getStatusBadgeClass = (status: string) => {
  if (status === "Active") {
    return "bg-emerald-50 text-emerald-600 border border-emerald-100";
  }
  if (status === "Scheduled") {
    return "bg-blue-50 text-blue-600 border border-blue-100";
  }
  if (status === "Expired") {
    return "bg-red-50 text-red-600 border border-red-100";
  }
  return "bg-gray-50 text-gray-600 border border-gray-100";
};
</script>

<template>
  <div class="space-y-5">

    <!-- ================= HEADER ================= -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-md bg-gray-900 text-white shadow-2xs">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>

        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
            Discounts
          </h1>
          <p class="text-xs text-gray-400 mt-0.5">
            Create and manage promotional campaigns, coupons, and seasonal sales
          </p>
        </div>
      </div>

      <NuxtLink
        to="/admin/discounts/create"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Create Discount</span>
      </NuxtLink>
    </div>

    <!-- ================= STATISTICS ================= -->
    <div class="grid gap-3 grid-cols-2 lg:grid-cols-4">
      <!-- Total -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Discounts</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">{{ totalDiscounts }}</p>
      </div>

      <!-- Active -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Active Codes</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-emerald-600">{{ activeDiscounts }}</p>
      </div>

      <!-- Scheduled -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Scheduled</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-blue-600">{{ scheduledDiscounts }}</p>
      </div>

      <!-- Expired -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Expired</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-red-500">{{ expiredDiscounts }}</p>
      </div>
    </div>

    <!-- ================= FILTERS ================= -->
    <div class="rounded-md border border-gray-100 bg-white p-3.5 shadow-xs">
      <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center">
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
            placeholder="Search code or promotional description..."
            class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <!-- Status Filter -->
        <select
          v-model="selectedStatus"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Expired">Expired</option>
          <option value="Inactive">Inactive</option>
        </select>

        <!-- Type Filter -->
        <select
          v-model="selectedType"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="All">All Types</option>
          <option value="Percentage">Percentage</option>
          <option value="Fixed Amount">Fixed Amount</option>
        </select>

        <!-- Reset Button -->
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition shadow-2xs"
          @click="clearFilters"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Result Count -->
    <div class="flex items-center justify-between px-1 text-xs text-gray-400">
      <p>
        Showing
        <span class="font-bold text-gray-900">{{ filteredDiscounts.length }}</span>
        promotional codes
      </p>
    </div>

    <!-- ================= TABLE ================= -->
    <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[950px] text-left text-xs">
          <thead class="border-b border-gray-100 bg-white">
            <tr>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                DISCOUNT CODE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                VALUE / TYPE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                USAGE QUOTA
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                APPLICABLE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                VALIDITY PERIOD
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
              v-for="discount in filteredDiscounts"
              :key="discount.id"
              class="transition hover:bg-gray-50/60"
            >
              <!-- Code & Description -->
              <td class="px-6 py-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="rounded-md border border-dashed border-gray-300 bg-gray-50 px-2.5 py-1 font-mono text-xs font-bold text-gray-900 tracking-wider">
                      {{ discount.code }}
                    </span>

                    <button
                      type="button"
                      title="Copy promo code"
                      class="text-gray-400 hover:text-gray-700 hover:scale-125 transition-transform p-0.5"
                      @click="copyCode(discount.code)"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <p class="mt-1 text-[11px] text-gray-400 line-clamp-1">
                    {{ discount.description }}
                  </p>
                </div>
              </td>

              <!-- Value -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 font-bold text-xs shadow-2xs">
                    {{ discount.type === "Percentage" ? "%" : "$" }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-xs sm:text-sm">
                      {{ discount.value }}{{ discount.type === "Percentage" ? "%" : "$" }} OFF
                    </p>
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide">
                      {{ discount.type }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Usage Progress -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-36">
                  <div class="mb-1 flex items-center justify-between text-[11px]">
                    <span class="font-semibold text-gray-700">
                      {{ discount.used }} / {{ discount.usageLimit }}
                    </span>
                    <span class="font-bold text-gray-400">
                      {{ usagePercentage(discount) }}%
                    </span>
                  </div>

                  <div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="
                        usagePercentage(discount) >= 90
                          ? 'bg-red-500'
                          : usagePercentage(discount) >= 70
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      "
                      :style="{ width: `${usagePercentage(discount)}%` }"
                    ></div>
                  </div>
                </div>
              </td>

              <!-- Applicable Products -->
              <td class="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                {{ discount.products }} Products
              </td>

              <!-- Validity Period -->
              <td class="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                <p class="font-medium text-gray-800">{{ discount.startDate }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">to {{ discount.endDate }}</p>
              </td>

              <!-- Status Badge & Toggle -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  type="button"
                  title="Click to toggle status"
                  class="rounded-md px-2.5 py-1 text-xs font-semibold transition"
                  :class="getStatusBadgeClass(discount.status)"
                  @click="toggleStatus(discount)"
                >
                  {{ discount.status }}
                </button>
              </td>

              <!-- ACTIONS: BORDERLESS INLINE ICONS -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-3">
                  <!-- Toggle / Active Status Icon -->
                  <button
                    type="button"
                    title="Toggle Status"
                    class="text-emerald-500 hover:text-emerald-700 hover:scale-125 transition-transform p-0.5"
                    @click="toggleStatus(discount)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  <!-- Delete Icon -->
                  <button
                    type="button"
                    title="Delete Discount"
                    class="text-red-400 hover:text-red-600 hover:scale-125 transition-transform p-0.5"
                    @click="openDeleteModal(discount)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <!-- View Modal Icon -->
                  <button
                    type="button"
                    title="View Discount Details"
                    class="text-blue-400 hover:text-blue-600 hover:scale-125 transition-transform p-0.5"
                    @click="openViewModal(discount)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredDiscounts.length === 0"
        class="py-14 text-center"
      >
        <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="mt-3 text-xs font-bold text-gray-900">No discounts found</h3>
        <p class="mt-0.5 text-[11px] text-gray-400">Try changing your search terms or filter settings.</p>
      </div>
    </div>

    <!-- ================= VIEW DETAILS MODAL ================= -->
    <div
      v-if="showViewModal && discountToView"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-md rounded-md bg-white p-5 shadow-xl border border-gray-100">
        <div class="flex items-start justify-between border-b border-gray-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shadow-2xs">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 class="font-mono text-sm font-black text-gray-900">{{ discountToView.code }}</h3>
              <p class="text-[11px] text-gray-400">{{ discountToView.description }}</p>
            </div>
          </div>

          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 transition"
            @click="closeViewModal"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mt-4 space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3 rounded-lg bg-gray-50/80 p-3 border border-gray-100">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Discount Value</p>
              <p class="mt-0.5 text-base font-black text-blue-600">
                {{ discountToView.value }}{{ discountToView.type === "Percentage" ? "%" : "$" }} OFF
              </p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Campaign Status</p>
              <span
                class="mt-1 inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold"
                :class="getStatusBadgeClass(discountToView.status)"
              >
                {{ discountToView.status }}
              </span>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between border-b border-gray-100/80 py-1.5">
              <span class="text-gray-400">Discount Type</span>
              <span class="font-bold text-gray-900">{{ discountToView.type }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-100/80 py-1.5">
              <span class="text-gray-400">Times Used</span>
              <span class="font-bold text-gray-900">{{ discountToView.used }} / {{ discountToView.usageLimit }} limit</span>
            </div>
            <div class="flex justify-between border-b border-gray-100/80 py-1.5">
              <span class="text-gray-400">Applies To</span>
              <span class="font-bold text-gray-900">{{ discountToView.products }} Products</span>
            </div>
            <div class="flex justify-between py-1.5">
              <span class="text-gray-400">Validity Window</span>
              <span class="font-medium text-gray-800">{{ discountToView.startDate }} → {{ discountToView.endDate }}</span>
            </div>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2 text-xs font-semibold border-t border-gray-100 pt-3">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-gray-700 hover:bg-gray-50 transition"
            @click="closeViewModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- ================= DELETE MODAL ================= -->
    <div
      v-if="showDeleteModal && discountToDelete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-sm rounded-md bg-white p-5 shadow-xl border border-gray-100">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 class="mt-3 text-sm font-bold text-gray-900">Delete Discount Code?</h3>
        <p class="mt-1 text-xs leading-relaxed text-gray-500">
          Are you sure you want to delete <span class="font-mono font-bold text-gray-900">{{ discountToDelete.code }}</span>? Customers will no longer be able to apply this discount.
        </p>

        <div class="mt-5 flex justify-end gap-2 text-xs font-semibold">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition"
            @click="closeDeleteModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="rounded-lg bg-red-600 px-3.5 py-1.5 text-white hover:bg-red-700 transition shadow-2xs"
            @click="confirmDeleteDiscount"
          >
            Delete Discount
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
