<script setup lang="ts">
import { computed, ref } from "vue";
import { products } from "~/data/product";
import { userSeedData } from "~/data/admin";
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

const deleteUser = (id: number) => {
  const confirmed = confirm("Are you sure you want to delete this user?");

  if (!confirmed) return;

  users.value = users.value.filter((user) => user.id !== id);
};

const toggleStatus = (user: User) => {
  user.status = user.status === "Active" ? "Blocked" : "Active";
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div
      class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Users</h1>

        <p class="mt-1 text-sm text-gray-500">
          Manage customers and administrators.
        </p>
      </div>

      <NuxtLink
        to="/admin/users/create"
        class="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        <span class="text-lg">+</span>
        Add User
      </NuxtLink>
    </div>

    <!-- Stats -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Total Users</p>
        <p class="mt-2 text-3xl font-bold">{{ totalUsers }}</p>
      </div>

      <div class="rounded-2xl border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Active Users</p>
        <p class="mt-2 text-3xl font-bold text-green-600">
          {{ activeUsers }}
        </p>
      </div>

      <div class="rounded-2xl border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Blocked Users</p>
        <p class="mt-2 text-3xl font-bold text-red-600">
          {{ blockedUsers }}
        </p>
      </div>

      <div class="rounded-2xl border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Administrators</p>
        <p class="mt-2 text-3xl font-bold">
          {{ adminUsers }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="md:col-span-1">
          <input
            v-model="search"
            type="text"
            placeholder="Search name, email or phone..."
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <select
          v-model="selectedRole"
          class="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
        </select>

        <select
          v-model="selectedStatus"
          class="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[900px]">
          <thead class="bg-gray-50">
            <tr class="border-b">
              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500"
              >
                User
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500"
              >
                Role
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500"
              >
                Status
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500"
              >
                Orders
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500"
              >
                Spent
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500"
              >
                Joined
              </th>

              <th
                class="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="user.avatar"
                    class="h-11 w-11 rounded-full object-cover"
                    :alt="user.name"
                  />

                  <div>
                    <p class="font-semibold text-gray-900">
                      {{ user.name }}
                    </p>

                    <p class="text-sm text-gray-500">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="
                    user.role === 'Admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  "
                >
                  {{ user.role }}
                </span>
              </td>

              <td class="px-6 py-4">
                <button
                  @click="toggleStatus(user)"
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  "
                >
                  {{ user.status }}
                </button>
              </td>

              <td class="px-6 py-4 text-sm font-semibold">
                {{ user.orders }}
              </td>

              <td class="px-6 py-4 text-sm font-semibold">
                ${{ user.spent.toLocaleString() }}
              </td>

              <td class="px-6 py-4 text-sm text-gray-500">
                {{ user.joined }}
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/users/${user.id}`"
                    class="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-gray-100"
                  >
                    View
                  </NuxtLink>

                  <button
                    @click="deleteUser(user.id)"
                    class="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
