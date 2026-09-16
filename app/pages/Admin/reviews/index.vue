<script setup lang="ts">
import { computed, ref } from "vue";
import { products } from "~/data/product";
import { reviewSeedData } from "~/data/admin";
definePageMeta({
  layout: "admin",
});

const reviews = ref<Review[]>(reviewSeedData.map((review) => ({ ...review })));

const search = ref("");
const selectedRating = ref("All");
const selectedStatus = ref("All");
const selectedProduct = ref("All");

const products = computed(() => {
  return [...new Set(reviews.value.map((review) => review.product))];
});

const filteredReviews = computed(() => {
  return reviews.value.filter((review) => {
    const searchValue = search.value.toLowerCase();

    const searchMatch =
      review.customer.toLowerCase().includes(searchValue) ||
      review.email.toLowerCase().includes(searchValue) ||
      review.product.toLowerCase().includes(searchValue) ||
      review.title.toLowerCase().includes(searchValue) ||
      review.comment.toLowerCase().includes(searchValue);

    const ratingMatch =
      selectedRating.value === "All" ||
      review.rating === Number(selectedRating.value);

    const statusMatch =
      selectedStatus.value === "All" || review.status === selectedStatus.value;

    const productMatch =
      selectedProduct.value === "All" ||
      review.product === selectedProduct.value;

    return searchMatch && ratingMatch && statusMatch && productMatch;
  });
});

/* =========================
   Statistics
========================= */

const totalReviews = computed(() => reviews.value.length);

const publishedReviews = computed(() => {
  return reviews.value.filter((review) => review.status === "Published").length;
});

const pendingReviews = computed(() => {
  return reviews.value.filter((review) => review.status === "Pending").length;
});

const hiddenReviews = computed(() => {
  return reviews.value.filter((review) => review.status === "Hidden").length;
});

const averageRating = computed(() => {
  if (reviews.value.length === 0) return "0.0";

  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0);

  return (total / reviews.value.length).toFixed(1);
});

/* =========================
   Actions
========================= */

const changeStatus = (
  review: Review,
  status: "Published" | "Pending" | "Hidden",
) => {
  review.status = status;
};

const deleteReview = (id: number) => {
  const confirmed = confirm("Are you sure you want to delete this review?");

  if (!confirmed) return;

  reviews.value = reviews.value.filter((review) => review.id !== id);
};

const clearFilters = () => {
  search.value = "";
  selectedRating.value = "All";
  selectedStatus.value = "All";
  selectedProduct.value = "All";
};

