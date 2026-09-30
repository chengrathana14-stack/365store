<template>
  <Teleport to="body">
    <div
      v-if="isSearchOpen"
      class="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      @click.self="closeSearch"
    >
      <div
        class="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-[#0d1017]/95 shadow-[0_25px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]"
      >
        <!-- Search Header Bar -->
        <div class="relative flex items-center border-b border-white/10 px-5 py-4">
          <!-- Search Icon -->
          <svg
            class="h-5 w-5 text-lime-400 shrink-0 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>

          <!-- Search Input -->
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Search footwear, sportswear, brands, or gear... (Press Esc to close)"
            class="w-full bg-transparent text-sm sm:text-base text-white placeholder-gray-500 outline-none font-medium"
            @keydown.esc="closeSearch"
            @keydown.enter="handleEnterKey"
          />

          <!-- Clear Query Button -->
          <button
            v-if="query"
            type="button"
            @click="query = ''"
            class="mr-2 text-xs font-bold text-gray-400 hover:text-white px-2 py-1 rounded-md bg-white/5"
          >
            Clear
          </button>

          <!-- ESC Key Hint -->
          <div class="hidden sm:flex items-center gap-1.5 pl-2 border-l border-white/10">
            <kbd class="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-gray-300">ESC</kbd>
          </div>

          <!-- Close Button -->
          <button
            type="button"
            @click="closeSearch"
            class="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-400 transition hover:bg-white/20 hover:text-white"
            title="Close Search"
          >
            ✕
          </button>
        </div>

        <!-- Filter Chips Row -->
        <div class="flex items-center gap-2 overflow-x-auto px-5 py-3 border-b border-white/10 custom-scrollbar shrink-0 bg-white/[0.02]">
          <span class="text-[10px] font-black uppercase tracking-wider text-gray-400 shrink-0">Filter:</span>
          <button
            v-for="filter in filterOptions"
            :key="filter.label"
            type="button"
            @click="activeFilter = filter.value"
            class="shrink-0 rounded-full px-3 py-1 text-xs font-bold transition flex items-center gap-1"
            :class="
              activeFilter === filter.value
                ? 'bg-lime-400 text-black shadow-[0_0_12px_rgba(183,243,74,0.3)]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
            "
          >
            <span>{{ filter.label }}</span>
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto p-5 custom-scrollbar flex-1 space-y-6">
          <!-- 1. Recent Searches & Trending Quick Queries (When query is empty) -->
          <div v-if="!query.trim()" class="space-y-6">
            <!-- Recent Searches -->
            <div v-if="recentSearches.length > 0">
              <div class="flex items-center justify-between mb-2.5">
                <span class="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <svg class="h-3.5 w-3.5 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Recent Searches</span>
                </span>
                <button
                  type="button"
                  @click="clearRecentSearches"
                  class="text-[11px] text-gray-500 hover:text-red-400 transition"
                >
                  Clear all
                </button>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in recentSearches"
                  :key="item"
                  type="button"
                  @click="selectQuery(item)"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:border-lime-400/40 hover:text-lime-300 transition"
                >
                  <span>{{ item }}</span>
                  <span class="text-[10px] text-gray-500">↗</span>
                </button>
              </div>
            </div>

            <!-- Trending Suggestions -->
            <div>
              <span class="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-2.5">
                <span>🔥</span>
                <span>Trending Athlete Searches</span>
              </span>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  v-for="trend in trendingQueries"
                  :key="trend.title"
                  type="button"
                  @click="selectQuery(trend.query)"
                  class="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-lime-400/50 hover:bg-white/10"
                >
                  <span class="text-lg">{{ trend.icon }}</span>
                  <div>
                    <p class="text-xs font-bold text-white">{{ trend.title }}</p>
                    <p class="text-[10px] text-gray-400">{{ trend.subtitle }}</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Spotlight Recommended Gear -->
            <div>
              <span class="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-2.5">
                <span class="h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
                <span>Featured Recommendations</span>
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="item in featuredProducts"
                  :key="item.id"
                  class="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-2.5 transition hover:border-lime-400/40 hover:bg-white/10 cursor-pointer group"
                  @click="goToProduct(item)"
                >
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="h-14 w-14 rounded-xl object-cover bg-neutral-900 border border-white/10 group-hover:scale-105 transition"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-[10px] font-black uppercase text-lime-400">{{ item.brand }} · {{ item.category }}</p>
                    <h4 class="text-xs font-bold text-white truncate">{{ item.name }}</h4>
                    <p class="text-xs font-black text-lime-400 mt-0.5">${{ item.price.toFixed(2) }}</p>
                  </div>
                  <span class="text-gray-500 group-hover:text-lime-400 group-hover:translate-x-1 transition text-xs pr-2">→</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Live Search Results (When query is active) -->
          <div v-else>
            <!-- Results Counter & Status -->
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <span class="text-xs text-gray-400">
                Found <strong class="text-white">{{ filteredResults.length }}</strong> results for "<span class="text-lime-400 font-bold">{{ query }}</span>"
              </span>
              <NuxtLink
                :to="`/Product?search=${encodeURIComponent(query)}`"
                @click="closeSearch"
                class="text-xs font-bold text-lime-400 hover:underline"
              >
                View in Catalog &rarr;
              </NuxtLink>
            </div>

            <!-- Empty Results -->
            <div v-if="filteredResults.length === 0" class="py-12 text-center">
              <span class="text-4xl">🔍</span>
              <h3 class="mt-3 text-base font-bold text-white">No products found</h3>
              <p class="mt-1 text-xs text-gray-400 max-w-sm mx-auto">
                We couldn't find any gear matching "{{ query }}". Try searching for "Nike", "Running", "Hoodie" or explore categories.
              </p>
              <div class="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  v-for="sugg in ['Nike', 'Puma', 'Shoes', 'Adidas']"
                  :key="sugg"
                  type="button"
                  @click="selectQuery(sugg)"
                  class="rounded-xl border border-white/15 bg-white/5 px-3 py-1 text-xs text-lime-300 hover:bg-white/10"
                >
                  Try "{{ sugg }}"
                </button>
              </div>
            </div>

            <!-- Results List Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="product in filteredResults"
                :key="product.id"
                class="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-lime-400/50 hover:bg-white/10 hover:shadow-lg"
              >
                <!-- Thumbnail -->
                <div
                  class="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-900 border border-white/10 cursor-pointer"
                  @click="goToProduct(product)"
                >
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  <span
                    v-if="product.discount"
                    class="absolute top-1 left-1 rounded bg-red-600 px-1 text-[9px] font-black text-white"
                  >
                    -{{ product.discount }}%
                  </span>
                </div>

                <!-- Info -->
                <div class="min-w-0 flex-1 cursor-pointer" @click="goToProduct(product)">
                  <div class="flex items-center gap-1.5 text-[10px] font-black uppercase text-lime-400">
                    <span>{{ product.brand }}</span>
                    <span>•</span>
                    <span class="text-gray-400">{{ product.category }}</span>
                  </div>
                  <h4 class="text-xs font-bold text-white truncate group-hover:text-lime-400 transition">
                    {{ product.name }}
                  </h4>
                  <div class="mt-1 flex items-baseline gap-2">
                    <span class="text-xs font-black text-lime-400">
                      ${{ product.price.toFixed(2) }}
                    </span>
                    <span
                      v-if="product.discount"
                      class="text-[10px] text-gray-500 line-through"
                    >
                      ${{ (product.price / (1 - product.discount / 100)).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <!-- Action Button: Add to Cart -->
                <button
                  type="button"
                  @click.stop="handleQuickAdd(product)"
                  class="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-gray-300 transition hover:bg-lime-400 hover:text-black hover:border-lime-400"
                  title="Add to cart"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Footer -->
        <div class="border-t border-white/10 px-5 py-3 flex items-center justify-between text-[11px] text-gray-400 bg-black/40">
          <div class="flex items-center gap-3">
            <span>💡 Tip: Press <kbd class="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-[10px]">Ctrl+K</kbd> anywhere</span>
          </div>
          <span>365 Sport Smart Search</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import type { Product } from "~/type/product";
import { products as fallbackProducts } from "~/data/product";
import { useApiBase } from "~/composables/useApi";
import { useSearch } from "~/composables/useSearch";
import { useCart } from "~/composables/useCart";
import { useToast } from "~/composables/useToast";

const router = useRouter();
const apiBase = useApiBase();
const { isSearchOpen, searchQuery, recentSearches, closeSearch, addRecentSearch, clearRecentSearches, loadRecentSearches } = useSearch();
const { addToCart } = useCart();
const { success } = useToast();

const inputRef = ref<HTMLInputElement | null>(null);
const query = ref("");
const activeFilter = ref("all");
const allProducts = ref<Product[]>(fallbackProducts);

const filterOptions = [
  { label: "All Gear", value: "all" },
  { label: "Shoes", value: "shoes" },
  { label: "Clothing", value: "clothing" },
  { label: "Accessories", value: "accessories" },
  { label: "Nike", value: "nike" },
  { label: "Adidas", value: "adidas" },
  { label: "Discount", value: "discount" },
];

const trendingQueries = [
  { title: "Alphafly & Vaporfly", subtitle: "Marathon racing", icon: "👟", query: "Alphafly" },
  { title: "Basketball High-tops", subtitle: "Court grip shoes", icon: "🏀", query: "Basketball" },
  { title: "Pro Fleece Hoodies", subtitle: "Warmup apparel", icon: "🧥", query: "Hoodie" },
  { title: "Special Deals", subtitle: "Up to 30% off", icon: "🔥", query: "discount" },
];

const loadProducts = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${apiBase}/products`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allProducts.value = data.map((p: any) => ({
          ...p,
          id: Number(p.id),
        }));
      }
    }
  } catch {}
};

const featuredProducts = computed(() => {
  return allProducts.value.filter((p) => p.featured || p.popular).slice(0, 4);
});

const filteredResults = computed(() => {
  let list = allProducts.value;

  // Filter category / brand
  if (activeFilter.value === "shoes") {
    list = list.filter((p) => p.category.toLowerCase().includes("shoe") || p.category.toLowerCase().includes("footwear"));
  } else if (activeFilter.value === "clothing") {
    list = list.filter((p) => ["clothing", "shirt", "pant", "hoodie", "jacket"].some((c) => p.category.toLowerCase().includes(c)));
  } else if (activeFilter.value === "accessories") {
    list = list.filter((p) => p.category.toLowerCase().includes("accessor"));
  } else if (activeFilter.value === "nike") {
    list = list.filter((p) => p.brand.toLowerCase() === "nike");
  } else if (activeFilter.value === "adidas") {
    list = list.filter((p) => p.brand.toLowerCase() === "adidas");
  } else if (activeFilter.value === "discount") {
    list = list.filter((p) => p.discount > 0);
  }

  const q = query.value.trim().toLowerCase();
  if (!q) return list;

  return list.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.color && p.color.toLowerCase().includes(q))
    );
  });
});

const selectQuery = (q: string) => {
  if (q.toLowerCase() === "discount") {
    activeFilter.value = "discount";
    query.value = "";
  } else {
    query.value = q;
  }
};

const handleEnterKey = () => {
  if (query.value.trim()) {
    addRecentSearch(query.value);
  }
};

const goToProduct = (product: Product) => {
  if (query.value.trim()) {
    addRecentSearch(query.value);
  }
  closeSearch();
  router.push(`/Product/${product.id}`);
};

const handleQuickAdd = (product: Product) => {
  const defaultSize = product.size?.[0] || "";
  addToCart(product, 1, defaultSize);
  success("Added to Bag!", `${product.name} (Size: ${defaultSize})`);
};

// Keybindings: Ctrl+K / Cmd+K / Slash (/)
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (isSearchOpen.value) {
      closeSearch();
    } else {
      isSearchOpen.value = true;
    }
  } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
    e.preventDefault();
    isSearchOpen.value = true;
  }
};

watch(isSearchOpen, (open) => {
  if (open) {
    loadRecentSearches();
    loadProducts();
    if (searchQuery.value) {
      query.value = searchQuery.value;
    }
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

onMounted(() => {
  loadRecentSearches();
  loadProducts();
  window.addEventListener("keydown", handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
});
</script>
