<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { adminNavigation } from "~/data/storefront";

const route = useRoute();
const sidebarOpen = ref(false);
const navigation = adminNavigation;

const isLinkActive = (path: string) => {
  if (path === "/admin") {
    return route.path === "/admin" || route.path === "/admin/";
  }
  return route.path.startsWith(path);
};
</script>

<template>
  <div class="admin-theme min-h-screen bg-zinc-50/70 font-sans text-zinc-900">
    <!-- Mobile overlay backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
      @click="sidebarOpen = false"
    ></div>

    <!-- ================= SHADCN-STYLE WHITE SIDEBAR ================= -->
    <aside
      class="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-zinc-200/80 bg-white shadow-xs transition-transform duration-200 ease-out"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- 1. Header & Brand Logo -->
      <div class="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 px-5">
        <NuxtLink to="/admin" class="group flex items-center gap-2.5">
          <div class="flex h-8 w-8 items-center justify-center rounded-md bg-black text-lime-400 shadow-xs transition-transform group-hover:scale-105">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-base font-black tracking-tight text-zinc-900">365</span>
            <span class="text-xs font-extrabold uppercase tracking-widest text-zinc-400">SPORT</span>
            <span class="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-600">Admin</span>
          </div>
        </NuxtLink>

        <!-- Close button on mobile -->
        <button
          type="button"
          class="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 lg:hidden"
          @click="sidebarOpen = false"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 2. Administrator Profile Card -->
      <div class="shrink-0 p-3 border-b border-zinc-100">
        <div class="flex items-center gap-2.5 rounded-md border border-zinc-200/70 bg-zinc-50/60 p-2.5 transition hover:bg-zinc-100/60">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-black text-xs font-bold text-white shadow-2xs">
            A
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <p class="truncate text-xs font-bold text-zinc-900">Administrator</p>
              <span class="h-1.5 w-1.5 rounded-full bg-lime-500 shrink-0" title="Online"></span>
            </div>
            <p class="truncate text-[10px] font-medium text-zinc-500">Store Manager</p>
          </div>
        </div>
      </div>

      <!-- 3. Navigation Links (with sleek slim scrollbar) -->
      <nav class="custom-scrollbar flex-1 overflow-y-auto px-3 py-3 space-y-4">
        <div v-for="section in navigation" :key="section.title">
          <p class="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {{ section.title }}
          </p>

          <div class="space-y-0.5">
            <NuxtLink
              v-for="item in section.items"
              :key="item.path"
              :to="item.path"
              class="group flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-all"
              :class="
                isLinkActive(item.path)
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900'
              "
              @click="sidebarOpen = false"
            >
              <div class="flex items-center gap-2.5">
                <!-- VECTOR SVG ICONS -->
                <span
                  class="flex h-4 w-4 shrink-0 items-center justify-center transition-colors"
                  :class="isLinkActive(item.path) ? 'text-blue-600' : 'text-zinc-400 group-hover:text-zinc-700'"
                >
                  <!-- Dashboard -->
                  <svg v-if="item.icon === 'dashboard'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>

                  <!-- Products -->
                  <svg v-else-if="item.icon === 'products'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>

                  <!-- Brands -->
                  <svg v-else-if="item.icon === 'brands'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>

                  <!-- Categories -->
                  <svg v-else-if="item.icon === 'categories'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>

                  <!-- Inventory -->
                  <svg v-else-if="item.icon === 'inventory'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>

                  <!-- Orders -->
                  <svg v-else-if="item.icon === 'orders'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>

                  <!-- Users -->
                  <svg v-else-if="item.icon === 'users'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>

                  <!-- Reviews -->
                  <svg v-else-if="item.icon === 'reviews'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>

                  <!-- Discounts -->
                  <svg v-else-if="item.icon === 'discounts'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>

                  <!-- Notifications -->
                  <svg v-else-if="item.icon === 'notifications'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>

                  <!-- Reports -->
                  <svg v-else-if="item.icon === 'reports'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>

                  <!-- Settings -->
                  <svg v-else-if="item.icon === 'settings'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>

                  <!-- Default fallback -->
                  <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>

                <span class="truncate">{{ item.name }}</span>
              </div>

              <!-- Badge -->
              <span
                v-if="item.badge"
                class="rounded px-1.5 py-0.5 text-[10px] font-bold"
                :class="
                  isLinkActive(item.path)
                    ? 'bg-lime-400 text-black font-extrabold'
                    : 'bg-zinc-100 text-zinc-700'
                "
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- 4. Footer Actions -->
      <div class="shrink-0 border-t border-zinc-100 p-3 space-y-1">
        <NuxtLink
          to="/"
          target="_blank"
          class="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100/80 hover:text-zinc-900"
        >
          <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span class="flex-1">View Website</span>
          <svg class="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </NuxtLink>

        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <svg class="h-4 w-4 text-zinc-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="flex-1 text-left">Logout</span>
        </button>
      </div>
    </aside>

    <!-- ================= MAIN CONTENT AREA ================= -->
    <div class="lg:pl-64">
      <!-- Shadcn Top Header -->
      <header
        class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/80 bg-white/95 backdrop-blur-xs px-4 sm:px-6 shadow-2xs"
      >
        <!-- Left: Mobile Toggle & Page Title -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden shadow-2xs"
            @click="sidebarOpen = true"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <div class="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
              <span>365 SPORT</span>
              <span>/</span>
              <span class="text-zinc-600 capitalize">{{ route.path.split('/')[2] || 'Dashboard' }}</span>
            </div>
            <h1 class="text-sm font-bold text-zinc-900 leading-tight">Management System</h1>
          </div>
        </div>

        <!-- Right: Actions & Profile -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Quick search trigger (Shadcn Command Palette style) -->
          <button
            type="button"
            class="hidden md:inline-flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50/70 px-3 py-1.5 text-xs text-zinc-400 shadow-2xs transition hover:border-zinc-300 hover:bg-white hover:text-zinc-600"
          >
            <div class="flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search dashboard...</span>
            </div>
            <kbd class="pointer-events-none rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          <!-- Notifications button -->
          <NuxtLink
            to="/admin/notifications"
            class="relative flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 shadow-2xs transition hover:bg-zinc-50 hover:text-zinc-900"
            title="Notifications"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
          </NuxtLink>

          <!-- Profile trigger -->
          <div class="flex items-center gap-2 rounded-md border border-zinc-200 bg-white p-1 pl-1.5 pr-2.5 shadow-2xs">
            <div class="flex h-6 w-6 items-center justify-center rounded-sm bg-black text-[10px] font-bold text-white">
              A
            </div>
            <div class="hidden text-left sm:block">
              <p class="text-xs font-bold leading-none text-zinc-900">Admin</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>
