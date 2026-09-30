<script setup lang="ts">
import { onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useWishlist } from "~/composables/useWishlist";
import { useCart } from "~/composables/useCart";
import RecentlyViewed from "~/components/RecentlyViewed.vue";

definePageMeta({
  layout: "user",
});

const { user, loadUser, logout, isSuperAdmin } = useAuth();
const { wishlistCount } = useWishlist();
const { cartCount } = useCart();

onMounted(loadUser);
</script>

<template>
  <main class="min-h-screen py-10 text-white">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb / Back -->
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition"
        >
          <span>&larr; Return to Store</span>
        </NuxtLink>

        <span class="inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-3.5 py-1 text-xs font-bold text-lime-400">
          <span class="h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
          365 Member Hub
        </span>
      </div>

      <!-- Logged In State -->
      <div v-if="user" class="space-y-6">
        <!-- Profile Banner Card -->
        <div class="rounded-3xl border border-white/10 bg-[#0d1017]/85 p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-white/10">
            <div class="flex items-center gap-4">
              <div
                class="flex h-18 w-18 items-center justify-center rounded-2xl bg-lime-400 text-3xl font-black text-black shadow-[0_0_20px_rgba(183,243,74,0.4)]"
              >
                {{ user.name.charAt(0).toUpperCase() }}
              </div>

              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-2xl sm:text-3xl font-black text-white">{{ user.name }}</h1>
                  <span
                    v-if="isSuperAdmin"
                    class="rounded-md bg-lime-400/20 border border-lime-400/40 px-2 py-0.5 text-[10px] font-black uppercase text-lime-400"
                  >
                    Superadmin
                  </span>
                </div>
                <p class="text-xs text-gray-400 mt-0.5">{{ user.email }}</p>
                <div class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-bold text-lime-300">
                  <span>🏆 Gold Athletic Member</span>
                  <span>•</span>
                  <span>450 Club Points</span>
                </div>
              </div>
            </div>

            <!-- Sign Out Button -->
            <button
              type="button"
              @click="logout"
              class="self-start sm:self-auto rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              Sign Out
            </button>
          </div>

          <!-- Quick Navigation Hub -->
          <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <NuxtLink
              to="/Cart"
              class="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-lime-400/50 hover:bg-white/10 transition group"
            >
              <span class="text-xl">🛍️</span>
              <p class="mt-2 font-black text-white group-hover:text-lime-400 transition">Shopping Bag</p>
              <p class="text-[11px] text-gray-400">{{ cartCount }} items in bag</p>
            </NuxtLink>

            <NuxtLink
              to="/Wishlist"
              class="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-lime-400/50 hover:bg-white/10 transition group"
            >
              <span class="text-xl">❤️</span>
              <p class="mt-2 font-black text-white group-hover:text-lime-400 transition">Saved Wishlist</p>
              <p class="text-[11px] text-gray-400">{{ wishlistCount }} saved gear</p>
            </NuxtLink>

            <NuxtLink
              to="/Product"
              class="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-lime-400/50 hover:bg-white/10 transition group"
            >
              <span class="text-xl">👟</span>
              <p class="mt-2 font-black text-white group-hover:text-lime-400 transition">Store Catalog</p>
              <p class="text-[11px] text-gray-400">Explore gear</p>
            </NuxtLink>

            <NuxtLink
              v-if="isSuperAdmin"
              to="/admin"
              class="rounded-2xl border border-lime-400/30 bg-lime-400/10 p-4 hover:bg-lime-400 hover:text-black transition group text-lime-400"
            >
              <span class="text-xl">⚡</span>
              <p class="mt-2 font-black group-hover:text-black transition">Admin Console</p>
              <p class="text-[11px] group-hover:text-black/80">Manage store</p>
            </NuxtLink>

            <NuxtLink
              v-else
              to="/contact"
              class="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-lime-400/50 hover:bg-white/10 transition group"
            >
              <span class="text-xl">💬</span>
              <p class="mt-2 font-black text-white group-hover:text-lime-400 transition">Support</p>
              <p class="text-[11px] text-gray-400">Help & FAQs</p>
            </NuxtLink>
          </div>

          <!-- Account Details List -->
          <div class="mt-6 border-t border-white/10 pt-6">
            <h3 class="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">Account Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span class="text-[10px] text-gray-500 font-bold uppercase">Full Name</span>
                <p class="mt-0.5 font-bold text-white">{{ user.name }}</p>
              </div>

              <div class="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span class="text-[10px] text-gray-500 font-bold uppercase">Email Address</span>
                <p class="mt-0.5 font-bold text-white">{{ user.email }}</p>
              </div>

              <div class="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span class="text-[10px] text-gray-500 font-bold uppercase">Membership Tier</span>
                <p class="mt-0.5 font-bold text-lime-400">VIP Pro Athlete (Tier 3)</p>
              </div>

              <div class="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span class="text-[10px] text-gray-500 font-bold uppercase">Instant Checkout Access</span>
                <p class="mt-0.5 font-bold text-emerald-400">✓ Bakong KHQR Enabled</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recently Viewed Gear in Profile -->
        <RecentlyViewed />
      </div>

      <!-- Guest State -->
      <div
        v-else
        class="rounded-3xl border border-white/10 bg-[#0d1017]/85 p-12 text-center shadow-xl backdrop-blur-2xl"
      >
        <span class="text-5xl">🔐</span>
        <h1 class="mt-4 text-2xl font-black text-white">
          Sign In to Access 365 Member Hub
        </h1>
        <p class="mt-2 text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
          View your order history, saved favorites, member-only discounts, and personalized gear recommendations.
        </p>

        <div class="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <NuxtLink
            to="/Auth/Login"
            class="rounded-xl bg-lime-400 px-8 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-lime-300 transition"
          >
            Sign In Now
          </NuxtLink>

          <NuxtLink
            to="/Auth/Register"
            class="rounded-xl border border-white/20 bg-white/10 px-8 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-white/20 transition"
          >
            Create Free Account
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>
