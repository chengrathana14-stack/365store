<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const isSubmitted = ref(false);

const submitResetRequest = () => {
  isSubmitted.value = true;
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 px-4 py-8">
    <div class="mx-auto w-full max-w-md">
      <div class="mb-4">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:-translate-x-1 hover:bg-white hover:text-gray-900 hover:shadow-sm"
        >
          <span class="text-lg leading-none">←</span>
          Back to Home
        </NuxtLink>
      </div>

      <div class="rounded-xl bg-white p-8 shadow-lg">
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-black italic">
            <span class="text-lime-500">365</span>SPORT
          </h1>

          <p class="mt-2 text-gray-500">Reset your password</p>
        </div>

        <p
          v-if="isSubmitted"
          class="mb-5 rounded-lg bg-lime-50 px-4 py-3 text-sm text-lime-700"
          role="status"
        >
          If an account exists for this email, you will receive reset
          instructions shortly.
        </p>

        <form v-else class="space-y-5" @submit.prevent="submitResetRequest">
          <p class="text-sm leading-6 text-gray-600">
            Enter your email address and we will send you instructions to reset
            your password.
          </p>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-200"
            />
          </div>

          <button
            type="submit"
            class="w-full rounded-lg bg-black py-3 font-bold text-white transition-all duration-200 hover:bg-lime-500 hover:text-black active:scale-[0.98]"
          >
            SEND RESET LINK
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-500">
          Remember your password?

          <NuxtLink
            to="/Auth/Login"
            class="font-semibold text-lime-600 hover:text-lime-700"
          >
            Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
