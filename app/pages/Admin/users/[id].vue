<script setup lang="ts">
import { computed, ref } from "vue";
import { userActivitySeedData, userOrderSummarySeedData, userSeedData } from "~/data/admin";
import type { UserActivity, UserOrderSummary } from "~/type/admin";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const userId = Number(route.params.id);

// =====================================================
// DYNAMIC USER DATA FROM SEED DATA
// =====================================================

const fallbackUser = userSeedData[0] || {
  id: 1,
  name: "Dara Sok",
  email: "dara@gmail.com",
  phone: "+855 12 111 222",
  role: "Customer" as const,
  status: "Active" as const,
  orders: 12,
  spent: 1250,
  joined: "January 12, 2026",
  avatar: "https://i.pravatar.cc/300?img=12",
};

const matchedUser = userSeedData.find((u) => u.id === userId) || fallbackUser;

const user = ref({
  id: matchedUser.id,
  name: matchedUser.name,
  email: matchedUser.email,
  phone: matchedUser.phone,
  address: "Phnom Penh, Cambodia",
  role: matchedUser.role,
  status: matchedUser.status,
  joined: matchedUser.joined,
  avatar: matchedUser.avatar,
  orders: matchedUser.orders,
  completedOrders: Math.max(0, matchedUser.orders - 2),
  cancelledOrders: matchedUser.orders > 2 ? 2 : 0,
  spent: matchedUser.spent,
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
    return "bg-emerald-50 text-emerald-600 border border-emerald-100";
  }

  return "bg-red-50 text-red-600 border border-red-100";
});

// =====================================================
// TOGGLE USER STATUS
// =====================================================

const toggleStatus = () => {
  user.value.status = user.value.status === "Active" ? "Blocked" : "Active";
};

// =====================================================
// DELETE USER MODAL
// =====================================================

const showDeleteModal = ref(false);

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const deleteUser = () => {
  showDeleteModal.value = false;
  alert(`User "${user.value.name}" deleted.`);
  navigateTo("/admin/users");
};

// =====================================================
// ORDER STATUS CLASS
// =====================================================

