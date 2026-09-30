<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="drawer-backdrop">
      <div
        v-if="isCartDrawerOpen"
        class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        @click="closeCartDrawer"
      ></div>
    </Transition>

    <!-- Slide-over Drawer Panel -->
    <Transition name="drawer-slide">
      <div
        v-if="isCartDrawerOpen"
        class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#0b0e14] text-white shadow-2xl border-l border-white/10"
      >
        <!-- Drawer Header -->
        <div class="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-black/40">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-400 text-black font-black text-xs shadow-[0_0_10px_#b7f34a]">
              {{ cartCount }}
            </span>
            <h2 class="text-lg font-black uppercase tracking-tight text-white">Your Shopping Bag</h2>
          </div>

          <button
            type="button"
            @click="closeCartDrawer"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-400 transition hover:bg-white/15 hover:text-white"
            title="Close Drawer"
          >
            ✕
          </button>
        </div>

        <!-- Dynamic Free Express Shipping Progress Bar -->
        <div class="border-b border-white/10 bg-white/[0.03] px-6 py-3.5">
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span v-if="freeShippingRemaining > 0" class="text-gray-300">
              Add <strong class="text-lime-400 font-black">${{ freeShippingRemaining.toFixed(2) }}</strong> more for <strong class="text-white">FREE Express Shipping</strong>
            </span>
            <span v-else class="text-lime-400 font-black flex items-center gap-1.5">
              <span>🎉</span>
              <span>You unlocked FREE Express Delivery!</span>
            </span>
            <span class="font-mono text-[11px] text-gray-400">{{ freeShippingProgress }}%</span>
          </div>

          <!-- Progress track -->
          <div class="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              class="h-full rounded-full bg-linear-to-r from-lime-400 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(183,243,74,0.5)]"
              :style="{ width: `${freeShippingProgress}%` }"
            ></div>
          </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <!-- EMPTY STATE -->
          <div v-if="cart.length === 0" class="py-14 text-center">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-3xl">
              🛍️
            </div>
            <h3 class="mt-4 text-lg font-black text-white">Your bag is currently empty</h3>
            <p class="mt-1 text-xs text-gray-400 max-w-xs mx-auto">
              Ready to elevate your performance? Check out top athletic shoes and sportswear.
            </p>
            <NuxtLink
              to="/Product"
              @click="closeCartDrawer"
              class="mt-6 inline-flex items-center justify-center rounded-xl bg-lime-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(183,243,74,0.4)]"
            >
              Start Shopping &rarr;
            </NuxtLink>
          </div>

          <!-- CART ITEMS LIST -->
          <div v-else class="space-y-4">
            <div
              v-for="item in cart"
              :key="`${item.product.id}-${item.size}`"
              class="group relative flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 transition hover:border-white/25"
            >
              <!-- Product Image -->
              <NuxtLink
                :to="`/Product/${item.product.id}`"
                @click="closeCartDrawer"
                class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-900 border border-white/10"
              >
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-108"
                />
              </NuxtLink>

              <!-- Product Info -->
              <div class="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <NuxtLink
                      :to="`/Product/${item.product.id}`"
                      @click="closeCartDrawer"
                      class="text-xs font-bold text-white hover:text-lime-400 line-clamp-1 transition"
                    >
                      {{ item.product.name }}
                    </NuxtLink>

                    <!-- Delete button -->
                    <button
                      type="button"
                      @click="removeFromCart(item.product.id, item.size)"
                      class="text-gray-500 hover:text-red-400 transition text-xs p-1"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>

                  <!-- Brand & Size Pill -->
                  <div class="mt-1 flex items-center gap-2">
                    <span class="text-[10px] font-black uppercase text-lime-400">{{ item.product.brand }}</span>
                    <span v-if="item.size" class="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-gray-300">
                      Size: {{ item.size }}
                    </span>
                  </div>
                </div>

                <!-- Price & Stepper row -->
                <div class="mt-2.5 flex items-center justify-between">
                  <span class="text-sm font-black text-lime-400">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </span>

                  <!-- Quantity Controls -->
                  <div class="flex items-center rounded-lg border border-white/15 bg-white/5">
                    <button
                      type="button"
                      @click="decreaseQuantity(item.product.id, item.size)"
                      class="px-2 py-0.5 text-xs font-bold text-gray-300 hover:text-white disabled:opacity-30"
                      :disabled="item.quantity <= 1"
                    >
                      −
                    </button>
                    <span class="min-w-6 text-center text-xs font-bold text-white">
                      {{ item.quantity }}
                    </span>
                    <button
                      type="button"
                      @click="increaseQuantity(item.product.id, item.size)"
                      class="px-2 py-0.5 text-xs font-bold text-gray-300 hover:text-white disabled:opacity-30"
                      :disabled="item.quantity >= item.product.stock"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RECOMMENDED ATHLETIC ADD-ONS (UPSLELL) -->
          <div v-if="cart.length > 0" class="border-t border-white/10 pt-5">
            <span class="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <span>⚡</span>
              <span>Popular Essentials Athletes Also Buy</span>
            </span>

            <div class="space-y-2.5">
              <div
                v-for="addon in recommendedAddons"
                :key="addon.id"
                class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5"
              >
                <div class="flex items-center gap-3">
                  <span class="text-2xl">{{ addon.icon }}</span>
                  <div>
                    <p class="text-xs font-bold text-white">{{ addon.name }}</p>
                    <p class="text-[11px] font-black text-lime-400">${{ addon.price.toFixed(2) }}</p>
                  </div>
                </div>

                <button
                  type="button"
                  @click="handleAddon(addon)"
                  class="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-lime-400 hover:text-black transition flex items-center gap-1"
                >
                  <span>+ Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Drawer Footer: Summary & Actions -->
        <div v-if="cart.length > 0" class="border-t border-white/10 bg-black/75 p-5 space-y-3.5">
          <!-- Mobile Promo Code Section -->
          <div class="rounded-xl border border-white/15 bg-white/[0.04] p-3">
            <div v-if="appliedDiscount" class="flex items-center justify-between">
              <div class="flex items-center gap-2 min-w-0">
                <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-400 text-black text-[10px] font-black">
                  ✓
                </span>
                <div class="min-w-0">
                  <p class="text-xs font-black uppercase text-white truncate">
                    {{ appliedPromoCode }}
                    <span class="text-lime-400">(-{{ discountLabel }})</span>
                  </p>
                  <p class="text-[10px] text-gray-400">Promo code active</p>
                </div>
              </div>
              <button
                type="button"
                @click="removePromo"
                class="shrink-0 rounded-lg bg-red-500/15 px-2.5 py-1 text-[11px] font-bold text-red-400 hover:bg-red-500/25 transition active:scale-95"
              >
                Remove
              </button>
            </div>

            <div v-else class="space-y-1.5">
              <label class="block text-[10px] font-black uppercase tracking-wider text-gray-300">
                Have a Promo Code?
              </label>
              <div class="flex gap-2">
                <input
                  v-model="drawerPromoCode"
                  type="text"
                  placeholder="e.g. 168 or SPORT10"
                  @keydown.enter.prevent="handleApplyPromo"
                  class="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs uppercase font-mono tracking-wider text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                />
                <button
                  type="button"
                  @click="handleApplyPromo"
                  class="shrink-0 rounded-lg bg-lime-400 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300 active:scale-95 shadow-[0_0_10px_rgba(183,243,74,0.3)]"
                >
                  Apply
                </button>
              </div>
              <p
                v-if="drawerPromoMsg"
                class="text-[11px] font-bold"
                :class="drawerPromoSuccess ? 'text-lime-400' : 'text-red-400'"
              >
                {{ drawerPromoMsg }}
              </p>
            </div>
          </div>

          <!-- Price Calculation -->
          <div class="space-y-1.5 text-xs text-gray-300">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-bold text-white">${{ subtotal.toFixed(2) }}</span>
            </div>

            <div v-if="discountAmount > 0" class="flex justify-between text-lime-400 font-bold">
              <span>Promo Discount ({{ discountLabel }})</span>
              <span>-${{ discountAmount.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Estimated Shipping</span>
              <span v-if="shippingFee === 0" class="font-bold text-lime-400">FREE</span>
              <span v-else class="font-bold text-white">${{ shippingFee.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between border-t border-white/10 pt-2 text-sm font-black text-white">
              <span>Total</span>
              <span class="text-base text-lime-400">${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2">
            <!-- 1. Instant KHQR Bakong Pay Button -->
            <button
              type="button"
              @click="handleInstantQrPay"
              class="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-lime-400 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/25 transition hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(183,243,74,0.4)] active:scale-98"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>Instant KHQR Bakong Pay</span>
            </button>

            <!-- 2. Proceed to Standard Checkout -->
            <NuxtLink
              to="/Order"
              @click="closeCartDrawer"
              class="w-full flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 text-xs font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20 hover:border-lime-400/50"
            >
              <span>Proceed to Checkout &rarr;</span>
            </NuxtLink>

            <!-- 3. View Full Bag link -->
            <div class="text-center pt-1">
              <NuxtLink
                to="/Cart"
                @click="closeCartDrawer"
                class="text-[11px] font-bold text-gray-400 hover:text-lime-300 underline"
              >
                View Full Bag Details
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCart } from "~/composables/useCart";
import { useQrPayment } from "~/composables/useQrPayment";
import { useToast } from "~/composables/useToast";
import { useAdminStore } from "~/composables/useAdminStore";

const {
  cart,
  cartCount,
  subtotal,
  appliedDiscount,
  appliedPromoCode,
  discountAmount,
  discountLabel,
  applyPromo,
  removePromo,
  isCartDrawerOpen,
  freeShippingProgress,
  freeShippingRemaining,
  closeCartDrawer,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  addToCart,
} = useCart();

const { openQrPayment } = useQrPayment();
const { success, error } = useToast();
const { allDiscounts } = useAdminStore();

const drawerPromoCode = ref("");
const drawerPromoMsg = ref("");
const drawerPromoSuccess = ref(false);

const handleApplyPromo = () => {
  const result = applyPromo(drawerPromoCode.value, allDiscounts.value);
  drawerPromoMsg.value = result.message;
  drawerPromoSuccess.value = result.success;
  if (result.success) {
    success("Promo Applied!", result.message);
    drawerPromoCode.value = "";
  } else {
    error("Invalid Promo Code", result.message);
  }
};

const shippingFee = computed(() => {
  if (subtotal.value === 0) return 0;
  return subtotal.value >= 120 ? 0 : 5;
});

const total = computed(() => {
  return Math.max(0, subtotal.value + shippingFee.value - discountAmount.value);
});

const recommendedAddons = [
  {
    id: 991,
    name: "365 Pro Gripper Crew Socks (3-Pack)",
    price: 14.0,
    icon: "🧦",
    image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=300&auto=format&fit=crop&q=80",
    stock: 50,
    brand: "365 Sport",
    category: "Accessories",
  },
  {
    id: 992,
    name: "Anti-Slip Performance Headband",
    price: 9.0,
    icon: "🏃",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&auto=format&fit=crop&q=80",
    stock: 30,
    brand: "365 Sport",
    category: "Accessories",
  },
  {
    id: 993,
    name: "AeroHydro 750ml Sports Bottle",
    price: 18.0,
    icon: "🧴",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&auto=format&fit=crop&q=80",
    stock: 25,
    brand: "365 Sport",
    category: "Accessories",
  },
];

const handleAddon = (addon: any) => {
  addToCart(
    {
      id: addon.id,
      name: addon.name,
      price: addon.price,
      image: addon.image,
      hoverimg: addon.image,
      images: [addon.image],
      description: "Official 365 Sport athletic accessory",
      category: addon.category,
      brand: addon.brand,
      gender: "Unisex",
      color: "Black",
      size: ["Standard"],
      discount: 0,
      rating: 5.0,
      reviews: 42,
      stock: addon.stock,
      featured: false,
      isNew: false,
    },
    1,
    "Standard",
    false,
  );
  success("Added Add-on!", `${addon.name} added to your bag`);
};

const handleInstantQrPay = () => {
  closeCartDrawer();
  openQrPayment({
    items: cart.value,
    subtotal: subtotal.value,
    shipping: shippingFee.value,
    total: total.value,
  });
};
</script>

<style scoped>
.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active {
  transition: opacity 300ms ease;
}

.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
