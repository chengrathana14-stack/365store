<script setup lang="ts">
import { ref } from "vue";
import { productFormOptions } from "~/data/admin";

definePageMeta({
  layout: "admin",
});

const form = ref({
  name: "",
  price: "",
  category: "Football Boots",
  brand: "Nike",
  gender: "Men",
  color: "",
  description: "",
  discount: 0,
  stock: 0,
  rating: 0,
  reviews: 0,
  featured: false,
  isNew: true,
  image: "",
  hoverimg: "",
  sizes: [] as string[],
});

const availableSizes = productFormOptions.sizes;
const categories = productFormOptions.categories;
const brands = productFormOptions.brands;
const genders = productFormOptions.genders;

const toggleSize = (size: string) => {
  if (form.value.sizes.includes(size)) {
    form.value.sizes = form.value.sizes.filter((item) => item !== size);
  } else {
    form.value.sizes.push(size);
  }
};

const createProduct = () => {
  console.log("Product:", form.value);

  alert("Product created successfully!");

  navigateTo("/admin/products");
};

const cancel = () => {
  navigateTo("/admin/products");
};
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <NuxtLink
          to="/admin/products"
          class="text-sm font-medium text-gray-500 hover:text-black"
        >
          ← Back to Products
        </NuxtLink>

        <h2 class="mt-2 text-2xl font-bold text-gray-900">Add Product</h2>

        <p class="mt-1 text-sm text-gray-500">
          Create a new product for your sports store.
        </p>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          class="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50"
          @click="cancel"
        >
          Cancel
        </button>

        <button
          type="button"
          class="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          @click="createProduct"
        >
          Create Product
        </button>
      </div>
    </div>

    <!-- Main -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Left -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Basic Information -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="mb-6">
            <h3 class="font-bold text-gray-900">Basic Information</h3>

            <p class="mt-1 text-sm text-gray-500">
              Enter the main product information.
            </p>
          </div>

          <div class="space-y-5">
            <!-- Name -->
            <div>
              <label class="mb-2 block text-sm font-semibold">
                Product Name
              </label>

              <input
                v-model="form.name"
                type="text"
                placeholder="Nike Mercurial Vapor 16 Elite"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="mb-2 block text-sm font-semibold">
                Description
              </label>

              <textarea
                v-model="form.description"
                rows="5"
                placeholder="Enter product description..."
                class="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              ></textarea>
            </div>

            <!-- Category / Brand -->
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  v-model="form.category"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                >
                  <option
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold"> Brand </label>

                <select
                  v-model="form.brand"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                >
                  <option v-for="brand in brands" :key="brand" :value="brand">
                    {{ brand }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Gender / Color -->
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-semibold"> Gender </label>

                <select
                  v-model="form.gender"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                >
                  <option
                    v-for="gender in genders"
                    :key="gender"
                    :value="gender"
                  >
                    {{ gender }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold"> Color </label>

                <input
                  v-model="form.color"
                  type="text"
                  placeholder="Black / White"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="mb-6">
            <h3 class="font-bold">Pricing & Inventory</h3>

            <p class="mt-1 text-sm text-gray-500">
              Set product price, discount and stock.
            </p>
          </div>

          <div class="grid gap-5 sm:grid-cols-3">
            <div>
              <label class="mb-2 block text-sm font-semibold">
                Price ($)
              </label>

              <input
                v-model="form.price"
                type="number"
                min="0"
                placeholder="150"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold">
                Discount (%)
              </label>

              <input
                v-model="form.discount"
                type="number"
                min="0"
                max="100"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold"> Stock </label>

              <input
                v-model="form.stock"
                type="number"
                min="0"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        <!-- Sizes -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 class="font-bold">Available Sizes</h3>

          <p class="mt-1 text-sm text-gray-500">
            Select the sizes available for this product.
          </p>

          <div class="mt-5 flex flex-wrap gap-3">
            <button
              v-for="size in availableSizes"
              :key="size"
              type="button"
              class="rounded-lg border px-4 py-2 text-sm font-semibold transition"
              :class="
                form.sizes.includes(size)
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white hover:border-black'
              "
              @click="toggleSize(size)"
            >
              {{ size }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="space-y-6">
        <!-- Product Image -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 class="font-bold">Product Images</h3>

          <p class="mt-1 text-sm text-gray-500">Add product image URLs.</p>

          <div class="mt-5 space-y-4">
            <div>
              <label class="mb-2 block text-sm font-semibold">
                Main Image URL
              </label>

              <input
                v-model="form.image"
                type="text"
                placeholder="https://..."
                class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold">
                Hover Image URL
              </label>

              <input
                v-model="form.hoverimg"
                type="text"
                placeholder="https://..."
                class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>
          </div>

          <!-- Preview -->
          <div
            class="mt-5 flex h-64 items-center justify-center overflow-hidden rounded-xl bg-gray-100"
          >
            <img
              v-if="form.image"
              :src="form.image"
              :alt="form.name"
              class="h-full w-full object-contain"
            />

            <div v-else class="text-center text-sm text-gray-400">
              <div class="text-4xl">👟</div>

              <p class="mt-2">Image preview</p>
            </div>
          </div>
        </div>

        <!-- Product Status -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 class="font-bold">Product Status</h3>

          <div class="mt-5 space-y-4">
            <label class="flex cursor-pointer items-center justify-between">
              <div>
                <p class="text-sm font-semibold">Featured Product</p>

                <p class="text-xs text-gray-500">Show on featured sections</p>
              </div>

              <input
                v-model="form.featured"
                type="checkbox"
                class="h-5 w-5 accent-black"
              />
            </label>

            <label class="flex cursor-pointer items-center justify-between">
              <div>
                <p class="text-sm font-semibold">New Product</p>

                <p class="text-xs text-gray-500">Mark product as new</p>
              </div>

              <input
                v-model="form.isNew"
                type="checkbox"
                class="h-5 w-5 accent-black"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
