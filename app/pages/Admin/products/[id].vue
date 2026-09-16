<script setup lang="ts">
import { computed, ref } from "vue";
import { productFormOptions } from "~/data/admin";
import { products } from "~/data/product";

definePageMeta({
  layout: "admin",
});

const route = useRoute();

const productId = computed(() => {
  return Number(route.params.id);
});

const product = computed(() => {
  return products.find((item) => item.id === productId.value);
});

const form = ref({
  name: "",
  price: 0,
  category: "",
  brand: "",
  gender: "",
  color: "",
  description: "",
  discount: 0,
  stock: 0,
  image: "",
  hoverimg: "",
  featured: false,
  isNew: false,
  sizes: [] as string[],
});

const initialized = ref(false);

watch(
  product,
  (value) => {
    if (!value || initialized.value) return;

    form.value = {
      name: value.name,
      price: value.price,
      category: value.category,
      brand: value.brand,
      gender: value.gender,
      color: value.color,
      description: value.description,
      discount: value.discount,
      stock: value.stock,
      image: value.image,
      hoverimg: value.hoverimg,
      featured: value.featured,
      isNew: value.isNew,
      sizes: [...value.size],
    };

    initialized.value = true;
  },
  { immediate: true },
);

const availableSizes = productFormOptions.sizes;

const toggleSize = (size: string) => {
  if (form.value.sizes.includes(size)) {
    form.value.sizes = form.value.sizes.filter((item) => item !== size);
  } else {
    form.value.sizes.push(size);
  }
};

const updateProduct = () => {
  console.log("Updated product:", {
    id: productId.value,
    ...form.value,
  });

  alert("Product updated successfully!");

  navigateTo("/admin/products");
};

const deleteProduct = () => {
  if (!product.value) return;

  const confirmed = confirm(`Delete "${product.value.name}"?`);

  if (!confirmed) return;

  alert("Product deleted successfully!");

  navigateTo("/admin/products");
};
</script>

<template>
  <div v-if="product" class="mx-auto max-w-6xl space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
    >
      <div>
        <NuxtLink
          to="/admin/products"
          class="text-sm font-medium text-gray-500 hover:text-black"
        >
          ← Back to Products
        </NuxtLink>

        <h2 class="mt-2 text-2xl font-bold">Edit Product</h2>

        <p class="mt-1 text-sm text-gray-500">Product ID: #{{ product.id }}</p>
      </div>

      <div class="flex gap-3">
        <button
          class="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          @click="deleteProduct"
        >
          Delete
        </button>

        <button
          class="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          @click="updateProduct"
        >
          Save Changes
        </button>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Main -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Information -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 class="font-bold">Product Information</h3>

          <div class="mt-6 space-y-5">
            <div>
              <label class="mb-2 block text-sm font-semibold">
                Product Name
              </label>

              <input
                v-model="form.name"
                class="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold">
                Description
              </label>

              <textarea
                v-model="form.description"
                rows="5"
                class="w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-black"
              ></textarea>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-semibold"> Brand </label>

                <select
                  v-model="form.brand"
                  class="w-full rounded-xl border px-4 py-3 outline-none"
                >
                  <option>Nike</option>
                  <option>Adidas</option>
                  <option>Puma</option>
                  <option>Mizuno</option>
                  <option>New Balance</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  v-model="form.category"
                  class="w-full rounded-xl border px-4 py-3 outline-none"
                >
                  <option>Football Boots</option>
                  <option>Football Jersey</option>
                  <option>Football Clothing</option>
                  <option>Football Bags</option>
                  <option>Football Accessories</option>
                  <option>Football</option>
                  <option>Goalkeeper</option>
                </select>
              </div>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-semibold"> Gender </label>

                <select
                  v-model="form.gender"
                  class="w-full rounded-xl border px-4 py-3 outline-none"
                >
                  <option>Men</option>
                  <option>Women</option>
                  <option>Unisex</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold"> Color </label>

                <input
                  v-model="form.color"
                  class="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 class="font-bold">Pricing & Inventory</h3>

          <div class="mt-6 grid gap-5 sm:grid-cols-3">
            <div>
              <label class="mb-2 block text-sm font-semibold"> Price </label>

              <input
                v-model="form.price"
                type="number"
                class="w-full rounded-xl border px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold"> Discount </label>

              <input
                v-model="form.discount"
                type="number"
                class="w-full rounded-xl border px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold"> Stock </label>

              <input
                v-model="form.stock"
                type="number"
                class="w-full rounded-xl border px-4 py-3 outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Sizes -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 class="font-bold">Available Sizes</h3>

          <div class="mt-5 flex flex-wrap gap-3">
            <button
              v-for="size in availableSizes"
              :key="size"
              type="button"
              class="rounded-lg border px-4 py-2 text-sm font-semibold"
              :class="
                form.sizes.includes(size)
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200'
              "
              @click="toggleSize(size)"
            >
              {{ size }}
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 class="font-bold">Product Image</h3>

          <input
            v-model="form.image"
            class="mt-5 w-full rounded-xl border px-4 py-3 text-sm outline-none"
            placeholder="Image URL"
          />

          <div
            class="mt-5 flex h-64 items-center justify-center overflow-hidden rounded-xl bg-gray-100"
          >
            <img
              :src="form.image"
              :alt="form.name"
              class="h-full w-full object-contain"
            />
          </div>
        </div>

        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 class="font-bold">Status</h3>

          <label class="mt-5 flex items-center justify-between">
            <span class="text-sm"> Featured </span>

            <input
              v-model="form.featured"
              type="checkbox"
              class="h-5 w-5 accent-black"
            />
          </label>

          <label class="mt-4 flex items-center justify-between">
            <span class="text-sm"> New Product </span>

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

  <!-- Not Found -->
  <div v-else class="flex min-h-[500px] items-center justify-center">
    <div class="text-center">
      <div class="text-6xl">😕</div>

      <h2 class="mt-4 text-2xl font-bold">Product Not Found</h2>

      <p class="mt-2 text-gray-500">
        The product you're looking for doesn't exist.
      </p>

      <NuxtLink
        to="/admin/products"
        class="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
      >
        Back to Products
      </NuxtLink>
    </div>
  </div>
</template>
