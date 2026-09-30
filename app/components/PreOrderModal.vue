<template>
  <Teleport to="body">
    <div
      v-if="isPreOrderModalOpen && preOrderProduct"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300 overflow-y-auto"
      @click.self="closePreOrder"
    >
      <div
        class="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-[#0d1017]/95 text-white shadow-2xl backdrop-blur-2xl my-8"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/40">
          <div class="flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-black text-base font-black shadow-[0_0_12px_#b7f34a]">
              👟
            </span>
            <div>
              <h2 class="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>Shoe Restock &amp; Pre-Order</span>
                <span class="rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400">
                  Sold Out Online
                </span>
              </h2>
              <p class="text-[11px] text-gray-400">
                Direct request to 365 Sports Telegram Bot &amp; Admin
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="closePreOrder"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <!-- Product Preview Card -->
        <div class="p-5 border-b border-white/10 bg-white/[0.02]">
          <div class="flex items-center gap-4">
            <img
              :src="preOrderProduct.image"
              :alt="preOrderProduct.name"
              class="h-20 w-20 shrink-0 rounded-2xl object-cover border border-white/15 bg-neutral-900"
            />
            <div class="min-w-0 flex-1">
              <span class="text-[10px] font-black uppercase tracking-wider text-lime-400">
                {{ preOrderProduct.brand }} · {{ preOrderProduct.category }}
              </span>
              <h3 class="text-sm sm:text-base font-bold text-white leading-tight truncate">
                {{ preOrderProduct.name }}
              </h3>
              <div class="mt-1 flex items-baseline gap-2">
                <span class="text-base font-black text-lime-400">
                  ${{ preOrderProduct.price.toFixed(2) }}
                </span>
                <span class="text-xs text-gray-400">
                  Total: <strong class="text-white">${{ (preOrderProduct.price * quantity).toFixed(2) }}</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- Size & Quantity Row -->
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
            <!-- Size Selector -->
            <div class="sm:col-span-2">
              <label class="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Select Your Size:
              </label>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="size in preOrderProduct.size"
                  :key="size"
                  type="button"
                  @click="selectedSize = size"
                  class="min-w-10 h-8 rounded-lg border text-xs font-bold transition flex items-center justify-center"
                  :class="
                    selectedSize === size
                      ? 'border-lime-400 bg-lime-400 text-black shadow-[0_0_10px_rgba(183,243,74,0.4)]'
                      : 'border-white/15 bg-white/5 text-gray-300 hover:border-lime-400/50 hover:text-white'
                  "
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div>
              <label class="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Quantity:
              </label>
              <div class="flex items-center rounded-xl border border-white/15 bg-white/5 p-1 w-full justify-between">
                <button
                  type="button"
                  @click="quantity = Math.max(1, quantity - 1)"
                  class="h-7 w-7 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition flex items-center justify-center"
                >
                  -
                </button>
                <span class="text-xs font-black text-lime-400">{{ quantity }}</span>
                <button
                  type="button"
                  @click="quantity = quantity + 1"
                  class="h-7 w-7 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Form: Customer Info for Pre-Order -->
        <form @submit.prevent="handleSubmitForm" class="p-5 sm:p-6 space-y-3.5">
          <div class="flex items-center justify-between pb-1">
            <span class="text-xs font-black uppercase text-lime-400 flex items-center gap-1.5">
              <span>⚡</span>
              <span>Reserve & Pre-Order Form</span>
            </span>
            <span class="rounded-full bg-lime-400/10 border border-lime-400/30 px-2 py-0.5 text-[9px] font-bold text-lime-300">
              Priority Restock
            </span>
          </div>

          <!-- Customer Name & Gmail Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                Your Full Name <span class="text-red-400">*</span>
              </label>
              <input
                v-model="customerName"
                type="text"
                required
                placeholder="e.g. Rothana Cheng"
                class="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-lime-400 transition"
              />
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                Your Gmail / Email <span class="text-red-400">*</span>
              </label>
              <input
                v-model="customerEmail"
                type="email"
                required
                placeholder="e.g. rothanacheng@gmail.com"
                class="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-lime-400 transition"
              />
            </div>
          </div>

          <!-- Phone & Location Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                Phone Number <span class="text-red-400">*</span>
              </label>
              <input
                v-model="customerPhone"
                type="text"
                required
                placeholder="e.g. 096 961 1977"
                class="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-lime-400 transition"
              />
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                Delivery Location / Province
              </label>
              <input
                v-model="customerLocation"
                type="text"
                placeholder="e.g. Phnom Penh (Toul Kork)"
                class="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-lime-400 transition"
              />
            </div>
          </div>

          <!-- Special Notes / Urgency -->
          <div>
            <label class="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1">
              Shoe Request Note / Urgency
            </label>
            <textarea
              v-model="customerNotes"
              rows="2"
              placeholder="e.g. Need this shoe for an upcoming match on Saturday. Can pay via Bakong QR."
              class="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-lime-400 transition resize-none"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/25 transition hover:bg-lime-300 active:scale-98 disabled:opacity-50"
            >
              <span v-if="isSubmitting" class="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
              <span v-else>⚡</span>
              <span>{{ isSubmitting ? "Submitting Request..." : "Submit Pre-Order Request" }}</span>
            </button>
          </div>
        </form>

        <!-- Direct Contact Footer -->
        <div class="border-t border-white/10 px-6 py-3.5 bg-black/40 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <div class="flex items-center gap-3">
            <span class="font-bold text-white flex items-center gap-1.5">
              <span>📞</span>
              <a href="tel:+855969611977" class="hover:text-lime-400 transition">Hotline: 096 961 1977</a>
            </span>
          </div>
          <span class="text-[11px] text-gray-500">365 Sport Cambodia</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { usePreOrder } from "~/composables/usePreOrder";
