<script setup lang="ts">
import { computed, ref } from "vue";
import { reportPeriods, reportSeedData } from "~/data/admin";

definePageMeta({
  layout: "admin",
});

useHead({
  title: "Reports & Analytics",
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

// =====================================================
// SALES DATA
// =====================================================

const salesData = reportSeedData.salesData;

// =====================================================
// TOP PRODUCTS
// =====================================================

const topProducts = reportSeedData.topProducts;

// =====================================================
// TOP CUSTOMERS
// =====================================================

const topCustomers = reportSeedData.topCustomers;

// =====================================================
// ORDER STATUS
// =====================================================

const orderStatuses = reportSeedData.orderStatuses;

// =====================================================
// PAYMENT METHODS
// =====================================================

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
// REFRESH
// =====================================================

const refreshReport = async () => {
  reportLoading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 700));

  reportLoading.value = false;
};

// =====================================================
// PRINT
// =====================================================

const printReport = () => {
  window.print();
};

// =====================================================
// CSV EXPORT
// =====================================================

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

// =====================================================
// PDF
// =====================================================

const savePDF = () => {
  window.print();
};

// =====================================================
// REPORT TITLE
// =====================================================

const reportTitle = computed(() => {
  if (selectedPeriod.value === "Custom") {
    return `${fromDate.value} → ${toDate.value}`;
  }

  return selectedPeriod.value;
});
</script>

