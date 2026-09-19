<template>
  <div class="min-h-screen py-10 sm:py-16">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <!-- Success Header Card -->
      <div class="overflow-hidden rounded-2xl border border-gray-200/90 bg-white/95 backdrop-blur-md p-8 sm:p-10 shadow-lg text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-400 text-black shadow-md shadow-lime-400/30">
          <svg class="h-8 w-8 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span class="mt-4 inline-block text-xs font-black uppercase tracking-widest text-lime-600 bg-lime-50 px-3 py-1 rounded-full border border-lime-200">
          Payment & Order Confirmed
        </span>

        <h1 class="mt-2 text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
          Thank You For Your Order!
        </h1>

        <p class="mt-2 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
          We have received your order and payment. Our logistics team in Phnom Penh is preparing your sport gear for fast delivery.
        </p>

        <!-- Order ID Tag -->
        <div class="mt-6 inline-flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2 text-xs font-mono font-bold text-gray-800">
          <span>Order ID:</span>
          <span class="text-sm font-black text-black">{{ order?.id || orderId }}</span>
        </div>

        <!-- 4-Stage Shipment Progress Tracker -->
        <div class="mt-10 border-t border-gray-100 pt-8">
          <div class="grid grid-cols-4 gap-2 text-center text-xs">
            <div class="flex flex-col items-center">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-black text-lime-400 font-bold">✓</span>
              <span class="mt-2 font-bold text-gray-900">Order Placed</span>
              <span class="text-[10px] text-gray-400">Received</span>
            </div>

            <div class="flex flex-col items-center">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-black text-lime-400 font-bold">✓</span>
              <span class="mt-2 font-bold text-gray-900">Payment Paid</span>
              <span class="text-[10px] text-lime-600 font-semibold">{{ order?.paymentMethod || 'KHQR Instant' }}</span>
            </div>

            <div class="flex flex-col items-center">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-black font-black animate-pulse">●</span>
              <span class="mt-2 font-bold text-gray-900">Packing Gear</span>
              <span class="text-[10px] text-gray-500">In Progress</span>
            </div>

            <div class="flex flex-col items-center opacity-40">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold">4</span>
              <span class="mt-2 font-bold text-gray-900">Out for Delivery</span>
              <span class="text-[10px] text-gray-400">1-2 Business Days</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Receipt & Breakdown Container -->
      <div class="mt-8 rounded-2xl border border-gray-200/90 bg-white/95 backdrop-blur-md p-6 sm:p-10 shadow-lg">
        <!-- Customer & Order Details Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-6 text-xs">
          <div>
            <h4 class="font-black uppercase tracking-wider text-gray-400 text-[11px] mb-2">Delivery Details</h4>
            <p class="font-bold text-gray-900 text-sm">{{ order?.customer || 'Rothana Cheng' }}</p>
            <p class="text-gray-600 mt-0.5">📞 {{ order?.phone || '012 888 365' }}</p>
            <p class="text-gray-600 mt-0.5">✉️ {{ order?.email || 'customer@365sports.com' }}</p>
            <p class="text-gray-600 mt-0.5">📍 {{ order?.address || 'Phnom Penh, Cambodia' }}</p>
          </div>

          <div class="sm:text-right">
            <h4 class="font-black uppercase tracking-wider text-gray-400 text-[11px] mb-2">Payment Details</h4>
            <p class="font-bold text-gray-900 text-sm">{{ order?.paymentMethod || 'KHQR / Bakong (Instant)' }}</p>
            <span class="inline-flex items-center gap-1 mt-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              {{ order?.paymentStatus || 'Paid' }}
            </span>
            <p class="text-gray-400 text-[11px] mt-2">
              Date: {{ formatDate(order?.date) }}
            </p>
          </div>
        </div>

        <!-- Itemized Products -->
        <div class="mt-6">
          <h4 class="font-black uppercase tracking-wider text-gray-900 text-xs mb-4">Purchased Gear</h4>
          <div class="space-y-4">
            <div
              v-for="(item, idx) in displayItems"
              :key="idx"
              class="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-neutral-50/70 p-3.5 text-xs"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="h-14 w-14 rounded-lg object-cover border border-gray-200 shrink-0"
                />
                <div>
                  <h5 class="font-black text-gray-950 text-sm">{{ item.product.name }}</h5>
                  <p class="text-gray-500 text-[11px]">
                    Size: <span class="font-semibold text-gray-800">{{ item.size || 'Standard' }}</span>
                    &middot;
                    Qty: <span class="font-semibold text-gray-800">{{ item.quantity }}</span>
                  </p>
                </div>
              </div>

              <div class="text-right">
                <span class="font-black text-gray-950 text-sm">
                  ${{ (item.product.price * item.quantity).toFixed(2) }}
                </span>
                <span class="block text-[10px] text-gray-400">
                  ${{ item.product.price.toFixed(2) }} ea
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Totals Breakdown -->
        <div class="mt-6 border-t border-gray-100 pt-6">
          <div class="space-y-2 text-xs max-w-xs ml-auto">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span class="font-bold text-gray-900">${{ (order?.subtotal || 129.99).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span class="font-bold text-gray-900">{{ (order?.shipping || 0) === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}` }}</span>
            </div>
            <div class="border-t border-gray-200 pt-2 flex items-baseline justify-between">
              <span class="text-sm font-black uppercase text-gray-950">Total Paid</span>
              <div class="text-right">
                <span class="text-2xl font-black text-gray-950">
                  ${{ (order?.total || 129.99).toFixed(2) }}
                </span>
                <span class="block text-[10px] text-gray-500 font-bold">
                  ≈ {{ ((order?.total || 129.99) * 4100).toLocaleString() }} KHR
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            @click="printReceipt"
            class="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-800 transition hover:border-black hover:bg-gray-50"
          >
            <span>🖨️ Print Receipt</span>
          </button>

          <NuxtLink
            to="/Product"
            class="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 shadow-md shadow-lime-400/20"
          >
            <span>Continue Shopping &rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { products as fallbackProducts } from "~/data/product";

definePageMeta({
  layout: "user",
});

const route = useRoute();
const orderId = computed(() => String(route.params.id));
const order = ref<any>(null);

onMounted(() => {
  if (typeof window !== "undefined") {
    try {
      const orders = JSON.parse(localStorage.getItem("365_orders") || "[]");
      const found = orders.find((o: any) => o.id === orderId.value);
      if (found) {
        order.value = found;
      } else {
        const last = JSON.parse(localStorage.getItem("last_order") || "null");
        if (last) order.value = last;
      }
    } catch (e) {
      console.error(e);
    }
  }
});

const displayItems = computed(() => {
  if (order.value?.items?.length) {
    return order.value.items;
  }
  // Sample fallback display
  return [
    {
      product: fallbackProducts[0],
      quantity: 1,
      size: "9",
    },
  ];
});

const formatDate = (dateStr?: string) => {
  if (!dateStr) return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const printReceipt = () => {
  if (typeof window !== "undefined") {
    window.print();
  }
};
</script>
