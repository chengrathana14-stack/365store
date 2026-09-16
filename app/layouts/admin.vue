<script setup lang="ts">
import { adminNavigation } from "~/data/storefront";

const sidebarOpen = ref(false);
const navigation = adminNavigation;
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- ================= SIDEBAR ================= -->

    <aside
      class="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-black text-white transition-transform duration-300"
      :class="
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      "
    >
      <!-- Logo -->
      <div
        class="flex h-20 shrink-0 items-center border-b border-gray-800 px-6"
      >
        <NuxtLink to="/admin" class="text-2xl font-black tracking-tight">
          365<span class="text-gray-500">SPORT</span>
        </NuxtLink>
      </div>

      <!-- Admin -->
      <div class="shrink-0 border-b border-gray-800 p-5">
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-black text-lg font-bold text-white ring-1 ring-gray-700"
          >
            A
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">Administrator</p>

            <p class="text-xs text-gray-500">Store Manager</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto px-3 py-5">
        <div v-for="section in navigation" :key="section.title" class="mb-7">
          <p
            class="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-gray-500"
          >
            {{ section.title }}
          </p>

          <NuxtLink
            v-for="item in section.items"
            :key="item.path"
            :to="item.path"
            class="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-300 transition hover:bg-white hover:text-black"
            active-class="bg-white !text-black"
            @click="sidebarOpen = false"
          >
            <span class="text-lg">
              {{ item.icon }}
            </span>

            <span class="flex-1">
              {{ item.name }}
            </span>

            <span
              v-if="item.badge"
              class="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
        </div>
      </nav>

      <!-- Bottom -->
      <div class="shrink-0 border-t border-gray-800 p-3">
        <NuxtLink
          to="/"
          target="_blank"
          class="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-300 transition hover:bg-gray-800"
        >
          <span>🌐</span>
          <span>View Website</span>
        </NuxtLink>

        <button
          class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-300 transition hover:bg-red-500"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- ================= MAIN ================= -->

    <div class="lg:pl-64">
      <!-- Header -->
      <header
        class="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6"
      >
        <!-- Left -->
        <div class="flex items-center gap-4">
          <button
            class="rounded-xl p-2 text-xl hover:bg-gray-100 lg:hidden"
            @click="sidebarOpen = true"
          >
            ☰
          </button>

          <div>
            <p class="text-xs text-gray-400">365 SPORT ADMIN</p>

            <h1 class="text-lg font-bold text-gray-900">Management System</h1>
          </div>
        </div>

        <!-- Right -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Search -->
          <button
            class="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 md:block"
          >
            🔍 Search
          </button>

          <!-- Notification -->
          <NuxtLink
            to="/admin/notifications"
            class="relative rounded-xl p-2 text-xl hover:bg-gray-100"
          >
            🔔

            <span
              class="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"
            ></span>
          </NuxtLink>

          <!-- Profile -->
          <button
            class="flex items-center gap-3 rounded-xl p-1.5 hover:bg-gray-100"
          >
            <div
              class="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white"
            >
              A
            </div>

            <div class="hidden text-left lg:block">
              <p class="text-sm font-semibold">Admin</p>

              <p class="text-[11px] text-gray-500">Administrator</p>
            </div>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>
