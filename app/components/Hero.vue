<template>
  <section class="relative min-h-125 w-full overflow-hidden bg-black sm:h-140">
    <!-- Slides -->
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 transition-opacity duration-700"
      :class="currentSlide === index ? 'opacity-100' : 'opacity-0'"
    >
      <!-- Background Image -->
      <img
        :src="slide.image"
        :alt="slide.title"
        class="h-full w-full object-cover"
      />

      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/55"></div>

      <!-- Content -->
      <div class="absolute inset-0 flex items-center">
        <div class="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div class="max-w-xl text-white">
            <p
              class="mb-3 text-sm font-bold uppercase tracking-[4px] text-lime-400"
            >
              {{ slide.subtitle }}
            </p>

            <h1
              class="text-4xl font-black uppercase leading-[0.95] sm:text-6xl lg:text-7xl"
            >
              {{ slide.title }}
            </h1>

            <p class="mt-5 text-base text-gray-200 sm:text-lg">
              {{ slide.description }}
            </p>

            <NuxtLink
              to="/Product"
              class="mt-8 inline-flex rounded-md bg-lime-400 px-7 py-3 font-bold uppercase text-black transition duration-300 hover:scale-105 hover:bg-lime-300"
            >
              Shop Now
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Previous Button -->
    <button
      @click="prevSlide"
      aria-label="Previous slide"
      class="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-2xl text-white backdrop-blur-sm transition hover:bg-lime-400 hover:text-black"
    >
      ‹
    </button>

    <!-- Next Button -->
    <button
      @click="nextSlide"
      aria-label="Next slide"
      class="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-2xl text-white backdrop-blur-sm transition hover:bg-lime-400 hover:text-black"
    >
      ›
    </button>

    <!-- Dots -->
    <div class="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2">
      <button
        v-for="(_, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
        class="h-2 rounded-full transition-all duration-300"
        :class="currentSlide === index ? 'w-8 bg-lime-400' : 'w-2 bg-white/60'"
      ></button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const currentSlide = ref(0);

const slides = [
  {
    title: "Move With Power",
    subtitle: "365 Sport",
    description:
      "Discover premium sportswear designed to help you perform at your best.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Run Your Game",
    subtitle: "New Collection",
    description: "Performance running shoes and gear built for every step.",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Play Without Limits",
    subtitle: "Basketball",
    description:
      "Upgrade your basketball game with the latest performance collection.",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80",
  },
];

let slideInterval: ReturnType<typeof setInterval>;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

onMounted(() => {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 4000);
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>
