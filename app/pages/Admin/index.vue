<script setup lang="ts">
import { computed } from "vue";
import { useAdminStore } from "~/composables/useAdminStore";

definePageMeta({
  layout: "admin",
});

const { allOrders, allProducts, allUsers, allDiscounts } = useAdminStore();

const totalRevenue = computed(() => {
  return allOrders.value
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
});

const khrRevenue = computed(() => {
  return Math.round(totalRevenue.value * 4100);
});

const stats = computed(() => [
  {
    title: "Total Sales Revenue",
    value: `$${totalRevenue.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    change: `≈ ${khrRevenue.value.toLocaleString()} ៛`,
    icon: "💰",
  },
  {
    title: "Total Orders",
    value: String(allOrders.value.length),
    change: `${allOrders.value.filter((o) => o.status === 'Processing').length} Processing`,
    icon: "📦",
  },
  {
    title: "Live Products",
    value: String(allProducts.value.length),
    change: "Active in catalog",
    icon: "👟",
  },
  {
    title: "Customer & Users",
    value: String(allUsers.value.length),
    change: `${allDiscounts.value.filter((d) => d.status === 'Active').length} Active Discounts`,
    icon: "👥",
  },
]);
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Quick Action Shortcuts -->
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-gray-900">
          Executive Dashboard
        </h1>
        <p class="text-xs text-gray-400 mt-0.5">
          Real-time performance, revenue, orders, and Cambodian payment activity
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <NuxtLink
          to="/admin/products/create"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 active:scale-95"
        >
          <span>+ Add Product</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/discounts/create"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 active:scale-95"
        >
          <span>+ Create Voucher</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/users/create"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 active:scale-95"
        >
          <span>+ New User</span>
        </NuxtLink>

        <NuxtLink
          to="/"
          target="_blank"
          class="inline-flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-zinc-800 active:scale-95"
        >
          <span>Live Store ↗</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Store Health & Payment Gateway Status Strip -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-xs">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 font-bold text-xs">
          KHQR
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-gray-900 truncate">Bakong KHQR Gateway</p>
          <div class="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online · 0% Settlement Fee</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-xs">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
          CARD
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-gray-900 truncate">Visa / Mastercard / ABA</p>
          <div class="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-xs">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 font-bold text-xs">
          LOG
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-gray-900 truncate">Phnom Penh & Provinces</p>
          <div class="flex items-center gap-1.5 text-[10px] text-purple-600 font-semibold">
            <span>🚚 Express Delivery 1-2 Days</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Calculated Statistics Cards -->
    <AdminStats :stats="stats" />

    <!-- Sales Analytics & Top Selling Products -->
    <div class="grid gap-6 xl:grid-cols-3">
      <!-- Sales Chart -->
      <div class="xl:col-span-2">
        <AdminSalesChart />
      </div>

      <!-- Top Products -->
      <AdminTopProducts />
    </div>

    <!-- Live Recent Orders Table with real purchases -->
    <AdminRecentOrders />
  </div>
</template>
