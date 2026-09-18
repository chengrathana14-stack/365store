<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { brandSeedData } from "~/data/admin";

definePageMeta({
  layout: "admin",
});

useHead({
  title: "Brand Partners | Admin",
});

// =====================================================
// BRAND DATA & EXTENDED METADATA
// =====================================================

interface BrandPartner {
  id: number;
  name: string;
  products: number;
  status: "Active" | "Inactive" | string;
  description: string;
  created: string;
  origin: string;
  countryCode: string;
  tier: string;
  specialties: string[];
  website: string;
  color: string;
}

const brandMetadata: Record<string, Partial<BrandPartner>> = {
  Nike: {
    origin: "Beaverton, Oregon, USA",
    countryCode: "🇺🇸 USA",
    tier: "Tier 1 Global Partner",
    specialties: ["Football", "Running", "Apparel"],
    website: "nike.com",
    color: "from-zinc-900 to-zinc-700",
  },
  Adidas: {
    origin: "Herzogenaurach, Germany",
    countryCode: "🇩🇪 Germany",
    tier: "Tier 1 Global Partner",
    specialties: ["Football", "Jerseys", "Lifestyle"],
    website: "adidas.com",
    color: "from-blue-900 to-blue-700",
  },
  Puma: {
    origin: "Herzogenaurach, Germany",
    countryCode: "🇩🇪 Germany",
    tier: "Tier 1 Global Partner",
    specialties: ["Football Boots", "Running", "Speed"],
    website: "puma.com",
    color: "from-red-900 to-red-700",
  },
  Mizuno: {
    origin: "Osaka, Japan",
    countryCode: "🇯🇵 Japan",
    tier: "Premium Equipment Partner",
    specialties: ["Leather Boots", "Footwear", "Equipment"],
    website: "mizuno.com",
    color: "from-indigo-900 to-indigo-700",
  },
  "New Balance": {
    origin: "Boston, Massachusetts, USA",
    countryCode: "🇺🇸 USA",
    tier: "Performance Partner",
    specialties: ["Running", "Comfort", "Football"],
    website: "newbalance.com",
    color: "from-rose-900 to-rose-700",
  },
  "Under Armour": {
    origin: "Baltimore, Maryland, USA",
    countryCode: "🇺🇸 USA",
    tier: "Performance Wear",
    specialties: ["Training", "Compression", "Footwear"],
    website: "underarmour.com",
    color: "from-neutral-900 to-neutral-700",
  },
  Asics: {
    origin: "Kobe, Japan",
    countryCode: "🇯🇵 Japan",
    tier: "Running Specialist",
    specialties: ["Marathon", "Running Shoes", "Stability"],
    website: "asics.com",
    color: "from-cyan-900 to-cyan-700",
  },
  Jordan: {
    origin: "Chicago, Illinois, USA",
    countryCode: "🇺🇸 USA",
    tier: "Iconic Basketball & Streetwear",
    specialties: ["Basketball", "Retro Footwear", "Street"],
    website: "nike.com/jordan",
    color: "from-red-950 to-red-800",
  },
};

const brands = ref<BrandPartner[]>(
  brandSeedData.map((brand) => {
    const meta = brandMetadata[brand.name] || {};
    return {
      id: brand.id,
      name: brand.name,
      products: brand.products,
      status: brand.status,
      description: brand.description,
      created: brand.created,
      origin: meta.origin || "Global",
      countryCode: meta.countryCode || "🌐 International",
      tier: meta.tier || "Official Partner",
      specialties: meta.specialties || ["Sports", "Footwear"],
      website: meta.website || "official.com",
      color: meta.color || "from-gray-900 to-gray-700",
    };
  }),
);

// =====================================================
// FILTERS & STATE
// =====================================================

const search = ref("");
const statusFilter = ref("All");
const specialtyFilter = ref("All");
const sortBy = ref("Most Products");
const viewMode = ref<"grid" | "table">("grid");
const showFilterPanel = ref(false);

