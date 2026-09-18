<script setup lang="ts">
import { ref, computed } from "vue";
import { notificationSeedData } from "~/data/admin";
import type { AdminNotification } from "~/type/admin";

definePageMeta({
  layout: "admin",
});

const notifications = ref<AdminNotification[]>(
  notificationSeedData.map((notification) => ({
    ...notification,
    type: notification.type as AdminNotification["type"],
  })),
);

const search = ref("");
const selectedFilter = ref<"all" | "unread" | "order" | "stock" | "user" | "review">("all");
const deleteModalId = ref<number | null>(null);

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

const orderCount = computed(() => {
  return notifications.value.filter((n) => n.type === "order").length;
});

const stockCount = computed(() => {
  return notifications.value.filter((n) => n.type === "stock").length;
});

const userReviewCount = computed(() => {
  return notifications.value.filter((n) => n.type === "user" || n.type === "review").length;
});

const filteredNotifications = computed(() => {
  return notifications.value.filter((n) => {
    // Filter type
    let matchesType = true;
    if (selectedFilter.value === "unread") {
      matchesType = !n.read;
    } else if (selectedFilter.value === "order") {
      matchesType = n.type === "order";
    } else if (selectedFilter.value === "stock") {
      matchesType = n.type === "stock";
    } else if (selectedFilter.value === "user" || selectedFilter.value === "review") {
      matchesType = n.type === "user" || n.type === "review";
    }

    // Filter search
    const query = search.value.trim().toLowerCase();
    const matchesSearch =
      !query ||
      n.title.toLowerCase().includes(query) ||
      n.message.toLowerCase().includes(query);

    return matchesType && matchesSearch;
  });
});

const markAsRead = (id: number) => {
  const notification = notifications.value.find((item) => item.id === id);
  if (notification) {
    notification.read = true;
  }
};

const toggleRead = (id: number) => {
  const notification = notifications.value.find((item) => item.id === id);
  if (notification) {
    notification.read = !notification.read;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.read = true;
  });
};

const confirmDelete = (id: number) => {
  deleteModalId.value = id;
};

const executeDelete = () => {
  if (deleteModalId.value !== null) {
    notifications.value = notifications.value.filter(
      (n) => n.id !== deleteModalId.value,
    );
    deleteModalId.value = null;
  }
};

const clearAllRead = () => {
  notifications.value = notifications.value.filter((n) => !n.read);
};
</script>

