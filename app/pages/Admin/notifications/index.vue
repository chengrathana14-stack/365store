<script setup lang="ts">
import { ref, computed } from "vue";
import { notificationSeedData } from "~/data/admin";

definePageMeta({
  layout: "admin",
});

const notifications = ref(
  notificationSeedData.map((notification) => ({ ...notification })),
);

const filter = ref("All");

const unreadCount = computed(() => {
  return notifications.value.filter((notification) => !notification.read)
    .length;
});

const filteredNotifications = computed(() => {
  if (filter.value === "Unread") {
    return notifications.value.filter((notification) => !notification.read);
  }

  return notifications.value;
});

const markAsRead = (id: number) => {
  const notification = notifications.value.find((item) => item.id === id);

  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.read = true;
  });
};

const deleteNotification = (id: number) => {
  notifications.value = notifications.value.filter(
    (notification) => notification.id !== id,
  );
};
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
    >
      <div>
        <h2 class="text-2xl font-bold">Notifications</h2>

        <p class="mt-1 text-sm text-gray-500">
          Stay updated with your store activity.
        </p>
      </div>

      <button
        v-if="unreadCount > 0"
        class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        @click="markAllAsRead"
      >
        Mark all as read
      </button>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="rounded-2xl border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Total Notifications</p>

        <p class="mt-2 text-2xl font-bold">
          {{ notifications.length }}
        </p>
      </div>

      <div class="rounded-2xl border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Unread</p>

        <p class="mt-2 text-2xl font-bold text-red-600">
          {{ unreadCount }}
        </p>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex gap-2">
      <button
        class="rounded-xl px-4 py-2 text-sm font-semibold"
        :class="
          filter === 'All'
            ? 'bg-black text-white'
            : 'bg-white border border-gray-200'
        "
        @click="filter = 'All'"
      >
        All
      </button>

      <button
        class="rounded-xl px-4 py-2 text-sm font-semibold"
        :class="
          filter === 'Unread'
            ? 'bg-black text-white'
            : 'bg-white border border-gray-200'
        "
        @click="filter = 'Unread'"
      >
        Unread
      </button>
    </div>

    <!-- Notifications -->
    <div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        class="flex gap-4 border-b p-5 transition last:border-b-0 hover:bg-gray-50"
        :class="!notification.read ? 'bg-gray-50' : 'bg-white'"
      >
        <!-- Icon -->
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
          :class="{
            'bg-blue-100': notification.type === 'order',
            'bg-orange-100': notification.type === 'stock',
            'bg-green-100': notification.type === 'user',
            'bg-yellow-100': notification.type === 'review',
          }"
        >
          {{
            notification.type === "order"
              ? "🛒"
              : notification.type === "stock"
                ? "📦"
                : notification.type === "user"
                  ? "👤"
                  : "⭐"
          }}
        </div>

        <!-- Content -->
        <div class="min-w-0 flex-1">
          <div class="flex flex-col justify-between gap-1 sm:flex-row">
            <h3
              class="font-semibold"
              :class="!notification.read ? 'text-black' : 'text-gray-700'"
            >
              {{ notification.title }}
            </h3>

            <span class="text-xs text-gray-400">
              {{ notification.time }}
            </span>
          </div>

          <p class="mt-1 text-sm text-gray-500">
            {{ notification.message }}
          </p>

          <div class="mt-3 flex gap-3">
            <button
              v-if="!notification.read"
              class="text-xs font-semibold text-blue-600 hover:underline"
              @click="markAsRead(notification.id)"
            >
              Mark as read
            </button>

            <button
              class="text-xs font-semibold text-red-500 hover:underline"
              @click="deleteNotification(notification.id)"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Unread -->
        <div
          v-if="!notification.read"
          class="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500"
        ></div>
      </div>

      <!-- Empty -->
      <div v-if="filteredNotifications.length === 0" class="p-16 text-center">
        <div class="text-5xl">🔔</div>

        <h3 class="mt-4 font-bold">No notifications</h3>

        <p class="mt-1 text-sm text-gray-500">You're all caught up.</p>
      </div>
    </div>
  </div>
</template>
