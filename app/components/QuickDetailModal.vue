<template>
  <Teleport to="body">
    <div
      v-if="isDetailOpen && selectedProduct"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md"
      @click.self="closeQuickDetail"
    >
      <div
        class="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-[#0d1017]/95 text-white shadow-2xl backdrop-blur-2xl transition-all duration-300"
      >
        <!-- Close Button -->
        <button
          type="button"
          @click="closeQuickDetail"
          class="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300 transition hover:bg-white/20 hover:text-white"
        >
          ✕
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2">
          <!-- Left: Image View -->
          <div class="relative bg-neutral-950/70 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
            <!-- Badges -->
            <div class="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
              <span
                v-if="selectedProduct.discount"
                class="rounded-md bg-red-600 px-2 py-0.5 text-xs font-black text-white tracking-wide"
              >
                -{{ selectedProduct.discount }}%
              </span>
              <span
                v-if="selectedProduct.isNew"
                class="rounded-md bg-lime-400 px-2 py-0.5 text-[11px] font-black text-black tracking-normal"
              >
                NEW
              </span>
            </div>

            <div class="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl bg-neutral-900 shadow-md border border-white/10">
              <img
                :src="activeImg || selectedProduct.image"
                :alt="selectedProduct.name"
                class="h-full w-full object-cover transition-transform duration-500 hover:scale-108"
              />
            </div>

            <!-- Image thumbnail switchers if hoverimg exists -->
            <div v-if="selectedProduct.hoverimg" class="mt-4 flex gap-2">
              <button
                type="button"
                @click="activeImg = selectedProduct.image"
                class="h-12 w-12 rounded-xl border-2 overflow-hidden bg-neutral-900"
                :class="(activeImg || selectedProduct.image) === selectedProduct.image ? 'border-lime-400' : 'border-white/10'"
              >
                <img :src="selectedProduct.image" class="h-full w-full object-cover" />
              </button>
              <button
                type="button"
                @click="activeImg = selectedProduct.hoverimg"
                class="h-12 w-12 rounded-xl border-2 overflow-hidden bg-neutral-900"
                :class="activeImg === selectedProduct.hoverimg ? 'border-lime-400' : 'border-white/10'"
              >
                <img :src="selectedProduct.hoverimg" class="h-full w-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Right: Details & Buying Flow -->
          <div class="p-6 flex flex-col justify-between">
            <div>
              <!-- Category & Brand -->
              <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-lime-400">
                <span>{{ selectedProduct.brand }} · {{ selectedProduct.category }}</span>
                <span class="text-emerald-400">In Stock ({{ selectedProduct.stock }})</span>
              </div>

              <!-- Title -->
              <h3 class="mt-2 text-xl font-black text-white leading-tight">
                {{ selectedProduct.name }}
              </h3>

              <!-- Rating -->
              <div class="mt-2 flex items-center gap-1.5 text-xs">
                <div class="flex text-amber-400">
                  <span v-for="s in 5" :key="s" class="text-sm">★</span>
                </div>
                <span class="font-bold text-white">{{ selectedProduct.rating }}</span>
                <span class="text-gray-400">({{ selectedProduct.reviews }} reviews)</span>
              </div>

              <!-- Price -->
              <div class="mt-3 flex items-baseline gap-2.5">
                <span class="text-2xl font-black text-lime-400 drop-shadow-[0_0_10px_rgba(183,243,74,0.3)]">
                  ${{ selectedProduct.price.toFixed(2) }}
                </span>
                <span
                  v-if="selectedProduct.discount"
                  class="text-sm text-gray-500 line-through font-bold"
                >
                  ${{ (selectedProduct.price / (1 - selectedProduct.discount / 100)).toFixed(2) }}
                </span>
                <span class="text-[11px] text-gray-400 ml-auto">
                  ≈ {{ Math.round(selectedProduct.price * 4100).toLocaleString() }} ៛
                </span>
              </div>

              <!-- Description -->
              <p class="mt-3 text-xs leading-relaxed text-gray-300 line-clamp-3">
                {{ selectedProduct.description }}
              </p>

              <!-- Size selector -->
              <div class="mt-4">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Select Size
                </label>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="sz in selectedProduct.size"
                    :key="sz"
                    type="button"
                    @click="chosenSize = sz"
                    class="min-w-9 rounded-lg border px-2.5 py-1 text-xs font-bold transition"
                    :class="
                      chosenSize === sz
                        ? 'border-lime-400 bg-lime-400 text-black font-black shadow-[0_0_10px_rgba(183,243,74,0.3)]'
                        : 'border-white/15 bg-white/5 text-gray-300 hover:border-white/30'
                    "
                  >
                    {{ sz }}
                  </button>
                </div>
              </div>

              <!-- Quantity Selector -->
              <div class="mt-4 flex items-center gap-3">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-300">Quantity</span>
                <div class="flex items-center rounded-lg border border-white/15 bg-white/5">
                  <button
                    type="button"
                    @click="qty > 1 && qty--"
                    class="px-3 py-1 text-xs font-bold text-gray-300 hover:text-white"
                  >
                    -
                  </button>
                  <span class="min-w-8 text-center text-xs font-bold text-white">{{ qty }}</span>
                  <button
                    type="button"
                    @click="qty < selectedProduct.stock && qty++"
                    class="px-3 py-1 text-xs font-bold text-gray-300 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 pt-4 border-t border-white/10 space-y-2">
              <!-- Primary: Instant Buy with QR -->
              <button
                type="button"
                @click="handleInstantQr"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 py-3 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/25 transition hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(183,243,74,0.4)] active:scale-98"
              >
                <span>⚡ Instant Buy with QR (KHQR)</span>
              </button>

              <!-- Secondary: Add to Cart & Full Details -->
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="handleAddToCart"
                  class="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-bold text-white transition hover:bg-white/15 active:scale-98"
                >
                  <span>{{ justAdded ? "✓ Added!" : "Add to Cart" }}</span>
                </button>

                <NuxtLink
                  :to="`/Product/${selectedProduct.id}`"
                  @click="closeQuickDetail"
                  class="flex items-center justify-center rounded-xl border border-white/15 bg-white/10 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 active:scale-98 text-center"
                >
                  Full Details &rarr;
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuickDetail } from "~/composables/useQuickDetail";
import { useCart } from "~/composables/useCart";
import { useQrPayment } from "~/composables/useQrPayment";
import { useToast } from "~/composables/useToast";

