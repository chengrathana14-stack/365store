<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "admin",
});

const form = ref({
  name: "",
  description: "",
  website: "",
  image: "",
  status: "Active",
});

const createBrand = () => {
  if (!form.value.name.trim()) {
    alert("Please enter brand name.");
    return;
  }

  console.log("New brand:", form.value);
  alert("Brand created successfully!");
  navigateTo("/admin/brands");
};

const cancel = () => {
  navigateTo("/admin/brands");
};
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-5">
    <!-- Header -->
    <div>
      <NuxtLink
        to="/admin/brands"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition mb-2"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Brands</span>
      </NuxtLink>

      <div class="mt-2">
        <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
          Add Brand
        </h1>
        <p class="text-xs text-gray-400 mt-0.5">
          Add a new sports manufacturer partner to your store catalog.
        </p>
      </div>
    </div>

    <!-- Form -->
    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Information -->
      <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs lg:col-span-2">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 class="font-bold text-gray-900 text-sm">Brand Information</h3>
            <p class="text-xs text-gray-400 mt-0.5">Basic profile details and website</p>
          </div>

          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shadow-2xs">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        <div class="mt-4 space-y-4">
          <!-- Name -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
              Brand Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g. Nike, Adidas, Puma..."
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="5"
              placeholder="Enter brand background, product specialization, and origin..."
              class="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Website -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
              Official Website URL
            </label>
            <input
              v-model="form.website"
              type="text"
              placeholder="https://www.brand.com"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
              Initial Status
            </label>
            <select
              v-model="form.status"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="Active">Active (Visible in catalog)</option>
              <option value="Inactive">Inactive (Paused / Hidden)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Preview & Logo -->
      <div class="space-y-4">
        <!-- Logo URL -->
        <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs">
          <h3 class="font-bold text-gray-900 text-sm">Brand Logo</h3>
          <p class="text-xs text-gray-400 mt-0.5">Enter public logo image URL</p>

          <input
            v-model="form.image"
            type="text"
            placeholder="https://images.unsplash.com/..."
            class="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          <div class="mt-3 flex h-36 items-center justify-center overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
            <img
              v-if="form.image"
              :src="form.image"
              :alt="form.name"
              class="h-full w-full object-contain p-2"
            />
            <div v-else class="text-center text-gray-400 p-4">
              <svg class="mx-auto h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="mt-1 text-xs text-gray-400">Logo preview</p>
            </div>
          </div>
        </div>

        <!-- Live Card Preview -->
        <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs">
          <h3 class="font-bold text-gray-900 text-sm">Live Preview</h3>
          <p class="text-xs text-gray-400 mt-0.5">How this brand looks on store cards</p>

          <div class="mt-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4 shadow-2xs">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white font-black text-sm shadow-2xs">
                {{ form.name ? form.name.charAt(0).toUpperCase() : "B" }}
              </div>
              <div>
                <h4 class="font-bold text-xs text-gray-900">
                  {{ form.name || "Brand Name" }}
                </h4>
                <span
                  class="mt-0.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold"
                  :class="form.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'"
                >
                  {{ form.status }}
                </span>
              </div>
            </div>

            <p class="mt-2.5 line-clamp-2 text-xs text-gray-500 leading-relaxed">
              {{ form.description || "Enter a description to see live preview here..." }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
      <button
        type="button"
        class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
        @click="cancel"
      >
        Cancel
      </button>

      <button
        type="button"
        class="rounded-lg bg-gray-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-2xs active:scale-95"
        @click="createBrand"
      >
        Create Brand
      </button>
    </div>
  </div>
</template>