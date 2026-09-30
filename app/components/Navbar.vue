<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useWishlist } from "~/composables/useWishlist";
import { useCart } from "~/composables/useCart";
import { useAuth } from "~/composables/useAuth";
import { useSearch } from "~/composables/useSearch";
import { useProductCompare } from "~/composables/useProductCompare";

const { wishlistCount } = useWishlist();
const { cartCount, openCartDrawer } = useCart();
const { user, loadUser, logout, isSuperAdmin } = useAuth();
const { openSearch } = useSearch();
const { compareCount, openCompareModal } = useProductCompare();

const isAccountMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);

const closeAccountMenu = () => {
  isAccountMenuOpen.value = false;
};

const toggleAccountMenu = () => {
  isAccountMenuOpen.value = !isAccountMenuOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const route = useRoute();

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Catalog", path: "/Product" },
  { name: "Deals", path: "/Product?type=discount" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const isActive = (path: string) => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.toLowerCase().startsWith(path.toLowerCase().split("?")[0]);
};

onMounted(loadUser);
onMounted(() => document.addEventListener("click", closeAccountMenu));
onBeforeUnmount(() => document.removeEventListener("click", closeAccountMenu));
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07090e]/85 backdrop-blur-xl text-white transition-all duration-300 shadow-xl"
  >
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 sm:h-18 items-center justify-between gap-4">
        <!-- ================= LOGO ================= -->
        <NuxtLink to="/" class="flex items-center gap-1.5 group">
          <div class="flex items-center">
            <span class="text-3xl sm:text-4xl font-black italic tracking-tighter text-lime-400 drop-shadow-[0_0_12px_rgba(183,243,74,0.4)] transition group-hover:scale-105">
              365
            </span>
            <span class="ml-1 text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Sports
            </span>
          </div>
          <!-- Live pulse dot -->
          <span class="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse ml-0.5"></span>
        </NuxtLink>

        <!-- ================= DESKTOP NAVIGATION ================= -->
        <ul class="hidden items-center gap-6 md:flex lg:gap-8">
          <li v-for="link in navLinks" :key="link.path">
            <NuxtLink
              :to="link.path"
              class="group relative inline-flex items-center px-1 py-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors duration-200"
              :class="
                isActive(link.path)
                  ? 'text-lime-400'
                  : 'text-gray-300 hover:text-white'
              "
            >
              <span>{{ link.name }}</span>
              <!-- Modern Lime Underline Indicator -->
              <span
                class="absolute -bottom-1 left-0 h-[2.5px] w-full rounded-full bg-lime-400 shadow-[0_0_8px_#b7f34a] transition-all duration-300 ease-out"
                :class="
                  isActive(link.path)
                    ? 'scale-x-100 opacity-100'
                    : 'scale-x-0 opacity-0 group-hover:scale-x-60 group-hover:opacity-70'
                "
              ></span>
            </NuxtLink>
          </li>
        </ul>

        <!-- ================= QUICK SEARCH BAR BUTTON (DESKTOP) ================= -->
        <div class="hidden lg:flex items-center flex-1 max-w-xs mx-4">
          <button
            type="button"
            @click="openSearch()"
            class="w-full flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs text-gray-400 transition hover:border-lime-400/50 hover:bg-white/10 hover:text-gray-200 group"
          >
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-lime-400 group-hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span>Search shoes, apparel...</span>
            </div>
            <kbd class="rounded border border-white/15 bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-gray-400">Ctrl K</kbd>
          </button>
        </div>

        <!-- ================= RIGHT ACTIONS ================= -->
        <div class="flex items-center gap-3 sm:gap-4">
          <!-- Mobile / Tablet Search Icon -->
          <button
            type="button"
            @click="openSearch()"
            class="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:border-lime-400 hover:text-white"
            title="Search catalog"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          <!-- Compare Tray Trigger (Shows if items added) -->
          <button
            v-if="compareCount > 0"
            type="button"
            @click="openCompareModal"
            class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-lime-400/40 bg-lime-400/10 text-lime-400 shadow-[0_0_12px_rgba(183,243,74,0.2)] transition hover:scale-105 active:scale-95"
            title="Open product comparison"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            <span class="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-lime-400 px-1 text-[10px] font-black text-black">
              {{ compareCount }}
            </span>
          </button>

          <!-- Wishlist Link -->
          <NuxtLink
            to="/Wishlist"
            class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:border-white/30 hover:text-white"
            title="My Wishlist"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span
              v-if="wishlistCount > 0"
              class="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white"
            >
              {{ wishlistCount }}
            </span>
          </NuxtLink>

          <!-- Slide-over Cart Trigger Button -->
          <button
            type="button"
            @click="openCartDrawer"
            class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:border-lime-400 hover:text-lime-300 active:scale-95"
            title="Shopping Bag"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span
              v-if="cartCount > 0"
              class="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-lime-400 px-1 text-[10px] font-black text-black shadow-[0_0_8px_#b7f34a]"
            >
              {{ cartCount }}
            </span>
          </button>

          <!-- Superadmin Console Fast Jump Pill -->
          <NuxtLink
            v-if="user && isSuperAdmin"
            to="/admin"
            class="hidden xl:inline-flex items-center gap-1.5 rounded-xl border border-lime-400/40 bg-lime-400/10 px-3 py-1.5 text-xs font-bold text-lime-400 transition hover:bg-lime-400 hover:text-black"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            <span>Admin</span>
          </NuxtLink>

          <!-- User Account Menu -->
          <template v-if="user">
            <div class="relative" @click.stop>
              <button
                type="button"
                @click="toggleAccountMenu"
                class="flex items-center gap-2 rounded-full p-0.5 border border-white/20 transition hover:border-lime-400 active:scale-95"
                :title="user.name"
              >
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 text-black text-xs font-black">
                  {{ user.name.charAt(0).toUpperCase() }}
                </span>
              </button>

              <!-- Account Dropdown Menu (Cyber Dark Theme) -->
              <Transition name="account-menu">
                <div
                  v-if="isAccountMenuOpen"
                  class="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/15 bg-[#0d1017]/95 p-5 text-left shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
                >
                  <div class="flex items-center gap-3 pb-4 border-b border-white/10">
                    <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-400 text-black text-lg font-black shadow-[0_0_12px_rgba(183,243,74,0.4)]">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <strong class="text-sm font-bold text-white truncate">{{ user.name }}</strong>
                        <span v-if="isSuperAdmin" class="rounded bg-lime-400/20 text-lime-400 px-1.5 py-0.5 text-[9px] font-black uppercase">Admin</span>
                      </div>
                      <p class="text-xs text-gray-400 truncate mt-0.5">{{ user.email }}</p>
                    </div>
                  </div>

                  <!-- Admin Console Link for Superadmins -->
                  <div v-if="isSuperAdmin" class="mt-3">
                    <NuxtLink
                      to="/admin"
                      @click="closeAccountMenu"
                      class="flex items-center justify-between rounded-xl bg-lime-400/10 border border-lime-400/30 p-2.5 text-xs font-bold text-lime-400 hover:bg-lime-400 hover:text-black transition"
                    >
                      <span class="flex items-center gap-2">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                        </svg>
                        <span>Open Admin Console</span>
                      </span>
                      <span>&rarr;</span>
                    </NuxtLink>
                  </div>

                  <!-- Menu Links -->
                  <div class="mt-3 space-y-1 text-xs">
                    <NuxtLink
                      to="/Profile"
                      @click="closeAccountMenu"
                      class="block rounded-lg px-3 py-2 font-medium text-gray-300 hover:bg-white/10 hover:text-white transition"
                    >
                      Profile & Membership
                    </NuxtLink>
                    <NuxtLink
                      to="/Wishlist"
                      @click="closeAccountMenu"
                      class="block rounded-lg px-3 py-2 font-medium text-gray-300 hover:bg-white/10 hover:text-white transition"
                    >
                      My Saved Wishlist ({{ wishlistCount }})
                    </NuxtLink>
                    <NuxtLink
                      to="/Cart"
                      @click="closeAccountMenu"
                      class="block rounded-lg px-3 py-2 font-medium text-gray-300 hover:bg-white/10 hover:text-white transition"
                    >
                      Shopping Cart ({{ cartCount }})
                    </NuxtLink>

                    <button
                      type="button"
                      @click="logout(); closeAccountMenu()"
                      class="w-full text-left rounded-lg px-3 py-2 font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition mt-2 border-t border-white/10 pt-2.5"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>

          <NuxtLink
            v-else
            to="/Auth/Login"
            class="hidden sm:inline-flex items-center justify-center rounded-xl bg-lime-400 px-5 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_15px_rgba(183,243,74,0.4)] active:scale-95"
          >
            Login
          </NuxtLink>

          <!-- Mobile Menu Hamburger -->
          <button
            type="button"
            @click="toggleMobileMenu"
            class="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white"
            title="Toggle Menu"
          >
            <svg
              class="h-6 w-6 transition-transform duration-200"
              :class="{ 'rotate-90 text-lime-400': isMobileMenuOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      <Transition name="mobile-menu">
        <div
          v-if="isMobileMenuOpen"
          class="border-t border-white/10 py-4 md:hidden space-y-3"
        >
          <!-- Mobile Quick Search -->
          <button
            type="button"
            @click="openSearch(); closeMobileMenu()"
            class="w-full flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-gray-400"
          >
            <span class="flex items-center gap-2">
              <svg class="h-4 w-4 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span>Search products...</span>
            </span>
            <span class="text-lime-400 font-bold">Search</span>
          </button>

          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              @click="closeMobileMenu"
              class="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold transition"
              :class="
                isActive(link.path)
                  ? 'border-l-4 border-lime-400 bg-lime-400/10 text-lime-400'
                  : 'text-gray-300 hover:bg-white/5'
              "
            >
              <span>{{ link.name }}</span>
              <span v-if="isActive(link.path)" class="h-1.5 w-1.5 rounded-full bg-lime-400"></span>
            </NuxtLink>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <NuxtLink
              to="/Wishlist"
              @click="closeMobileMenu"
              class="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-gray-300"
            >
              <span>Wishlist</span>
              <span v-if="wishlistCount > 0" class="rounded-full bg-red-500 px-1.5 text-[10px] text-white">
                {{ wishlistCount }}
              </span>
            </NuxtLink>

            <button
              type="button"
              @click="openCartDrawer(); closeMobileMenu()"
              class="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-gray-300"
            >
              <span>Bag</span>
              <span v-if="cartCount > 0" class="rounded-full bg-lime-400 px-1.5 text-[10px] text-black font-black">
                {{ cartCount }}
              </span>
            </button>
          </div>

          <div class="pt-2 border-t border-white/10">
            <template v-if="user">
              <NuxtLink
                v-if="isSuperAdmin"
                to="/admin"
                @click="closeMobileMenu"
                class="flex items-center justify-between rounded-xl bg-lime-400/10 border border-lime-400/30 p-3 text-xs font-bold text-lime-400 mb-2"
              >
                <span>Admin Console</span>
                <span>&rarr;</span>
              </NuxtLink>

              <NuxtLink
                to="/Profile"
                @click="closeMobileMenu"
                class="block rounded-xl bg-white/10 px-4 py-2.5 text-center text-xs font-bold text-white mb-2"
              >
                My Account
              </NuxtLink>

              <button
                type="button"
                @click="logout(); closeMobileMenu()"
                class="w-full rounded-xl py-2 text-center text-xs font-bold text-red-400 hover:bg-red-500/10"
              >
                Log Out
              </button>
            </template>

            <NuxtLink
              v-else
              to="/Auth/Login"
              @click="closeMobileMenu"
              class="block rounded-xl bg-lime-400 px-4 py-2.5 text-center text-xs font-black uppercase text-black"
            >
              Login to 365 Sports
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<style scoped>
.account-menu-enter-active,
.account-menu-leave-active {
  transition: opacity 180ms ease, transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;
}

.account-menu-enter-from,
.account-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
