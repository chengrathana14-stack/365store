<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "admin",
});

const name = ref("");
const description = ref("");
const status = ref<"Active" | "Inactive">("Active");

const error = ref("");
const success = ref(false);

const createCategory = async () => {
  error.value = "";
  success.value = false;

  if (!name.value.trim()) {
    error.value = "Category name is required.";
    return;
  }

  if (!description.value.trim()) {
    error.value = "Category description is required.";
    return;
  }

  // Later:
  // await $fetch("/api/categories", {
  //   method: "POST",
  //   body: {
  //     name: name.value,
  //     description: description.value,
  //     status: status.value,
  //   },
  // });

  success.value = true;

  setTimeout(() => {
    navigateTo("/admin/categories");
  }, 700);
};

const cancel = () => {
  navigateTo("/admin/categories");
};
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">

    <!-- Header -->
    <div>

      <NuxtLink
        to="/admin/categories"
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black"
      >
        ← Back to Categories
      </NuxtLink>

      <div class="mt-5">
        <h1 class="text-2xl font-bold text-gray-900">
          Create Category
        </h1>

        <p class="mt-1 text-sm text-gray-500">
          Add a new product category to your store.
        </p>
      </div>

    </div>

    <!-- Form -->
    <div class="grid gap-6 lg:grid-cols-3">

      <!-- Main -->
      <div
        class="space-y-6 rounded-md border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"
      >

        <div>
          <h2 class="text-lg font-bold">
            Category Information
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            Enter the basic information for your category.
          </p>
        </div>

        <!-- Name -->
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Category Name
            <span class="text-red-500">*</span>
          </label>

          <input
            v-model="name"
            type="text"
            placeholder="Example: Football Boots"
            class="w-full rounded-md border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Description
            <span class="text-red-500">*</span>
          </label>

          <textarea
            v-model="description"
            rows="6"
            placeholder="Describe this category..."
            class="w-full resize-none rounded-md border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          ></textarea>

          <p class="mt-2 text-xs text-gray-400">
            Write a short description that explains what products belong to
            this category.
          </p>
        </div>

        <!-- Status -->
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Status
          </label>

          <div class="grid gap-3 sm:grid-cols-2">

            <button
              type="button"
              class="rounded-md border p-4 text-left transition"
              :class="
                status === 'Active'
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200'
              "
              @click="status = 'Active'"
            >
              <div class="flex items-center gap-3">

                <div
                  class="flex h-10 w-10 items-center justify-center rounded-md bg-green-100 text-green-600"
                >
                  ✓
                </div>

                <div>
                  <p class="font-semibold">
                    Active
                  </p>

                  <p class="text-xs text-gray-500">
                    Category is visible in store
                  </p>
                </div>

              </div>
            </button>

            <button
              type="button"
              class="rounded-md border p-4 text-left transition"
              :class="
                status === 'Inactive'
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200'
              "
              @click="status = 'Inactive'"
            >
              <div class="flex items-center gap-3">

                <div
                  class="flex h-10 w-10 items-center justify-center rounded-md bg-red-100 text-red-600"
                >
                  ×
                </div>

                <div>
                  <p class="font-semibold">
                    Inactive
                  </p>

                  <p class="text-xs text-gray-500">
                    Category is hidden from store
                  </p>
                </div>

              </div>
            </button>

          </div>
        </div>

      </div>

      <!-- Preview -->
      <div class="space-y-6">

        <div
          class="rounded-md border border-gray-200 bg-white p-6 shadow-sm"
        >

          <h2 class="font-bold">
            Preview
          </h2>

          <div class="mt-5 rounded-md border border-gray-200 p-5">

            <div
              class="flex h-14 w-14 items-center justify-center rounded-md bg-gray-100 text-2xl"
            >
              📂
            </div>

            <h3 class="mt-4 font-bold">
              {{ name || "Category Name" }}
            </h3>

            <p class="mt-2 text-sm leading-5 text-gray-500">
              {{ description || "Category description will appear here." }}
            </p>

            <div class="mt-4">
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="
                  status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                {{ status }}
              </span>
            </div>

          </div>

        </div>

        <div class="rounded-md bg-gray-50 p-5">
          <p class="text-sm font-semibold">
            💡 Tip
          </p>

          <p class="mt-2 text-sm leading-6 text-gray-500">
            Use a clear category name so customers can easily find products
            in your store.
          </p>
        </div>

      </div>

    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {{ error }}
    </div>

    <!-- Success -->
    <div
      v-if="success"
      class="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600"
    >
      Category created successfully!
    </div>

    <!-- Buttons -->
    <div
      class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
    >

      <button
        type="button"
        class="rounded-md border border-gray-200 px-6 py-3 text-sm font-semibold hover:bg-gray-50"
        @click="cancel"
      >
        Cancel
      </button>

      <button
        type="button"
        class="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        @click="createCategory"
      >
        Create Category
      </button>

    </div>

  </div>
</template>