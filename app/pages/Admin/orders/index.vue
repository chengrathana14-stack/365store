<script setup lang="ts">
import { computed, ref } from "vue";
import { products } from "~/data/product";
import { orderSeedData } from "~/data/admin";
definePageMeta({
  layout: "admin",
});

const orders = ref<Order[]>(orderSeedData.map((order) => ({ ...order })));

const search = ref("");
const selectedStatus = ref("All");
const selectedPayment = ref("All");
const selectedSort = ref("Newest");

const showDeleteModal = ref(false);
const selectedOrder = ref<Order | null>(null);

/* =========================
   STATISTICS
========================= */

const totalOrders = computed(() => orders.value.length);

const totalRevenue = computed(() =>
  orders.value
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + order.total, 0),
);

const pendingOrders = computed(
  () => orders.value.filter((order) => order.status === "Pending").length,
);

const processingOrders = computed(
  () => orders.value.filter((order) => order.status === "Processing").length,
);

const completedOrders = computed(
  () => orders.value.filter((order) => order.status === "Completed").length,
);

const cancelledOrders = computed(
  () => orders.value.filter((order) => order.status === "Cancelled").length,
);

const paidOrders = computed(
  () => orders.value.filter((order) => order.paymentStatus === "Paid").length,
);

/* =========================
   FILTER
========================= */

const filteredOrders = computed(() => {
  const keyword = search.value.toLowerCase().trim();

  let result = orders.value.filter((order) => {
    const matchSearch =
      !keyword ||
      order.id.toLowerCase().includes(keyword) ||
      order.customer.toLowerCase().includes(keyword) ||
      order.email.toLowerCase().includes(keyword) ||
      order.product.toLowerCase().includes(keyword);

    const matchStatus =
      selectedStatus.value === "All" || order.status === selectedStatus.value;

    const matchPayment =
      selectedPayment.value === "All" ||
      order.paymentStatus === selectedPayment.value;

    return matchSearch && matchStatus && matchPayment;
  });

  if (selectedSort.value === "Newest") {
    result = [...result].sort((a, b) => b.id.localeCompare(a.id));
  }

  if (selectedSort.value === "Oldest") {
    result = [...result].sort((a, b) => a.id.localeCompare(b.id));
  }

  if (selectedSort.value === "Highest Amount") {
    result = [...result].sort((a, b) => b.total - a.total);
  }

  if (selectedSort.value === "Lowest Amount") {
    result = [...result].sort((a, b) => a.total - b.total);
  }

  if (selectedSort.value === "Customer A-Z") {
    result = [...result].sort((a, b) => a.customer.localeCompare(b.customer));
  }

  return result;
});

/* =========================
   HELPERS
========================= */

const statusClass = (status: OrderStatus) => {
  return {
    "bg-yellow-100 text-yellow-700": status === "Pending",
    "bg-blue-100 text-blue-700": status === "Processing",
    "bg-green-100 text-green-700": status === "Completed",
    "bg-red-100 text-red-700": status === "Cancelled",
  };
};

const paymentClass = (status: PaymentStatus) => {
  return {
    "bg-green-100 text-green-700": status === "Paid",
    "bg-yellow-100 text-yellow-700": status === "Pending",
    "bg-red-100 text-red-700": status === "Refunded",
  };
};

const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};

const clearFilters = () => {
  search.value = "";
  selectedStatus.value = "All";
  selectedPayment.value = "All";
  selectedSort.value = "Newest";
};

/* =========================
   DELETE
========================= */

const openDeleteModal = (order: Order) => {
  selectedOrder.value = order;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  selectedOrder.value = null;
  showDeleteModal.value = false;
};

const deleteOrder = () => {
  if (!selectedOrder.value) return;

  orders.value = orders.value.filter(
    (order) => order.id !== selectedOrder.value?.id,
  );

  closeDeleteModal();
};
</script>

