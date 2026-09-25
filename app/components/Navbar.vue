<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

// ===============================================
// Wishlist
// ===============================================

const { wishlistCount } = useWishlist();

// ===============================================
// Cart
// ===============================================

const { cartCount } = useCart();
const { user, loadUser, logout, isSuperAdmin } = useAuth();
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
  { name: "Product", path: "/Product" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const isActive = (path: string) => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.toLowerCase().startsWith(path.toLowerCase());
};

onMounted(loadUser);
onMounted(() => document.addEventListener("click", closeAccountMenu));
onBeforeUnmount(() => document.removeEventListener("click", closeAccountMenu));
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-black/10 bg-white/95 backdrop-blur"
  >
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        class="flex h-16 items-center justify-between gap-4 sm:gap-6 lg:gap-8"
      >
        <!-- ===================================== -->
        <!-- Logo -->
        <!-- ===================================== -->

        <NuxtLink to="/" class="flex items-center">
          <h1 class="flex items-baseline font-black italic leading-none">
            <span class="text-4xl tracking-tighter text-lime-500 sm:text-5xl">
              365
            </span>

            <span class="ml-1 text-2xl tracking-tight text-black">
              Sports
            </span>
          </h1>
        </NuxtLink>

        <!-- ===================================== -->
        <!-- Desktop Menu -->
        <!-- ===================================== -->

        <ul class="hidden items-center gap-7 md:flex lg:gap-9">
          <li v-for="link in navLinks" :key="link.path">
            <NuxtLink
              :to="link.path"
              class="group relative inline-flex items-center px-1 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 lg:text-base"
              :class="
                isActive(link.path)
                  ? 'font-bold text-black'
                  : 'text-gray-600 hover:text-black'
              "
            >
              <span>{{ link.name }}</span>
              <!-- Modern Lime Underline Indicator -->
              <span
                class="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-lime-500 transition-all duration-250 ease-out"
                :class="
                  isActive(link.path)
                    ? 'scale-x-100 opacity-100'
                    : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-60'
                "
              ></span>
            </NuxtLink>
          </li>
        </ul>

        <!-- ===================================== -->
        <!-- Right Icons -->
        <!-- ===================================== -->

        <div class="hidden items-center gap-5 sm:flex">
          <!-- ================================= -->
          <!-- Search -->
          <!-- ================================= -->
