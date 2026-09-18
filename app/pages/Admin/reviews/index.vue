<script setup lang="ts">
import { computed, ref } from "vue";
import { reviewSeedData } from "~/data/admin";
import type { Review } from "~/type/product";

definePageMeta({
  layout: "admin",
});

const reviews = ref<Review[]>(reviewSeedData.map((review) => ({ ...review })));

const search = ref("");
const selectedRating = ref("All");
const selectedStatus = ref("All");
const selectedProduct = ref("All");

const products = computed<string[]>(() => {
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
   Status & Actions
========================= */

const changeStatus = (
  review: Review,
  status: "Published" | "Pending" | "Hidden",
) => {
  review.status = status;
};

// =========================
// DELETE MODAL
// =========================

const reviewToDelete = ref<Review | null>(null);
const showDeleteModal = ref(false);

const openDeleteModal = (review: Review) => {
  reviewToDelete.value = review;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  reviewToDelete.value = null;
  showDeleteModal.value = false;
};

const confirmDeleteReview = () => {
  if (reviewToDelete.value) {
    reviews.value = reviews.value.filter((r) => r.id !== reviewToDelete.value!.id);
  }
  closeDeleteModal();
};

// =========================
// VIEW REVIEW MODAL
// =========================

const reviewToView = ref<Review | null>(null);
const showViewModal = ref(false);

const openViewModal = (review: Review) => {
  reviewToView.value = review;
  showViewModal.value = true;
};

const closeViewModal = () => {
  reviewToView.value = null;
  showViewModal.value = false;
};

const clearFilters = () => {
  search.value = "";
  selectedRating.value = "All";
  selectedStatus.value = "All";
  selectedProduct.value = "All";
};

const getStatusBadgeClass = (status: string) => {
  if (status === "Published") {
    return "bg-emerald-50 text-emerald-600 border border-emerald-100";
  }
  if (status === "Pending") {
    return "bg-amber-50 text-amber-600 border border-amber-100";
  }
  return "bg-red-50 text-red-600 border border-red-100";
};
</script>

<template>
  <div class="space-y-5">

    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-md bg-gray-900 text-white shadow-2xs">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>

        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
            Reviews
          </h1>
          <p class="text-xs text-gray-400 mt-0.5">
            Monitor customer ratings, moderate feedback, and manage sports catalog sentiment
          </p>
        </div>
      </div>

      <!-- Average Rating Scorecard Pill -->
      <div class="inline-flex items-center gap-2 rounded-lg border border-amber-200/80 bg-amber-50/70 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-2xs">
        <svg class="h-4 w-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="text-sm font-black text-gray-900">{{ averageRating }}</span>
        <span class="text-gray-500 text-[11px]">Overall Rating</span>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- STATISTICS (CLEAN SMALL-RADIUS METRICS) -->
    <!-- ================================================= -->
    <div class="grid gap-3 grid-cols-2 lg:grid-cols-4">
      <!-- Total -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Reviews</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-gray-900">{{ totalReviews }}</p>
      </div>

      <!-- Published -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Published</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-emerald-600">{{ publishedReviews }}</p>
      </div>

      <!-- Pending -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pending Review</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-amber-600">{{ pendingReviews }}</p>
      </div>

      <!-- Hidden -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Hidden / Flagged</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-2xl font-black text-red-500">{{ hiddenReviews }}</p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- FILTERS BAR -->
    <!-- ================================================= -->
    <div class="rounded-md border border-gray-100 bg-white p-3.5 shadow-xs">
      <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        <!-- Search -->
        <div class="relative sm:col-span-2">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Search feedback, product or customer..."
            class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <!-- Rating Filter -->
        <div>
          <select
            v-model="selectedRating"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <select
            v-model="selectedStatus"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Pending">Pending</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>

        <!-- Product Filter -->
        <div class="flex gap-2">
          <select
            v-model="selectedProduct"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Products</option>
            <option v-for="product in products" :key="product" :value="product">
              {{ product }}
            </option>
          </select>

          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition shadow-2xs shrink-0"
            @click="clearFilters"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Results Count -->
    <div class="flex items-center justify-between px-1 text-xs text-gray-400">
      <p>
        Showing
        <span class="font-bold text-gray-900">{{ filteredReviews.length }}</span>
        verified review{{ filteredReviews.length === 1 ? "" : "s" }}
      </p>
    </div>

    <!-- ================================================= -->
    <!-- REVIEWS TABLE (WITH BORDERLESS ACTION ICONS) -->
    <!-- ================================================= -->
    <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[1000px] text-left text-xs">
          <thead class="border-b border-gray-100 bg-white">
            <tr>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                CUSTOMER
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                PRODUCT
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                RATING
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                COMMENT
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                DATE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                STATUS
              </th>
              <th class="px-6 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100/80">
            <tr
              v-for="review in filteredReviews"
              :key="review.id"
              class="transition hover:bg-gray-50/60"
            >
              <!-- Customer -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="review.avatar"
                    :alt="review.customer"
                    class="h-9 w-9 rounded-full object-cover border border-gray-100 shadow-2xs shrink-0"
                  />

                  <div>
                    <div class="flex items-center gap-1.5">
                      <p class="font-bold text-gray-900 text-xs sm:text-sm">
                        {{ review.customer }}
                      </p>

                      <span
                        v-if="review.verified"
                        title="Verified Buyer"
                        class="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-600 border border-emerald-100"
                      >
                        ✓ Verified
                      </span>
                    </div>

                    <p class="mt-0.5 text-[11px] text-gray-400">
                      {{ review.email }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Product -->
              <td class="max-w-[200px] px-6 py-4">
                <p class="truncate font-medium text-gray-900 text-xs" :title="review.product">
                  {{ review.product }}
                </p>
              </td>

              <!-- Rating (Gold Stars SVGs) -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-1">
                  <div class="flex text-amber-400">
                    <svg
                      v-for="star in 5"
                      :key="star"
                      class="h-3.5 w-3.5"
                      :class="star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="text-[11px] font-bold text-gray-500 ml-1">{{ review.rating }}.0</span>
                </div>
              </td>

              <!-- Feedback Comment -->
              <td class="max-w-[260px] px-6 py-4">
                <p class="font-bold text-gray-900 text-xs line-clamp-1">
                  {{ review.title }}
                </p>
                <p class="mt-0.5 line-clamp-1 text-[11px] text-gray-500">
                  {{ review.comment }}
                </p>
              </td>

              <!-- Date -->
              <td class="px-6 py-4 text-gray-500 whitespace-nowrap">
                {{ review.date }}
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="rounded-md px-2.5 py-1 text-xs font-semibold"
                  :class="getStatusBadgeClass(review.status)"
                >
                  {{ review.status }}
                </span>
              </td>

              <!-- ACTIONS (BORDERLESS NAKED INLINE ICONS) -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-3">
                  <!-- Approve / Publish Review (Green Checkmark) -->
                  <button
                    v-if="review.status !== 'Published'"
                    type="button"
                    title="Publish Review"
                    class="text-emerald-500 hover:text-emerald-700 hover:scale-125 transition-transform p-0.5"
                    @click="changeStatus(review, 'Published')"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <!-- Hide / Pause Review (Amber Eye-off) -->
                  <button
                    v-if="review.status === 'Published'"
                    type="button"
                    title="Hide Review from Store"
                    class="text-amber-500 hover:text-amber-700 hover:scale-125 transition-transform p-0.5"
                    @click="changeStatus(review, 'Hidden')"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>

                  <!-- Delete Review (Red Cross / Trash) -->
                  <button
                    type="button"
                    title="Delete Review"
                    class="text-red-400 hover:text-red-600 hover:scale-125 transition-transform p-0.5"
                    @click="openDeleteModal(review)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <!-- View Full Review Modal (Blue Eye) -->
                  <button
                    type="button"
                    title="Read Full Review"
                    class="text-blue-400 hover:text-blue-600 hover:scale-125 transition-transform p-0.5"
                    @click="openViewModal(review)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredReviews.length === 0"
        class="py-14 text-center"
      >
        <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="mt-3 text-xs font-bold text-gray-900">No reviews found</h3>
        <p class="mt-0.5 text-[11px] text-gray-400">Try changing your filters or keywords.</p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- VIEW REVIEW DETAILS MODAL -->
    <!-- ================================================= -->
    <div
      v-if="showViewModal && reviewToView"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-md rounded-md bg-white p-5 shadow-xl border border-gray-100">
        <div class="flex items-start justify-between border-b border-gray-100 pb-3">
          <div class="flex items-center gap-2.5">
            <img
              :src="reviewToView.avatar"
              :alt="reviewToView.customer"
              class="h-9 w-9 rounded-full object-cover border border-gray-100 shadow-2xs"
            />
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-xs font-bold text-gray-900">{{ reviewToView.customer }}</h3>
                <span
                  v-if="reviewToView.verified"
                  class="text-[10px] text-emerald-600 font-bold"
                >
                  ✓ Verified Buyer
                </span>
              </div>
              <p class="text-[11px] text-gray-400">{{ reviewToView.email }}</p>
            </div>
          </div>

          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 transition"
            @click="closeViewModal"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mt-4 space-y-3 text-xs">
          <div>
            <span class="text-[11px] font-semibold text-gray-400">Catalog Product:</span>
            <p class="font-bold text-gray-900 mt-0.5">{{ reviewToView.product }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <svg
                v-for="star in 5"
                :key="star"
                class="h-4 w-4"
                :class="star <= reviewToView.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="font-bold text-gray-700 ml-1.5">{{ reviewToView.rating }}.0 / 5.0</span>
            </div>

            <span
              class="rounded-md px-2.5 py-0.5 text-xs font-semibold"
              :class="getStatusBadgeClass(reviewToView.status)"
            >
              {{ reviewToView.status }}
            </span>
          </div>

          <div class="rounded-lg bg-gray-50/80 p-3 border border-gray-100">
            <p class="font-bold text-gray-900 text-xs">{{ reviewToView.title }}</p>
            <p class="mt-1 text-gray-600 leading-relaxed text-xs">{{ reviewToView.comment }}</p>
          </div>

          <p class="text-[11px] text-gray-400 text-right">Submitted on {{ reviewToView.date }}</p>
        </div>

        <div class="mt-5 flex justify-end gap-2 text-xs font-semibold border-t border-gray-100 pt-3">
          <button
            v-if="reviewToView.status !== 'Published'"
            type="button"
            class="rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700 transition shadow-2xs"
            @click="changeStatus(reviewToView, 'Published'); closeViewModal();"
          >
            Publish Review
          </button>

          <button
            v-if="reviewToView.status === 'Published'"
            type="button"
            class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-700 hover:bg-amber-100 transition shadow-2xs"
            @click="changeStatus(reviewToView, 'Hidden'); closeViewModal();"
          >
            Hide from Store
          </button>

          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition"
            @click="closeViewModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- DELETE REVIEW MODAL -->
    <!-- ================================================= -->
    <div
      v-if="showDeleteModal && reviewToDelete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-sm rounded-md bg-white p-5 shadow-xl border border-gray-100">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 class="mt-3 text-sm font-bold text-gray-900">Delete Review?</h3>
        <p class="mt-1 text-xs leading-relaxed text-gray-500">
          Are you sure you want to permanently delete this customer review from <span class="font-semibold text-gray-900">{{ reviewToDelete.customer }}</span>?
        </p>

        <div class="mt-5 flex justify-end gap-2 text-xs font-semibold">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition"
            @click="closeDeleteModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 transition shadow-2xs"
            @click="confirmDeleteReview"
          >
            Delete Review
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
