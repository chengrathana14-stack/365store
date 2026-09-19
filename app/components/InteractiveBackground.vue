<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f6f8f4]">
    <!-- High-tech subtle dot matrix pattern overlay -->
    <div
      class="absolute inset-0 opacity-[0.45]"
      style="
        background-image: radial-gradient(rgba(16, 19, 16, 0.12) 1px, transparent 1px);
        background-size: 28px 28px;
      "
    ></div>

    <!-- Radial subtle gradient vignette -->
    <div
      class="absolute inset-0 bg-radial from-transparent via-[#f6f8f4]/60 to-[#f6f8f4]"
    ></div>

    <!-- Floating Glowing Mesh Spheres with Keyframe Animations -->
    <!-- Orb 1: Signature Sport Lime Glow (Top-Left to Center) -->
    <div
      class="mesh-orb orb-1 absolute -top-32 -left-32 h-120 w-120 rounded-full bg-linear-to-tr from-lime-400/25 to-emerald-300/15 blur-3xl"
      :style="orb1Style"
    ></div>

    <!-- Orb 2: Electric Cyan / White Ambient (Top-Right) -->
    <div
      class="mesh-orb orb-2 absolute top-1/4 -right-40 h-130 w-130 rounded-full bg-linear-to-bl from-teal-400/15 via-lime-300/10 to-transparent blur-3xl"
      :style="orb2Style"
    ></div>

    <!-- Orb 3: Deep Dynamic Sport Pulse (Bottom-Left) -->
    <div
      class="mesh-orb orb-3 absolute -bottom-40 left-1/3 h-140 w-140 rounded-full bg-linear-to-t from-lime-400/20 via-emerald-400/10 to-transparent blur-3xl"
      :style="orb3Style"
    ></div>

    <!-- Subtle interactive light follower on mouse move -->
    <div
      class="pointer-events-none absolute h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/10 blur-3xl transition-transform duration-500 ease-out"
      :style="{
        left: `${mousePos.x}px`,
        top: `${mousePos.y}px`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

const mousePos = ref({ x: -500, y: -500 });
const rawX = ref(0);
const rawY = ref(0);

const handleMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY };
  // Normalized offset (-1 to 1) for parallax
  rawX.value = (e.clientX / window.innerWidth - 0.5) * 40;
  rawY.value = (e.clientY / window.innerHeight - 0.5) * 40;
};

const orb1Style = computed(() => ({
  transform: `translate(${rawX.value * 0.5}px, ${rawY.value * 0.5}px)`,
  transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
}));

const orb2Style = computed(() => ({
  transform: `translate(${-rawX.value * 0.7}px, ${-rawY.value * 0.7}px)`,
  transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
}));

const orb3Style = computed(() => ({
  transform: `translate(${rawX.value * 0.4}px, ${-rawY.value * 0.4}px)`,
  transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
}));

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("mousemove", handleMouseMove);
  }
});
</script>

<style scoped>
@keyframes float1 {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(40px, 50px) scale(1.08);
  }
}

@keyframes float2 {
  0%, 100% {
    transform: translate(0px, 0px) scale(1.05);
  }
  50% {
    transform: translate(-50px, 35px) scale(0.95);
  }
}

@keyframes float3 {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(30px, -45px) scale(1.1);
  }
}

.orb-1 {
  animation: float1 14s ease-in-out infinite alternate;
}

.orb-2 {
  animation: float2 18s ease-in-out infinite alternate;
}

.orb-3 {
  animation: float3 16s ease-in-out infinite alternate;
}
</style>
