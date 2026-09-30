<template>
  <Teleport to="body">
    <Transition name="compare-float">
      <div
        v-if="compareCount > 0"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl rounded-2xl border border-lime-400/40 bg-[#0d1017]/95 p-3.5 sm:px-5 sm:py-4 text-white shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(183,243,74,0.15)] backdrop-blur-2xl"
      >
        <div class="flex items-center justify-between gap-4">
          <!-- Left: Count & Thumbnails -->
          <div class="flex items-center gap-3 min-w-0">
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-400 text-black font-black text-xs shadow-[0_0_10px_#b7f34a]">
                {{ compareCount }}
              </span>
              <span class="hidden sm:inline text-xs font-black uppercase tracking-wider text-white">
                Compare Gear
              </span>
            </div>

            <!-- Product Thumbnails with Remove Badges -->
            <div class="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
              <div
                v-for="prod in comparedProducts"
                :key="prod.id"
                class="group relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl overflow-hidden border border-white/20 bg-neutral-900"
              >
                <img :src="prod.image" :alt="prod.name" class="h-full w-full object-cover" />
                <button
                  type="button"
                  @click="removeFromCompare(prod.id)"
                  class="absolute inset-0 flex items-center justify-center bg-black/70 text-red-400 text-xs font-bold opacity-0 transition group-hover:opacity-100"
                  title="Remove from comparison"
                >
                  ✕
                </button>
              </div>

              <!-- Empty slots up to max (4) -->
              <div
                v-for="slot in Math.max(0, 2 - compareCount)"
                :key="`slot-${slot}`"
                class="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-[11px] text-gray-500"
              >
                +
              </div>
            </div>
          </div>

          <!-- Right: Clear & Compare Trigger Buttons -->
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              @click="clearCompare"
              class="text-xs font-bold text-gray-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition"
            >
              Clear
            </button>

            <button
              type="button"
              @click="openCompareModal"
              class="flex items-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2 sm:py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_15px_rgba(183,243,74,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="compareCount < 2"
            >
              <span>Compare ({{ compareCount }})</span>
              <span class="text-sm">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useProductCompare } from "~/composables/useProductCompare";

const { comparedProducts, compareCount, removeFromCompare, clearCompare, openCompareModal } = useProductCompare();
</script>

<style scoped>
.compare-float-enter-active,
.compare-float-leave-active {
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.compare-float-enter-from,
.compare-float-leave-to {
  opacity: 0;
  transform: translate(-50%, 30px);
}
</style>
