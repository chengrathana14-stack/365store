<template>
  <div class="min-h-screen py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Page Title -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="h-6 w-1.5 rounded-full bg-lime-400 shadow-[0_0_10px_#b7f34a]"></span>
            <h1 class="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Shopping Bag</h1>
          </div>
          <p class="mt-1 text-xs sm:text-sm text-gray-400">Review your selected performance gear before payment</p>
        </div>

        <NuxtLink
          to="/Product"
          class="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400 hover:text-lime-300 transition"
        >
          <span>← Continue Shopping</span>
        </NuxtLink>
      </div>

      <!-- EMPTY CART STATE -->
      <div
        v-if="cart.length === 0"
        class="rounded-3xl border border-white/10 bg-[#0d1017]/85 backdrop-blur-2xl px-6 py-20 text-center shadow-xl text-white"
      >
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-3xl">
          🛒
        </div>

        <h2 class="mt-5 text-2xl font-black text-white">
          Your cart is currently empty
        </h2>

        <p class="mx-auto mt-2 max-w-md text-xs sm:text-sm text-gray-400">
          Looks like you haven't added any gear yet. Check out our trending popular footwear and sportswear collections.
        </p>

        <NuxtLink
          to="/Product"
          class="mt-6 inline-flex rounded-xl bg-lime-400 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(183,243,74,0.4)] active:scale-95"
        >
          Explore Catalog &rarr;
        </NuxtLink>
      </div>

      <!-- CART WITH ITEMS -->
      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-12 text-white">
        <!-- LEFT: Items List (8 cols) -->
        <div class="space-y-4 lg:col-span-8">
          <!-- Cart Header Bar -->
          <div
            class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1017]/85 backdrop-blur-xl px-5 py-4 shadow-sm"
          >
            <div>
              <h2 class="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                Cart Items ({{ cartCount }})
              </h2>
            </div>

            <!-- Clear Cart -->
            <button
              @click="handleClearCart"
              class="text-xs font-bold text-red-400 hover:text-red-300 transition"
            >
              Clear Cart
            </button>
          </div>

          <!-- Product Item Card -->
          <div
            v-for="item in cart"
            :key="`${item.product.id}-${item.size}`"
            class="flex flex-col sm:flex-row gap-5 rounded-2xl border border-white/10 bg-[#0d1017]/85 backdrop-blur-xl p-5 shadow-md transition hover:border-lime-400/40"
          >
            <!-- Product Thumbnail -->
            <NuxtLink
              :to="`/Product/${item.product.id}`"
              class="h-32 w-full sm:w-32 shrink-0 overflow-hidden rounded-xl bg-neutral-900 border border-white/10"
            >
              <img
                :src="item.product.image"
                :alt="item.product.name"
                class="h-full w-full object-cover transition duration-500 hover:scale-108"
              />
            </NuxtLink>

            <!-- Details -->
            <div class="flex-1 flex flex-col justify-between">
              <div class="flex justify-between gap-4">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-widest text-lime-400">
                    {{ item.product.brand }} · {{ item.product.category }}
                  </span>
                  <NuxtLink :to="`/Product/${item.product.id}`">
                    <h3 class="mt-1 text-base font-black text-white transition hover:text-lime-400">
                      {{ item.product.name }}
                    </h3>
                  </NuxtLink>
                  <p class="mt-1 text-xs font-bold text-gray-300">
                    Size: <span class="rounded bg-white/10 px-2 py-0.5 font-mono text-white">{{ item.size || 'Standard' }}</span>
                  </p>
                </div>

                <!-- Delete Item -->
                <button
                  @click="removeFromCart(item.product.id, item.size)"
                  class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-red-400 transition"
                  title="Remove"
                >
                  ✕
                </button>
              </div>

              <!-- Quantity and Subtotal -->
              <div class="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                <div class="flex items-center rounded-lg border border-white/15 bg-white/5">
                  <button
                    @click="decreaseQuantity(item.product.id, item.size)"
                    :disabled="item.quantity <= 1"
                    class="px-3 py-1 text-sm font-bold text-gray-300 hover:text-white disabled:opacity-30"
                  >
                    −
                  </button>
                  <span class="min-w-8 text-center text-xs font-black text-white">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="increaseQuantity(item.product.id, item.size)"
                    :disabled="item.quantity >= item.product.stock"
                    class="px-3 py-1 text-sm font-bold text-gray-300 hover:text-white disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <div class="text-right">
                  <span class="text-base font-black text-lime-400">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </span>
                  <span class="block text-[11px] text-gray-400">
                    ${{ item.product.price.toFixed(2) }} each
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Order Summary (4 cols) -->
        <div class="lg:col-span-4">
          <div class="sticky top-24 rounded-3xl border border-white/10 bg-[#0d1017]/90 backdrop-blur-2xl p-6 shadow-2xl">
            <h2 class="text-lg font-black uppercase tracking-tight text-white">Order Summary</h2>

            <!-- Costs breakdown -->
            <div class="mt-5 space-y-3 text-xs">
              <div class="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span class="font-bold text-white">${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Estimated Shipping</span>
                <span class="font-bold text-white">
                  {{ shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}` }}
                </span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-emerald-400 font-bold">
                <span>Promo Discount (10%)</span>
                <span>-${{ discount.toFixed(2) }}</span>
              </div>

              <div class="border-t border-white/10 pt-3">
                <div class="flex items-baseline justify-between">
                  <span class="text-sm font-black text-white uppercase">Total</span>
                  <div class="text-right">
                    <span class="text-2xl font-black text-lime-400 drop-shadow-[0_0_10px_rgba(183,243,74,0.3)]">
                      ${{ total.toFixed(2) }}
                    </span>
                    <span class="block text-[10px] text-gray-400 font-bold">
                      ≈ {{ Math.round(total * 4100).toLocaleString() }} KHR
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Promo Code Input -->
            <div class="mt-6 border-t border-white/10 pt-5">
              <label class="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">
                Promo Code
              </label>
              <div class="flex gap-2">
                <input
                  v-model="promoCode"
                  type="text"
                  placeholder="Try: SPORT10"
                  class="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs uppercase font-mono tracking-wider text-white focus:border-lime-400 focus:outline-none"
                />
                <button
                  type="button"
                  @click="applyPromo"
                  class="rounded-xl bg-lime-400 px-4 text-xs font-black uppercase text-black hover:bg-lime-300 transition"
                >
                  Apply
                </button>
              </div>
              <p
                v-if="promoMessage"
                class="mt-1.5 text-xs font-bold"
                :class="promoApplied ? 'text-emerald-400' : 'text-red-400'"
              >
                {{ promoMessage }}
              </p>
            </div>

            <!-- PRIMARY ACTION 1: INSTANT BUY NOW (CARD OR QR) -->
            <button
              type="button"
              @click="handleInstantCartQr"
              class="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 py-4 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/25 transition hover:bg-lime-300 hover:shadow-[0_0_25px_rgba(183,243,74,0.5)] active:scale-98"
            >
              <span>⚡ Instant Buy Now (Card or QR)</span>
            </button>

            <!-- PRIMARY ACTION 2: Standard Checkout -->
            <NuxtLink
              to="/Order"
              class="mt-2.5 block w-full rounded-xl border border-white/15 bg-white/10 py-3 text-center text-xs font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20 active:scale-98"
            >
              Standard Checkout &rarr;
            </NuxtLink>

            <!-- Trust badges -->
            <div class="mt-6 border-t border-white/10 pt-4 text-center text-[11px] text-gray-400 space-y-1">
              <p>🔒 256-Bit Encrypted KHQR & Card Payments</p>
              <p>✓ 100% Genuine Performance Products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCart } from "~/composables/useCart";
import { useQrPayment } from "~/composables/useQrPayment";
import { useToast } from "~/composables/useToast";

definePageMeta({
  layout: "user",
});

const {
  cart,
  cartCount,
  subtotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = useCart();

const { openQrPayment } = useQrPayment();
const { success, error } = useToast();

const shipping = computed(() => {
  if (subtotal.value === 0) return 0;
  return subtotal.value >= 100 ? 0 : 5;
});

const promoCode = ref("");
const promoApplied = ref(false);
const promoMessage = ref("");

const discount = computed(() => {
  if (!promoApplied.value) return 0;
  return subtotal.value * 0.1;
});

const total = computed(() => {
  return Math.max(0, subtotal.value + shipping.value - discount.value);
});

const applyPromo = () => {
  if (promoCode.value.trim().toUpperCase() === "SPORT10") {
    promoApplied.value = true;
    promoMessage.value = "✓ SPORT10 applied: 10% discount!";
    success("Promo applied", "10% off your entire order!");
  } else {
    promoApplied.value = false;
    promoMessage.value = "Invalid code. Try SPORT10";
    error("Invalid code", "Use code SPORT10 for 10% off.");
  }
};

const handleClearCart = () => {
  if (confirm("Are you sure you want to clear your shopping bag?")) {
    clearCart();
    success("Cart cleared", "All items removed from your cart.");
  }
};

const handleInstantCartQr = () => {
  if (cart.value.length === 0) return;
  openQrPayment({
    items: cart.value.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      size: item.size,
    })),
    subtotal: subtotal.value,
    shipping: shipping.value,
    total: total.value,
  });
};
</script>