const currentPage = ref(1);
const itemsPerPage = ref(6);

const showDeleteModal = ref(false);
const selectedBrand = ref<BrandPartner | null>(null);

// Reset page on filter change
watch([search, statusFilter, specialtyFilter, sortBy], () => {
  currentPage.value = 1;
});

// =====================================================
// COMPUTED STATS & PORTFOLIO SHARE
// =====================================================

const totalProducts = computed(() => {
  return brands.value.reduce((total, brand) => total + brand.products, 0);
});

const activeBrands = computed(() => {
  return brands.value.filter((brand) => brand.status === "Active").length;
});

const inactiveBrands = computed(() => {
  return brands.value.filter((brand) => brand.status === "Inactive").length;
});

const topBrand = computed(() => {
  return [...brands.value].sort((a, b) => b.products - a.products)[0];
});

const allSpecialties = computed(() => {
  const set = new Set<string>();
  brands.value.forEach((b) => b.specialties.forEach((s) => set.add(s)));
  return ["All", ...Array.from(set)];
});

// Distribution share for top brands
const brandShareBreakdown = computed(() => {
  const total = totalProducts.value || 1;
  const sorted = [...brands.value].sort((a, b) => b.products - a.products);
  return sorted.slice(0, 5).map((b) => ({
    name: b.name,
    count: b.products,
    percentage: Math.round((b.products / total) * 100),
  }));
});

const filteredBrands = computed(() => {
  let result = [...brands.value];

  // Search
  if (search.value.trim()) {
    const keyword = search.value.toLowerCase();

    result = result.filter(
      (brand) =>
        brand.name.toLowerCase().includes(keyword) ||
        brand.description.toLowerCase().includes(keyword) ||
        brand.origin.toLowerCase().includes(keyword) ||
        brand.specialties.some((s) => s.toLowerCase().includes(keyword)),
    );
  }

  // Status Filter
  if (statusFilter.value !== "All") {
    result = result.filter((brand) => brand.status === statusFilter.value);
  }

  // Specialty Filter
  if (specialtyFilter.value !== "All") {
    result = result.filter((brand) =>
      brand.specialties.includes(specialtyFilter.value),
    );
  }

  // Sorting
  if (sortBy.value === "A-Z") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === "Z-A") {
    result.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy.value === "Most Products") {
    result.sort((a, b) => b.products - a.products);
  } else if (sortBy.value === "Least Products") {
    result.sort((a, b) => a.products - b.products);
  } else if (sortBy.value === "Newest") {
    result.sort((a, b) => b.id - a.id);
  } else if (sortBy.value === "Oldest") {
    result.sort((a, b) => a.id - b.id);
  }

  return result;
});

// =====================================================
// PAGINATION
// =====================================================

const totalPages = computed(() => {
  return Math.ceil(filteredBrands.value.length / itemsPerPage.value) || 1;
});

const paginatedBrands = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredBrands.value.slice(start, start + itemsPerPage.value);
});

const paginationStart = computed(() => {
  if (filteredBrands.value.length === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredBrands.value.length);
});

// =====================================================
// ACTIONS
// =====================================================

const clearFilters = () => {
  search.value = "";
  statusFilter.value = "All";
  specialtyFilter.value = "All";
  sortBy.value = "Most Products";
  currentPage.value = 1;
};

const toggleStatus = (brand: BrandPartner) => {
  brand.status = brand.status === "Active" ? "Inactive" : "Active";
};

const openDeleteModal = (brand: BrandPartner) => {
  selectedBrand.value = brand;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  selectedBrand.value = null;
  showDeleteModal.value = false;
};