import { useToast } from "~/composables/useToast";

const {
  isPreOrderModalOpen,
  preOrderProduct,
  preOrderSize,
  closePreOrder,
  notifyTelegramApi,
} = usePreOrder();

const { success, error } = useToast();

const selectedSize = ref("");
const quantity = ref(1);
const customerName = ref("");
const customerEmail = ref("");
const customerPhone = ref("");
const customerLocation = ref("");
const customerNotes = ref("");
const isSubmitting = ref(false);

watch(
  preOrderSize,
  (newSize) => {
    selectedSize.value = newSize || preOrderProduct.value?.size?.[0] || "Standard";
  },
  { immediate: true },
);

const buildPayload = () => {
  if (!preOrderProduct.value) return null;
  return {
    product: preOrderProduct.value,
    size: selectedSize.value,
    quantity: quantity.value,
    customerName: customerName.value.trim(),
    customerEmail: customerEmail.value.trim(),
    customerPhone: customerPhone.value.trim(),
    customerLocation: customerLocation.value.trim(),
    notes: customerNotes.value.trim(),
  };
};

const handleSubmitForm = async () => {
  const payload = buildPayload();
  if (!payload) return;

  isSubmitting.value = true;

  try {
    const res = await notifyTelegramApi(payload);

    // Save request to localStorage so admin can see restock demand in browser
    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("365_restock_requests") || "[]");
        existing.unshift({
          ...payload,
          productName: payload.product.name,
          productId: payload.product.id,
          brand: payload.product.brand,
          date: new Date().toISOString(),
        });
        localStorage.setItem("365_restock_requests", JSON.stringify(existing.slice(0, 50)));
      } catch {}
    }

    if (res?.botDelivered) {
      success(
        "Pre-Order Request Received! ⚡",
        `We have received your pre-order for ${payload.product.name} (Size ${payload.size}). Our team will contact ${payload.customerEmail} shortly!`,
      );
    } else {
      success(
        "Pre-Order Registered! ⚡",
        `Your reservation for ${payload.product.name} (Size ${payload.size}) has been recorded. Our team will contact you to confirm!`,
      );
    }

    closePreOrder();
  } catch (err: any) {
    error("Could not send request", err?.message || "Please check your details and try again.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
