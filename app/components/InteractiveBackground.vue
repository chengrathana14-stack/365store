<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#07090e]">
    <!-- High-tech dark isometric grid texture -->
    <div
      class="absolute inset-0 opacity-[0.22]"
      style="
        background-image: 
          linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 40px 40px;
        mask-image: radial-gradient(ellipse 80% 60% at 50% 35%, #000 70%, transparent 100%);
      "
    ></div>

    <!-- Soft Radial Dark Vignette -->
    <div class="absolute inset-0 bg-radial from-transparent via-[#07090e]/40 to-[#07090e]"></div>

    <!-- MULTI-COLOR VIBRANT AURORA ORBS -->
    <!-- Orb 1: Electric Hyper-Lime (Top-Left) -->
    <div
      class="aurora-orb orb-lime absolute -top-40 -left-40 h-[380px] w-[380px] md:h-[550px] md:w-[550px] rounded-full bg-gradient-to-tr from-[#b7f34a]/30 via-[#10b981]/25 to-transparent blur-[60px] md:blur-[120px] will-change-transform"
      :style="limeStyle"
    ></div>

    <!-- Orb 2: Vivid Cyber Cyan (Top-Right) -->
    <div
      class="aurora-orb orb-cyan absolute top-10 -right-40 h-[400px] w-[400px] md:h-[600px] md:w-[600px] rounded-full bg-gradient-to-bl from-[#00f0ff]/30 via-[#3b82f6]/20 to-transparent blur-[65px] md:blur-[130px] will-change-transform"
      :style="cyanStyle"
    ></div>

    <!-- Orb 3: Cosmic Electric Purple (Center-Bottom) -->
    <div
      class="aurora-orb orb-purple hidden sm:block absolute -bottom-40 left-1/4 h-[650px] w-[650px] rounded-full bg-gradient-to-t from-[#a855f7]/30 via-[#6366f1]/25 to-transparent blur-[70px] md:blur-[140px] will-change-transform"
      :style="purpleStyle"
    ></div>

    <!-- Orb 4: Hot Sunset Neon Magenta (Center-Right Floating) -->
    <div
      class="aurora-orb orb-magenta hidden sm:block absolute top-1/2 -right-20 h-[480px] w-[480px] rounded-full bg-gradient-to-l from-[#f43f5e]/25 via-[#ec4899]/20 to-transparent blur-[60px] md:blur-[120px] will-change-transform"
      :style="magentaStyle"
    ></div>

    <!-- Interactive HTML5 Particle Network Canvas -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0 h-full w-full opacity-60 pointer-events-none"
    ></canvas>

    <!-- Cursor Follower Ambient Spotlight (Desktop Only) -->
    <div
      v-if="!isTouchDevice && mousePos.x > 0"
      class="pointer-events-none absolute h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-[#b7f34a]/12 via-[#00f0ff]/06 to-transparent blur-3xl transition-transform duration-300 ease-out"
      :style="{
        left: `${mousePos.x}px`,
        top: `${mousePos.y}px`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const mousePos = ref({ x: -500, y: -500 });
const rawX = ref(0);
const rawY = ref(0);
const isTouchDevice = ref(false);

const handleMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY };
  rawX.value = (e.clientX / window.innerWidth - 0.5) * 40;
  rawY.value = (e.clientY / window.innerHeight - 0.5) * 40;
};

// Parallax Styles for Aurora Orbs
const limeStyle = computed(() => ({
  transform: `translate3d(${rawX.value * 0.5}px, ${rawY.value * 0.5}px, 0)`,
  transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
}));

const cyanStyle = computed(() => ({
  transform: `translate3d(${-rawX.value * 0.5}px, ${-rawY.value * 0.5}px, 0)`,
  transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
}));

const purpleStyle = computed(() => ({
  transform: `translate3d(${rawX.value * 0.4}px, ${-rawY.value * 0.4}px, 0)`,
  transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
}));

const magentaStyle = computed(() => ({
  transform: `translate3d(${-rawX.value * 0.3}px, ${rawY.value * 0.3}px, 0)`,
  transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
}));

// Floating Particle System on HTML5 Canvas
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

let animationId: number;
let particles: Particle[] = [];

const colors = ["#b7f34a", "#00f0ff", "#a855f7", "#ffffff", "#f43f5e"];

const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
  isTouchDevice.value = isTouch;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // Mobile uses 16 lightweight particles; Desktop uses 36
  const count = isTouch ? 16 : 36;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * (isTouch ? 0.35 : 0.5),
    vy: (Math.random() - 0.5) * (isTouch ? 0.35 : 0.5),
    radius: Math.random() * 1.8 + 1,
    color: colors[Math.floor(Math.random() * colors.length)] || "#b7f34a",
    alpha: Math.random() * 0.5 + 0.2,
  }));

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p) continue;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle (omit expensive shadowBlur on mobile for buttery 60fps)
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      if (!isTouch) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
      }
      ctx.fill();

      // Connect nearby particles with subtle lines
      const maxDist = isTouch ? 85 : 105;
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        if (!p2) continue;
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist / maxDist) * 0.15;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // React to mouse proximity on desktop only
      if (!isTouch && mousePos.value.x > 0) {
        const mdx = p.x - mousePos.value.x;
        const mdy = p.y - mousePos.value.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mousePos.value.x, mousePos.value.y);
          ctx.strokeStyle = "#b7f34a";
          ctx.globalAlpha = (1 - mdist / 130) * 0.22;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    if (!isTouch) {
      ctx.shadowBlur = 0;
    }
    animationId = requestAnimationFrame(render);
  };

  render();
};

onMounted(() => {
  if (typeof window !== "undefined") {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
    isTouchDevice.value = isTouch;
    if (!isTouch) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    initCanvas();
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("mousemove", handleMouseMove);
    cancelAnimationFrame(animationId);
  }
});
</script>

<style scoped>
@keyframes float-fluid-1 {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(60px, 80px) scale(1.12);
  }
  66% {
    transform: translate(-30px, 40px) scale(0.95);
  }
}

@keyframes float-fluid-2 {
  0%, 100% {
    transform: translate(0px, 0px) scale(1.05);
  }
  33% {
    transform: translate(-70px, 50px) scale(0.9);
  }
  66% {
    transform: translate(40px, -60px) scale(1.15);
  }
}

@keyframes float-fluid-3 {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(50px, -70px) scale(1.18);
  }
}

.orb-lime {
  animation: float-fluid-1 18s ease-in-out infinite alternate;
}

.orb-cyan {
  animation: float-fluid-2 22s ease-in-out infinite alternate;
}

.orb-purple {
  animation: float-fluid-3 20s ease-in-out infinite alternate;
}

.orb-magenta {
  animation: float-fluid-1 16s ease-in-out infinite alternate-reverse;
}
</style>