<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div
      class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Orders</h1>

        <p class="mt-1 text-sm text-gray-500">
          Manage customer orders, payments and order status.
        </p>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          class="rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-50"
          @click="clearFilters"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <!-- MAIN STATS -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">Total Orders</p>

          <div class="rounded-xl bg-gray-100 p-3">📦</div>
        </div>

        <p class="mt-4 text-3xl font-bold">
          {{ totalOrders }}
        </p>

        <p class="mt-1 text-xs text-gray-500">All orders</p>
      </div>

      <div class="rounded-2xl border bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">Revenue</p>

          <div class="rounded-xl bg-green-100 p-3">💰</div>
        </div>

        <p class="mt-4 text-3xl font-bold text-green-600">
          {{ formatPrice(totalRevenue) }}
        </p>

        <p class="mt-1 text-xs text-gray-500">Excluding cancelled orders</p>
      </div>

      <div class="rounded-2xl border bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">Pending</p>

          <div class="rounded-xl bg-yellow-100 p-3">⏳</div>
        </div>

        <p class="mt-4 text-3xl font-bold text-yellow-600">
          {{ pendingOrders }}
        </p>

        <p class="mt-1 text-xs text-gray-500">Waiting for confirmation</p>
      </div>

      <div class="rounded-2xl border bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">Completed</p>

          <div class="rounded-xl bg-green-100 p-3">✓</div>
        </div>

        <p class="mt-4 text-3xl font-bold text-green-600">
          {{ completedOrders }}
        </p>

        <p class="mt-1 text-xs text-gray-500">Successfully delivered</p>
      </div>
    </div>

    <!-- ORDER STATUS SUMMARY -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border bg-white p-5">
        <div class="flex items-center gap-3">
          <span class="h-3 w-3 rounded-full bg-yellow-500"></span>

          <span class="text-sm font-medium text-gray-600"> Pending </span>
        </div>

        <p class="mt-3 text-2xl font-bold">
          {{ pendingOrders }}
        </p>
      </div>

      <div class="rounded-2xl border bg-white p-5">
        <div class="flex items-center gap-3">
          <span class="h-3 w-3 rounded-full bg-blue-500"></span>

          <span class="text-sm font-medium text-gray-600"> Processing </span>
        </div>

        <p class="mt-3 text-2xl font-bold">
          {{ processingOrders }}
        </p>
      </div>

      <div class="rounded-2xl border bg-white p-5">
        <div class="flex items-center gap-3">
          <span class="h-3 w-3 rounded-full bg-green-500"></span>

          <span class="text-sm font-medium text-gray-600"> Completed </span>
        </div>

        <p class="mt-3 text-2xl font-bold">
          {{ completedOrders }}
        </p>
      </div>

      <div class="rounded-2xl border bg-white p-5">
        <div class="flex items-center gap-3">
          <span class="h-3 w-3 rounded-full bg-red-500"></span>

          <span class="text-sm font-medium text-gray-600"> Cancelled </span>
        </div>

        <p class="mt-3 text-2xl font-bold">
          {{ cancelledOrders }}
        </p>
      </div>
    </div>

    <!-- FILTERS -->
    <div class="rounded-2xl border bg-white p-5 shadow-sm">
      <div class="grid gap-4 lg:grid-cols-4">
        <!-- Search -->
        <div class="lg:col-span-2">
          <label class="mb-2 block text-sm font-semibold"> Search </label>

          <div class="relative">
            <span
              class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              🔍
            </span>

            <input
              v-model="search"
              type="text"
              placeholder="Order ID, customer, email or product..."
              class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition focus:border-black"
            />
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="mb-2 block text-sm font-semibold"> Order Status </label>

          <select
            v-model="selectedStatus"
            class="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <!-- Payment -->
        <div>
          <label class="mb-2 block text-sm font-semibold"> Payment </label>

          <select
            v-model="selectedPayment"
            class="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Refunded</option>
          </select>
        </div>
      </div>

      <div
        class="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
      >
        <p class="text-sm text-gray-500">
          Showing
          <span class="font-semibold text-gray-900">
            {{ filteredOrders.length }}
          </span>
          orders
        </p>

        <select
          v-model="selectedSort"
          class="rounded-xl border px-4 py-2.5 text-sm outline-none"
        >
          <option>Newest</option>
          <option>Oldest</option>
          <option>Highest Amount</option>
          <option>Lowest Amount</option>
          <option>Customer A-Z</option>
        </select>
      </div>
    </div>

    <!-- TABLE -->
    <div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div class="border-b px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-bold">Order List</h2>

            <p class="mt-1 text-xs text-gray-500">
              View and manage customer purchases.
            </p>
          </div>

          <span
            class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold"
          >
            {{ filteredOrders.length }} Orders
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1100px] text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="px-6 py-4">Order</th>

              <th class="px-6 py-4">Customer</th>

              <th class="px-6 py-4">Product</th>

              <th class="px-6 py-4">Total</th>

              <th class="px-6 py-4">Payment</th>

              <th class="px-6 py-4">Status</th>

              <th class="px-6 py-4">Date</th>

              <th class="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="transition hover:bg-gray-50"
            >
              <!-- Order -->
              <td class="px-6 py-5">
                <NuxtLink
                  :to="`/admin/orders/${order.id.replace('#ORD-', '')}`"
                  class="font-bold hover:underline"
                >
                  {{ order.id }}
                </NuxtLink>

                <p class="mt-1 text-xs text-gray-400">
                  {{ order.quantity }} item<span v-if="order.quantity > 1"
                    >s</span
                  >
                </p>
              </td>

              <!-- Customer -->
              <td class="px-6 py-5">
                <p class="font-semibold">
                  {{ order.customer }}
                </p>

                <p class="text-xs text-gray-500">
                  {{ order.email }}
                </p>

                <p class="text-xs text-gray-400">
                  {{ order.phone }}
                </p>
              </td>

              <!-- Product -->
              <td class="max-w-[230px] px-6 py-5">
                <p class="truncate font-medium">
                  {{ order.product }}
                </p>

                <p class="mt-1 text-xs text-gray-500">
                  Qty: {{ order.quantity }}
                </p>
              </td>

              <!-- Total -->
              <td class="px-6 py-5">
                <p class="font-bold">
                  {{ formatPrice(order.total) }}
                </p>

                <p class="text-xs text-gray-400">
                  Shipping: {{ formatPrice(order.shipping) }}
                </p>
              </td>

              <!-- Payment -->
              <td class="px-6 py-5">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="paymentClass(order.paymentStatus)"
                >
                  {{ order.paymentStatus }}
                </span>

                <p class="mt-2 text-xs text-gray-500">
                  {{ order.paymentMethod }}
                </p>
              </td>

              <!-- Status -->
              <td class="px-6 py-5">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </td>

              <!-- Date -->
              <td class="whitespace-nowrap px-6 py-5 text-gray-500">
                {{ order.date }}
              </td>

              <!-- Action -->
              <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                  <NuxtLink
                    :to="`/admin/orders/${order.id.replace('#ORD-', '')}`"
                    class="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold transition hover:bg-black hover:text-white"
                  >
                    View
                  </NuxtLink>

                  <button
                    type="button"
                    class="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    @click="openDeleteModal(order)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- EMPTY -->
      <div v-if="filteredOrders.length === 0" class="px-6 py-20 text-center">
        <div class="text-5xl">📦</div>

        <h3 class="mt-4 text-lg font-bold">No orders found</h3>

        <p class="mt-2 text-sm text-gray-500">
          Try changing your search or filters.
        </p>

        <button
          type="button"
          class="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- DELETE MODAL -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      @click.self="closeDeleteModal"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl"
        >
          ⚠️
        </div>

        <h2 class="mt-4 text-xl font-bold">Delete Order?</h2>

        <p class="mt-2 text-sm leading-6 text-gray-500">
          Are you sure you want to delete
          <span class="font-semibold text-gray-900">
            {{ selectedOrder?.id }} </span
          >? This action cannot be undone.
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-gray-50"
            @click="closeDeleteModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            @click="deleteOrder"
          >
            Delete Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
