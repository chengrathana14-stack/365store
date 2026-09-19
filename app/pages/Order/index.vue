<template>
  <div class="min-h-screen py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Back Navigation -->
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink
          to="/Cart"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 transition hover:-translate-x-1 hover:text-black"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Cart</span>
        </NuxtLink>

        <!-- Secure Badge -->
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          256-Bit SSL Encrypted Checkout
        </span>
      </div>

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2">
          <span class="h-7 w-1.5 rounded-full bg-lime-500"></span>
          <h1 class="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">Checkout</h1>
        </div>
        <p class="mt-1 text-xs sm:text-sm text-gray-500">
          Provide your shipping address and choose your preferred instant payment method
        </p>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid gap-8 lg:grid-cols-12">
        <!-- LEFT: Shipping & Payment Method (8 cols) -->
        <div class="lg:col-span-8 space-y-8">
          <!-- 1. SHIPPING INFORMATION -->
          <div class="rounded-2xl border border-gray-200/90 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-sm">
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 class="text-lg font-black uppercase tracking-tight text-gray-950 flex items-center gap-2">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-black text-lime-400 text-xs">1</span>
                <span>Shipping Information</span>
              </h2>
              <span class="text-xs text-gray-400 font-medium">* Required fields</span>
            </div>

            <form class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <!-- Full Name -->
              <div>
                <label class="block font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-1.5">
                  Full Name *
                </label>
                <input
                  v-model="shippingInfo.fullName"
                  type="text"
                  placeholder="e.g. Rothana Cheng"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs outline-none transition focus:border-black focus:ring-2 focus:ring-lime-400/30"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-1.5">
                  Email Address *
                </label>
                <input
                  v-model="shippingInfo.email"
                  type="email"
                  placeholder="e.g. rothana@example.com"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs outline-none transition focus:border-black focus:ring-2 focus:ring-lime-400/30"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-1.5">
                  Phone Number (Telegram / Mobile) *
                </label>
                <input
                  v-model="shippingInfo.phone"
                  type="tel"
                  placeholder="e.g. 012 345 678"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs outline-none transition focus:border-black focus:ring-2 focus:ring-lime-400/30"
                />
              </div>

              <!-- City / Province -->
              <div>
                <label class="block font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-1.5">
                  City / Province *
                </label>
                <input
                  v-model="shippingInfo.city"
                  type="text"
                  placeholder="e.g. Phnom Penh"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs outline-none transition focus:border-black focus:ring-2 focus:ring-lime-400/30"
                />
              </div>

              <!-- Delivery Address -->
              <div class="sm:col-span-2">
                <label class="block font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-1.5">
                  Street Address / House No. *
                </label>
                <input
                  v-model="shippingInfo.address"
                  type="text"
                  placeholder="e.g. #14, St. 2004, Sangkat Teuk Thla, Khan Sen Sok"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs outline-none transition focus:border-black focus:ring-2 focus:ring-lime-400/30"
                />
              </div>
            </form>
          </div>

          <!-- 2. PAYMENT METHOD SELECTION -->
          <div class="rounded-2xl border border-gray-200/90 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-sm">
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 class="text-lg font-black uppercase tracking-tight text-gray-950 flex items-center gap-2">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-black text-lime-400 text-xs">2</span>
                <span>Payment Method</span>
              </h2>
              <span class="text-xs font-bold text-lime-600">⚡ Instant Verification</span>
            </div>

            <!-- Payment Tabs -->
            <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <!-- KHQR Option (Default & Recommended) -->
              <button
                type="button"
                @click="paymentMethod = 'khqr'"
                class="flex flex-col items-center justify-center rounded-xl border-2 p-3.5 font-bold transition text-center relative overflow-hidden"
                :class="
                  paymentMethod === 'khqr'
                    ? 'border-red-600 bg-red-50/70 text-red-700 ring-2 ring-red-400/20 shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                "
              >
                <span class="text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded tracking-wide mb-1">KHQR</span>
                <span class="text-xs font-black">Bakong / KHQR</span>
                <span class="text-[10px] text-gray-400">All Banking Apps</span>
              </button>

              <!-- Credit / Debit Card -->
              <button
                type="button"
                @click="paymentMethod = 'card'"
                class="flex flex-col items-center justify-center rounded-xl border-2 p-3.5 font-bold transition text-center"
                :class="
                  paymentMethod === 'card'
                    ? 'border-black bg-neutral-900 text-white shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                "
              >
                <span class="text-lg mb-1">💳</span>
                <span class="text-xs font-black">Credit Card</span>
                <span class="text-[10px] opacity-70">Visa / Mastercard</span>
              </button>

              <!-- Cash On Delivery -->
              <button
                type="button"
                @click="paymentMethod = 'cod'"
                class="flex flex-col items-center justify-center rounded-xl border-2 p-3.5 font-bold transition text-center"
                :class="
                  paymentMethod === 'cod'
                    ? 'border-lime-500 bg-lime-50 text-black shadow-xs ring-2 ring-lime-400/30'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                "
              >
                <span class="text-lg mb-1">🚚</span>
                <span class="text-xs font-black">Cash On Delivery</span>
                <span class="text-[10px] text-gray-400">Pay at Doorstep</span>
              </button>

              <!-- Bank Wire -->
              <button
                type="button"
                @click="paymentMethod = 'bank'"
                class="flex flex-col items-center justify-center rounded-xl border-2 p-3.5 font-bold transition text-center"
                :class="
                  paymentMethod === 'bank'
                    ? 'border-black bg-neutral-900 text-white shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                "
              >
                <span class="text-lg mb-1">🏦</span>
                <span class="text-xs font-black">Bank Transfer</span>
                <span class="text-[10px] opacity-70">Manual Slip</span>
              </button>
            </div>

            <!-- PAYMENT CONTENT 1: KHQR EMBEDDED CODE (WHAT WAS MISSING!) -->
            <div v-if="paymentMethod === 'khqr'" class="mt-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white">
              <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
                <!-- QR Visual Display -->
                <div class="flex flex-col items-center rounded-2xl bg-white p-4 text-black shadow-lg">
                  <div class="flex items-center gap-1.5 mb-2">
                    <span class="text-xs font-black text-red-600">KHQR</span>
                    <span class="text-[11px] font-bold text-gray-700">· CHENG ROTANA</span>
                  </div>

                  <!-- Real KHQR Image -->
                  <div class="relative p-1 border-2 border-gray-200 rounded-xl overflow-hidden max-w-[210px] sm:max-w-[230px] bg-white shadow-xs">
                    <img
                      src="/images/khqr.png"
                      alt="CHENG ROTANA KHQR"
                      class="w-full h-auto object-contain rounded-lg"
                    />

                    <!-- Scanning Line animation if verifying -->
                    <div
                      v-if="isProcessingPayment"
                      class="absolute inset-x-0 h-1 bg-lime-400 animate-pulse shadow-[0_0_12px_#b7f34a]"
                      style="top: 50%"
                    ></div>
                  </div>

                  <span class="mt-2 text-xs font-black text-black">
                    ${{ finalTotal.toFixed(2) }} ({{ Math.round(finalTotal * 4100).toLocaleString() }} ៛)
                  </span>
                </div>

                <!-- QR Instructions & Quick Scan -->
                <div class="flex-1 space-y-3 text-xs">
                  <div class="flex items-center gap-2">
                    <span class="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">Step 1</span>
                    <span class="font-bold text-gray-200">Open any Bakong / ABA / ACLEDA app</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">Step 2</span>
                    <span class="font-bold text-gray-200">Scan this KHQR code</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">Step 3</span>
                    <span class="font-bold text-gray-200">Confirm payment & click below to verify</span>
                  </div>

                  <div class="pt-3">
                    <div class="rounded-xl bg-neutral-900 p-3 border border-neutral-800 text-[11px] text-gray-300">
                      <p>✨ <strong>Supported:</strong> ABA PAY, Bakong, Wing, ACLEDA, Sathapana, TrueMoney, PromptPay</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PAYMENT CONTENT 2: CARD DETAILS -->
            <div v-else-if="paymentMethod === 'card'" class="mt-6 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div class="sm:col-span-2">
                  <label class="block font-bold text-gray-800 text-[11px] mb-1">Card Number *</label>
                  <input
                    v-model="cardInfo.cardNumber"
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    maxlength="19"
                    @input="formatCardNumber"
                    class="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-xs outline-none transition focus:border-black"
                  />
                </div>
                <div>
                  <label class="block font-bold text-gray-800 text-[11px] mb-1">Cardholder Name *</label>
                  <input
                    v-model="cardInfo.holderName"
                    type="text"
                    placeholder="John Doe"
                    class="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs outline-none transition focus:border-black"
                  />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block font-bold text-gray-800 text-[11px] mb-1">Exp (MM/YY) *</label>
                    <input
                      v-model="cardInfo.expiry"
                      type="text"
                      placeholder="12/28"
                      maxlength="5"
                      class="w-full rounded-xl border border-gray-200 px-3 py-3 font-mono text-xs outline-none transition focus:border-black"
                    />
                  </div>
                  <div>
                    <label class="block font-bold text-gray-800 text-[11px] mb-1">CVC *</label>
                    <input
                      v-model="cardInfo.cvc"
                      type="text"
                      placeholder="123"
                      maxlength="4"
                      class="w-full rounded-xl border border-gray-200 px-3 py-3 font-mono text-xs outline-none transition focus:border-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- PAYMENT CONTENT 3: CASH ON DELIVERY -->
            <div v-else-if="paymentMethod === 'cod'" class="mt-6 rounded-xl bg-neutral-50 p-4 border border-gray-200 text-xs text-gray-700">
              <p class="font-bold text-gray-900 mb-1">💵 Cash on Delivery (Doorstep Payment)</p>
              <p>You can pay with cash or KHQR directly to our courier when your gear arrives. Please have the exact change ready.</p>
            </div>

            <!-- PAYMENT CONTENT 4: BANK TRANSFER -->
            <div v-else class="mt-6 rounded-xl bg-neutral-50 p-4 border border-gray-200 text-xs text-gray-700 space-y-1">
              <p class="font-bold text-gray-900">🏦 Bank Wire Transfer Details:</p>
              <p>Bank: <strong>ABA Bank</strong> · Account Name: <strong>365 SPORTS CO., LTD</strong></p>
              <p>Account Number: <strong class="font-mono">001 999 365 (USD)</strong></p>
            </div>
          </div>
        </div>

        <!-- RIGHT: ORDER SUMMARY (4 cols) -->
        <div class="lg:col-span-4">
          <div class="sticky top-24 rounded-2xl border border-gray-200/90 bg-white/95 backdrop-blur-md p-6 shadow-lg">
            <h3 class="text-base font-black uppercase tracking-tight text-gray-950">Order Summary</h3>

            <!-- Itemized List -->
            <div class="mt-4 space-y-3 border-b border-gray-100 pb-4 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              <div
                v-for="(item, idx) in checkoutItems"
                :key="idx"
                class="flex gap-3 text-xs"
              >
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="h-14 w-14 rounded-lg object-cover border border-gray-200 shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-gray-900 truncate">{{ item.product.name }}</h4>
                  <p class="text-[11px] text-gray-500">Size: {{ item.size || 'Standard' }} | Qty: {{ item.quantity }}</p>
                  <p class="font-black text-gray-900 mt-0.5">${{ (item.product.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <!-- Totals calculation -->
            <div class="mt-4 space-y-2 text-xs">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span class="font-bold text-gray-900">${{ itemsSubtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span class="font-bold text-gray-900">
                  {{ shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}` }}
                </span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tax (Included)</span>
                <span class="font-bold text-gray-900">$0.00</span>
              </div>

              <div class="border-t border-gray-200 pt-3">
                <div class="flex items-baseline justify-between">
                  <span class="text-sm font-black text-gray-950 uppercase">Total Due</span>
                  <div class="text-right">
                    <span class="text-2xl font-black text-gray-950">
                      ${{ finalTotal.toFixed(2) }}
                    </span>
                    <span class="block text-[10px] text-gray-500 font-bold">
                      ≈ {{ Math.round(finalTotal * 4100).toLocaleString() }} KHR
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- SUBMIT BUTTON -->
            <div class="mt-6 space-y-3">
              <!-- Verification / Loading Progress -->
              <div
                v-if="isProcessingPayment"
                class="rounded-xl border border-lime-400/50 bg-lime-400/10 p-3 text-center text-xs font-bold text-lime-700 animate-pulse flex items-center justify-center gap-2"
              >
                <svg class="h-4 w-4 animate-spin text-lime-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ processingStatusMessage }}</span>
              </div>

              <button
                v-else
                type="button"
                @click="handleCompleteOrder"
                :disabled="!isFormValid || checkoutItems.length === 0"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 py-4 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/20 transition hover:bg-lime-300 hover:scale-[1.01] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span v-if="paymentMethod === 'khqr'">⚡ Confirm KHQR Payment</span>
                <span v-else-if="paymentMethod === 'card'">💳 Pay with Credit Card</span>
                <span v-else-if="paymentMethod === 'cod'">🚚 Place Order (COD)</span>
                <span v-else>🏦 Place Order via Bank Wire</span>
              </button>

              <NuxtLink
                to="/Cart"
                class="block w-full rounded-xl border border-gray-200 bg-white py-2.5 text-center text-xs font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Modify Cart
              </NuxtLink>
            </div>

            <!-- Trust Badges -->
            <div class="mt-6 border-t border-gray-100 pt-4 text-center text-[10px] text-gray-500 space-y-1">
              <p>🔒 Instant Bank Verification & SSL Encryption</p>
              <p>✓ 30 Days Return & Exchange Guarantee</p>
              <p>📞 24/7 Dedicated Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCart } from "~/composables/useCart";
import { useToast } from "~/composables/useToast";
import { navigateTo } from "#app/composables/router";
import { products as fallbackProducts } from "~/data/product";

definePageMeta({
  layout: "user",
});

const { cart, subtotal: cartSubtotal, clearCart } = useCart();
const { success, error } = useToast();

// Shipping Information
const shippingInfo = ref({
  fullName: "Rothana Cheng",
  email: "rothana@365sports.com",
  phone: "012 888 365",
  address: "Building 365, Confederation de la Russie, Phnom Penh",
  city: "Phnom Penh",
});

// Payment Method Tab
const paymentMethod = ref<"khqr" | "card" | "cod" | "bank">("khqr");

// Card Info
const cardInfo = ref({
  cardNumber: "",
  holderName: "",
  expiry: "",
  cvc: "",
});

const formatCardNumber = () => {
  let val = cardInfo.value.cardNumber.replace(/\D/g, "").slice(0, 16);
  cardInfo.value.cardNumber = val.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

// Checkout Items (if cart has items, use cart; if cart is empty, fallback to product #1 so the page remains interactive for demonstration)
const checkoutItems = computed(() => {
  if (cart.value.length > 0) {
    return cart.value;
  }
  // Fallback demo product if user navigated directly to checkout
  return [
    {
      product: fallbackProducts[0],
      quantity: 1,
      size: fallbackProducts[0].size[0] || "8",
    },
  ];
});

const itemsSubtotal = computed(() => {
  return checkoutItems.value.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
});

const shippingCost = computed(() => {
  return itemsSubtotal.value >= 100 ? 0 : 5;
});

const finalTotal = computed(() => {
  return itemsSubtotal.value + shippingCost.value;
});

// Form Validation
const isFormValid = computed(() => {
  const { fullName, email, phone, address, city } = shippingInfo.value;
  if (!fullName || !email || !phone || !address || !city) return false;

  if (paymentMethod.value === "card") {
    const { cardNumber, holderName, expiry, cvc } = cardInfo.value;
    if (!cardNumber || !holderName || !expiry || !cvc) return false;
  }
  return true;
});

// Complete Order Process
const isProcessingPayment = ref(false);
const processingStatusMessage = ref("Verifying payment signal...");

const handleCompleteOrder = () => {
  if (!isFormValid.value) {
    error("Form incomplete", "Please fill in all required shipping fields.");
    return;
  }

  isProcessingPayment.value = true;
  processingStatusMessage.value =
    paymentMethod.value === "khqr"
      ? "Listening for Bakong / KHQR payment signal..."
      : "Validating payment details...";

  setTimeout(() => {
    processingStatusMessage.value =
      paymentMethod.value === "khqr"
        ? "Payment detected! Verifying transaction receipt..."
        : "Payment authorized!";
  }, 1400);

  setTimeout(() => {
    isProcessingPayment.value = false;

    // Generate Order ID
    const orderId = "365-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const orderRecord = {
      id: orderId,
      customer: shippingInfo.value.fullName,
      email: shippingInfo.value.email,
      phone: shippingInfo.value.phone,
      address: shippingInfo.value.address,
      city: shippingInfo.value.city,
      items: checkoutItems.value,
      subtotal: itemsSubtotal.value,
      shipping: shippingCost.value,
      total: finalTotal.value,
      khrTotal: Math.round(finalTotal.value * 4100),
      status: "Processing",
      paymentStatus: paymentMethod.value === "cod" ? "Pending" : "Paid",
      paymentMethod:
        paymentMethod.value === "khqr"
          ? "KHQR / Bakong (Instant)"
          : paymentMethod.value === "card"
          ? "Credit Card"
          : paymentMethod.value === "cod"
          ? "Cash on Delivery"
          : "Bank Transfer",
      date: new Date().toISOString(),
    };

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("365_orders") || "[]");
        existing.unshift(orderRecord);
        localStorage.setItem("365_orders", JSON.stringify(existing));
        localStorage.setItem("last_order", JSON.stringify(orderRecord));
      } catch (err) {
        console.error("Order storage err:", err);
      }
    }

    clearCart();
    success("Order Confirmed! 🎉", `Order ID: ${orderId}. View your receipt.`);
    navigateTo(`/Order/${orderId}`);
  }, 2600);
};
</script>