const viewReview = (review: Review) => {
  alert(`Review by ${review.customer}\n\n${review.title}\n\n${review.comment}`);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div
      class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reviews</h1>

        <p class="mt-1 text-sm text-gray-500">
          Manage customer reviews and product ratings.
        </p>
      </div>

      <div
        class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
      >
        <span class="text-yellow-500"> ★ </span>

        <span class="font-bold text-gray-900">
          {{ averageRating }}
        </span>

        <span class="text-sm text-gray-400"> average rating </span>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- STATISTICS -->
    <!-- ================================================= -->

    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Total -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Reviews</p>

            <p class="mt-2 text-3xl font-bold text-gray-900">
              {{ totalReviews }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl"
          >
            ★
          </div>
        </div>
      </div>

      <!-- Published -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Published</p>

            <p class="mt-2 text-3xl font-bold text-green-600">
              {{ publishedReviews }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600"
          >
            ✓
          </div>
        </div>
      </div>

      <!-- Pending -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Pending</p>

            <p class="mt-2 text-3xl font-bold text-yellow-600">
              {{ pendingReviews }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600"
          >
            !
          </div>
        </div>
      </div>

      <!-- Hidden -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Hidden</p>

            <p class="mt-2 text-3xl font-bold text-red-600">
              {{ hiddenReviews }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600"
          >
            ×
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- FILTERS -->
    <!-- ================================================= -->

    <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <!-- Search -->
        <div class="lg:col-span-1">
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Search
          </label>

          <div class="relative">
            <span
              class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              🔍
            </span>

            <input
              v-model="search"
              type="text"
              placeholder="Search reviews..."
              class="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
            />
          </div>
        </div>

        <!-- Rating -->
        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Rating
          </label>

          <select
            v-model="selectedRating"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="All">All Ratings</option>

            <option value="5">★★★★★ 5 Stars</option>

            <option value="4">★★★★☆ 4 Stars</option>

            <option value="3">★★★☆☆ 3 Stars</option>

            <option value="2">★★☆☆☆ 2 Stars</option>

            <option value="1">★☆☆☆☆ 1 Star</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Status
          </label>

          <select
            v-model="selectedStatus"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="All">All Status</option>

            <option value="Published">Published</option>

            <option value="Pending">Pending</option>

            <option value="Hidden">Hidden</option>
          </select>
        </div>

        <!-- Product -->
        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Product
          </label>

          <select
            v-model="selectedProduct"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="All">All Products</option>

            <option v-for="product in products" :key="product" :value="product">
              {{ product }}
            </option>
          </select>
        </div>
      </div>

      <!-- Filter Footer -->
      <div
        class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm text-gray-500">
          Showing
          <span class="font-semibold text-gray-900">
            {{ filteredReviews.length }}
          </span>
          review{{ filteredReviews.length === 1 ? "" : "s" }}
        </p>

        <button
          @click="clearFilters"
          class="text-sm font-semibold text-gray-600 hover:text-black hover:underline"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- REVIEW TABLE -->
    <!-- ================================================= -->

    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <!-- Table Header -->

      <div
        class="flex flex-col gap-2 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="text-lg font-bold text-gray-900">Customer Reviews</h2>

          <p class="mt-1 text-sm text-gray-500">
            Review and moderate customer feedback.
          </p>
        </div>

        <span
          class="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
        >
          {{ filteredReviews.length }} Results
        </span>
      </div>

      <!-- Table -->

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1200px]">
          <thead class="bg-gray-50">
            <tr class="border-b border-gray-200">
              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Customer
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Product
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Rating
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Review
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Date
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Status
              </th>

              <th
                class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="review in filteredReviews"
              :key="review.id"
              class="transition hover:bg-gray-50"
            >
              <!-- Customer -->

              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <img
                    :src="review.avatar"
                    :alt="review.customer"
                    class="h-11 w-11 rounded-full object-cover"
                  />

                  <div>
                    <div class="flex items-center gap-2">
                      <p class="font-semibold text-gray-900">
                        {{ review.customer }}
                      </p>

                      <span
                        v-if="review.verified"
                        class="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700"
                      >
                        Verified
                      </span>
                    </div>

                    <p class="mt-1 text-xs text-gray-500">
                      {{ review.email }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Product -->

              <td class="max-w-[220px] px-6 py-5">
                <p
                  class="truncate text-sm font-medium text-gray-900"
                  :title="review.product"
                >
                  {{ review.product }}
                </p>
              </td>

              <!-- Rating -->

              <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                  <span class="text-sm tracking-wide text-yellow-500">
                    {{ "★".repeat(review.rating)
                    }}{{ "☆".repeat(5 - review.rating) }}
                  </span>

                  <span class="text-xs font-semibold text-gray-500">
                    {{ review.rating }}.0
                  </span>
                </div>
              </td>

              <!-- Review -->

              <td class="max-w-[300px] px-6 py-5">
                <p class="font-semibold text-gray-900">
                  {{ review.title }}
                </p>

                <p class="mt-1 line-clamp-2 text-sm text-gray-500">
                  {{ review.comment }}
                </p>
              </td>

              <!-- Date -->

              <td class="px-6 py-5 text-sm text-gray-500">
                {{ review.date }}
              </td>

              <!-- Status -->

              <td class="px-6 py-5">
                <span
                  class="rounded-full px-3 py-1.5 text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-700':
                      review.status === 'Published',

                    'bg-yellow-100 text-yellow-700':
                      review.status === 'Pending',

                    'bg-red-100 text-red-700': review.status === 'Hidden',
                  }"
                >
                  {{ review.status }}
                </span>
              </td>

              <!-- Actions -->

              <td class="px-6 py-5">
                <div class="flex justify-end gap-2">
                  <!-- View -->

                  <button
                    @click="viewReview(review)"
                    class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    View
                  </button>

                  <!-- Approve -->

                  <button
                    v-if="review.status !== 'Published'"
                    @click="changeStatus(review, 'Published')"
                    class="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-100"
                  >
                    Approve
                  </button>

                  <!-- Hide -->

                  <button
                    v-if="review.status === 'Published'"
                    @click="changeStatus(review, 'Hidden')"
                    class="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                  >
                    Hide
                  </button>

                  <!-- Delete -->

                  <button
                    @click="deleteReview(review.id)"
                    class="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty -->

            <tr v-if="filteredReviews.length === 0">
              <td colspan="7" class="px-6 py-16 text-center">
                <div class="mx-auto max-w-sm">
                  <div
                    class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl"
                  >
                    ★
                  </div>

                  <h3 class="mt-4 font-bold text-gray-900">No reviews found</h3>

                  <p class="mt-1 text-sm text-gray-500">
                    Try changing your filters or search keywords.
                  </p>

                  <button
                    @click="clearFilters"
                    class="mt-4 text-sm font-semibold text-black underline"
                  >
                    Clear Filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ================================================= -->
      <!-- FOOTER -->
      <!-- ================================================= -->

      <div
        class="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm text-gray-500">
          Showing
          <span class="font-semibold text-gray-900">
            {{ filteredReviews.length }}
          </span>
          of
          <span class="font-semibold text-gray-900">
            {{ totalReviews }}
          </span>
          reviews
        </p>

        <div class="flex gap-2">
          <button
            disabled
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-400"
          >
            Previous
          </button>

          <button
            class="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            1
          </button>

          <button
            disabled
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
