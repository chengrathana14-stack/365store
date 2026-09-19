<template>
  <Teleport to="body">
    <div
      v-if="isDetailOpen && selectedProduct"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm"
      @click.self="closeQuickDetail"
    >
      <div
        class="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200/60 bg-white text-gray-900 shadow-2xl transition-all duration-300"
      >
        <!-- Close Button -->
        <button
          type="button"
          @click="closeQuickDetail"
          class="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-black hover:text-white"
        >
          ✕
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2">
          <!-- Left: Image View -->
          <div class="relative bg-neutral-100 p-6 flex flex-col items-center justify-center">
            <!-- Badges -->
            <div class="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
              <span
                v-if="selectedProduct.discount"
                class="rounded-xs bg-red-600 px-2 py-0.5 text-xs font-bold text-white tracking-wide"
              >
                -{{ selectedProduct.discount }}%
              </span>
              <span
                v-if="selectedProduct.isNew"
                class="rounded-none bg-black px-2 py-0.5 text-[11px] font-semibold text-white tracking-normal"
              >
                NEW
              </span>
            </div>

            <div class="relative aspect-square w-full max-w-xs overflow-hidden rounded-xl bg-white shadow-xs">
              <img
                :src="activeImg || selectedProduct.image"
                :alt="selectedProduct.name"
                class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <!-- Image thumbnail switchers if hoverimg exists -->
            <div v-if="selectedProduct.hoverimg" class="mt-4 flex gap-2">
              <button
                type="button"
                @click="activeImg = selectedProduct.image"
                class="h-12 w-12 rounded-lg border-2 overflow-hidden bg-white"
                :class="(activeImg || selectedProduct.image) === selectedProduct.image ? 'border-black' : 'border-gray-200'"
              >
                <img :src="selectedProduct.image" class="h-full w-full object-cover" />
              </button>
              <button
                type="button"
                @click="activeImg = selectedProduct.hoverimg"
                class="h-12 w-12 rounded-lg border-2 overflow-hidden bg-white"
                :class="activeImg === selectedProduct.hoverimg ? 'border-black' : 'border-gray-200'"
              >
                <img :src="selectedProduct.hoverimg" class="h-full w-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Right: Details & Buying Flow -->
          <div class="p-6 flex flex-col justify-between">
            <div>
              <!-- Category & Brand -->
              <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                <span>{{ selectedProduct.brand }} · {{ selectedProduct.category }}</span>
                <span class="text-emerald-600">In Stock ({{ selectedProduct.stock }})</span>
              </div>

              <!-- Title -->
              <h3 class="mt-2 text-xl font-black text-gray-900 leading-tight">
                {{ selectedProduct.name }}
              </h3>

              <!-- Rating -->
              <div class="mt-2 flex items-center gap-1.5 text-xs">
                <div class="flex text-amber-400">
                  <span v-for="s in 5" :key="s" class="text-sm">★</span>
                </div>
                <span class="font-bold text-gray-800">{{ selectedProduct.rating }}</span>
                <span class="text-gray-400">({{ selectedProduct.reviews }} reviews)</span>
              </div>

              <!-- Price -->
              <div class="mt-3 flex items-baseline gap-2.5">
                <span class="text-2xl font-black text-gray-950">
                  ${{ selectedProduct.price.toFixed(2) }}
                </span>
                <span
                  v-if="selectedProduct.discount"
                  class="text-sm text-gray-400 line-through"
                >
                  ${{ (selectedProduct.price / (1 - selectedProduct.discount / 100)).toFixed(2) }}
                </span>
              </div>

              <!-- Description -->
              <p class="mt-3 text-xs leading-relaxed text-gray-600 line-clamp-3">
                {{ selectedProduct.description }}
              </p>

              <!-- Size selector -->
              <div class="mt-4">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1.5">
                  Select Size
                </label>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="sz in selectedProduct.size"
                    :key="sz"
                    type="button"
                    @click="chosenSize = sz"
                    class="min-w-9 rounded-md border px-2.5 py-1 text-xs font-bold transition"
                    :class="
                      chosenSize === sz
                        ? 'border-black bg-black text-lime-400'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    "
                  >
                    {{ sz }}
                  </button>
                </div>
              </div>

              <!-- Quantity Selector -->
              <div class="mt-4 flex items-center gap-3">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-800">Quantity</span>
                <div class="flex items-center rounded-md border border-gray-200 bg-white">
                  <button
                    type="button"
                    @click="qty > 1 && qty--"
                    class="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span class="min-w-8 text-center text-xs font-bold">{{ qty }}</span>
                  <button
                    type="button"
                    @click="qty < selectedProduct.stock && qty++"
                    class="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 pt-4 border-t border-gray-100 space-y-2">
              <!-- Primary: Instant Buy with QR -->
              <button
                type="button"
                @click="handleInstantQr"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-md active:scale-98"
              >
                <span>⚡ Instant Buy with QR</span>
              </button>

              <!-- Secondary: Add to Cart -->
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="handleAddToCart"
                  class="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-800 transition hover:border-black hover:bg-gray-50 active:scale-98"
                >
                  <span>{{ justAdded ? "✓ Added!" : "Add to Cart" }}</span>
                </button>

                <NuxtLink
                  :to="`/Product/${selectedProduct.id}`"
                  @click="closeQuickDetail"
                  class="flex items-center justify-center rounded-xl bg-black py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800 active:scale-98 text-center"
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
