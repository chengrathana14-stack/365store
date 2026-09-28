<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-xl border border-black/10 bg-black/90 p-4 text-white shadow-2xl backdrop-blur-md"
        :class="{
          'border-l-4 border-l-lime-400': toast.type === 'success',
          'border-l-4 border-l-red-500': toast.type === 'error',
          'border-l-4 border-l-amber-400': toast.type === 'warning',
          'border-l-4 border-l-cyan-400': toast.type === 'info',
        }"
      >
        <div class="mt-0.5 shrink-0">
          <span v-if="toast.type === 'success'" class="flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 text-black text-xs font-black">✓</span>
          <span v-else-if="toast.type === 'error'" class="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-black">✕</span>
          <span v-else-if="toast.type === 'warning'" class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-black text-xs font-black">!</span>
          <span v-else class="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-black text-xs font-black">i</span>
        </div>
        <div class="flex-1">
          <h4 class="text-xs font-bold uppercase tracking-wider text-lime-400">{{ toast.title }}</h4>
          <p v-if="toast.message" class="mt-0.5 text-xs text-gray-300 leading-snug">{{ toast.message }}</p>
        </div>
        <button
          type="button"
          @click="removeToast(toast.id)"
          class="shrink-0 text-gray-400 hover:text-white transition"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "~/composables/useToast";

const { toasts, removeToast } = useToast();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