const deleteBrand = () => {
  if (!selectedBrand.value) return;

  brands.value = brands.value.filter(
    (brand) => brand.id !== selectedBrand.value?.id,
  );

  closeDeleteModal();

  if (currentPage.value > totalPages.value && currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div class="space-y-6">

    <!-- =====================================
         PAGE HEADER
    ====================================== -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
            Brand Partners
          </h1>
          <span class="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-100">
            Official Directory
          </span>
        </div>
        <p class="text-xs text-gray-400 mt-1">
          Manage manufacturer partnerships, sports apparel distribution, and catalog shares
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin/products"
          class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
        >
          <svg class="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Catalog Inventory</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/brands/create"
          class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Brand Partner</span>
        </NuxtLink>
      </div>
    </div>

    <!-- =====================================
         BRAND INTELLIGENCE KPI CARDS
    ====================================== -->
    <div class="grid gap-3 grid-cols-2 lg:grid-cols-4">
      <!-- Total Partners -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Partners</p>
          <span class="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">Active: {{ activeBrands }}</span>
        </div>
        <p class="mt-1 text-2xl font-black text-gray-900">{{ brands.length }} <span class="text-xs font-normal text-gray-400">brands</span></p>
        <p class="mt-2 text-[11px] text-gray-400">
          {{ inactiveBrands }} under review / paused
        </p>
      </div>

      <!-- Total Catalog Items -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Catalog Volume</p>
        <p class="mt-1 text-2xl font-black text-emerald-600">{{ totalProducts }} <span class="text-xs font-normal text-gray-400">items</span></p>
        <p class="mt-2 text-[11px] text-gray-400">
          Supplied across all sports categories
        </p>
      </div>

      <!-- Leading Brand Share -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Leading Partner</p>
        <div class="flex items-baseline gap-2 mt-1">
          <p class="text-2xl font-black text-gray-900">{{ topBrand?.name }}</p>
          <span class="text-xs font-bold text-emerald-600">{{ topBrand?.products }} items</span>
        </div>
        <p class="mt-2 text-[11px] text-gray-400">
          {{ Math.round(((topBrand?.products || 0) / (totalProducts || 1)) * 100) }}% of total store inventory
        </p>
      </div>

      <!-- Average Portfolio Size -->
      <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Avg. Brand Depth</p>
        <p class="mt-1 text-2xl font-black text-indigo-600">
          {{ Math.round(totalProducts / (brands.length || 1)) }}
          <span class="text-xs font-normal text-gray-400">items / brand</span>
        </p>
        <p class="mt-2 text-[11px] text-gray-400">
          High SKU diversity per manufacturer
        </p>
      </div>
    </div>

    <!-- =====================================
         STORE CATALOG DISTRIBUTION BAR
    ====================================== -->
    <div class="rounded-md border border-gray-100 bg-white p-4 shadow-xs">
      <div class="flex items-center justify-between mb-2.5">
        <div>
          <p class="text-xs font-bold text-gray-900">Catalog Market Share</p>
          <p class="text-[11px] text-gray-400">Inventory share by manufacturer across the entire store</p>
        </div>
        <span class="text-[11px] font-semibold text-gray-500">100% catalog coverage</span>
      </div>

      <!-- Multi-segment visual progress bar -->
      <div class="h-2.5 w-full flex overflow-hidden rounded-full bg-gray-100 gap-0.5">
        <div
          v-for="(share, index) in brandShareBreakdown"
          :key="share.name"
          class="h-full transition-all duration-300 relative group cursor-pointer"
          :class="[
            index === 0 ? 'bg-zinc-900' : '',
            index === 1 ? 'bg-blue-600' : '',
            index === 2 ? 'bg-amber-500' : '',
            index === 3 ? 'bg-emerald-500' : '',
            index === 4 ? 'bg-purple-500' : '',
          ]"
          :style="{ width: `${share.percentage}%` }"
          :title="`${share.name}: ${share.count} items (${share.percentage}%)`"
        ></div>
      </div>

      <!-- Legend -->
      <div class="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
        <div
          v-for="(share, index) in brandShareBreakdown"
          :key="share.name"
          class="flex items-center gap-1.5"
        >
          <span
            class="h-2 w-2 rounded-full"
            :class="[
              index === 0 ? 'bg-zinc-900' : '',
              index === 1 ? 'bg-blue-600' : '',
              index === 2 ? 'bg-amber-500' : '',
              index === 3 ? 'bg-emerald-500' : '',
              index === 4 ? 'bg-purple-500' : '',
            ]"
          ></span>
          <span class="font-bold text-gray-800">{{ share.name }}</span>
          <span class="text-gray-400">({{ share.percentage }}%)</span>
        </div>
      </div>
    </div>

    <!-- =====================================
         MAIN BRAND DIRECTORY CARD
    ====================================== -->
    <div class="overflow-hidden rounded-md border border-gray-100 bg-white shadow-xs">

      <!-- 1. TOP CONTROLS BAR -->
      <div class="flex flex-col gap-3.5 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
        
        <!-- Left: Search input, Filter button, Live badge -->
        <div class="flex flex-wrap items-center gap-2">
          
          <!-- Search Box -->
          <div class="relative w-64 sm:w-80">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              v-model="search"
              type="text"
              placeholder="Search brand, origin, sport..."
              class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Filter Funnel Icon Button -->
          <button
            type="button"
            title="Filter options"
            class="flex h-8 w-8 items-center justify-center rounded-lg border transition"
            :class="
              showFilterPanel || specialtyFilter !== 'All' || sortBy !== 'Most Products'
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            "
            @click="showFilterPanel = !showFilterPanel"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>

          <!-- Live Badge -->
          <div class="flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Verified Partners</span>
          </div>
        </div>

        <!-- Right: Status Filter Pills Tab -->
        <div class="flex items-center rounded-md bg-gray-100/80 p-1 text-xs font-medium">
          <!-- All -->
          <button
            type="button"
            class="rounded-lg px-3 py-1 transition"
            :class="
              statusFilter === 'All'
                ? 'bg-white font-bold text-blue-600 shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            "
            @click="statusFilter = 'All'"
          >
            All Partners
          </button>

          <!-- Active -->
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1 transition"
            :class="
              statusFilter === 'Active'
                ? 'bg-white font-bold text-blue-600 shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            "
            @click="statusFilter = 'Active'"
          >
            <span>Active</span>
            <span
              class="rounded-full px-1.5 py-0.2 text-[10px] font-bold"
              :class="
                statusFilter === 'Active'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              "
            >
              {{ activeBrands }}
            </span>
          </button>

          <!-- Inactive / Paused -->
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1 transition"
            :class="
              statusFilter === 'Inactive'
                ? 'bg-white font-bold text-blue-600 shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            "
            @click="statusFilter = 'Inactive'"
          >
            <span>Paused</span>
            <span
              class="rounded-full px-1.5 py-0.2 text-[10px] font-bold"
              :class="
                statusFilter === 'Inactive'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              "
            >
              {{ inactiveBrands }}
            </span>
          </button>
        </div>
      </div>

      <!-- 2. EXPANDABLE ADVANCED FILTER DRAWER -->
      <div
        v-if="showFilterPanel"
        class="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-gray-50/60 px-4 py-3 text-xs"
      >
        <!-- Sport Specialty Filter -->
        <div class="flex items-center gap-1.5">
          <span class="text-gray-500 font-medium">Sport Specialty:</span>
          <select
            v-model="specialtyFilter"
            class="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 outline-none focus:border-blue-500"
          >
            <option v-for="s in allSpecialties" :key="s" :value="s">
              {{ s === "All" ? "All Sports" : s }}
            </option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="flex items-center gap-1.5">
          <span class="text-gray-500 font-medium">Sort by:</span>
          <select
            v-model="sortBy"
            class="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="Most Products">Catalog: Highest First</option>
            <option value="Least Products">Catalog: Lowest First</option>
            <option value="A-Z">Brand Name: A-Z</option>
            <option value="Z-A">Brand Name: Z-A</option>
            <option value="Newest">Newest Partner</option>
            <option value="Oldest">Oldest Partner</option>
          </select>
        </div>

        <!-- View Mode Toggle -->
        <div class="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 ml-auto">
          <button
            type="button"
            class="rounded px-2.5 py-0.5 text-xs font-medium transition flex items-center gap-1"
            :class="viewMode === 'grid' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'"
            @click="viewMode = 'grid'"
          >
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Cards</span>
          </button>
          <button
            type="button"
            class="rounded px-2.5 py-0.5 text-xs font-medium transition flex items-center gap-1"
            :class="viewMode === 'table' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'"
            @click="viewMode = 'table'"
          >
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Table</span>
          </button>
        </div>

        <!-- Reset Button -->
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
          @click="clearFilters"
        >
          Reset Filters
        </button>
      </div>

      <!-- 3. BRAND CARDS VIEW (DEDICATED BRAND DIRECTORY) -->
      <div
        v-if="viewMode === 'grid' && paginatedBrands.length"
        class="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="brand in paginatedBrands"
          :key="brand.id"
          class="group relative rounded-md border border-gray-100 bg-white p-5 shadow-2xs transition-all duration-200 hover:shadow-md hover:border-blue-100 flex flex-col justify-between"
        >
          <!-- Top Card Meta -->
          <div>
            <div class="flex items-start justify-between gap-3">
              <!-- Brand Logo Badge -->
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gray-900 text-white font-black text-sm shadow-xs transition-transform group-hover:scale-105">
                <span v-if="brand.name === 'Nike'" class="text-xs font-black tracking-tighter">NIKE</span>
                <span v-else-if="brand.name === 'Adidas'" class="text-[11px] font-black tracking-tight">///</span>
                <span v-else-if="brand.name === 'Puma'" class="text-xs font-black tracking-tight">PUMA</span>
                <span v-else-if="brand.name === 'Mizuno'" class="text-xs font-black">MIZ</span>
                <span v-else-if="brand.name === 'New Balance'" class="text-xs font-black">NB</span>
                <span v-else-if="brand.name === 'Under Armour'" class="text-xs font-black">UA</span>
                <span v-else-if="brand.name === 'Asics'" class="text-xs font-black">AS</span>
                <span v-else-if="brand.name === 'Jordan'" class="text-xs font-black">23</span>
                <span v-else class="text-sm font-bold uppercase">{{ brand.name.charAt(0) }}</span>
              </div>

              <!-- Status Badge -->
              <button
                type="button"
                @click="toggleStatus(brand)"
                title="Click to toggle status"
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition"
                :class="
                  brand.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                "
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="brand.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'"
                ></span>
                <span>{{ brand.status === 'Active' ? 'Active Partner' : 'Paused' }}</span>
              </button>
            </div>

            <!-- Brand Info -->
            <div class="mt-4">
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                  {{ brand.name }}
                </h3>
                <!-- Verified Icon -->
                <svg class="h-4 w-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>

              <p class="text-[11px] font-medium text-gray-400 mt-0.5">
                {{ brand.countryCode }} • {{ brand.tier }}
              </p>

              <p class="mt-2 text-xs text-gray-500 line-clamp-2 min-h-[32px] leading-relaxed">
                {{ brand.description }}
              </p>

              <!-- Specialty Sport Tags -->
              <div class="mt-3 flex flex-wrap gap-1">
                <span
                  v-for="s in brand.specialties"
                  :key="s"
                  class="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                >
                  {{ s }}
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Card: Catalog Share & Actions -->
          <div class="mt-5 border-t border-gray-100 pt-3.5">
            <!-- Catalog bar -->
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-gray-900">{{ brand.products }} Products</span>
              <span class="text-[11px] font-medium text-gray-400">
                {{ Math.round((brand.products / (totalProducts || 1)) * 100) }}% store share
              </span>
            </div>

            <div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full bg-blue-600 transition-all duration-300"
                :style="{ width: `${Math.min(Math.round((brand.products / (totalProducts || 1)) * 100) * 2.5, 100)}%` }"
              ></div>
            </div>

            <!-- Card Bottom Bar with Actions -->
            <div class="mt-3 flex items-center justify-between pt-1">
              <!-- Browse products link -->
              <NuxtLink
                to="/admin/products"
                class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition"
              >
                <span>Browse catalog</span>
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>

              <!-- Borderless Action Icons -->
              <div class="flex items-center gap-2.5">
                <!-- Edit -->
                <NuxtLink
                  :to="`/admin/brands/${brand.id}/edit`"
                  title="Edit Brand Partner"
                  class="text-emerald-500 hover:text-emerald-700 hover:scale-125 transition-transform p-0.5"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </NuxtLink>

                <!-- Delete -->
                <button
                  type="button"
                  title="Delete Brand Partner"
                  class="text-red-400 hover:text-red-600 hover:scale-125 transition-transform p-0.5"
                  @click="openDeleteModal(brand)"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <!-- View Details -->
                <NuxtLink
                  :to="`/admin/brands/${brand.id}`"
                  title="View Brand Performance"
                  class="text-blue-400 hover:text-blue-600 hover:scale-125 transition-transform p-0.5"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. TABLE VIEW (STRUCTURED BRAND DIRECTORY) -->
      <div v-if="viewMode === 'table'" class="overflow-x-auto">
        <table class="w-full min-w-[950px] text-left text-xs">
          <!-- Table Header -->
          <thead class="border-b border-gray-100 bg-white">
            <tr>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                BRAND PARTNER
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                HEADQUARTERS & TIER
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                SPECIALTY FOCUS
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                CATALOG VOLUME & SHARE
              </th>
              <th class="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                PARTNERSHIP STATUS
              </th>
              <th class="px-6 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
                ACTIONS
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="divide-y divide-gray-100/80">
            <tr
              v-for="brand in paginatedBrands"
              :key="brand.id"
              class="transition hover:bg-gray-50/60"
            >
              <!-- 1. BRAND PARTNER -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <!-- Brand Logo Badge -->
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-900 text-white font-bold text-xs shadow-2xs">
                    <span v-if="brand.name === 'Nike'" class="text-[10px] font-black">NIKE</span>
                    <span v-else-if="brand.name === 'Adidas'" class="text-[10px] font-black">///</span>
                    <span v-else-if="brand.name === 'Puma'" class="text-[10px] font-black">PUMA</span>
                    <span v-else class="text-xs font-bold">{{ brand.name.slice(0, 2).toUpperCase() }}</span>
                  </div>

                  <div>
                    <div class="flex items-center gap-1.5">
                      <p class="font-bold text-gray-900 text-xs sm:text-sm">
                        {{ brand.name }}
                      </p>
                      <svg class="h-3.5 w-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <p class="mt-0.5 text-[11px] text-gray-400">
                      ID: BRD-{{ String(brand.id).padStart(4, "0") }} • {{ brand.website }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- 2. HEADQUARTERS & TIER -->
              <td class="px-6 py-4">
                <p class="font-bold text-gray-800 text-xs">
                  {{ brand.countryCode }}
                </p>
                <p class="mt-0.5 text-[11px] text-gray-400 truncate max-w-[180px]" :title="brand.origin">
                  {{ brand.origin }}
                </p>
              </td>

              <!-- 3. SPECIALTY FOCUS -->
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1 max-w-[200px]">
                  <span
                    v-for="s in brand.specialties"
                    :key="s"
                    class="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                  >
                    {{ s }}
                  </span>
                </div>
              </td>

              <!-- 4. CATALOG VOLUME & SHARE -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <span class="inline-block rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                    {{ brand.products }} items
                  </span>
                  <span class="text-[11px] font-medium text-gray-400">
                    ({{ Math.round((brand.products / (totalProducts || 1)) * 100) }}%)
                  </span>
                </div>
              </td>

              <!-- 5. PARTNERSHIP STATUS -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  type="button"
                  @click="toggleStatus(brand)"
                  title="Click to toggle"
                  class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition"
                  :class="
                    brand.status === 'Active'
                      ? 'border border-emerald-200/80 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100'
                      : 'border border-amber-200/80 bg-amber-50/50 text-amber-600 hover:bg-amber-100'
                  "
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="brand.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'"
                  ></span>
                  <span>{{ brand.status === 'Active' ? 'Active Partner' : 'Paused' }}</span>
                </button>
              </td>

              <!-- 6. ACTIONS (Borderless icons) -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-3">
                  <!-- Browse catalog link -->
                  <NuxtLink
                    to="/admin/products"
                    title="View catalog for this brand"
                    class="text-blue-500 hover:text-blue-700 hover:scale-125 transition-transform p-0.5"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </NuxtLink>

                  <!-- Edit -->
                  <NuxtLink
                    :to="`/admin/brands/${brand.id}/edit`"
                    title="Edit Partner Profile"
                    class="text-emerald-500 hover:text-emerald-700 hover:scale-125 transition-transform p-0.5"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </NuxtLink>

                  <!-- Delete -->
                  <button
                    type="button"
                    title="Delete Brand Partner"
                    class="text-red-400 hover:text-red-600 hover:scale-125 transition-transform p-0.5"
                    @click="openDeleteModal(brand)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <!-- Details -->
                  <NuxtLink
                    :to="`/admin/brands/${brand.id}`"
                    title="View Brand Performance"
                    class="text-blue-400 hover:text-blue-600 hover:scale-125 transition-transform p-0.5"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 5. EMPTY STATE -->
      <div
        v-if="filteredBrands.length === 0"
        class="py-16 text-center"
      >
        <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="mt-3 text-sm font-bold text-gray-900">No brand partners found</h3>
        <p class="mt-1 text-xs text-gray-400">Try adjusting your search terms or specialty filters.</p>
        <button
          type="button"
          class="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>

      <!-- 6. TABLE FOOTER -->
      <div
        v-if="filteredBrands.length > 0"
        class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 bg-white text-xs text-gray-400 font-medium"
      >
        <p>
          Showing {{ paginationStart }} to {{ paginationEnd }} of {{ filteredBrands.length }} brand partners
        </p>

        <!-- Pagination Controls -->
        <div class="flex items-center gap-2">
          <!-- Prev -->
          <button
            type="button"
            :disabled="currentPage === 1"
            class="text-xs font-medium text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            @click="currentPage--"
          >
            Prev
          </button>

          <!-- Pages -->
          <div class="flex items-center gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              class="h-7 min-w-[28px] px-2 rounded-md border text-xs font-semibold transition"
              :class="
                currentPage === page
                  ? 'border-blue-500 bg-white text-blue-600 font-bold shadow-2xs'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              "
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>

          <!-- Next -->
          <button
            type="button"
            :disabled="currentPage === totalPages"
            class="text-xs font-medium text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- =====================================
         DELETE CONFIRMATION MODAL
    ====================================== -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-sm rounded-md bg-white p-5 shadow-xl border border-gray-100">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h2 class="mt-3 text-sm font-bold text-gray-900">Delete Brand Partner?</h2>
        <p class="mt-1 text-xs leading-relaxed text-gray-500">
          Are you sure you want to delete <span class="font-semibold text-gray-900">{{ selectedBrand?.name }}</span>? All associated partner records will be unlinked.
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
            class="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 transition"
            @click="deleteBrand"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
