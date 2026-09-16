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

        <ul class="hidden items-center gap-8 md:flex lg:gap-10">
          <!-- Home -->

          <li>
            <NuxtLink
              to="/"
              class="rounded-full px-4 py-2 font-semibold text-gray-700 transition duration-300 hover:bg-lime-100 hover:text-black"
              active-class="bg-black text-white hover:bg-black hover:text-white"
            >
              Home
            </NuxtLink>
          </li>

          <!-- Product -->

          <li>
            <NuxtLink
              to="/Product"
              class="rounded-full px-4 py-2 font-semibold text-gray-700 transition duration-300 hover:bg-lime-100 hover:text-black"
              active-class="bg-black text-white hover:bg-black hover:text-white"
            >
              Product
            </NuxtLink>
          </li>

          <!-- About -->

          <li>
            <NuxtLink
              to="/About"
              class="rounded-full px-4 py-2 font-semibold text-gray-700 transition duration-300 hover:bg-lime-100 hover:text-black"
              active-class="bg-black text-white hover:bg-black hover:text-white"
            >
              About
            </NuxtLink>
          </li>

          <!-- Contact -->

          <li>
            <NuxtLink
              to="/Contact"
              class="rounded-full px-4 py-2 font-semibold text-gray-700 transition duration-300 hover:bg-lime-100 hover:text-black"
              active-class="bg-black text-white hover:bg-black hover:text-white"
            >
              Contact
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

          <!-- ================================= -->
          <!-- Account -->
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
                    class="mt-6 flex items-center gap-4"
                    role="menuitem"
                  >
                    <span
                      class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-lime-300 via-emerald-500 to-slate-900 text-xl font-bold text-white"
                    >
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                    <span class="min-w-0">
                      <strong
                        class="block truncate text-xl font-bold text-gray-950"
                        >{{ user.name }}</strong
                      >
                      <span class="mt-1 block text-lg text-gray-500"
                        >Personal</span
                      >
                      <span class="block truncate text-lg text-gray-500">{{
                        user.email
                      }}</span>
                    </span>
                  </NuxtLink>

                  <button
                    type="button"
                    class="mt-6 text-xl font-semibold text-gray-950 hover:text-lime-600"
                    role="menuitem"
                  >
                    Convert to business
                  </button>

                  <p class="mt-8 text-base text-gray-600">Your accounts</p>

                  <button
                    type="button"
                    class="mt-6 block text-xl font-semibold text-gray-950 hover:text-lime-600"
                    role="menuitem"
                  >
                    Add 365 Sport account
                  </button>

                  <button
                    type="button"
                    class="mt-6 block text-xl font-semibold text-gray-950 hover:text-red-600"
                    role="menuitem"
                    @click="logout"
                  >
                    Log out
                  </button>
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
              to="/"
              class="rounded-lg px-4 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-100"
              @click="closeMobileMenu"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/Product"
              class="rounded-lg px-4 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-100"
              @click="closeMobileMenu"
            >
              Product
            </NuxtLink>
            <NuxtLink
              to="/About"
              class="rounded-lg px-4 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-100"
              @click="closeMobileMenu"
            >
              About
            </NuxtLink>
            <NuxtLink
              to="/Contact"
              class="rounded-lg px-4 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-100"
              @click="closeMobileMenu"
            >
              Contact
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