const { isDetailOpen, selectedProduct, closeQuickDetail } = useQuickDetail();
const { addToCart } = useCart();
const { openQrPayment } = useQrPayment();
const { success } = useToast();

const activeImg = ref("");
const chosenSize = ref("");
const qty = ref(1);
const justAdded = ref(false);

watch(selectedProduct, (p) => {
  if (p) {
    activeImg.value = p.image;
    chosenSize.value = p.size?.[0] || "";
    qty.value = 1;
    justAdded.value = false;
  }
});

const handleAddToCart = () => {
  if (!selectedProduct.value) return;
  addToCart(selectedProduct.value, qty.value, chosenSize.value);
  justAdded.value = true;
  success("Added to cart!", `${qty.value}x ${selectedProduct.value.name} (${chosenSize.value})`);
  setTimeout(() => {
    justAdded.value = false;
  }, 1500);
};

const handleInstantQr = () => {
  if (!selectedProduct.value) return;
  const product = selectedProduct.value;
  const currentTotal = product.price * qty.value;
  closeQuickDetail();

  openQrPayment({
    items: [
      {
        product,
        quantity: qty.value,
        size: chosenSize.value,
      },
    ],
    subtotal: currentTotal,
    shipping: 0,
    total: currentTotal,
  });
};
</script>
