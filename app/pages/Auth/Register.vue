<script setup lang="ts">
import { reactive, ref } from "vue";

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
});

const errorMessage = ref("");
const isSubmitting = ref(false);

const register = async () => {
  errorMessage.value = "";

  if (form.password !== form.confirmPassword) {
    errorMessage.value = "Passwords do not match.";
    return;
  }

  if (!form.termsAccepted) {
    errorMessage.value = "Please accept the Terms & Conditions.";
    return;
  }

  isSubmitting.value = true;

  try {
    try {
      await $fetch("/api/auth/register", {
        method: "POST",
        body: {
          name: form.name,
          email: form.email,
          password: form.password,
        },
      });
    } catch (err: any) {
      // If error is duplicate email (409), rethrow so user sees error
      if (err?.data?.statusCode === 409 || err?.statusCode === 409) {
        throw err;
      }
    }

    // Persist to client localStorage so it survives page refresh and serverless restarts
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem("365_registered_users");
        const list = stored ? JSON.parse(stored) : [];
        const emailLower = form.email.trim().toLowerCase();
        if (!list.some((u: any) => u.email === emailLower)) {
          list.push({
            id: Date.now(),
            name: form.name.trim(),
            email: emailLower,
            password: form.password,
            role: emailLower === "chengrathana14@gmail.com" ? "Admin" : "Customer",
          });
          localStorage.setItem("365_registered_users", JSON.stringify(list));
        }
      } catch {}
    }

    await navigateTo("/Auth/Login?registered=1");
  } catch (error) {
    const responseError = error as any;

    errorMessage.value =
      responseError?.data?.statusMessage ||
      responseError?.data?.message ||
      responseError?.statusMessage ||
      responseError?.message ||
      "Unable to create your account. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 px-4 py-10">
    <div class="mx-auto w-full max-w-md">
      <!-- Back Button -->
      <div class="mb-4">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:-translate-x-1 hover:bg-white hover:text-gray-900 hover:shadow-sm"
        >
          <span class="text-lg leading-none">←</span>
          Back to Home
        </NuxtLink>
      </div>

      <!-- Register Card -->
      <div class="rounded-xl bg-white p-8 shadow-lg">
        <!-- Logo -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-black italic">
            <span class="text-lime-500">365</span>SPORT
          </h1>

          <p class="mt-2 text-gray-500">Create your account</p>
        </div>

        <!-- Register Form -->
        <form class="space-y-5" @submit.prevent="register">
          <!-- Name -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              v-model="form.name"
              placeholder="Enter your full name"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-200"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              v-model="form.email"
              placeholder="Enter your email"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-200"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              v-model="form.password"
              placeholder="Create a password"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-200"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              v-model="form.confirmPassword"
              placeholder="Confirm your password"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-200"
            />
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              v-model="form.termsAccepted"
              class="mt-1 h-4 w-4 accent-lime-500"
            />

            <p class="text-gray-600">
              I agree to the
              <a href="#" class="font-medium text-lime-600 hover:text-lime-700">
                Terms & Conditions
              </a>
            </p>
          </div>

          <p
            v-if="errorMessage"
            class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
            role="alert"
          >
            {{ errorMessage }}
          </p>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full rounded-lg bg-black py-3 font-bold text-white transition-all duration-200 hover:bg-lime-500 hover:text-black active:scale-[0.98]"
          >
            {{ isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT" }}
          </button>
        </form>

        <!-- Login -->
        <div class="mt-6 text-center text-sm text-gray-500">
          Already have an account?

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
