<script setup lang="ts">
import { computed, ref } from "vue";
import { reportPeriods, reportSeedData } from "~/data/admin";

definePageMeta({
  layout: "admin",
});

useHead({
  title: "Reports & Analytics | 365 SPORT Admin",
});

// =====================================================
// DATE FILTER
// =====================================================

const selectedPeriod = ref("This Month");
const periods = reportPeriods;

const fromDate = ref("2026-09-01");
const toDate = ref("2026-09-03");
const reportLoading = ref(false);

// =====================================================
// REPORT DATA
// =====================================================

const report = ref({ ...reportSeedData.report });
const salesData = reportSeedData.salesData;
const topProducts = reportSeedData.topProducts;
const topCustomers = reportSeedData.topCustomers;
const orderStatuses = reportSeedData.orderStatuses;
const paymentMethods = reportSeedData.paymentMethods;

// =====================================================
// CALCULATIONS
// =====================================================

const revenueGrowth = computed(() => {
  if (!report.value.previousRevenue) return 0;
  return (
    ((report.value.revenue - report.value.previousRevenue) /
      report.value.previousRevenue) *
    100
  ).toFixed(1);
});

const ordersGrowth = computed(() => {
  if (!report.value.previousOrders) return 0;
  return (
    ((report.value.orders - report.value.previousOrders) /
      report.value.previousOrders) *
    100
  ).toFixed(1);
});

const customersGrowth = computed(() => {
  if (!report.value.previousCustomers) return 0;
  return (
    ((report.value.customers - report.value.previousCustomers) /
      report.value.previousCustomers) *
    100
  ).toFixed(1);
});

const averageOrderGrowth = computed(() => {
  if (!report.value.previousAverageOrder) return 0;
  return (
    ((report.value.averageOrder - report.value.previousAverageOrder) /
      report.value.previousAverageOrder) *
    100
  ).toFixed(1);
});

const maxRevenue = computed(() => {
  return Math.max(...salesData.map((item) => item.revenue), 1);
});

// =====================================================
// FORMAT
// =====================================================

const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// =====================================================
// PERIOD
// =====================================================

const changePeriod = () => {
  if (selectedPeriod.value === "Today") {
    fromDate.value = "2026-09-03";
    toDate.value = "2026-09-03";
  }

  if (selectedPeriod.value === "Yesterday") {
    fromDate.value = "2026-09-02";
    toDate.value = "2026-09-02";
  }

  if (selectedPeriod.value === "Last 7 Days") {
    fromDate.value = "2026-08-28";
    toDate.value = "2026-09-03";
  }

  if (selectedPeriod.value === "Last 30 Days") {
    fromDate.value = "2026-08-05";
    toDate.value = "2026-09-03";
  }

  if (selectedPeriod.value === "This Month") {
    fromDate.value = "2026-09-01";
    toDate.value = "2026-09-03";
  }

  if (selectedPeriod.value === "Last Month") {
    fromDate.value = "2026-08-01";
    toDate.value = "2026-08-31";
  }

  if (selectedPeriod.value === "This Year") {
    fromDate.value = "2026-01-01";
    toDate.value = "2026-09-03";
  }
};

// =====================================================
// ACTIONS
// =====================================================

const refreshReport = async () => {
  reportLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));
  reportLoading.value = false;
};

const printReport = () => {
  window.print();
};

