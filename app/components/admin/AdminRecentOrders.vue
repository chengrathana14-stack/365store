<script setup lang="ts">
import { computed } from "vue";
import { useAdminStore } from "~/composables/useAdminStore";

const { allOrders } = useAdminStore();

const orders = computed(() => {
  return allOrders.value.slice(0, 6);
});

const statusClass = (status: string) => {
  if (status === "Completed") {
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  }

  if (status === "Processing") {
    return "bg-blue-100 text-blue-700 border border-blue-200";
  }

  if (status === "Cancelled") {
    return "bg-red-100 text-red-700 border border-red-200";
  }

  return "bg-amber-100 text-amber-700 border border-amber-200";
};
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
    <!-- Header -->
    <div
      class="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <h3 class="font-bold text-gray-900">Recent Customer Orders</h3>
        </div>
        <p class="text-xs text-gray-400 mt-0.5">Live feed of purchases across Cambodia</p>
      </div>

      <NuxtLink
        to="/admin/orders"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
      >
        <span>View all orders ({{ allOrders.length }})</span>
        <span>&rarr;</span>
      </NuxtLink>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[750px] text-left text-xs">
        <thead class="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <tr>
            <th class="px-5 py-3">Order Ref</th>
            <th class="px-5 py-3">Customer</th>
            <th class="px-5 py-3">Purchased Item</th>
            <th class="px-5 py-3">Total Amount</th>
            <th class="px-5 py-3">Payment</th>
            <th class="px-5 py-3">Status</th>
            <th class="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="order in orders"
            :key="order.id"
            class="transition hover:bg-gray-50/70"
          >
            <!-- Order ID -->
            <td class="px-5 py-4 font-mono font-bold text-gray-900">
              <NuxtLink
                :to="`/admin/orders/${order.id.replace('#ORD-', '').replace('#', '')}`"
                class="hover:text-blue-600 hover:underline"
              >
                {{ order.id }}
              </NuxtLink>
              <span class="block text-[10px] font-sans font-normal text-gray-400">{{ order.date }}</span>
            </td>

            <!-- Customer -->
            <td class="px-5 py-4">
              <p class="font-bold text-gray-900">{{ order.customer }}</p>
              <p class="text-[11px] text-gray-400">{{ order.phone }}</p>
            </td>

            <!-- Product -->
            <td class="px-5 py-4 max-w-[220px]">
              <p class="truncate font-medium text-gray-800" :title="order.product">
                {{ order.product }}
              </p>
              <span class="text-[10px] text-gray-400">Qty: {{ order.quantity }}</span>
            </td>

            <!-- Total Amount -->
            <td class="px-5 py-4">
              <span class="font-bold text-gray-900">${{ Number(order.total).toFixed(2) }}</span>
              <span class="block text-[10px] text-gray-400">
                ≈ {{ (order as any).khrTotal ? (order as any).khrTotal.toLocaleString() : Math.round(Number(order.total) * 4100).toLocaleString() }} ៛
              </span>
            </td>

            <!-- Payment Method -->
            <td class="px-5 py-4">
              <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold"
                :class="order.paymentMethod?.includes('KHQR') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-800'"
              >
                <span>{{ order.paymentMethod?.includes('KHQR') ? '⚡' : '💳' }}</span>
                <span>{{ order.paymentMethod || 'Paid' }}</span>
              </span>
            </td>

            <!-- Status -->
            <td class="px-5 py-4">
              <span
                class="rounded-full px-2.5 py-0.5 text-[11px] font-bold inline-block"
                :class="statusClass(order.status)"
              >
                {{ order.status }}
              </span>
            </td>

            <!-- Action -->
            <td class="px-5 py-4 text-right">
              <NuxtLink
                :to="`/admin/orders/${order.id.replace('#ORD-', '').replace('#', '')}`"
                class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-100 hover:text-black transition"
              >
                Manage
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
