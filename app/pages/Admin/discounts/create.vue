<script setup lang="ts">
import { ref, computed } from "vue";
import { products } from "~/data/product";
import { useAdminStore } from "~/composables/useAdminStore";
import { useToast } from "~/composables/useToast";
import type { Discount } from "~/type/product";

definePageMeta({
  layout: "admin",
});

const { addDiscount } = useAdminStore();
const { success, error } = useToast();

const discountType = ref<"percentage" | "fixed">("percentage");
const discountValue = ref<number | null>(15);
const discountCode = ref("");
const description = ref("");
const startDate = ref(new Date().toISOString().split("T")[0]);
const endDate = ref("");
const minPurchase = ref<number | null>(50);
const usageLimit = ref<number | null>(100);
const selectedProducts = ref<number[]>([]);
const active = ref(true);

const selectAll = computed({
  get() {
    return selectedProducts.value.length === products.length;
  },
  set(value: boolean) {
    selectedProducts.value = value
      ? products.map((product) => product.id)
      : [];
  },
});

const toggleProduct = (id: number) => {
  if (selectedProducts.value.includes(id)) {
    selectedProducts.value = selectedProducts.value.filter(
      (productId) => productId !== id
    );
  } else {
    selectedProducts.value.push(id);
  }
};

const generateRandomCode = () => {
  const prefixes = ["SPORT", "NIKE", "RUNNER", "CAMBODIA", "PRO", "CHAMPION"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const val = discountValue.value || 15;
  discountCode.value = `${randomPrefix}${val}`;
};

const saveDiscount = () => {
  if (!discountCode.value.trim()) {
    error("Discount Code Required", "Please enter a promotional code or click generate.");
    return;
  }

  if (!discountValue.value || discountValue.value <= 0) {
    error("Invalid Discount Value", "Discount amount must be greater than 0.");
    return;
  }

  const cleanCode = discountCode.value.trim().toUpperCase();

  const newDiscount: Discount = {
    id: Math.floor(Math.random() * 9000) + 1000,
    code: cleanCode,
    description:
      description.value.trim() ||
      `${discountValue.value}${discountType.value === "percentage" ? "%" : "$"} off on 365 sports gear`,
    type: discountType.value === "percentage" ? "Percentage" : "Fixed Amount",
    value: discountValue.value,
    status: active.value ? "Active" : "Scheduled",
    startDate: startDate.value || new Date().toISOString().split("T")[0],
    endDate: endDate.value || "2026-12-31",
    minPurchase: minPurchase.value || 0,
    usageLimit: usageLimit.value || 100,
    used: 0,
  };

  addDiscount(newDiscount);
  success("Discount Voucher Created!", `Promo code ${cleanCode} is now active.`);
  navigateTo("/admin/discounts");
};

const cancel = () => {
  navigateTo("/admin/discounts");
};
</script>

<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <NuxtLink
          to="/admin/discounts"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition mb-2"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Discounts</span>
        </NuxtLink>

        <div class="mt-1">
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
            Create Discount Campaign
          </h1>
          <p class="text-xs text-gray-400 mt-0.5">
            Configure a promotional voucher code or percentage discount for checkout
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
          @click="cancel"
        >
          Cancel
        </button>

        <button
          type="button"
          class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
          @click="saveDiscount"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Save Discount</span>
        </button>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <!-- Main Form Columns (2 cols) -->
      <div class="space-y-4 xl:col-span-2">
        <!-- Basic Information -->
        <div class="rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
          <div class="mb-4 border-b border-gray-100 pb-3">
            <h2 class="text-sm font-bold text-gray-900">
              Basic Campaign Information
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">
              Code identification, promotion type, and customer message
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-gray-700">
                  Discount Code <span class="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  @click="generateRandomCode"
                  class="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  ⚡ Auto-Generate Code
                </button>
              </div>

              <div class="relative">
                <input
                  v-model="discountCode"
                  type="text"
                  placeholder="e.g. SPORT20, NIKEFEST"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p class="mt-1 text-[11px] text-gray-400">
                Code that customers will apply at checkout.
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Discount Type
              </label>
              <select
                v-model="discountType"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="percentage">Percentage Discount (%)</option>
                <option value="fixed">Fixed Cash Amount ($)</option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Discount Value <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model.number="discountValue"
                  type="number"
                  min="1"
                  placeholder="e.g. 15"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 pr-10 text-xs font-bold text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  {{ discountType === "percentage" ? "%" : "$" }}
                </span>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Promotion Description
              </label>
              <textarea
                v-model="description"
                rows="3"
                placeholder="Details of the promotion (e.g. 15% discount on all football boots & sneakers)..."
                class="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Schedule & Limits -->
        <div class="rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
          <div class="mb-4 border-b border-gray-100 pb-3">
            <h2 class="text-sm font-bold text-gray-900">
              Schedule & Redemption Rules
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">
              Launch timing, expiration date, and minimum basket value
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Start Date
              </label>
              <input
                v-model="startDate"
                type="date"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Expiration Date
              </label>
              <input
                v-model="endDate"
                type="date"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Minimum Purchase Requirement ($)
              </label>
              <input
                v-model.number="minPurchase"
                type="number"
                min="0"
                placeholder="0"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Max Usage Quota
              </label>
              <input
                v-model.number="usageLimit"
                type="number"
                min="1"
                placeholder="100"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Applicable Products -->
        <div class="rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
          <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Target Products
              </h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Select products eligible for this discount code
              </p>
            </div>

            <span class="rounded-md bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 text-xs font-bold">
              {{ selectedProducts.length }} Selected
            </span>
          </div>

          <div class="overflow-hidden rounded-lg border border-gray-200">
            <div class="flex items-center gap-2.5 border-b border-gray-200 bg-gray-50/80 px-3 py-2">
              <input
                v-model="selectAll"
                type="checkbox"
                class="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-xs font-bold text-gray-700">
                Select All Products (Entire Catalog)
              </span>
            </div>

            <div class="max-h-60 overflow-y-auto divide-y divide-gray-100">
              <div
                v-for="product in products"
                :key="product.id"
                class="flex items-center gap-3 px-3 py-2.5 transition hover:bg-gray-50"
              >
                <input
                  :checked="selectedProducts.includes(product.id)"
                  type="checkbox"
                  class="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  @change="toggleProduct(product.id)"
                />

                <img
                  :src="product.image"
                  :alt="product.name"
                  class="h-9 w-9 rounded-md object-cover bg-gray-100 border border-gray-100"
                />

                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-bold text-gray-900">
                    {{ product.name }}
                  </p>
                  <p class="text-[11px] text-gray-400">
                    {{ product.brand }} · ${{ product.price }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Column (1 col) -->
      <div class="space-y-4">
        <div class="sticky top-6 rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-gray-900">
              Voucher Preview
            </h2>

            <!-- Toggle Status Switch -->
            <button
              type="button"
              class="relative h-5 w-9 rounded-full transition"
              :class="active ? 'bg-emerald-500' : 'bg-gray-300'"
              @click="active = !active"
            >
              <span
                class="absolute top-0.5 h-4 w-4 rounded-full bg-white transition"
                :class="active ? 'left-4.5' : 'left-0.5'"
              ></span>
            </button>
          </div>

          <div class="mt-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-black p-5 text-center text-white shadow-lg border border-neutral-800">
            <p class="text-[10px] font-black uppercase tracking-widest text-lime-400">
              PROMO CODE
            </p>

            <p class="mt-1 font-mono text-2xl font-black tracking-wider text-white">
              {{ discountCode.toUpperCase() || "SPORT15" }}
            </p>

            <div class="my-3 border-t border-dashed border-neutral-700"></div>

            <p class="text-[11px] text-gray-400">
              Customer Benefit
            </p>

            <p class="mt-0.5 text-2xl font-black text-lime-400 drop-shadow-[0_0_8px_rgba(183,243,74,0.3)]">
              {{ discountValue || 0 }}{{ discountType === "percentage" ? "%" : "$" }} OFF
            </p>
          </div>

          <div class="mt-4 space-y-2.5 text-xs">
            <div class="flex justify-between border-b border-gray-100/80 py-1">
              <span class="text-gray-400">Campaign Status</span>
              <span
                class="font-bold"
                :class="active ? 'text-emerald-600' : 'text-gray-400'"
              >
                {{ active ? "Active Now" : "Inactive" }}
              </span>
            </div>

            <div class="flex justify-between border-b border-gray-100/80 py-1">
              <span class="text-gray-400">Eligible Products</span>
              <span class="font-bold text-gray-900">
                {{ selectedProducts.length > 0 ? `${selectedProducts.length} Items` : 'All Products' }}
              </span>
            </div>

            <div class="flex justify-between border-b border-gray-100/80 py-1">
              <span class="text-gray-400">Min. Basket Requirement</span>
              <span class="font-bold text-gray-900">
                ${{ minPurchase || 0 }}
              </span>
            </div>

            <div class="flex justify-between py-1">
              <span class="text-gray-400">Max Usage Quota</span>
              <span class="font-bold text-gray-900">
                {{ usageLimit || "Unlimited" }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
            @click="saveDiscount"
          >
            Create Discount Code
          </button>
        </div>
      </div>
    </div>
  </div>
</template>