<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "admin",
});

const activeTab = ref<"general" | "store" | "notifications" | "security" | "system">("general");

// General Settings
const storeName = ref("365 Sport");
const storeTagline = ref("Premium Athletic Footwear & Apparel");
const email = ref("support@365sport.com");
const phone = ref("+855 12 345 678");
const address = ref("Preah Monivong Blvd, Phnom Penh, Cambodia");

// Store Settings
const currency = ref("USD");
const timezone = ref("Asia/Phnom_Penh");
const orderPrefix = ref("ORD-");
const taxRate = ref(10);
const freeShippingThreshold = ref(100);

// Notification Settings
const orderEmail = ref(true);
const stockAlert = ref(true);
const lowStockThreshold = ref(5);
const newUserAlert = ref(false);
const reviewAlert = ref(true);
const dailyDigest = ref(false);

// Security Settings
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const twoFactorEnabled = ref(false);

// System Settings
const maintenanceMode = ref(false);
const debugLogging = ref(false);

// Notification toast feedback
const showToast = ref(false);
const toastMessage = ref("");
const isSaving = ref(false);

const triggerToast = (msg: string) => {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const saveSettings = () => {
  isSaving.value = true;
  setTimeout(() => {
    isSaving.value = false;
    triggerToast("Settings saved successfully!");
  }, 400);
};

const clearCache = () => {
  triggerToast("Application cache cleared successfully!");
};

const exportBackup = () => {
  const backupData = {
    storeName: storeName.value,
    storeTagline: storeTagline.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    currency: currency.value,
    timezone: timezone.value,
    orderPrefix: orderPrefix.value,
    taxRate: taxRate.value,
    freeShippingThreshold: freeShippingThreshold.value,
    maintenanceMode: maintenanceMode.value,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `365sport-settings-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  triggerToast("Settings backup exported successfully!");
};
</script>

<template>
  <div class="space-y-5">
    <!-- ================= HEADER ================= -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-md bg-gray-900 text-white shadow-2xs">
          <!-- Cog / Settings SVG Icon -->
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
            Settings
          </h1>
          <p class="text-xs text-gray-400 mt-0.5">
            Configure store preferences, localization, notifications, and security
          </p>
        </div>
      </div>

      <button
        type="button"
        :disabled="isSaving"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-black active:scale-95 disabled:opacity-50"
        @click="saveSettings"
      >
        <svg
          v-if="!isSaving"
          class="h-3.5 w-3.5 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg
          v-else
          class="h-3.5 w-3.5 animate-spin text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>{{ isSaving ? "Saving..." : "Save Changes" }}</span>
      </button>
    </div>

    <!-- ================= MAIN LAYOUT GRID ================= -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-4">
      <!-- Sidebar Navigation -->
      <aside class="h-fit rounded-md border border-gray-100 bg-white p-2 shadow-xs space-y-1">
        <!-- General Tab -->
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition"
          :class="
            activeTab === 'general'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          "
          @click="activeTab = 'general'"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>General</span>
        </button>

        <!-- Store Configuration Tab -->
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition"
          :class="
            activeTab === 'store'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          "
          @click="activeTab = 'store'"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Store & Localization</span>
        </button>

        <!-- Notifications Tab -->
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition"
          :class="
            activeTab === 'notifications'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          "
          @click="activeTab = 'notifications'"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span>Notifications</span>
        </button>

        <!-- Security Tab -->
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition"
          :class="
            activeTab === 'security'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          "
          @click="activeTab = 'security'"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Security</span>
        </button>

        <!-- System Tab -->
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition"
          :class="
            activeTab === 'system'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          "
          @click="activeTab = 'system'"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          <span>System & Data</span>
        </button>
      </aside>

      <!-- Content Panels -->
      <main class="lg:col-span-3 space-y-5">
        <!-- ================= 1. GENERAL TAB ================= -->
        <div
          v-if="activeTab === 'general'"
          class="rounded-md border border-gray-100 bg-white shadow-xs overflow-hidden"
        >
          <div class="border-b border-gray-100 p-5">
            <h2 class="text-sm font-bold text-gray-900">General Information</h2>
            <p class="mt-0.5 text-xs text-gray-400">
              Basic storefront branding and primary contact details
            </p>
          </div>

          <div class="p-5 space-y-4">
            <!-- Store Profile Image Mock -->
            <div class="flex items-center gap-4 pb-3 border-b border-gray-100">
              <div class="flex h-14 w-14 items-center justify-center rounded-md bg-black text-lime-400 font-black text-lg shadow-2xs">
                365
              </div>
              <div>
                <p class="text-xs font-bold text-gray-900">Store Brand Logo</p>
                <p class="text-[11px] text-gray-400 mt-0.5">Recommended 256x256px SVG or PNG</p>
                <div class="mt-2 flex gap-2">
                  <button
                    type="button"
                    class="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50"
                  >
                    Change Logo
                  </button>
                </div>
              </div>
            </div>

            <!-- Store Name & Tagline -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Store Name
                </label>
                <input
                  v-model="storeName"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Tagline / Slogan
                </label>
                <input
                  v-model="storeTagline"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                />
              </div>
            </div>

            <!-- Email & Phone -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Support Email
                </label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    v-model="email"
                    type="email"
                    class="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-2 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Phone Number
                </label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input
                    v-model="phone"
                    type="text"
                    class="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-2 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <!-- Address -->
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Storefront Address
              </label>
              <textarea
                v-model="address"
                rows="2"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- ================= 2. STORE & LOCALIZATION TAB ================= -->
        <div
          v-if="activeTab === 'store'"
          class="rounded-md border border-gray-100 bg-white shadow-xs overflow-hidden"
        >
          <div class="border-b border-gray-100 p-5">
            <h2 class="text-sm font-bold text-gray-900">Store Configuration & Localization</h2>
            <p class="mt-0.5 text-xs text-gray-400">
              Manage currency, timezone, tax rates, and checkout limits
            </p>
          </div>

          <div class="p-5 space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Default Currency
                </label>
                <select
                  v-model="currency"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="KHR">KHR (៛) - Cambodian Riel</option>
                  <option value="THB">THB (฿) - Thai Baht</option>
                  <option value="EUR">EUR (€) - Euro</option>
                </select>
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Store Timezone
                </label>
                <select
                  v-model="timezone"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                >
                  <option value="Asia/Phnom_Penh">Asia/Phnom_Penh (UTC+7)</option>
                  <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
                  <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Order Number Prefix
                </label>
                <input
                  v-model="orderPrefix"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                  placeholder="ORD-"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Standard Tax / VAT (%)
                </label>
                <input
                  v-model.number="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Free Shipping Threshold ($)
                </label>
                <input
                  v-model.number="freeShippingThreshold"
                  type="number"
                  min="0"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ================= 3. NOTIFICATIONS TAB ================= -->
        <div
          v-if="activeTab === 'notifications'"
          class="rounded-md border border-gray-100 bg-white shadow-xs overflow-hidden"
        >
          <div class="border-b border-gray-100 p-5">
            <h2 class="text-sm font-bold text-gray-900">Administrator Alerts & Email Events</h2>
            <p class="mt-0.5 text-xs text-gray-400">
              Customize real-time alerts and trigger thresholds for the store team
            </p>
          </div>

          <div class="divide-y divide-gray-100">
            <!-- New Order Alert -->
            <div class="flex items-center justify-between p-4 sm:px-5">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-900">New Order Notifications</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">
                    Notify administrators whenever a customer checkout completes
                  </p>
                </div>
              </div>

              <!-- Sleek Modern Switch -->
              <button
                type="button"
                class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden"
                :class="orderEmail ? 'bg-gray-900' : 'bg-gray-200'"
                @click="orderEmail = !orderEmail"
              >
                <span
                  class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-2xs transform transition duration-200 ease-in-out"
                  :class="orderEmail ? 'translate-x-4' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <!-- Low Stock Alert -->
            <div class="p-4 sm:px-5 space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-900">Low Stock Warnings</p>
                    <p class="text-[11px] text-gray-400 mt-0.5">
                      Receive automated warnings when inventory falls below minimum threshold
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden"
                  :class="stockAlert ? 'bg-gray-900' : 'bg-gray-200'"
                  @click="stockAlert = !stockAlert"
                >
                  <span
                    class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-2xs transform transition duration-200 ease-in-out"
                    :class="stockAlert ? 'translate-x-4' : 'translate-x-0'"
                  ></span>
                </button>
              </div>

              <!-- Threshold setting -->
              <div v-if="stockAlert" class="ml-11 flex items-center gap-2 pt-1">
                <span class="text-[11px] text-gray-500">Alert threshold:</span>
                <input
                  v-model.number="lowStockThreshold"
                  type="number"
                  min="1"
                  max="100"
                  class="w-16 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                />
                <span class="text-[11px] text-gray-400">units remaining</span>
              </div>
            </div>

            <!-- New Customer Alert -->
            <div class="flex items-center justify-between p-4 sm:px-5">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-900">New Customer Registrations</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">
                    Trigger an alert when a customer creates a new verified account
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden"
                :class="newUserAlert ? 'bg-gray-900' : 'bg-gray-200'"
                @click="newUserAlert = !newUserAlert"
              >
                <span
                  class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-2xs transform transition duration-200 ease-in-out"
                  :class="newUserAlert ? 'translate-x-4' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <!-- Review Alert -->
            <div class="flex items-center justify-between p-4 sm:px-5">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-900">Product Review Submissions</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">
                    Notify moderators when a new customer review requires approval
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden"
                :class="reviewAlert ? 'bg-gray-900' : 'bg-gray-200'"
                @click="reviewAlert = !reviewAlert"
              >
                <span
                  class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-2xs transform transition duration-200 ease-in-out"
                  :class="reviewAlert ? 'translate-x-4' : 'translate-x-0'"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- ================= 4. SECURITY TAB ================= -->
        <div
          v-if="activeTab === 'security'"
          class="space-y-5"
        >
          <!-- Password Change Card -->
          <div class="rounded-md border border-gray-100 bg-white shadow-xs overflow-hidden">
            <div class="border-b border-gray-100 p-5">
              <h2 class="text-sm font-bold text-gray-900">Change Administrator Password</h2>
              <p class="mt-0.5 text-xs text-gray-400">
                Ensure your account uses a strong password with at least 8 characters
              </p>
            </div>

            <div class="p-5 space-y-3.5">
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Current Password
                </label>
                <div class="relative">
                  <input
                    v-model="currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                    placeholder="Enter current password"
                  />
                  <!-- Borderless inline icon button -->
                  <button
                    type="button"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:scale-110 transition-transform"
                    :title="showCurrentPassword ? 'Hide password' : 'Show password'"
                    @click="showCurrentPassword = !showCurrentPassword"
                  >
                    <svg v-if="!showCurrentPassword" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                    New Password
                  </label>
                  <div class="relative">
                    <input
                      v-model="newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:scale-110 transition-transform"
                      :title="showNewPassword ? 'Hide password' : 'Show password'"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <svg v-if="!showNewPassword" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                    Confirm New Password
                  </label>
                  <div class="relative">
                    <input
                      v-model="confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-xs text-gray-800 shadow-2xs focus:border-gray-900 focus:outline-hidden"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:scale-110 transition-transform"
                      :title="showConfirmPassword ? 'Hide password' : 'Show password'"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <svg v-if="!showConfirmPassword" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <button
                  type="button"
                  class="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95"
                  @click="
                    currentPassword = '';
                    newPassword = '';
                    confirmPassword = '';
                    triggerToast('Password updated successfully!');
                  "
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          <!-- Two-Factor Authentication Card -->
          <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-900">Two-Factor Authentication (2FA)</p>
                <p class="text-[11px] text-gray-400 mt-0.5">
                  Require an authenticator app (Google Authenticator) on login
                </p>
              </div>
            </div>

            <button
              type="button"
              class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden"
              :class="twoFactorEnabled ? 'bg-gray-900' : 'bg-gray-200'"
              @click="twoFactorEnabled = !twoFactorEnabled"
            >
              <span
                class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-2xs transform transition duration-200 ease-in-out"
                :class="twoFactorEnabled ? 'translate-x-4' : 'translate-x-0'"
              ></span>
            </button>
          </div>
        </div>

        <!-- ================= 5. SYSTEM & DATA TAB ================= -->
        <div
          v-if="activeTab === 'system'"
          class="space-y-4"
        >
          <!-- Maintenance Mode -->
          <div class="rounded-md border border-amber-200/80 bg-amber-50/40 p-5 shadow-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-amber-900">Storefront Maintenance Mode</p>
                  <p class="text-[11px] text-amber-700 mt-0.5">
                    Temporarily disable the customer storefront and display an "Under Maintenance" splash screen
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden"
                :class="maintenanceMode ? 'bg-amber-600' : 'bg-gray-200'"
                @click="maintenanceMode = !maintenanceMode"
              >
                <span
                  class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-2xs transform transition duration-200 ease-in-out"
                  :class="maintenanceMode ? 'translate-x-4' : 'translate-x-0'"
                ></span>
              </button>
            </div>
          </div>

          <!-- Data Operations Card -->
          <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs space-y-4">
            <div>
              <h3 class="text-sm font-bold text-gray-900">System Operations</h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Maintenance tools to purge temporary caches or export settings backups
              </p>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <!-- Clear Cache -->
              <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3.5">
                <div>
                  <p class="text-xs font-bold text-gray-900">Purge Application Cache</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">Clears Nuxt ISR page & product cache</p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 active:scale-95"
                  @click="clearCache"
                >
                  <svg class="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Purge</span>
                </button>
              </div>

              <!-- Export Backup -->
              <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3.5">
                <div>
                  <p class="text-xs font-bold text-gray-900">Export Settings Backup</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">Download current JSON configuration</p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 active:scale-95"
                  @click="exportBackup"
                >
                  <svg class="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Save Floating Bar / Bottom Action -->
        <div class="flex items-center justify-between rounded-md border border-gray-100 bg-white p-4 shadow-xs">
          <p class="text-xs text-gray-400">
            Unsaved changes will be applied instantly to your store configuration.
          </p>
          <button
            type="button"
            :disabled="isSaving"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-black active:scale-95 disabled:opacity-50"
            @click="saveSettings"
          >
            <svg
              v-if="!isSaving"
              class="h-3.5 w-3.5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ isSaving ? "Saving..." : "Save Changes" }}</span>
          </button>
        </div>
      </main>
    </div>

    <!-- ================= TOAST NOTIFICATION ================= -->
    <transition
      enter-active-class="transform ease-out duration-200 transition"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-md border border-gray-900 bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl"
      >
        <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>