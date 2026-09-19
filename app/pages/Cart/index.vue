<template>
  <div class="min-h-screen py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Page Title -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="h-6 w-1 rounded-full bg-lime-500"></span>
            <h1 class="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">Shopping Bag</h1>
          </div>
          <p class="mt-1 text-xs sm:text-sm text-gray-500">Review your selected performance gear before payment</p>
        </div>

        <NuxtLink
          to="/Product"
          class="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-black transition"
        >
          <span>← Continue Shopping</span>
        </NuxtLink>
      </div>

      <!-- EMPTY CART STATE -->
      <div
        v-if="cart.length === 0"
        class="rounded-2xl border border-gray-200/90 bg-white/90 backdrop-blur-md px-6 py-20 text-center shadow-sm"
      >
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-3xl">
          🛒
        </div>

        <h2 class="mt-5 text-2xl font-black text-gray-950">
          Your cart is currently empty
        </h2>

        <p class="mx-auto mt-2 max-w-md text-xs sm:text-sm text-gray-500">
          Looks like you haven't added any gear yet. Check out our trending popular footwear and sportswear collections.
        </p>

        <NuxtLink
          to="/Product"
          class="mt-6 inline-flex rounded-xl bg-black px-7 py-3 text-xs font-black uppercase tracking-wider text-lime-400 transition hover:bg-neutral-800 active:scale-95"
        >
          Explore Catalog &rarr;
        </NuxtLink>
      </div>

      <!-- CART WITH ITEMS -->
      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- LEFT: Items List (8 cols) -->
        <div class="space-y-4 lg:col-span-8">
          <!-- Cart Header Bar -->
          <div
            class="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white/90 backdrop-blur-md px-5 py-3.5 shadow-xs"
          >
            <div>
              <h2 class="text-sm font-black text-gray-950 uppercase tracking-wider">
                Cart Items ({{ cartCount }})
              </h2>
            </div>

            <!-- Clear Cart -->
            <button
              @click="handleClearCart"
              class="text-xs font-bold text-red-500 hover:text-red-700 transition"
            >
              Clear Cart
            </button>
          </div>

          <!-- Product Item Card -->
          <div
            v-for="item in cart"
            :key="`${item.product.id}-${item.size}`"
            class="flex flex-col sm:flex-row gap-5 rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-md p-5 shadow-xs transition hover:border-gray-300"
          >
            <!-- Product Thumbnail -->
            <NuxtLink
              :to="`/Product/${item.product.id}`"
              class="h-32 w-full sm:w-32 shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-gray-200"
            >
              <img
                :src="item.product.image"
                :alt="item.product.name"
                class="h-full w-full object-cover transition duration-300 hover:scale-105"
              />
            </NuxtLink>

            <!-- Details -->
            <div class="flex-1 flex flex-col justify-between">
              <div class="flex justify-between gap-4">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {{ item.product.brand }} · {{ item.product.category }}
                  </span>
                  <NuxtLink :to="`/Product/${item.product.id}`">
                    <h3 class="mt-1 text-base font-black text-gray-950 transition hover:text-lime-600">
                      {{ item.product.name }}
                    </h3>
                  </NuxtLink>
                  <p class="mt-1 text-xs font-bold text-gray-700">
                    Size: <span class="rounded bg-neutral-100 px-2 py-0.5 font-mono">{{ item.size || 'Standard' }}</span>
                  </p>
                </div>

                <!-- Delete Item -->
                <button
                  @click="removeFromCart(item.product.id, item.size)"
                  class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Remove"
                >
                  ✕
                </button>
              </div>

              <!-- Quantity and Subtotal -->
              <div class="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                <div class="flex items-center rounded-lg border border-gray-200 bg-white">
                  <button
                    @click="decreaseQuantity(item.product.id, item.size)"
                    :disabled="item.quantity <= 1"
                    class="px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                  >
                    −
                  </button>
                  <span class="min-w-8 text-center text-xs font-black text-gray-950">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="increaseQuantity(item.product.id, item.size)"
                    :disabled="item.quantity >= item.product.stock"
                    class="px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <div class="text-right">
                  <span class="text-base font-black text-gray-950">
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
          <div class="sticky top-24 rounded-2xl border border-gray-200/80 bg-white/95 backdrop-blur-md p-6 shadow-lg">
            <h2 class="text-lg font-black uppercase tracking-tight text-gray-950">Order Summary</h2>

            <!-- Costs breakdown -->
            <div class="mt-5 space-y-3 text-xs">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span class="font-bold text-gray-900">${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Estimated Shipping</span>
                <span class="font-bold text-gray-900">
                  {{ shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}` }}
                </span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-emerald-600 font-bold">
                <span>Promo Discount (10%)</span>
                <span>-${{ discount.toFixed(2) }}</span>
              </div>

              <div class="border-t border-gray-200 pt-3">
                <div class="flex items-baseline justify-between">
                  <span class="text-sm font-black text-gray-950 uppercase">Total</span>
                  <div class="text-right">
                    <span class="text-2xl font-black text-gray-950">
                      ${{ total.toFixed(2) }}
                    </span>
                    <span class="block text-[10px] text-gray-500 font-bold">
                      ≈ {{ Math.round(total * 4100).toLocaleString() }} KHR
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Promo Code Input -->
            <div class="mt-6 border-t border-gray-100 pt-5">
              <label class="block text-[11px] font-black uppercase tracking-wider text-gray-700 mb-1.5">
                Promo Code
              </label>
              <div class="flex gap-2">
                <input
                  v-model="promoCode"
                  type="text"
                  placeholder="Try: SPORT10"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs uppercase font-mono tracking-wider focus:border-black focus:outline-none"
                />
                <button
                  type="button"
                  @click="applyPromo"
                  class="rounded-lg bg-black px-4 text-xs font-black uppercase text-lime-400 hover:bg-neutral-800 transition"
                >
                  Apply
                </button>
              </div>
              <p
                v-if="promoMessage"
                class="mt-1.5 text-xs font-bold"
                :class="promoApplied ? 'text-emerald-600' : 'text-red-500'"
              >
                {{ promoMessage }}
              </p>
            </div>

            <!-- PRIMARY ACTION 1: ⚡ INSTANT BUY WITH QR -->
            <button
              type="button"
              @click="handleInstantCartQr"
              class="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 py-3.5 text-xs font-black uppercase tracking-wider text-black shadow-md shadow-lime-400/20 transition hover:bg-lime-300 active:scale-98"
            >
              <span>⚡ Instant Pay with QR (KHQR)</span>
            </button>

            <!-- PRIMARY ACTION 2: Standard Checkout -->
            <NuxtLink
              to="/Order"
              class="mt-2.5 block w-full rounded-xl bg-black py-3 text-center text-xs font-black uppercase tracking-wider text-white transition hover:bg-neutral-800 active:scale-98"
            >
              Standard Checkout &rarr;
            </NuxtLink>

            <!-- Trust badges -->
            <div class="mt-6 border-t border-gray-100 pt-4 text-center text-[11px] text-gray-500 space-y-1">
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
