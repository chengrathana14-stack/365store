<script setup lang="ts">
import { computed, ref } from "vue";
import { userActivitySeedData, userOrderSummarySeedData } from "~/data/admin";
import type { UserActivity, UserOrderSummary } from "~/type/admin";

definePageMeta({
  layout: "admin",
});

const route = useRoute();

const userId = Number(route.params.id);

// =====================================================
// USER DATA
// =====================================================

const user = ref({
  id: userId,
  name: "Dara Sok",
  email: "dara@gmail.com",
  phone: "+855 12 111 222",
  address: "Phnom Penh, Cambodia",
  role: "Customer",
  status: "Active",
  joined: "January 12, 2026",
  avatar: "https://i.pravatar.cc/300?img=12",
  orders: 12,
  completedOrders: 10,
  cancelledOrders: 2,
  spent: 1250,
});

// =====================================================
// ORDER DATA
// =====================================================

const orders = ref<UserOrderSummary[]>(
  userOrderSummarySeedData.map((order) => ({ ...order })),
);

// =====================================================
// ACTIVITY DATA
// =====================================================

const activities: UserActivity[] = userActivitySeedData;

// =====================================================
// USER STATUS CLASS
// =====================================================

const statusClass = computed(() => {
  if (user.value.status === "Active") {
    return "bg-green-100 text-green-700";
  }

  return "bg-red-100 text-red-700";
});

// =====================================================
// TOGGLE USER STATUS
// =====================================================

const toggleStatus = () => {
  user.value.status = user.value.status === "Active" ? "Blocked" : "Active";
};

// =====================================================
// EDIT USER
// =====================================================

const editUser = () => {
  navigateTo(`/admin/users/${user.value.id}/edit`);
};

// =====================================================
// DELETE USER
// =====================================================

const deleteUser = () => {
  const confirmed = confirm(
    `Are you sure you want to delete ${user.value.name}?`,
  );

  if (!confirmed) {
    return;
  }

  alert("User deleted successfully.");

  navigateTo("/admin/users");
};

// =====================================================
// ORDER STATUS CLASS
// =====================================================

const orderStatusClass = (status: string) => {
  if (status === "Delivered") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Processing") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Pending") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (status === "Cancelled") {
    return "bg-red-100 text-red-700";
  }

  return "bg-gray-100 text-gray-700";
};

// =====================================================
// FORMAT PRICE
// =====================================================

