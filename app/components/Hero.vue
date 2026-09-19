<template>
  <section class="relative min-h-[500px] w-full overflow-hidden bg-[#07090e] sm:h-[580px] lg:h-[620px]">
    <!-- Slides -->
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 transition-opacity duration-1000"
      :class="currentSlide === index ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    >
      <!-- Background Image with subtle zoom on active -->
      <img
        :src="slide.image"
        :alt="slide.title"
        class="h-full w-full object-cover transition-transform duration-10000 ease-out"
        :class="currentSlide === index ? 'scale-110' : 'scale-100'"
      />

      <!-- Cyber Dark Gradient Overlay with Neon Atmosphere -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/75 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/30"></div>

      <!-- Content -->
      <div class="absolute inset-0 flex items-center">
        <div class="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div class="max-w-2xl text-white">
            <!-- Neon Pill Tag -->
            <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-400/40 bg-lime-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-lime-400 shadow-[0_0_15px_rgba(183,243,74,0.2)]">
              <span class="h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
              <span>{{ slide.subtitle || "NEXT-GEN ATHLETICS · 2026" }}</span>
            </div>

            <!-- Big Glowing Headline -->
            <h1
              class="text-4xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl"
            >
              <span class="block text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                {{ slide.title }}
              </span>
            </h1>

            <!-- Description -->
            <p class="mt-5 text-sm sm:text-base lg:text-lg text-gray-300 max-w-lg leading-relaxed drop-shadow">
              {{ slide.description }}
            </p>

            <!-- Dual Action CTAs -->
            <div class="mt-8 flex flex-wrap items-center gap-4">
              <NuxtLink
                to="/Product"
                class="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/30 transition duration-300 hover:scale-105 hover:bg-lime-300 hover:shadow-[0_0_30px_rgba(183,243,74,0.5)] active:scale-95"
              >
                <span>Shop The Collection</span>
                <span class="text-base">&rarr;</span>
              </NuxtLink>

              <NuxtLink
                to="/Product?type=popular"
                class="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20 hover:border-lime-400/60 active:scale-95"
              >
                <span>⚡ Trending Gear</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows with Glassmorphic styling -->
    <button
      @click="prevSlide"
      aria-label="Previous slide"
      class="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-2xl text-white backdrop-blur-md transition hover:bg-lime-400 hover:text-black hover:border-lime-400 hover:scale-110 active:scale-95"
    >
      ‹
    </button>

    <button
      @click="nextSlide"
      aria-label="Next slide"
      class="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-2xl text-white backdrop-blur-md transition hover:bg-lime-400 hover:text-black hover:border-lime-400 hover:scale-110 active:scale-95"
    >
      ›
    </button>

    <!-- Indicators -->
    <div class="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
      <button
        v-for="(_, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
        class="h-2 rounded-full transition-all duration-300"
        :class="currentSlide === index ? 'w-10 bg-lime-400 shadow-[0_0_10px_#b7f34a]' : 'w-2.5 bg-white/40 hover:bg-white/70'"
      ></button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { HeroSlide } from "~/type/storefront";
import { heroSlideSeedData } from "~/data/storefront";
import { useApiBase } from "~/composables/useApi";

const apiBase = useApiBase();
const slides = ref<HeroSlide[]>(heroSlideSeedData);
const currentSlide = ref(0);

const fetchSlides = async () => {
  try {
    const res = await fetch(`${apiBase}/heroSlides`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        slides.value = data;
      }
    }
  } catch (error) {
    console.error("Failed to fetch slides from frontend:", error);
  }
};

let slideInterval: ReturnType<typeof setInterval>;

const nextSlide = () => {
  if (slides.value.length === 0) return;
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  if (slides.value.length === 0) return;
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

onMounted(() => {
  fetchSlides();
  slideInterval = setInterval(() => {
    nextSlide();
  }, 4500);
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>