<template>
  <div class="min-h-screen space-y-6 bg-gray-50 p-1">
    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Reports & Analytics</h2>

        <p class="mt-1 text-sm text-gray-500">
          Analyze your store performance and sales activity.
        </p>
      </div>

      <!-- ACTION BUTTONS -->

      <div class="flex flex-wrap gap-2">
        <button
          @click="refreshReport"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
        >
          <span :class="{ 'animate-spin': reportLoading }"> ↻ </span>

          Refresh
        </button>

        <button
          @click="printReport"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
        >
          🖨️ Print
        </button>

        <button
          @click="savePDF"
          class="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          📄 Save PDF
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- DATE FILTER -->
    <!-- ================================================= -->

    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div
        class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"
      >
        <div>
          <p
            class="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400"
          >
            Report Period
          </p>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="period in periods"
              :key="period"
              @click="
                selectedPeriod = period;
                changePeriod();
              "
              class="rounded-xl border px-4 py-2 text-sm font-medium transition"
              :class="
                selectedPeriod === period
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
              "
            >
              {{ period }}
            </button>
          </div>
        </div>

        <!-- CUSTOM DATE -->

        <div class="flex flex-col gap-3 sm:flex-row">
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-500">
              From
            </label>

            <input
              v-model="fromDate"
              type="date"
              class="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-500">
              To
            </label>

            <input
              v-model="toDate"
              type="date"
              class="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      <div
        class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4"
      >
        <div class="text-sm text-gray-500">
          Showing report for:

          <span class="font-bold text-gray-900">
            {{ reportTitle }}
          </span>
        </div>

        <button
          @click="exportCSV"
          class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          ⬇ Export CSV
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- KPI CARDS -->
    <!-- ================================================= -->

    <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Revenue -->

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl"
          >
            $
          </div>

          <span
            class="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600"
          >
            +{{ revenueGrowth }}%
          </span>
        </div>

        <p class="mt-5 text-sm text-gray-500">Total Revenue</p>

        <p class="mt-1 text-3xl font-bold text-gray-900">
          {{ formatPrice(report.revenue) }}
        </p>

        <p class="mt-2 text-xs text-gray-400">
          Previous: {{ formatPrice(report.previousRevenue) }}
        </p>
      </div>

      <!-- Orders -->

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl"
          >
            🛒
          </div>

          <span
            class="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600"
          >
            +{{ ordersGrowth }}%
          </span>
        </div>

        <p class="mt-5 text-sm text-gray-500">Total Orders</p>

        <p class="mt-1 text-3xl font-bold">
          {{ report.orders }}
        </p>

        <p class="mt-2 text-xs text-gray-400">
          {{ report.cancelledOrders }} cancelled orders
        </p>
      </div>

      <!-- Customers -->

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl"
          >
            👥
          </div>

          <span
            class="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600"
          >
            +{{ customersGrowth }}%
          </span>
        </div>

        <p class="mt-5 text-sm text-gray-500">Customers</p>

        <p class="mt-1 text-3xl font-bold">
          {{ report.customers }}
        </p>

        <p class="mt-2 text-xs text-gray-400">Active customers</p>
      </div>

      <!-- Average Order -->

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl"
          >
            📦
          </div>

          <span
            class="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600"
          >
            +{{ averageOrderGrowth }}%
          </span>
        </div>

        <p class="mt-5 text-sm text-gray-500">Average Order</p>

        <p class="mt-1 text-3xl font-bold">
          {{ formatPrice(report.averageOrder) }}
        </p>

        <p class="mt-2 text-xs text-gray-400">Per completed order</p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- SALES CHART + ORDER STATUS -->
    <!-- ================================================= -->

    <div class="grid gap-6 xl:grid-cols-3">
      <!-- SALES CHART -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2"
      >
        <div
          class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 class="font-bold text-gray-900">Sales Performance</h3>

            <p class="mt-1 text-xs text-gray-400">
              Revenue generated over time
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs text-gray-400">Total</p>

            <p class="text-xl font-bold">
              {{ formatPrice(report.revenue) }}
            </p>
          </div>
        </div>

        <!-- CHART -->

        <div class="mt-8 flex h-72 items-end gap-2 overflow-x-auto sm:gap-3">
          <div
            v-for="item in salesData"
            :key="item.month"
            class="group flex h-full min-w-[35px] flex-1 flex-col justify-end"
          >
            <div class="relative flex h-full items-end">
              <div
                class="w-full rounded-t-lg bg-black transition-all duration-300 group-hover:bg-gray-600"
                :style="{
                  height: `${(item.revenue / maxRevenue) * 100}%`,
                  minHeight: item.revenue ? '8px' : '0px',
                }"
              >
                <div
                  v-if="item.revenue"
                  class="absolute -translate-y-7 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100"
                >
                  {{ formatPrice(item.revenue) }}
                </div>
              </div>
            </div>

            <div class="mt-3 text-center text-xs text-gray-400">
              {{ item.month }}
            </div>
          </div>
        </div>

        <!-- CHART LEGEND -->

        <div
          class="mt-5 flex items-center gap-6 border-t pt-4 text-xs text-gray-500"
        >
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-black"></span>
            Revenue
          </div>

          <div>
            Orders:
            <span class="font-bold text-gray-900">
              {{ report.orders }}
            </span>
          </div>
        </div>
      </div>

      <!-- ORDER STATUS -->

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 class="font-bold">Order Status</h3>

        <p class="mt-1 text-xs text-gray-400">Current order distribution</p>

        <div class="mt-8 space-y-6">
          <div v-for="status in orderStatuses" :key="status.name">
            <div class="mb-2 flex justify-between text-sm">
              <span class="font-medium text-gray-700">
                {{ status.name }}
              </span>

              <span class="font-bold">
                {{ status.count }}
              </span>
            </div>

            <div class="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full bg-black transition-all"
                :style="{ width: `${status.percentage}%` }"
              ></div>
            </div>

            <p class="mt-1 text-right text-xs text-gray-400">
              {{ status.percentage }}%
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- TOP PRODUCTS + TOP CUSTOMERS -->
    <!-- ================================================= -->

    <div class="grid gap-6 xl:grid-cols-2">
      <!-- TOP PRODUCTS -->

      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <div class="flex items-center justify-between border-b p-6">
          <div>
            <h3 class="font-bold">Top Selling Products</h3>

            <p class="mt-1 text-xs text-gray-400">Best performing products</p>
          </div>

          <span class="rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold">
            TOP 5
          </span>
        </div>

        <div class="divide-y">
          <div
            v-for="(product, index) in topProducts"
            :key="product.name"
            class="flex items-center gap-4 p-5 transition hover:bg-gray-50"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white"
            >
              {{ index + 1 }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold text-gray-900">
                {{ product.name }}
              </p>

              <p class="mt-1 text-xs text-gray-400">
                {{ product.category }}
              </p>
            </div>

            <div class="text-right">
              <p class="text-sm font-bold">
                {{ formatPrice(product.revenue) }}
              </p>

              <p class="mt-1 text-xs text-gray-400">{{ product.sold }} sold</p>
            </div>
          </div>
        </div>
      </div>

      <!-- TOP CUSTOMERS -->

      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <div class="flex items-center justify-between border-b p-6">
          <div>
            <h3 class="font-bold">Top Customers</h3>

            <p class="mt-1 text-xs text-gray-400">
              Customers with highest spending
            </p>
          </div>

          <span class="rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold">
            TOP 5
          </span>
        </div>

        <div class="divide-y">
          <div
            v-for="(customer, index) in topCustomers"
            :key="customer.email"
            class="flex items-center gap-4 p-5 transition hover:bg-gray-50"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold"
            >
              {{ customer.name.charAt(0) }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold">
                {{ customer.name }}
              </p>

              <p class="truncate text-xs text-gray-400">
                {{ customer.email }}
              </p>
            </div>

            <div class="text-right">
              <p class="text-sm font-bold">
                {{ formatPrice(customer.spent) }}
              </p>

              <p class="mt-1 text-xs text-gray-400">
                {{ customer.orders }} orders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- PAYMENT METHODS -->
    <!-- ================================================= -->

    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="mb-6">
        <h3 class="font-bold">Payment Methods</h3>

        <p class="mt-1 text-xs text-gray-400">Orders by payment method</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="payment in paymentMethods"
          :key="payment.name"
          class="rounded-xl border border-gray-100 bg-gray-50 p-5"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-700">
              {{ payment.name }}
            </span>

            <span class="text-xs font-bold"> {{ payment.percentage }}% </span>
          </div>

          <p class="mt-3 text-2xl font-bold">
            {{ payment.orders }}
          </p>

          <p class="mt-1 text-xs text-gray-400">Orders</p>

          <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              class="h-full rounded-full bg-black"
              :style="{ width: `${payment.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- SUMMARY -->
    <!-- ================================================= -->

    <div class="rounded-2xl bg-black p-6 text-white shadow-sm">
      <div
        class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-gray-400"
          >
            Report Summary
          </p>

          <h3 class="mt-2 text-xl font-bold">
            {{ reportTitle }}
          </h3>

          <p class="mt-2 max-w-2xl text-sm text-gray-400">
            Your store generated
            <span class="font-bold text-white">
              {{ formatPrice(report.revenue) }}
            </span>
            from
            <span class="font-bold text-white">
              {{ report.orders }}
            </span>
            orders during this reporting period.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            @click="exportCSV"
            class="rounded-xl border border-gray-700 px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-800"
          >
            Export CSV
          </button>

          <button
            @click="printReport"
            class="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  body {
    background: white !important;
  }

  aside,
  nav,
  header {
    display: none !important;
  }

  button {
    display: none !important;
  }

  .shadow-sm {
    box-shadow: none !important;
  }

  .bg-gray-50 {
    background: white !important;
  }

  @page {
    size: A4;
    margin: 15mm;
  }
}
</style>