<template>
  <div class="space-y-5">
    <!-- ================= HEADER ================= -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-md bg-gray-900 text-white shadow-2xs">
          <!-- Notification Bell SVG -->
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>

        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
              Notifications
            </h1>
            <span
              v-if="unreadCount > 0"
              class="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700"
            >
              {{ unreadCount }} new
            </span>
          </div>
          <p class="text-xs text-gray-400 mt-0.5">
            Real-time updates on orders, inventory alerts, and customer engagement
          </p>
        </div>
      </div>

      <!-- Quick bulk actions -->
      <div class="flex items-center gap-2">
        <button
          v-if="unreadCount > 0"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 active:scale-95"
          @click="markAllAsRead"
        >
          <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Mark all read</span>
        </button>

        <button
          v-if="notifications.some((n) => n.read)"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-2xs transition hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95"
          @click="clearAllRead"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Clear read</span>
        </button>
      </div>
    </div>

    <!-- ================= METRIC KPI CARDS ================= -->
    <div class="grid gap-3 grid-cols-2 lg:grid-cols-4">
      <!-- Total Notifications -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Updates</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">{{ notifications.length }}</p>
      </div>

      <!-- Unread Alerts -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Unread</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-red-600">{{ unreadCount }}</p>
      </div>

      <!-- Orders -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Order Events</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">{{ orderCount }}</p>
      </div>

      <!-- Inventory & Reviews -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Stock & Reviews</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">{{ stockCount + userReviewCount }}</p>
      </div>
    </div>

    <!-- ================= FILTERS & SEARCH TOOLBAR ================= -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <!-- Filter Tabs -->
      <div class="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
          :class="
            selectedFilter === 'all'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          "
          @click="selectedFilter = 'all'"
        >
          All
          <span class="ml-1 text-[10px] opacity-80">({{ notifications.length }})</span>
        </button>

        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
          :class="
            selectedFilter === 'unread'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          "
          @click="selectedFilter = 'unread'"
        >
          Unread
          <span
            v-if="unreadCount > 0"
            class="ml-1 rounded px-1 text-[10px] font-bold bg-red-500 text-white"
          >
            {{ unreadCount }}
          </span>
          <span v-else class="ml-1 text-[10px] opacity-80">(0)</span>
        </button>

        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
          :class="
            selectedFilter === 'order'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          "
          @click="selectedFilter = 'order'"
        >
          Orders
          <span class="ml-1 text-[10px] opacity-80">({{ orderCount }})</span>
        </button>

        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
          :class="
            selectedFilter === 'stock'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          "
          @click="selectedFilter = 'stock'"
        >
          Stock
          <span class="ml-1 text-[10px] opacity-80">({{ stockCount }})</span>
        </button>

        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
          :class="
            selectedFilter === 'user'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          "
          @click="selectedFilter = 'user'"
        >
          Customers & Reviews
          <span class="ml-1 text-[10px] opacity-80">({{ userReviewCount }})</span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full sm:w-64 shrink-0">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search notifications..."
          class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 shadow-2xs focus:border-gray-900 focus:outline-hidden"
        />
        <button
          v-if="search"
          type="button"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          @click="search = ''"
        >
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ================= NOTIFICATIONS LIST ================= -->
    <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">
      <div v-if="filteredNotifications.length > 0" class="divide-y divide-gray-100">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="group relative flex items-start gap-3.5 p-4 transition-colors hover:bg-gray-50/70"
          :class="!notification.read ? 'bg-blue-50/20' : 'bg-white'"
        >
          <!-- Unread Dot Indicator -->
          <span
            v-if="!notification.read"
            class="absolute left-1.5 top-5 h-1.5 w-1.5 rounded-full bg-blue-600"
            title="Unread"
          ></span>

          <!-- Left Icon (Zero emojis, crisp vector SVGs) -->
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md shadow-2xs transition-transform group-hover:scale-105"
            :class="{
              'bg-blue-50 text-blue-600': notification.type === 'order',
              'bg-amber-50 text-amber-600': notification.type === 'stock',
              'bg-emerald-50 text-emerald-600': notification.type === 'user',
              'bg-yellow-50 text-yellow-600': notification.type === 'review',
            }"
          >
            <!-- Order Icon -->
            <svg
              v-if="notification.type === 'order'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            <!-- Stock Icon -->
            <svg
              v-else-if="notification.type === 'stock'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>

            <!-- User Icon -->
            <svg
              v-else-if="notification.type === 'user'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>

            <!-- Review Icon -->
            <svg
              v-else-if="notification.type === 'review'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>

            <!-- Generic Alert Fallback -->
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>

          <!-- Body Content -->
          <div class="min-w-0 flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3
                  class="text-xs sm:text-sm font-bold tracking-tight"
                  :class="!notification.read ? 'text-gray-900' : 'text-gray-700'"
                >
                  {{ notification.title }}
                </h3>

                <!-- Type Badge -->
                <span
                  class="rounded-md px-1.5 py-0.5 text-[10px] font-semibold capitalize"
                  :class="{
                    'bg-blue-50 text-blue-600': notification.type === 'order',
                    'bg-amber-50 text-amber-600': notification.type === 'stock',
                    'bg-emerald-50 text-emerald-600': notification.type === 'user',
                    'bg-yellow-50 text-yellow-700': notification.type === 'review',
                  }"
                >
                  {{ notification.type === 'stock' ? 'Stock Alert' : notification.type }}
                </span>
              </div>

              <!-- Timestamp -->
              <span class="inline-flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ notification.time }}</span>
              </span>
            </div>

            <p class="mt-1 text-xs text-gray-500 leading-relaxed">
              {{ notification.message }}
            </p>
          </div>

          <!-- ================= BORDERLESS INLINE ACTION ICONS ================= -->
          <div class="flex items-center gap-1 shrink-0 pt-0.5">
            <!-- Mark read / unread toggle button (borderless inline icon) -->
            <button
              type="button"
              :title="notification.read ? 'Mark as unread' : 'Mark as read'"
              class="p-1 transition-all duration-150 hover:scale-125"
              :class="
                notification.read
                  ? 'text-gray-300 hover:text-blue-600'
                  : 'text-gray-400 hover:text-emerald-600'
              "
              @click="toggleRead(notification.id)"
            >
              <!-- Checkmark icon if unread; Double-check / undo icon if read -->
              <svg
                v-if="!notification.read"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <svg
                v-else
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <!-- Delete button (borderless inline icon) -->
            <button
              type="button"
              title="Delete notification"
              class="p-1 text-gray-400 transition-all duration-150 hover:text-red-600 hover:scale-125"
              @click="confirmDelete(notification.id)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- ================= EMPTY STATE ================= -->
      <div v-else class="p-12 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>

        <h3 class="mt-3 text-sm font-bold text-gray-900">
          No notifications found
        </h3>

        <p class="mt-1 text-xs text-gray-400 max-w-sm mx-auto">
          {{
            search
              ? `No notifications match "${search}". Try clearing your search query.`
              : 'You are all caught up! No notifications for this filter.'
          }}
        </p>

        <button
          v-if="search || selectedFilter !== 'all'"
          type="button"
          class="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50"
          @click="
            search = '';
            selectedFilter = 'all';
          "
        >
          Reset filters
        </button>
      </div>
    </div>

    <!-- ================= DELETE CONFIRMATION MODAL ================= -->
    <div
      v-if="deleteModalId !== null"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-sm rounded-md border border-gray-100 bg-white p-5 shadow-xl">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">Delete Notification?</h3>
            <p class="text-xs text-gray-500 mt-0.5">
              Are you sure you want to remove this notification alert?
            </p>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            @click="deleteModalId = null"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-red-700"
            @click="executeDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