const orderStatusClass = (status: string) => {
  if (status === "Delivered") {
    return "bg-emerald-50 text-emerald-600 border border-emerald-100";
  }

  if (status === "Processing") {
    return "bg-blue-50 text-blue-600 border border-blue-100";
  }

  if (status === "Pending") {
    return "bg-amber-50 text-amber-600 border border-amber-100";
  }

  if (status === "Cancelled") {
    return "bg-red-50 text-red-600 border border-red-100";
  }

  return "bg-gray-50 text-gray-600 border border-gray-100";
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
  <div class="space-y-5">
    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <!-- Back Link -->
        <NuxtLink
          to="/admin/users"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition mb-2"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Users</span>
        </NuxtLink>

        <!-- Title & Identification -->
        <div class="flex items-center gap-3 mt-1">
          <img
            :src="user.avatar"
            :alt="user.name"
            class="h-11 w-11 rounded-full object-cover border border-gray-100 shadow-2xs shrink-0"
          />

          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
                {{ user.name }}
              </h1>

              <span
                class="rounded-md px-2 py-0.5 text-xs font-semibold"
                :class="statusClass"
              >
                {{ user.status }}
              </span>
            </div>

            <p class="text-xs text-gray-400 mt-0.5">
              Account ID: #USR-{{ user.id }} · Member since {{ user.joined }}
            </p>
          </div>
        </div>
      </div>

      <!-- Header Actions -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
          @click="toggleStatus"
        >
          {{ user.status === "Active" ? "Suspend Account" : "Activate Account" }}
        </button>

        <button
          type="button"
          class="rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition shadow-2xs"
          @click="openDeleteModal"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- MAIN GRID -->
    <!-- ================================================= -->
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <!-- LEFT COLUMN (Profile Summary & Contact) -->
      <div class="space-y-4">
        <!-- Profile Card -->
        <div class="rounded-md border border-gray-100 bg-white p-5 text-center shadow-xs">
          <img
            :src="user.avatar"
            :alt="user.name"
            class="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-gray-50 border border-gray-100 shadow-2xs"
          />

          <h2 class="mt-3 text-base font-bold text-gray-900">
            {{ user.name }}
          </h2>

          <p class="text-xs text-gray-400 break-all mt-0.5">
            {{ user.email }}
          </p>

          <div class="mt-3 flex justify-center gap-2">
            <span
              class="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              :class="user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'"
            >
              {{ user.role }}
            </span>

            <span
              class="rounded-md px-2 py-0.5 text-[10px] font-semibold"
              :class="statusClass"
            >
              {{ user.status }}
            </span>
          </div>

          <button
            type="button"
            class="mt-4 w-full rounded-lg px-3 py-2 text-xs font-semibold transition shadow-2xs"
            :class="user.status === 'Active' ? 'bg-gray-900 text-white hover:bg-black' : 'bg-emerald-600 text-white hover:bg-emerald-700'"
            @click="toggleStatus"
          >
            {{ user.status === "Active" ? "Suspend / Block User" : "Activate User" }}
          </button>
        </div>

        <!-- Contact Information -->
        <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs">
          <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">
            Contact Details
          </h3>

          <div class="mt-3.5 space-y-3 text-xs">
            <div>
              <p class="text-[11px] font-semibold text-gray-400">Email Address</p>
              <p class="mt-0.5 font-bold text-gray-900 break-all">{{ user.email }}</p>
            </div>

            <div>
              <p class="text-[11px] font-semibold text-gray-400">Phone Number</p>
              <p class="mt-0.5 font-bold text-gray-900">{{ user.phone }}</p>
            </div>

            <div>
              <p class="text-[11px] font-semibold text-gray-400">Delivery Address</p>
              <p class="mt-0.5 font-medium text-gray-700">{{ user.address }}</p>
            </div>

            <div>
              <p class="text-[11px] font-semibold text-gray-400">Account Registration</p>
              <p class="mt-0.5 font-medium text-gray-700">{{ user.joined }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN (KPI Stats, Order History & Activity) -->
      <div class="space-y-4 xl:col-span-2">
        <!-- KPI METRICS -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <!-- Total Orders -->
          <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Orders</p>
            <p class="mt-1 text-2xl font-black text-gray-900">{{ user.orders }}</p>
          </div>

          <!-- Completed Orders -->
          <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Completed</p>
            <p class="mt-1 text-2xl font-black text-emerald-600">{{ user.completedOrders }}</p>
          </div>

          <!-- Cancelled Orders -->
          <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Cancelled</p>
            <p class="mt-1 text-2xl font-black text-red-500">{{ user.cancelledOrders }}</p>
          </div>

          <!-- Total Spent -->
          <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Spent</p>
            <p class="mt-1 text-2xl font-black text-gray-900">${{ formatPrice(user.spent) }}</p>
          </div>
        </div>

        <!-- ORDER HISTORY TABLE -->
        <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">
          <div class="flex items-center justify-between border-b border-gray-100 p-4">
            <div>
              <h3 class="text-sm font-bold text-gray-900">Order History</h3>
              <p class="text-xs text-gray-400 mt-0.5">Purchases placed by this customer</p>
            </div>

            <NuxtLink
              to="/admin/orders"
              class="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              View All Orders →
            </NuxtLink>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[700px] text-left text-xs">
              <thead class="border-b border-gray-100 bg-white text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <tr>
                  <th class="px-6 py-3.5">ORDER ID</th>
                  <th class="px-6 py-3.5">DATE</th>
                  <th class="px-6 py-3.5">ITEMS</th>
                  <th class="px-6 py-3.5">TOTAL</th>
                  <th class="px-6 py-3.5">STATUS</th>
                  <th class="px-6 py-3.5 text-center">ACTION</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100/80">
                <tr
                  v-for="order in orders"
                  :key="order.id"
                  class="transition hover:bg-gray-50/60"
                >
                  <!-- Order ID -->
                  <td class="px-6 py-4 font-bold text-gray-900">
                    <NuxtLink
                      :to="`/admin/orders/${order.id.replace('#ORD-', '')}`"
                      class="hover:text-blue-600 transition"
                    >
                      {{ order.id }}
                    </NuxtLink>
                  </td>

                  <!-- Date -->
                  <td class="px-6 py-4 text-gray-500">
                    {{ order.date }}
                  </td>

                  <!-- Items -->
                  <td class="px-6 py-4 font-medium text-gray-700">
                    {{ order.items }} items
                  </td>

                  <!-- Total -->
                  <td class="px-6 py-4 font-bold text-gray-900">
                    ${{ formatPrice(order.total) }}
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="rounded-md px-2.5 py-1 text-xs font-semibold"
                      :class="orderStatusClass(order.status)"
                    >
                      {{ order.status }}
                    </span>
                  </td>

                  <!-- ACTIONS: BORDERLESS BLUE EYE ICON -->
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <NuxtLink
                      :to="`/admin/orders/${order.id.replace('#ORD-', '')}`"
                      title="View Order Details"
                      class="inline-flex text-blue-400 hover:text-blue-600 hover:scale-125 transition-transform p-0.5"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="orders.length === 0" class="py-12 text-center">
            <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 class="mt-2 text-xs font-bold text-gray-900">No orders yet</h3>
            <p class="mt-0.5 text-[11px] text-gray-400">This customer hasn't placed any purchases.</p>
          </div>
        </div>

        <!-- RECENT ACTIVITY LOG -->
        <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs">
          <h3 class="text-sm font-bold text-gray-900">Recent Customer Activity</h3>
          <p class="text-xs text-gray-400 mt-0.5">Audit log of customer engagements and transactions</p>

          <div class="mt-4 space-y-4">
            <div
              v-for="(activity, index) in activities"
              :key="activity.title + activity.date"
              class="relative flex gap-3 text-xs"
            >
              <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold shadow-2xs">
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="font-bold text-gray-900">{{ activity.title }}</p>
                  <span class="text-[11px] text-gray-400">{{ activity.date }}</span>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">{{ activity.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================
         DELETE USER MODAL
    ========================================== -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-sm rounded-md bg-white p-5 shadow-xl border border-gray-100">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 class="mt-3 text-sm font-bold text-gray-900">Delete Account?</h3>
        <p class="mt-1 text-xs leading-relaxed text-gray-500">
          Are you sure you want to permanently delete <span class="font-semibold text-gray-900">{{ user.name }}</span>?
        </p>

        <div class="mt-5 flex justify-end gap-2 text-xs font-semibold">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition"
            @click="closeDeleteModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 transition shadow-2xs"
            @click="deleteUser"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