const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div class="mb-8">
      <!-- Back Button -->
      <NuxtLink
        to="/admin/users"
        class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 hover:text-black"
      >
        <span class="text-lg leading-none"> ← </span>

        Back to Users
      </NuxtLink>

      <!-- Breadcrumb -->
      <div class="mt-5 flex items-center gap-2 text-sm text-gray-500">
        <NuxtLink to="/admin/users" class="transition hover:text-black">
          Users
        </NuxtLink>

        <span>/</span>

        <span class="font-medium text-gray-700">
          {{ user.name }}
        </span>
      </div>

      <!-- Page Title -->
      <div
        class="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Profile</h1>

          <p class="mt-1 text-sm text-gray-500">
            View customer information, orders, and activity.
          </p>
        </div>

        <!-- Header Actions -->
        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            @click="editUser"
          >
            Edit User
          </button>

          <button
            type="button"
            class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            @click="deleteUser"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- MAIN CONTENT -->
    <!-- ================================================= -->

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <!-- ================================================= -->
      <!-- LEFT COLUMN -->
      <!-- ================================================= -->

      <div class="space-y-6">
        <!-- Profile Card -->
        <div
          class="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
        >
          <!-- Avatar -->
          <img
            :src="user.avatar"
            :alt="user.name"
            class="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-gray-100"
          />

          <!-- Name -->
          <h2 class="mt-5 text-xl font-bold text-gray-900">
            {{ user.name }}
          </h2>

          <!-- Email -->
          <p class="mt-1 break-all text-sm text-gray-500">
            {{ user.email }}
          </p>

          <!-- Role & Status -->
          <div class="mt-4 flex justify-center gap-2">
            <span
              class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
            >
              {{ user.role }}
            </span>

            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="statusClass"
            >
              {{ user.status }}
            </span>
          </div>

          <!-- Toggle Status -->
          <button
            type="button"
            class="mt-6 w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            @click="toggleStatus"
          >
            {{ user.status === "Active" ? "Block User" : "Activate User" }}
          </button>
        </div>

        <!-- Contact Information -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 class="font-bold text-gray-900">Contact Information</h3>

          <div class="mt-5 space-y-5">
            <!-- Email -->
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-400">Email</p>

              <p class="mt-1 break-all text-sm font-medium text-gray-900">
                {{ user.email }}
              </p>
            </div>

            <!-- Phone -->
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-400">Phone</p>

              <p class="mt-1 text-sm font-medium text-gray-900">
                {{ user.phone }}
              </p>
            </div>

            <!-- Address -->
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-400">
                Address
              </p>

              <p class="mt-1 text-sm font-medium text-gray-900">
                {{ user.address }}
              </p>
            </div>

            <!-- Joined -->
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-400">
                Joined
              </p>

              <p class="mt-1 text-sm font-medium text-gray-900">
                {{ user.joined }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================= -->
      <!-- RIGHT COLUMN -->
      <!-- ================================================= -->

      <div class="space-y-6 xl:col-span-2">
        <!-- ================================================= -->
        <!-- STATISTICS -->
        <!-- ================================================= -->

        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <!-- Total Orders -->
          <div
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p class="text-sm text-gray-500">Total Orders</p>

            <p class="mt-2 text-2xl font-bold text-gray-900">
              {{ user.orders }}
            </p>

            <p class="mt-1 text-xs text-gray-400">All orders</p>
          </div>

          <!-- Completed -->
          <div
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p class="text-sm text-gray-500">Completed</p>

            <p class="mt-2 text-2xl font-bold text-green-600">
              {{ user.completedOrders }}
            </p>

            <p class="mt-1 text-xs text-gray-400">Successful orders</p>
          </div>

          <!-- Cancelled -->
          <div
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p class="text-sm text-gray-500">Cancelled</p>

            <p class="mt-2 text-2xl font-bold text-red-600">
              {{ user.cancelledOrders }}
            </p>

            <p class="mt-1 text-xs text-gray-400">Cancelled orders</p>
          </div>

          <!-- Total Spent -->
          <div
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p class="text-sm text-gray-500">Total Spent</p>

            <p class="mt-2 text-2xl font-bold text-gray-900">
              ${{ formatPrice(user.spent) }}
            </p>

            <p class="mt-1 text-xs text-gray-400">Customer spending</p>
          </div>
        </div>

        <!-- ================================================= -->
        <!-- ORDER HISTORY -->
        <!-- ================================================= -->

        <div
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <!-- Order Header -->
          <div
            class="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 class="text-lg font-bold text-gray-900">Order History</h2>

              <p class="mt-1 text-sm text-gray-500">
                Recent purchases made by this customer.
              </p>
            </div>

            <NuxtLink
              to="/admin/orders"
              class="text-sm font-semibold text-gray-700 transition hover:text-black hover:underline"
            >
              View All
            </NuxtLink>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full min-w-[800px] text-left">
              <thead class="bg-gray-50">
                <tr class="border-b border-gray-100">
                  <th
                    class="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Order
                  </th>

                  <th
                    class="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Date
                  </th>

                  <th
                    class="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Items
                  </th>

                  <th
                    class="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Total
                  </th>

                  <th
                    class="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Status
                  </th>

                  <th
                    class="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="order in orders"
                  :key="order.id"
                  class="transition hover:bg-gray-50"
                >
                  <!-- Order -->
                  <td class="px-6 py-4">
                    <NuxtLink
                      :to="`/admin/orders/${order.id.replace('#ORD-', '')}`"
                      class="text-sm font-semibold text-gray-900 hover:underline"
                    >
                      {{ order.id }}
                    </NuxtLink>
                  </td>

                  <!-- Date -->
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ order.date }}
                  </td>

                  <!-- Items -->
                  <td class="px-6 py-4 text-sm text-gray-700">
                    {{ order.items }}
                  </td>

                  <!-- Total -->
                  <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${{ formatPrice(order.total) }}
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4">
                    <span
                      class="rounded-full px-3 py-1 text-xs font-semibold"
                      :class="orderStatusClass(order.status)"
                    >
                      {{ order.status }}
                    </span>
                  </td>

                  <!-- Action -->
                  <td class="px-6 py-4">
                    <NuxtLink
                      :to="`/admin/orders/${order.id.replace('#ORD-', '')}`"
                      class="text-sm font-semibold text-gray-700 hover:text-black hover:underline"
                    >
                      View
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="orders.length === 0" class="p-10 text-center">
            <div class="text-4xl">🛒</div>

            <h3 class="mt-3 font-semibold text-gray-900">No orders yet</h3>

            <p class="mt-1 text-sm text-gray-500">
              This customer hasn't placed any orders.
            </p>
          </div>
        </div>

        <!-- ================================================= -->
        <!-- RECENT ACTIVITY -->
        <!-- ================================================= -->

        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 class="text-lg font-bold text-gray-900">Recent Activity</h2>

            <p class="mt-1 text-sm text-gray-500">
              Recent activity from this customer.
            </p>
          </div>

          <!-- Activity -->
          <div class="mt-6">
            <div
              v-for="(activity, index) in activities"
              :key="activity.title + activity.date"
              class="relative flex gap-4 pb-6 last:pb-0"
            >
              <!-- Timeline Line -->
              <div
                v-if="index !== activities.length - 1"
                class="absolute left-5 top-10 h-full w-px bg-gray-200"
              ></div>

              <!-- Icon -->
              <div
                class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg"
              >
                {{ activity.icon }}
              </div>

              <!-- Activity Content -->
              <div class="min-w-0 flex-1">
                <div class="flex flex-col justify-between gap-1 sm:flex-row">
                  <p class="font-semibold text-gray-900">
                    {{ activity.title }}
                  </p>

                  <span class="text-xs text-gray-400">
                    {{ activity.date }}
                  </span>
                </div>

                <p class="mt-1 text-sm text-gray-500">
                  {{ activity.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
