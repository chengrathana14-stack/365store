<script setup lang="ts">
import { computed, ref } from "vue";
import { userSeedData } from "~/data/admin";
import type { User } from "~/type/product";

definePageMeta({
  layout: "admin",
});

const users = ref<User[]>(userSeedData.map((user) => ({ ...user })));

const search = ref("");
const selectedRole = ref("All");
const selectedStatus = ref("All");

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const searchMatch =
      user.name.toLowerCase().includes(search.value.toLowerCase()) ||
      user.email.toLowerCase().includes(search.value.toLowerCase()) ||
      user.phone.includes(search.value);

    const roleMatch =
      selectedRole.value === "All" || user.role === selectedRole.value;

    const statusMatch =
      selectedStatus.value === "All" || user.status === selectedStatus.value;

    return searchMatch && roleMatch && statusMatch;
  });
});

const totalUsers = computed(() => users.value.length);

const activeUsers = computed(
  () => users.value.filter((user) => user.status === "Active").length,
);

const blockedUsers = computed(
  () => users.value.filter((user) => user.status === "Blocked").length,
);

const adminUsers = computed(
  () => users.value.filter((user) => user.role === "Admin").length,
);

// =========================================
// DELETE MODAL
// =========================================

const userToDelete = ref<User | null>(null);
const showDeleteModal = ref(false);

const openDeleteModal = (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  userToDelete.value = null;
  showDeleteModal.value = false;
};

const confirmDeleteUser = () => {
  if (userToDelete.value) {
    users.value = users.value.filter((u) => u.id !== userToDelete.value!.id);
  }
  closeDeleteModal();
};

// =========================================
// TOGGLE STATUS
// =========================================

const toggleStatus = (user: User) => {
  user.status = user.status === "Active" ? "Blocked" : "Active";
};

const clearFilters = () => {
  search.value = "";
  selectedRole.value = "All";
  selectedStatus.value = "All";
};
</script>

<template>
  <div class="space-y-5">

    <!-- =========================================
         PAGE HEADER
    ========================================== -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-md bg-gray-900 text-white shadow-2xs">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>

        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
            Users
          </h1>
          <p class="text-xs text-gray-400 mt-0.5">
            Manage customer accounts, store administrators, and access privileges
          </p>
        </div>
      </div>

      <NuxtLink
        to="/admin/users/create"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add User</span>
      </NuxtLink>
    </div>

    <!-- =========================================
         KPI STATISTICS (CLEAN SMALL-RADIUS METRICS)
    ========================================== -->
    <div class="grid gap-3 grid-cols-2 lg:grid-cols-4">
      <!-- Total Users -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Users</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">{{ totalUsers }}</p>
      </div>

      <!-- Active Users -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Active Accounts</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-emerald-600">{{ activeUsers }}</p>
      </div>

      <!-- Blocked Users -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Suspended / Blocked</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-red-500">{{ blockedUsers }}</p>
      </div>

      <!-- Administrators -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Staff & Admins</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-purple-600">{{ adminUsers }}</p>
      </div>
    </div>

    <!-- =========================================
         FILTER BAR
    ========================================== -->
    <div class="rounded-md border border-gray-100 bg-white p-3.5 shadow-xs">
      <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <!-- Search -->
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Search name, email or phone..."
            class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <!-- Role Filter -->
        <select
          v-model="selectedRole"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
        </select>

        <!-- Status Filter -->
        <select
          v-model="selectedStatus"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>

        <!-- Clear Button -->
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition shadow-2xs"
          @click="clearFilters"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Count Summary -->
    <div class="flex items-center justify-between px-1 text-xs text-gray-400">
      <p>
        Showing
        <span class="font-bold text-gray-900">{{ filteredUsers.length }}</span>
        registered accounts
      </p>
    </div>

    <!-- =========================================
         USERS TABLE (WITH BORDERLESS ACTION ICONS)
    ========================================== -->
    <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[900px] text-left text-xs">
          <thead class="border-b border-gray-100 bg-white">
            <tr>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                USER PROFILE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                ROLE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                STATUS
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                ORDERS
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                TOTAL SPENT
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                JOINED
              </th>
              <th class="px-6 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100/80">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="transition hover:bg-gray-50/60"
            >
              <!-- User Profile -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="user.avatar"
                    :alt="user.name"
                    class="h-9 w-9 rounded-full object-cover border border-gray-100 shadow-2xs shrink-0"
                  />

                  <div>
                    <p class="font-bold text-gray-900 text-xs sm:text-sm">
                      {{ user.name }}
                    </p>
                    <p class="mt-0.5 text-[11px] text-gray-400">
                      {{ user.email }} · {{ user.phone }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  :class="
                    user.role === 'Admin'
                      ? 'bg-purple-50 text-purple-700 border border-purple-100'
                      : 'bg-blue-50 text-blue-700 border border-blue-100'
                  "
                >
                  {{ user.role }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="rounded-md px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5"
                  :class="
                    user.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-red-50 text-red-600 border border-red-100'
                  "
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'"
                  ></span>
                  <span>{{ user.status }}</span>
                </span>
              </td>

              <!-- Orders -->
              <td class="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap">
                {{ user.orders }} orders
              </td>

              <!-- Spent -->
              <td class="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                ${{ user.spent.toLocaleString() }}
              </td>

              <!-- Joined -->
              <td class="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                {{ user.joined }}
              </td>

              <!-- ACTIONS: BORDERLESS INLINE ICONS -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-3">
                  <!-- Toggle / Active Status Icon -->
                  <button
                    type="button"
                    :title="user.status === 'Active' ? 'Suspend / Block User' : 'Activate User'"
                    class="hover:scale-125 transition-transform p-0.5"
                    :class="user.status === 'Active' ? 'text-emerald-500 hover:text-emerald-700' : 'text-amber-500 hover:text-amber-700'"
                    @click="toggleStatus(user)"
                  >
                    <svg v-if="user.status === 'Active'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </button>

                  <!-- Delete User Icon -->
                  <button
                    type="button"
                    title="Delete User"
                    class="text-red-400 hover:text-red-600 hover:scale-125 transition-transform p-0.5"
                    @click="openDeleteModal(user)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <!-- View Profile Icon -->
                  <NuxtLink
                    :to="`/admin/users/${user.id}`"
                    title="View User Profile"
                    class="text-blue-400 hover:text-blue-600 hover:scale-125 transition-transform p-0.5"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredUsers.length === 0"
        class="py-14 text-center"
      >
        <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="mt-3 text-xs font-bold text-gray-900">No users found</h3>
        <p class="mt-0.5 text-[11px] text-gray-400">Try adjusting your search criteria or role filters.</p>
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

        <h3 class="mt-3 text-sm font-bold text-gray-900">Delete User Account?</h3>
        <p class="mt-1 text-xs leading-relaxed text-gray-500">
          Are you sure you want to permanently remove <span class="font-semibold text-gray-900">{{ userToDelete?.name }}</span>? All associated permissions will be revoked.
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
            @click="confirmDeleteUser"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
