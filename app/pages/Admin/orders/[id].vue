<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "admin",
});

const route = useRoute();

const orderId = computed(() => {
  return String(route.params.id);
});

/* =========================
   ORDER DATA
========================= */

const order = ref({
  id: `#ORD-${orderId.value}`,
  customer: "Dara Sok",
  email: "dara@example.com",
  phone: "+855 12 345 678",

  product: "Nike Mercurial Vapor 16 Elite",
  productImage: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c",

  quantity: 1,
  size: "42",
  color: "Black / Red",

  price: 145.97,
  subtotal: 145.97,
  shipping: 6,
  discount: 0,
  total: 151.97,

  status: "Completed",
  paymentStatus: "Paid",
  paymentMethod: "ABA Pay",

  shippingAddress:
    "123 Street 271, Sangkat Toul Tompoung, Phnom Penh, Cambodia",

  orderDate: "Sep 03, 2026",
  updatedDate: "Sep 03, 2026",
});

/* =========================
   FORM
========================= */

const selectedStatus = ref(order.value.status);
const selectedPaymentStatus = ref(order.value.paymentStatus);

const showDeleteModal = ref(false);
const showSuccess = ref(false);

/* =========================
   STATUS
========================= */

const statusClass = computed(() => {
  switch (selectedStatus.value) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Processing":
      return "bg-blue-100 text-blue-700";

    case "Completed":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
});

