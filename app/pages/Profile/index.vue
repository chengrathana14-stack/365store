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
  <main class="min-h-[60vh] bg-gray-50 px-4 py-12 sm:px-6">
    <div class="mx-auto max-w-2xl">
      <!-- Unauthorized banner -->
      <div
        v-if="route.query.unauthorized === 'admin'"
        class="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800"
      >
        <p class="font-bold">🔒 Admin Access Restricted</p>
        <p class="mt-0.5 text-gray-600">
          The Admin Dashboard is strictly reserved for the administrator account (<strong>chengrathana14@gmail.com</strong>).
        </p>
      </div>

      <div v-if="user" class="rounded-2xl bg-white p-8 shadow-sm">
        <div class="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full bg-lime-400 text-2xl font-black text-black"
          >
            {{ user.name.charAt(0).toUpperCase() }}
          </div>

          <div>
            <p class="text-sm font-medium text-lime-600">
              {{ isSuperAdmin ? '365SPORT Superadmin' : '365SPORT member' }}
            </p>
            <h1 class="text-2xl font-bold text-gray-900">{{ user.name }}</h1>
          </div>
        </div>

        <!-- Admin Console Card for chengrathana14@gmail.com -->
        <div
          v-if="isSuperAdmin"
          class="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <p class="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Administrator Management
            </p>
            <p class="mt-0.5 text-xs text-gray-500">
              Access the store control center, catalog, orders, and user permissions.
            </p>
          </div>
          <NuxtLink
            to="/admin"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-lime-400 hover:text-black transition shrink-0"
          >
            <span>Open Admin Console</span>
            <span>→</span>
          </NuxtLink>
        </div>

        <dl class="mt-6 space-y-4">
          <div>
            <dt class="text-sm text-gray-500">Gmail address</dt>
            <dd class="font-medium text-gray-900">{{ user.email }}</dd>
          </div>

          <div>
            <dt class="text-sm text-gray-500">Account role</dt>
            <dd class="font-semibold text-gray-900">
              {{ isSuperAdmin ? 'Administrator (Storefront & Management)' : 'Customer' }}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          class="mt-8 rounded-lg bg-black px-5 py-3 font-bold text-white transition hover:bg-lime-500 hover:text-black"
          @click="logout"
        >
          LOG OUT
        </button>
      </div>

      <div v-else class="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">
          Log in to view your profile
        </h1>
        <NuxtLink
          to="/Auth/Login"
          class="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-bold text-white hover:bg-lime-500 hover:text-black"
        >
          LOGIN
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

