<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useWishlist } from "~/composables/useWishlist";
import { useCart } from "~/composables/useCart";
import { useAuth } from "~/composables/useAuth";
import { useRoute } from "vue-router";

const { wishlistCount } = useWishlist();
const { cartCount } = useCart();
const { user, loadUser, logout } = useAuth();
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
    class="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07090e]/80 backdrop-blur-xl shadow-lg transition-colors"
  >
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-4 sm:gap-6 lg:gap-8">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center group">
          <h1 class="flex items-baseline font-black italic leading-none">
            <span class="text-4xl tracking-tighter text-lime-400 drop-shadow-[0_0_15px_rgba(183,243,74,0.4)] transition group-hover:scale-105 sm:text-5xl">
              365
            </span>
            <span class="ml-1 text-2xl tracking-tight text-white transition group-hover:text-lime-300">
              Sports
            </span>
          </h1>
        </NuxtLink>

        <!-- Desktop Menu -->
        <ul class="hidden items-center gap-7 md:flex lg:gap-9">
          <li v-for="link in navLinks" :key="link.path">
            <NuxtLink
              :to="link.path"
              class="group relative inline-flex items-center px-1 py-2 text-sm font-bold tracking-wide transition-colors duration-200 lg:text-base"
              :class="
                isActive(link.path)
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              "
            >
              <span>{{ link.name }}</span>
              <!-- Modern Lime Glowing Underline -->
              <span
                class="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-lime-400 shadow-[0_0_8px_#b7f34a] transition-all duration-250 ease-out"
                :class="
                  isActive(link.path)
                    ? 'scale-x-100 opacity-100'
                    : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-60'
                "
              ></span>
            </NuxtLink>
          </li>
        </ul>

        <!-- Right Icons -->
        <div class="hidden items-center gap-5 sm:flex">
          <!-- Wishlist -->
          <NuxtLink
            to="/Wishlist"
            class="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-white/10 transition"
            title="Wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-300 transition duration-300 group-hover:scale-110 group-hover:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span
              v-if="wishlistCount > 0"
              class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-black text-white shadow-md"
            >
              {{ wishlistCount }}
            </span>
          </NuxtLink>

          <!-- Cart -->
          <NuxtLink
            to="/Cart"
            class="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-white/10 transition"
            title="Shopping Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-300 transition duration-300 group-hover:scale-110 group-hover:text-lime-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <span
              v-if="cartCount > 0"
              class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-400 px-1 text-[11px] font-black text-black shadow-md shadow-lime-400/30"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>

          <!-- Account -->
          <template v-if="user">
            <div class="relative" @click.stop>
              <button
                type="button"
                class="flex items-center gap-2 rounded-full transition hover:opacity-80"
                title="Open account menu"
                :aria-expanded="isAccountMenuOpen"
                @click="toggleAccountMenu"
              >
                <span
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-lime-300 via-emerald-500 to-slate-900 text-sm font-black text-black ring-2 ring-lime-400 shadow-md"
                >
                  {{ user.name.charAt(0).toUpperCase() }}
                </span>
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isAccountMenuOpen }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>

              <Transition name="account-menu">
                <div
                  v-if="isAccountMenuOpen"
                  class="absolute right-0 top-14 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/15 bg-[#0e111a] p-6 text-left shadow-2xl backdrop-blur-2xl"
                  role="menu"
                >
                  <p class="text-xs uppercase font-bold text-gray-400">Signed In As</p>
                  <NuxtLink to="/Profile" class="mt-4 flex items-center gap-3" role="menuitem">
                    <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-600 text-lg font-black text-black">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                    <span class="min-w-0">
                      <strong class="block truncate text-base font-bold text-white">{{ user.name }}</strong>
                      <span class="block truncate text-xs text-gray-400">{{ user.email }}</span>
                    </span>
                  </NuxtLink>

                  <div class="mt-6 pt-4 border-t border-white/10 space-y-2">
                    <NuxtLink to="/Profile" class="block text-sm font-semibold text-gray-300 hover:text-lime-400 transition">
                      Your Profile & Orders
                    </NuxtLink>
                    <button
                      type="button"
                      class="block w-full text-left text-sm font-semibold text-red-400 hover:text-red-300 transition pt-2"
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
            class="rounded-full bg-lime-400 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black transition duration-300 hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(183,243,74,0.4)] hover:scale-105 active:scale-95"
          >
            Login
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          type="button"
          class="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
          title="Open navigation menu"
          :aria-expanded="isMobileMenuOpen"
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
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mobile Dropdown -->
      <Transition name="mobile-menu">
        <div
          v-if="isMobileMenuOpen"
          id="mobile-navigation"
          class="border-t border-white/10 py-4 md:hidden bg-[#07090e]/95 backdrop-blur-2xl"
        >
          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="flex items-center justify-between rounded-lg px-4 py-3 text-base font-bold transition-all duration-200"
              :class="
                isActive(link.path)
                  ? 'border-l-4 border-lime-400 bg-white/5 text-lime-400'
                  : 'text-gray-300 hover:bg-white/5'
              "
              @click="closeMobileMenu"
            >
              <span>{{ link.name }}</span>
              <span v-if="isActive(link.path)" class="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_8px_#b7f34a]"></span>
            </NuxtLink>
          </div>

          <div class="mt-4 flex items-center gap-3 border-t border-white/10 px-4 pt-4">
            <NuxtLink
              to="/Wishlist"
              class="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-center text-xs font-bold text-white"
              @click="closeMobileMenu"
            >
              Wishlist <span v-if="wishlistCount > 0" class="text-red-400">({{ wishlistCount }})</span>
            </NuxtLink>
            <NuxtLink
              to="/Cart"
              class="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-center text-xs font-bold text-white"
              @click="closeMobileMenu"
            >
              Cart <span v-if="cartCount > 0" class="text-lime-400">({{ cartCount }})</span>
            </NuxtLink>
          </div>

          <div class="mt-4 border-t border-white/10 px-4 pt-4">
            <template v-if="user">
              <NuxtLink
                to="/Profile"
                class="block rounded-xl bg-lime-400 px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-black"
                @click="closeMobileMenu"
              >
                Profile: {{ user.name }}
              </NuxtLink>
              <button
                type="button"
                class="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-xs font-bold text-red-400"
                @click="logout(); closeMobileMenu();"
              >
                Log out
              </button>
            </template>
            <NuxtLink
              v-else
              to="/Auth/Login"
              class="block rounded-xl bg-lime-400 px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/20"
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
  transition: opacity 180ms ease, transform 180ms ease;
  transform-origin: top right;
}
.account-menu-enter-from,
.account-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
  transform-origin: top;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