const paymentClass = computed(() => {
  switch (selectedPaymentStatus.value) {
    case "Paid":
      return "bg-green-100 text-green-700";

    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Refunded":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
});

/* =========================
   UPDATE ORDER
========================= */

const updateOrder = () => {
  order.value.status = selectedStatus.value;
  order.value.paymentStatus = selectedPaymentStatus.value;

  order.value.updatedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  showSuccess.value = true;

  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};

/* =========================
   DELETE
========================= */

const deleteOrder = () => {
  showDeleteModal.value = false;

  alert(`Order ${order.value.id} deleted successfully!`);

  navigateTo("/admin/orders");
};

/* =========================
   PRINT
========================= */

const printOrder = () => {
  window.print();
};

/* =========================
   PRICE
========================= */

const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <!-- HEADER -->
    <div
      class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
    >
      <div>
        <NuxtLink
          to="/admin/orders"
          class="text-sm font-medium text-gray-500 hover:text-black"
        >
          ← Back to Orders
        </NuxtLink>

        <div class="mt-3 flex flex-wrap items-center gap-3">
          <h1 class="text-2xl font-bold">Order {{ order.id }}</h1>

          <span
            class="rounded-full px-3 py-1 text-xs font-semibold"
            :class="statusClass"
          >
            {{ selectedStatus }}
          </span>
        </div>

        <p class="mt-1 text-sm text-gray-500">
          Placed on {{ order.orderDate }}
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-xl border bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50"
          @click="printOrder"
        >
          🖨 Print
        </button>

        <button
          type="button"
          class="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          @click="showDeleteModal = true"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- SUCCESS MESSAGE -->
    <div
      v-if="showSuccess"
      class="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700"
    >
      ✓ Order updated successfully.
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- LEFT -->
      <div class="space-y-6 lg:col-span-2">
        <!-- ORDER ITEMS -->
        <div class="rounded-2xl border bg-white shadow-sm">
          <div class="border-b px-6 py-5">
            <h2 class="font-bold">Order Items</h2>

            <p class="mt-1 text-xs text-gray-500">
              Products purchased in this order.
            </p>
          </div>

          <div class="p-6">
            <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
              <!-- IMAGE -->
              <div
                class="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100"
              >
                <img
                  :src="order.productImage"
                  :alt="order.product"
                  class="h-full w-full object-contain"
                />
              </div>

              <!-- PRODUCT -->
              <div class="flex-1">
                <p class="text-lg font-bold">
                  {{ order.product }}
                </p>

                <div class="mt-2 flex flex-wrap gap-2">
                  <span class="rounded-lg bg-gray-100 px-3 py-1 text-xs">
                    Size: {{ order.size }}
                  </span>

                  <span class="rounded-lg bg-gray-100 px-3 py-1 text-xs">
                    Color: {{ order.color }}
                  </span>
                </div>

                <p class="mt-3 text-sm text-gray-500">
                  Quantity: {{ order.quantity }}
                </p>
              </div>

              <!-- PRICE -->
              <div class="text-left sm:text-right">
                <p class="text-lg font-bold">
                  {{ formatPrice(order.price) }}
                </p>

                <p class="text-xs text-gray-500">× {{ order.quantity }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- CUSTOMER -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- CUSTOMER INFORMATION -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 class="font-bold">Customer Information</h2>

            <div class="mt-5 space-y-4">
              <div>
                <p class="text-xs text-gray-500">Name</p>

                <p class="mt-1 font-semibold">
                  {{ order.customer }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500">Email</p>

                <p class="mt-1 font-medium">
                  {{ order.email }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500">Phone</p>

                <p class="mt-1 font-medium">
                  {{ order.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- SHIPPING -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 class="font-bold">Shipping Address</h2>

            <div class="mt-5">
              <div class="flex gap-3">
                <div class="text-xl">📍</div>

                <p class="text-sm leading-6 text-gray-600">
                  {{ order.shippingAddress }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ORDER TIMELINE -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 class="font-bold">Order Timeline</h2>

          <div class="mt-6 space-y-6">
            <!-- Completed -->
            <div class="flex gap-4">
              <div class="flex flex-col items-center">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600"
                >
                  ✓
                </div>

                <div class="mt-2 h-10 w-px bg-gray-200"></div>
              </div>

              <div>
                <p class="font-semibold">Order Completed</p>

                <p class="mt-1 text-sm text-gray-500">
                  Order has been successfully completed.
                </p>

                <p class="mt-1 text-xs text-gray-400">
                  {{ order.updatedDate }}
                </p>
              </div>
            </div>

            <!-- Processing -->
            <div class="flex gap-4">
              <div class="flex flex-col items-center">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                >
                  🚚
                </div>

                <div class="mt-2 h-10 w-px bg-gray-200"></div>
              </div>

              <div>
                <p class="font-semibold">Processing</p>

                <p class="mt-1 text-sm text-gray-500">
                  Order was prepared for delivery.
                </p>
              </div>
            </div>

            <!-- Paid -->
            <div class="flex gap-4">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600"
              >
                $
              </div>

              <div>
                <p class="font-semibold">Payment Received</p>

                <p class="mt-1 text-sm text-gray-500">
                  Payment method:
                  {{ order.paymentMethod }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDEBAR -->
      <div class="space-y-6">
        <!-- UPDATE STATUS -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 class="font-bold">Update Order</h2>

          <div class="mt-5 space-y-5">
            <!-- STATUS -->
            <div>
              <label class="mb-2 block text-sm font-semibold">
                Order Status
              </label>

              <select
                v-model="selectedStatus"
                class="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <!-- PAYMENT -->
            <div>
              <label class="mb-2 block text-sm font-semibold">
                Payment Status
              </label>

              <select
                v-model="selectedPaymentStatus"
                class="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              >
                <option>Paid</option>
                <option>Pending</option>
                <option>Refunded</option>
              </select>
            </div>

            <button
              type="button"
              class="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
              @click="updateOrder"
            >
              Save Changes
            </button>
          </div>
        </div>

        <!-- PAYMENT -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 class="font-bold">Payment Information</h2>

          <div class="mt-5 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500"> Status </span>

              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="paymentClass"
              >
                {{ selectedPaymentStatus }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500"> Method </span>

              <span class="text-sm font-semibold">
                {{ order.paymentMethod }}
              </span>
            </div>
          </div>
        </div>

        <!-- ORDER SUMMARY -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 class="font-bold">Order Summary</h2>

          <div class="mt-5 space-y-4 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500"> Subtotal </span>

              <span class="font-medium">
                {{ formatPrice(order.subtotal) }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-500"> Shipping </span>

              <span class="font-medium">
                {{ formatPrice(order.shipping) }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-500"> Discount </span>

              <span class="font-medium text-green-600">
                -{{ formatPrice(order.discount) }}
              </span>
            </div>

            <div class="border-t pt-4">
              <div class="flex justify-between">
                <span class="font-bold"> Total </span>

                <span class="text-xl font-bold">
                  {{ formatPrice(order.total) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ORDER INFO -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 class="font-bold">Order Information</h2>

          <div class="mt-5 space-y-4">
            <div>
              <p class="text-xs text-gray-500">Order ID</p>

              <p class="mt-1 font-semibold">
                {{ order.id }}
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-500">Created</p>

              <p class="mt-1 font-medium">
                {{ order.orderDate }}
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-500">Last Updated</p>

              <p class="mt-1 font-medium">
                {{ order.updatedDate }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DELETE MODAL -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
        >
          ⚠️
        </div>

        <h2 class="mt-4 text-xl font-bold">Delete Order?</h2>

        <p class="mt-2 text-sm leading-6 text-gray-500">
          Are you sure you want to delete
          <span class="font-semibold text-gray-900"> {{ order.id }} </span>?
          This action cannot be undone.
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-gray-50"
            @click="showDeleteModal = false"
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

<style>
@media print {
  header,
  nav,
  aside,
  button,
  a {
    display: none !important;
  }

  body {
    background: white !important;
  }

  .space-y-6 {
    margin: 0 !important;
  }
}
</style>
