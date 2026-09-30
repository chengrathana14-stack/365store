<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Product } from "~/type/product";
import { products as fallbackProducts } from "~/data/product";
import { useApiBase } from "~/composables/useApi";
import { useAdminStore } from "~/composables/useAdminStore";
import { useToast } from "~/composables/useToast";
import RecentlyViewed from "~/components/RecentlyViewed.vue";

definePageMeta({
  layout: "user",
});

const apiBase = useApiBase();
const { applyOverrides } = useAdminStore();
const { success } = useToast();

const products = ref<Product[]>(applyOverrides(fallbackProducts));
const isLoading = ref(true);

const newsletterEmail = ref("");
const unlockedCoupon = ref<string | null>(null);

const loadProducts = async () => {
  try {
    const res = await fetch(`${apiBase}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        products.value = applyOverrides(
          data.map((p: any) => ({
            ...p,
            id: Number(p.id),
          }))
        );
      } else {
        products.value = applyOverrides(fallbackProducts);
      }
    } else {
      products.value = applyOverrides(fallbackProducts);
    }
  } catch (error) {
    console.error("Failed to fetch products from frontend:", error);
    products.value = applyOverrides(fallbackProducts);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});

// Popular Products
const popularProducts = computed(() => {
  return products.value
    .filter((product) => product.popular === true)
    .slice(0, 4);
});

// Discount Products
const discountProducts = computed(() => {
  return products.value
    .filter((product) => product.discount > 0 && !product.popular)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 4);
});

// Sports Disciplines Bento Data
const sportCategories = [
  {
    name: "Running & Marathon",
    slug: "running",
    categoryParam: "Shoes",
    tagline: "Carbon-Plated Propulsion & Pace",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    badge: "Most Popular",
    colSpan: "sm:col-span-2 lg:col-span-8",
  },
  {
    name: "Basketball",
    slug: "basketball",
    categoryParam: "Shoes",
    tagline: "High-Top Ankle Lock & Court Grip",
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&auto=format&fit=crop&q=80",
    badge: "Court Tested",
    colSpan: "sm:col-span-1 lg:col-span-4",
  },
  {
    name: "Gym & Strength Training",
    slug: "training",
    categoryParam: "Clothing",
    tagline: "Ultra-Durable Agility & Power Lifting",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    badge: "High Durability",
    colSpan: "sm:col-span-1 lg:col-span-4",
  },
  {
    name: "Football & Turf",
    slug: "football",
    categoryParam: "Shoes",
    tagline: "Precision Strike Firm-Ground Cleats",
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80",
    badge: "Speed Control",
    colSpan: "sm:col-span-1 lg:col-span-4",
  },
  {
    name: "Athletic Streetwear",
    slug: "streetwear",
    categoryParam: "Clothing",
    tagline: "Iconic Sport Hoodies & Everyday Drops",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&auto=format&fit=crop&q=80",
    badge: "Lifestyle",
    colSpan: "sm:col-span-2 lg:col-span-4",
  },
];

// Innovation Lab Tech Highlights
const techInnovations = [
  {
    title: "Kinetic Carbon Propulsion",
    subtitle: "AeroPlate 3.0",
    description: "Curved full-length carbon composite plate embedded inside high-resilience foam delivers explosive energy return with every toe-off.",
    icon: "⚡",
    tag: "Footwear Engineering",
  },
  {
    title: "AeroBreeze 4-Way Mesh",
    subtitle: "Thermo-Shield Tech",
    description: "Zoned micro-perforations channel air across the foot, wicking sweat instantaneously under hot tropical training climates.",
    icon: "🌬️",
    tag: "Upper Material",
  },
  {
    title: "Cambodian All-Weather Grip",
    subtitle: "High-Abrasion Rubber",
    description: "Engineered multi-directional lug patterns optimized for both pavement sprint intervals and wet tarmac stability.",
    icon: "🛡️",
    tag: "Outsole Durability",
  },
  {
    title: "Bakong KHQR Instant Checkout",
    subtitle: "Zero Fees · Sub-second",
    description: "Scan to pay with any Cambodian banking app (ABA, Acleda, Canadia, Wing) with automated order confirmation.",
    icon: "📱",
    tag: "Payment Innovation",
  },
];

// Athlete Testimonials
const athleteReviews = [
  {
    name: "Sopheap Seng",
    sport: "Marathon Runner · Phnom Penh",
    rating: 5,
    quote: "The carbon-plate shoes from 365 Sport shaved 4 minutes off my half-marathon personal best. Plus, paying via KHQR was done in seconds.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Piseth Kim",
    sport: "National Basketball League Player",
    rating: 5,
    quote: "Courtside traction is incredible. Zero slippage on indoor wooden floors. Authentic gear delivered to my doorstep the very next day.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Channary Meas",
    sport: "CrossFit Coach & Athlete",
    rating: 5,
    quote: "365 Sports is the only store in Cambodia that consistently stocks genuine top-tier performance shoes and breathable sportswear.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
];

// Newsletter Coupon Generator
const handleSubscribe = () => {
  if (!newsletterEmail.value || !newsletterEmail.value.includes("@")) return;
  unlockedCoupon.value = "WELCOME365";
  success("Welcome to Club 365!", "Your 10% discount code 'WELCOME365' has been unlocked.");
};

const copyCoupon = () => {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText("WELCOME365");
    success("Copied to Clipboard!", "Use code WELCOME365 at checkout for 10% off.");
  }
};
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- ================= HERO ================= -->
    <Hero />

    <!-- ================= HIGH-TECH TRUST TICKER ================= -->
    <section class="border-y border-white/10 bg-black/60 backdrop-blur-xl text-white">
      <div class="mx-auto grid max-w-7xl gap-6 px-6 py-6 text-xs sm:grid-cols-4 lg:px-8">
        <div class="flex items-center gap-3.5 group">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-400 font-black text-sm group-hover:scale-105 transition">01</span>
          <div>
            <h4 class="font-bold text-white tracking-wide">100% Elite Gear</h4>
            <p class="text-[11px] text-gray-400">Tested & certified authentic</p>
          </div>
        </div>

        <div class="flex items-center gap-3.5 group">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-black text-sm group-hover:scale-105 transition">02</span>
          <div>
            <h4 class="font-bold text-white tracking-wide">Nationwide Delivery</h4>
            <p class="text-[11px] text-gray-400">1-2 days across Cambodia</p>
          </div>
        </div>

        <div class="flex items-center gap-3.5 group">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 border border-purple-400/30 text-purple-400 font-black text-sm group-hover:scale-105 transition">03</span>
          <div>
            <h4 class="font-bold text-white tracking-wide">Easy Exchanges</h4>
            <p class="text-[11px] text-gray-400">30-day size swap guarantee</p>
          </div>
        </div>

        <div class="flex items-center gap-3.5 group">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-black text-sm group-hover:scale-105 transition">04</span>
          <div>
            <h4 class="font-bold text-white tracking-wide">KHQR Instant Pay</h4>
            <p class="text-[11px] text-gray-400">Scan & pay with Bakong apps</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= SHOP BY SPORT / DISCIPLINE (BENTO SHOWCASE) ================= -->
    <section class="py-20 relative">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Section Header -->
        <div class="mb-10 flex items-end justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="h-6 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff]"></span>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                Shop By Discipline
              </h2>
            </div>
            <p class="mt-2 text-xs sm:text-sm text-gray-400">
              Curated technical equipment engineered specifically for your sport
            </p>
          </div>

          <NuxtLink
            to="/Product"
            class="hidden text-xs font-black uppercase tracking-wider text-cyan-400 transition hover:text-cyan-300 hover:underline sm:inline-flex items-center gap-1.5"
          >
            <span>View All Sports</span>
            <span aria-hidden="true">&rarr;</span>
          </NuxtLink>
        </div>

        <!-- Bento Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
          <NuxtLink
            v-for="sport in sportCategories"
            :key="sport.slug"
            :to="`/Product?category=${encodeURIComponent(sport.categoryParam)}`"
            :class="sport.colSpan"
            class="group relative min-h-[260px] sm:min-h-[290px] overflow-hidden rounded-3xl border border-white/10 bg-[#0d1017] p-7 flex flex-col justify-between transition-all duration-500 hover:border-lime-400/60 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
          >
            <!-- Background Image with Zoom -->
            <img
              :src="sport.image"
              :alt="sport.name"
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-40 group-hover:opacity-60"
            />

            <!-- Dark Vignette Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/70 to-transparent"></div>

            <!-- Top Pill Badge -->
            <div class="relative z-10 flex items-center justify-between">
              <span class="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-lime-400 backdrop-blur-md">
                {{ sport.badge }}
              </span>

              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition group-hover:bg-lime-400 group-hover:text-black group-hover:scale-110">
                &rarr;
              </span>
            </div>

            <!-- Content bottom -->
            <div class="relative z-10">
              <h3 class="text-xl sm:text-2xl font-black uppercase tracking-tight text-white group-hover:text-lime-400 transition">
                {{ sport.name }}
              </h3>
              <p class="mt-1 text-xs text-gray-300 max-w-sm line-clamp-1">
                {{ sport.tagline }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ================= POPULAR PRODUCTS ================= -->
    <section class="py-20 border-t border-white/10 relative">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Section Header -->
        <div class="mb-10 flex items-end justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="h-6 w-1.5 rounded-full bg-lime-400 shadow-[0_0_12px_#b7f34a]"></span>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                Trending Popular Gear
              </h2>
            </div>

            <p class="mt-2 text-xs sm:text-sm text-gray-400">
              Top trending high-performance shoes and apparel selected for champions
            </p>
          </div>

          <!-- View All -->
          <NuxtLink
            to="/Product?type=popular"
            class="hidden text-xs font-black uppercase tracking-wider text-lime-400 transition hover:text-lime-300 hover:underline sm:inline-flex items-center gap-1.5"
          >
            <span>View All</span>
            <span aria-hidden="true">&rarr;</span>
          </NuxtLink>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard
            v-for="product in popularProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Mobile View All -->
        <div class="mt-8 text-center sm:hidden">
          <NuxtLink
            to="/Product?type=popular"
            class="inline-flex items-center justify-center rounded-xl bg-lime-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300"
          >
            View All Products &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ================= 365 INNOVATION LAB (ATHLETIC TECH SHOWCASE) ================= -->
    <section class="py-20 border-t border-white/10 relative overflow-hidden bg-radial from-lime-400/5 via-transparent to-transparent">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <div class="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-1 text-xs font-black uppercase tracking-widest text-lime-400 mb-3">
            <span class="h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
            365 LAB · ATHLETIC ENGINEERING
          </div>
          <h2 class="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Designed To Break Records
          </h2>
          <p class="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
            Every millimeter of our footwear and apparel is built with purpose. Experience cutting-edge sports science tested under rigorous conditions.
          </p>
        </div>

        <!-- Tech Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="tech in techInnovations"
            :key="tech.title"
            class="rounded-3xl border border-white/10 bg-[#0d1017]/85 p-6 backdrop-blur-xl transition hover:border-lime-400/50 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(183,243,74,0.15)] group"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-2xl group-hover:scale-110 transition mb-4">
              {{ tech.icon }}
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-lime-400">{{ tech.tag }}</span>
            <h3 class="text-base font-black text-white mt-1">{{ tech.title }}</h3>
            <p class="text-xs text-gray-400 mt-2 leading-relaxed">
              {{ tech.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= SPECIAL DISCOUNT DEALS ================= -->
    <section class="py-20 border-t border-white/10 relative">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Section Header -->
        <div class="mb-10 flex items-end justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="h-6 w-1.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444]"></span>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                Special Discount Deals
              </h2>
            </div>

            <p class="mt-2 text-xs sm:text-sm text-gray-400">
              Get authentic gear at limited-time discounted prices
            </p>
          </div>

          <!-- View All -->
          <NuxtLink
            to="/Product?type=discount"
            class="hidden text-xs font-black uppercase tracking-wider text-lime-400 transition hover:text-lime-300 hover:underline sm:inline-flex items-center gap-1.5"
          >
            <span>View All Deals</span>
            <span aria-hidden="true">&rarr;</span>
          </NuxtLink>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard
            v-for="product in discountProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Mobile View All -->
        <div class="mt-8 text-center sm:hidden">
          <NuxtLink
            to="/Product?type=discount"
            class="inline-flex items-center justify-center rounded-xl bg-lime-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300"
          >
            View All Deals &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ================= ATHLETE TESTIMONIALS (#365ATHLETES) ================= -->
    <section class="py-20 border-t border-white/10 relative bg-black/40">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mb-12 text-center max-w-xl mx-auto">
          <span class="text-xs font-black uppercase tracking-widest text-lime-400">Trusted By Champions</span>
          <h2 class="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
            Voices of #365Athletes
          </h2>
          <p class="text-xs sm:text-sm text-gray-400 mt-1">
            From morning road runs along the Tonle Sap to championship arenas
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="review in athleteReviews"
            :key="review.name"
            class="rounded-3xl border border-white/10 bg-[#0d1017]/80 p-6 flex flex-col justify-between"
          >
            <div>
              <div class="flex text-amber-400 text-sm mb-3">★★★★★</div>
              <p class="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                "{{ review.quote }}"
              </p>
            </div>

            <div class="mt-6 flex items-center gap-3 pt-4 border-t border-white/10">
              <img
                :src="review.avatar"
                :alt="review.name"
                class="h-11 w-11 rounded-full object-cover border border-lime-400/50"
              />
              <div>
                <h4 class="text-xs font-bold text-white">{{ review.name }}</h4>
                <p class="text-[10px] text-gray-400">{{ review.sport }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= RECENTLY VIEWED PRODUCTS (DYNAMIC LOCALSTORAGE) ================= -->
    <RecentlyViewed />

    <!-- ================= CLUB 365 VIP DROPS & NEWSLETTER ================= -->
    <section class="py-20 border-t border-white/10 relative">
      <div class="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <div class="rounded-3xl border border-lime-400/30 bg-linear-to-b from-[#0d1017] via-[#07090e] to-black p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <!-- Ambient Glow in Newsletter Box -->
          <div class="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-lime-400/15 blur-3xl"></div>

          <span class="inline-flex items-center gap-1.5 rounded-full bg-lime-400/10 border border-lime-400/30 px-3.5 py-1 text-xs font-black uppercase text-lime-400 mb-4">
            <span>⚡</span>
            <span>Join 365 Athletic Club</span>
          </span>

          <h2 class="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Unlock 10% Off Your First Drop
          </h2>

          <p class="mt-3 text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
            Get exclusive early access to limited sneaker releases, athlete training tips, and member-only secret discount codes.
          </p>

          <!-- Interactive Input Form -->
          <form
            v-if="!unlockedCoupon"
            @submit.prevent="handleSubscribe"
            class="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              v-model="newsletterEmail"
              type="email"
              required
              placeholder="Enter your email address"
              class="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
            />
            <button
              type="submit"
              class="rounded-xl bg-lime-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(183,243,74,0.5)] active:scale-95 shrink-0"
            >
              Unlock Code &rarr;
            </button>
          </form>

          <!-- Unlocked Coupon Banner -->
          <div
            v-else
            class="mt-6 rounded-2xl border border-lime-400/50 bg-lime-400/10 p-5 max-w-md mx-auto animate-in zoom-in-95"
          >
            <p class="text-xs text-lime-300 font-bold">🎉 Welcome to the Club! Your 10% Off Code:</p>
            <div class="mt-2 flex items-center justify-center gap-3">
              <span class="rounded-xl border border-lime-400 bg-black px-4 py-2 font-mono text-base font-black text-lime-400 tracking-widest">
                WELCOME365
              </span>
              <button
                type="button"
                @click="copyCoupon"
                class="rounded-xl bg-lime-400 px-4 py-2 text-xs font-black uppercase text-black hover:bg-lime-300 transition"
              >
                Copy
              </button>
            </div>
            <p class="mt-2 text-[10px] text-gray-400">Apply this code at checkout to enjoy 10% discount on all performance gear.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
