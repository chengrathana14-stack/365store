<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "user",
});

const route = useRoute();
const { user, loadUser, logout, isSuperAdmin } = useAuth();

onMounted(loadUser);
</script>

<template>
  <main class="min-h-[70vh] px-4 py-12 sm:px-6">
    <div class="mx-auto max-w-2xl">
      <!-- Unauthorized Admin Alert Banner -->
      <div
        v-if="route.query.unauthorized === 'admin'"
        class="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-xl"
      >
        <div class="flex items-start gap-3">
          <span class="text-2xl">🔒</span>
          <div>
            <h2 class="text-sm font-black uppercase tracking-wider text-amber-400">
              Admin Access Restricted
            </h2>
            <p class="mt-1 text-xs text-gray-300">
              The Admin Dashboard is strictly reserved for the authorized administrator account (<strong class="text-white">chengrathana14@gmail.com</strong>). Your current account is registered under standard Customer role.
            </p>
          </div>
        </div>
      </div>

      <!-- Logged In User Card -->
      <div
        v-if="user"
        class="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0e111a]/85 p-8 shadow-2xl backdrop-blur-2xl"
      >
        <!-- Background Glow Ambient -->
        <div
          class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
          :class="isSuperAdmin ? 'bg-lime-500/15' : 'bg-emerald-500/10'"
        ></div>

        <!-- Profile Header -->
        <div class="flex items-center gap-5 border-b border-white/10 pb-6">
          <div
            class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl font-black text-black shadow-lg"
            :class="isSuperAdmin ? 'from-lime-300 via-lime-400 to-emerald-500 shadow-lime-400/20' : 'from-gray-200 to-gray-400'"
          >
            {{ user.name.charAt(0).toUpperCase() }}
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span
                class="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider"
                :class="
                  isSuperAdmin
                    ? 'bg-lime-400 text-black shadow-[0_0_10px_rgba(183,243,74,0.4)]'
                    : 'bg-white/10 text-gray-300'
                "
              >
                {{ isSuperAdmin ? '👑 Superadmin (Dual Role)' : 'Athlete Member' }}
              </span>
            </div>
            <h1 class="mt-1 truncate text-2xl font-black italic tracking-tight text-white sm:text-3xl">
              {{ user.name }}
            </h1>
            <p class="text-xs text-gray-400 truncate">{{ user.email }}</p>
          </div>
        </div>

        <!-- Dual Role Admin Switcher Card (ONLY for chengrathana14@gmail.com) -->
        <div
          v-if="isSuperAdmin"
          class="mt-6 rounded-2xl border border-lime-400/30 bg-gradient-to-br from-lime-400/15 via-emerald-500/5 to-transparent p-5"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="flex h-2 w-2 rounded-full bg-lime-400 animate-ping"></span>
                <span class="text-xs font-black uppercase tracking-wider text-lime-400">
                  Dual Role Permissions Active
                </span>
              </div>
              <p class="mt-1 text-xs text-gray-300">
                You have dual access to both the <strong>Storefront Shopping Experience</strong> and the <strong>Admin Management System</strong>.
              </p>
            </div>

            <NuxtLink
              to="/admin"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/25 transition hover:bg-lime-300 hover:scale-105 active:scale-95 shrink-0"
            >
              <span>⚡ Switch to Admin</span>
              <span>→</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Account Attributes Detail List -->
        <dl class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <dt class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Account Email</dt>
            <dd class="mt-1 font-semibold text-white truncate">{{ user.email }}</dd>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <dt class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Account Role</dt>
            <dd class="mt-1 flex items-center gap-2 font-bold" :class="isSuperAdmin ? 'text-lime-400' : 'text-emerald-400'">
              <span>{{ isSuperAdmin ? 'Admin + Customer (Dual Role)' : 'Customer (User Role)' }}</span>
            </dd>
          </div>
        </dl>

        <!-- Profile Actions -->
        <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <NuxtLink
            to="/Product"
            class="text-xs font-bold text-gray-300 hover:text-lime-400 transition"
          >
            ← Continue Shopping
          </NuxtLink>

          <button
            type="button"
            class="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white active:scale-95"
            @click="logout"
          >
            LOG OUT
          </button>
        </div>
      </div>

      <!-- Guest Login Prompt -->
      <div
        v-else
        class="rounded-3xl border border-white/15 bg-[#0e111a]/85 p-10 text-center shadow-2xl backdrop-blur-2xl"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 text-2xl">
          👤
        </div>
        <h1 class="mt-4 text-2xl font-black italic text-white">
          Sign In To Access Your 365 Account
        </h1>
        <p class="mt-2 text-xs text-gray-400 max-w-md mx-auto">
          Log in with your email or use the Superadmin account to manage store operations.
        </p>
        <div class="mt-6 flex justify-center gap-3">
          <NuxtLink
            to="/Auth/Login"
            class="rounded-full bg-lime-400 px-8 py-3 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/20 transition hover:bg-lime-300 hover:scale-105 active:scale-95"
          >
            LOGIN
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