<!-- 
          <button class="group" title="Search">
            <img
              class="h-6 w-6 transition duration-300 group-hover:scale-110"
              src="https://img.icons8.com/?size=100&id=132&format=png&color=000000"
              alt="Search"
            />
          </button> -->

          <!-- ================================= -->
          <!-- Wishlist -->
          <!-- ================================= -->

          <NuxtLink
            to="/Wishlist"
            class="group relative flex items-center justify-center"
            title="Wishlist"
          >
            <img
              class="h-6 w-6 transition duration-300 group-hover:scale-110"
              src="https://img.icons8.com/?size=100&id=glkpNAGhoITn&format=png&color=000000"
              alt="Wishlist"
            />

            <!-- Wishlist Count -->

            <span
              v-if="wishlistCount > 0"
              class="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white"
            >
              {{ wishlistCount }}
            </span>
          </NuxtLink>

          <!-- ================================= -->
          <!-- Cart -->
          <!-- ================================= -->

          <NuxtLink to="/Cart" class="group relative" title="Cart">
            <img
              class="h-6 w-6 transition duration-300 group-hover:scale-110"
              src="https://img.icons8.com/?size=100&id=9671&format=png&color=000000"
              alt="Cart"
            />

            <!-- Cart Count -->

            <span
              v-if="cartCount > 0"
              class="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>

          <!-- Extra Logo to switch to Admin (authorized superadmin) -->
          <NuxtLink
            v-if="user && isSuperAdmin"
            to="/admin"
            class="group flex items-center gap-1.5 rounded-full bg-black px-3.5 py-1.5 text-xs font-semibold text-white transition duration-200 hover:bg-lime-400 hover:text-black"
            title="Admin Console"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            <span>Admin</span>
          </NuxtLink>

          <!-- ================================= -->
          <!-- Account (Standard Profile Logo) -->
          <!-- ================================= -->

          <template v-if="user">
            <div class="relative" @click.stop>
              <button
                type="button"
                class="flex items-center gap-2 rounded-full transition hover:opacity-80"
                title="Open account menu"
                :aria-expanded="isAccountMenuOpen"
                aria-haspopup="menu"
                @click="toggleAccountMenu"
              >
                <span
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-lime-300 via-emerald-500 to-slate-900 text-sm font-bold text-white ring-2 ring-white"
                >
                  {{ user.name.charAt(0).toUpperCase() }}
                </span>
                <span
                  class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 transition-transform duration-200"
                    :class="{ 'rotate-180': isAccountMenuOpen }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                </span>
              </button>

              <Transition name="account-menu">
                <div
                  v-if="isAccountMenuOpen"
                  class="absolute right-0 top-14 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-8 text-left shadow-[0_8px_30px_rgba(0,0,0,0.14)] ring-1 ring-black/5"
                  role="menu"
                >
                  <p class="text-base text-gray-600">Currently in</p>

                  <NuxtLink
                    to="/Profile"
                    class="mt-6 flex items-center gap-4 group"
                    role="menuitem"
                  >
                    <span
                      class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-lime-300 via-emerald-500 to-slate-900 text-xl font-bold text-white shadow-xs"
                    >
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                    <span class="min-w-0">
                      <span class="flex items-center gap-2">
                        <strong
                          class="block truncate text-lg font-bold text-gray-950 group-hover:text-lime-600 transition"
                          >{{ user.name }}</strong
                        >
                        <span
                          v-if="isSuperAdmin"
                          class="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime-400"
                        >
                          Admin
                        </span>
                      </span>
                      <span class="mt-0.5 block text-sm text-gray-500">
                        {{ user.email }}
                      </span>
                    </span>
                  </NuxtLink>

                  <!-- Admin Management Link (Clean, authentic SaaS style) -->
                  <div v-if="isSuperAdmin" class="mt-6 border-t border-gray-100 pt-5">
                    <NuxtLink
                      to="/admin"
                      class="flex items-center justify-between rounded-xl bg-gray-50 p-3.5 border border-gray-200/70 hover:bg-gray-100 hover:border-gray-300 transition group"
                      role="menuitem"
                    >
                      <div class="flex items-center gap-3">
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-lime-400 group-hover:scale-105 transition">
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                          </svg>
                        </div>
                        <div class="text-left">
                          <p class="text-sm font-bold text-gray-900 leading-tight">Admin Console</p>
                          <p class="text-xs text-gray-500 leading-tight mt-0.5">Manage orders, products & store</p>
                        </div>
                      </div>
                      <svg class="h-4 w-4 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </NuxtLink>
                  </div>

                  <div class="mt-6 border-t border-gray-100 pt-4 space-y-3">
                    <NuxtLink
                      to="/Profile"
                      class="block text-base font-medium text-gray-700 hover:text-black transition"
                      role="menuitem"
                    >
                      Account settings
                    </NuxtLink>

                    <button
                      type="button"
                      class="block w-full text-left text-base font-medium text-gray-700 hover:text-black transition"
                      role="menuitem"
                    >
                      Convert to business
                    </button>

                    <button
                      type="button"
                      class="block w-full text-left text-base font-semibold text-red-600 hover:text-red-700 transition pt-2"
                      role="menuitem"
                      @click="logout"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>

          <NuxtLink
            v-else
            to="/Auth/Login"
            class="rounded-full bg-black px-5 py-2.5 font-semibold text-white transition duration-300 hover:bg-lime-400 hover:text-black"
          >
            Login
          </NuxtLink>
        </div>

        <!-- ===================================== -->
        <!-- Mobile Menu Button -->
        <!-- ===================================== -->

        <button
          type="button"
          class="rounded-lg p-2 hover:bg-gray-100 md:hidden"
          title="Open navigation menu"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-navigation"
          @click="toggleMobileMenu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 transition-transform duration-200"
            :class="{ 'rotate-90': isMobileMenuOpen }"
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

      <Transition name="mobile-menu">
        <div
          v-if="isMobileMenuOpen"
          id="mobile-navigation"
          class="border-t border-gray-100 py-4 md:hidden"
        >
          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold transition-all duration-200"
              :class="
                isActive(link.path)
                  ? 'border-l-4 border-lime-500 bg-lime-50/80 font-bold text-black'
                  : 'text-gray-700 hover:bg-gray-100'
              "
              @click="closeMobileMenu"
            >
              <span>{{ link.name }}</span>
              <span
                v-if="isActive(link.path)"
                class="h-2 w-2 rounded-full bg-lime-500"
              ></span>
            </NuxtLink>
          </div>

          <div
            class="mt-3 flex items-center gap-3 border-t border-gray-100 px-4 pt-4"
          >
            <NuxtLink
              to="/Wishlist"
              class="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-center text-sm font-semibold text-gray-800"
              @click="closeMobileMenu"
            >
              Wishlist<span v-if="wishlistCount > 0">
                ({{ wishlistCount }})</span
              >
            </NuxtLink>
            <NuxtLink
              to="/Cart"
              class="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-center text-sm font-semibold text-gray-800"
              @click="closeMobileMenu"
            >
              Cart<span v-if="cartCount > 0"> ({{ cartCount }})</span>
            </NuxtLink>
          </div>

          <div class="mt-3 border-t border-gray-100 px-4 pt-4">
            <template v-if="user">
              <!-- Switch to Admin Console in mobile menu -->
              <NuxtLink
                v-if="isSuperAdmin"
                to="/admin"
                class="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-200 transition mb-2"
                @click="closeMobileMenu"
              >
                <span class="flex items-center gap-2.5">
                  <svg class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  <span>Admin Console</span>
                </span>
                <span class="text-xs text-gray-400">Manage →</span>
              </NuxtLink>

              <NuxtLink
                to="/Profile"
                class="block rounded-lg bg-black px-4 py-3 text-center font-semibold text-white"
                @click="closeMobileMenu"
              >
                View profile
              </NuxtLink>
              <button
                type="button"
                class="mt-2 w-full rounded-lg px-4 py-3 text-center font-semibold text-gray-600 hover:bg-gray-100"
                @click="
                  logout();
                  closeMobileMenu();
                "
              >
                Log out
              </button>
            </template>
            <NuxtLink
              v-else
              to="/Auth/Login"
              class="block rounded-lg bg-black px-4 py-3 text-center font-semibold text-white"
              @click="closeMobileMenu"
            >
              Login
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
  transition:
    opacity 180ms ease,
    transform 180ms ease;
  transform-origin: top right;
}

.account-menu-enter-from,
.account-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
  transform-origin: top;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