const exportCSV = () => {
  const rows = [
    ["365 Sport - Sales Report"],
    [],
    ["Report Period", selectedPeriod.value],
    ["From", fromDate.value],
    ["To", toDate.value],
    [],
    ["Metric", "Value"],
    ["Revenue", report.value.revenue],
    ["Orders", report.value.orders],
    ["Customers", report.value.customers],
    ["Average Order", report.value.averageOrder],
    ["Products Sold", report.value.productsSold],
    [],
    ["Top Products"],
    ["Product", "Category", "Sold", "Revenue"],
    ...topProducts.map((product) => [
      product.name,
      product.category,
      product.sold,
      product.revenue,
    ]),
  ];

  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `365-sport-report-${fromDate.value}-to-${toDate.value}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const savePDF = () => {
  window.print();
};

const reportTitle = computed(() => {
  if (selectedPeriod.value === "Custom") {
    return `${fromDate.value} → ${toDate.value}`;
  }
  return selectedPeriod.value;
});
</script>

<template>
  <div class="space-y-5">

    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-md bg-gray-900 text-white shadow-2xs">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
            Reports & Analytics
          </h1>
          <p class="text-xs text-gray-400 mt-0.5">
            Store financial performance, product sales trends, and customer metrics
          </p>
        </div>
      </div>

      <!-- HEADER ACTION BUTTONS -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
          @click="refreshReport"
        >
          <svg
            class="h-3.5 w-3.5 text-gray-500"
            :class="{ 'animate-spin': reportLoading }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
          @click="printReport"
        >
          <svg class="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Print</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
          @click="exportCSV"
        >
          <svg class="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export CSV</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-black transition active:scale-95"
          @click="savePDF"
        >
          <svg class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Save PDF</span>
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- PERIOD & DATE FILTER BAR -->
    <!-- ================================================= -->
    <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Report Timeline Filter
          </p>

          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="period in periods"
              :key="period"
              type="button"
              class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
              :class="
                selectedPeriod === period
                  ? 'bg-gray-900 text-white shadow-2xs'
                  : 'bg-gray-50 border border-gray-200/80 text-gray-600 hover:bg-gray-100'
              "
              @click="
                selectedPeriod = period;
                changePeriod();
              "
            >
              {{ period }}
            </button>
          </div>
        </div>

        <!-- Custom Date Range -->
        <div class="flex items-center gap-2">
          <div>
            <span class="block text-[10px] font-bold uppercase text-gray-400 mb-0.5">From</span>
            <input
              v-model="fromDate"
              type="date"
              class="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-800 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <span class="block text-[10px] font-bold uppercase text-gray-400 mb-0.5">To</span>
            <input
              v-model="toDate"
              type="date"
              class="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-800 outline-none transition focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5 text-xs text-gray-400">
        <p>
          Active View:
          <span class="font-bold text-gray-900">{{ reportTitle }}</span>
        </p>

        <p class="text-[11px]">
          Currency: <span class="font-semibold text-gray-700">USD ($)</span>
        </p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- KPI CARDS (CLEAN SMALL-RADIUS METRICS) -->
    <!-- ================================================= -->
    <div class="grid gap-3 grid-cols-2 lg:grid-cols-4">
      <!-- Total Revenue -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Revenue</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">{{ formatPrice(report.revenue) }}</p>
        <span class="mt-1 inline-flex items-center text-[11px] font-semibold text-emerald-600">
          +{{ revenueGrowth }}% vs previous period
        </span>
      </div>

      <!-- Orders -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Orders</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">{{ report.orders.toLocaleString() }}</p>
        <span class="mt-1 inline-flex items-center text-[11px] font-semibold text-emerald-600">
          +{{ ordersGrowth }}% vs previous period
        </span>
      </div>

      <!-- Average Order Value -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Average Order Value</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">{{ formatPrice(report.averageOrder) }}</p>
        <span class="mt-1 inline-flex items-center text-[11px] font-semibold text-emerald-600">
          +{{ averageOrderGrowth }}% trend
        </span>
      </div>

      <!-- Customers -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Active Shoppers</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">{{ report.customers.toLocaleString() }}</p>
        <span class="mt-1 inline-flex items-center text-[11px] font-semibold text-emerald-600">
          +{{ customersGrowth }}% growth
        </span>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- SALES CHART + ORDER STATUS -->
    <!-- ================================================= -->
    <div class="grid gap-4 xl:grid-cols-3">
      <!-- Sales Chart -->
      <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs xl:col-span-2">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Revenue Performance</h3>
            <p class="text-xs text-gray-400 mt-0.5">Monthly revenue trends</p>
          </div>

          <div class="text-right">
            <p class="text-[10px] font-bold uppercase text-gray-400">Total Period Revenue</p>
            <p class="text-base font-black text-emerald-600">{{ formatPrice(report.revenue) }}</p>
          </div>
        </div>

        <!-- Bar chart -->
        <div class="mt-6 flex h-60 items-end gap-2 sm:gap-3 overflow-x-auto pt-4">
          <div
            v-for="item in salesData"
            :key="item.month"
            class="group flex h-full min-w-[32px] flex-1 flex-col justify-end"
          >
            <div class="relative flex h-full items-end">
              <div
                class="w-full rounded-t-md bg-gray-900 transition-all duration-300 group-hover:bg-blue-600 shadow-2xs"
                :style="{
                  height: `${(item.revenue / maxRevenue) * 100}%`,
                  minHeight: item.revenue ? '6px' : '0px',
                }"
              >
                <!-- Tooltip -->
                <div class="absolute -translate-y-6 whitespace-nowrap rounded-md bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100 shadow-xs pointer-events-none">
                  {{ formatPrice(item.revenue) }}
                </div>
              </div>
            </div>

            <div class="mt-2 text-center text-[11px] font-medium text-gray-400">
              {{ item.month }}
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
          <div class="flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-gray-900"></span>
            <span class="font-medium text-gray-700">Monthly Revenue</span>
          </div>

          <p>Orders: <span class="font-bold text-gray-900">{{ report.orders }}</span></p>
        </div>
      </div>

      <!-- Order Status Distribution -->
      <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-900">Order Fulfillment</h3>
          <p class="text-xs text-gray-400 mt-0.5">Order distribution across lifecycle</p>

          <div class="mt-5 space-y-4">
            <div v-for="status in orderStatuses" :key="status.name">
              <div class="mb-1 flex justify-between text-xs">
                <span class="font-semibold text-gray-700">{{ status.name }}</span>
                <span class="font-bold text-gray-900">{{ status.count }} orders ({{ status.percentage }}%)</span>
              </div>

              <div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full transition-all"
                  :class="
                    status.name === 'Delivered'
                      ? 'bg-emerald-500'
                      : status.name === 'Processing'
                        ? 'bg-blue-500'
                        : status.name === 'Pending'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                  "
                  :style="{ width: `${status.percentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 border-t border-gray-100 pt-3 text-[11px] text-gray-400 text-center">
          Delivered fulfillment rate: <span class="font-bold text-emerald-600">82.4%</span>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- TOP PRODUCTS + TOP CUSTOMERS -->
    <!-- ================================================= -->
    <div class="grid gap-4 xl:grid-cols-2">
      <!-- Top Products -->
      <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">
        <div class="flex items-center justify-between border-b border-gray-100 p-4">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Top Selling Products</h3>
            <p class="text-xs text-gray-400 mt-0.5">Highest revenue contributors</p>
          </div>

          <span class="rounded-md bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Top 5
          </span>
        </div>

        <div class="divide-y divide-gray-100/80">
          <div
            v-for="(product, index) in topProducts"
            :key="product.name"
            class="flex items-center gap-3 p-3.5 transition hover:bg-gray-50/60"
          >
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-black text-gray-900 shadow-2xs">
              {{ index + 1 }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-bold text-gray-900">
                {{ product.name }}
              </p>
              <p class="text-[11px] text-gray-400">
                {{ product.category }}
              </p>
            </div>

            <div class="text-right">
              <p class="text-xs font-black text-gray-900">
                {{ formatPrice(product.revenue) }}
              </p>
              <p class="text-[10px] text-gray-400">{{ product.sold }} sold</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Customers -->
      <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">
        <div class="flex items-center justify-between border-b border-gray-100 p-4">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Top Valued Customers</h3>
            <p class="text-xs text-gray-400 mt-0.5">Shoppers with highest historical spend</p>
          </div>

          <span class="rounded-md bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Top 5
          </span>
        </div>

        <div class="divide-y divide-gray-100/80">
          <div
            v-for="(customer, index) in topCustomers"
            :key="customer.email"
            class="flex items-center gap-3 p-3.5 transition hover:bg-gray-50/60"
          >
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-black text-purple-700 shadow-2xs">
              {{ customer.name.charAt(0) }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-bold text-gray-900">
                {{ customer.name }}
              </p>
              <p class="text-[11px] text-gray-400">
                {{ customer.orders }} completed orders
              </p>
            </div>

            <div class="text-right">
              <p class="text-xs font-black text-emerald-600">
                {{ formatPrice(customer.spent) }}
              </p>
              <p class="text-[10px] text-gray-400">Lifetime spend</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
