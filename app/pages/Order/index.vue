<template>
  <div class="min-h-screen py-10 text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Back Navigation -->
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink
          to="/Cart"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-400 transition hover:-translate-x-1 hover:text-white"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Cart</span>
        </NuxtLink>

        <!-- Secure Badge -->
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          256-Bit SSL Encrypted Checkout
        </span>
      </div>

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2">
          <span class="h-7 w-1.5 rounded-full bg-lime-400 shadow-[0_0_12px_#b7f34a]"></span>
          <h1 class="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Checkout</h1>
        </div>
        <p class="mt-1 text-xs sm:text-sm text-gray-400">
          Provide your shipping address and choose your preferred instant payment method
        </p>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid gap-8 lg:grid-cols-12">
        <!-- LEFT: Shipping & Payment Method (8 cols) -->
        <div class="lg:col-span-8 space-y-8">
          <!-- 1. SHIPPING INFORMATION -->
          <div class="rounded-3xl border border-white/10 bg-[#0d1017]/85 backdrop-blur-2xl p-6 sm:p-8 shadow-xl">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 class="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2.5">
                <span class="flex h-7 w-7 items-center justify-center rounded-xl bg-lime-400 text-black text-xs font-black shadow-[0_0_10px_#b7f34a]">1</span>
                <span>Shipping Information</span>
              </h2>
              <span class="text-xs text-gray-400 font-medium">* Required fields</span>
            </div>

            <form class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <!-- Full Name -->
              <div>
                <label class="block font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-1.5">
                  Full Name *
                </label>
                <input
                  v-model="shippingInfo.fullName"
                  type="text"
                  placeholder="e.g. Rothana Cheng"
                  class="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-1.5">
                  Email Address *
                </label>
                <input
                  v-model="shippingInfo.email"
                  type="email"
                  placeholder="e.g. rothana@example.com"
                  class="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-1.5">
                  Phone Number (Telegram / Mobile) *
                </label>
                <input
                  v-model="shippingInfo.phone"
                  type="tel"
                  placeholder="e.g. 012 345 678"
                  class="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
                />
              </div>

              <!-- City / Province -->
              <div>
                <label class="block font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-1.5">
                  City / Province *
                </label>
                <input
                  v-model="shippingInfo.city"
                  type="text"
                  placeholder="e.g. Phnom Penh"
                  class="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
                />
              </div>

              <!-- Delivery Address -->
              <div class="sm:col-span-2">
                <label class="block font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-1.5">
                  Street Address / House No. *
                </label>
                <input
                  v-model="shippingInfo.address"
                  type="text"
                  placeholder="e.g. #14, St. 2004, Sangkat Teuk Thla, Khan Sen Sok"
                  class="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
                />
              </div>
            </form>
          </div>

          <!-- 2. PAYMENT METHOD SELECTION -->
          <div class="rounded-3xl border border-white/10 bg-[#0d1017]/85 backdrop-blur-2xl p-6 sm:p-8 shadow-xl">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 class="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2.5">
                <span class="flex h-7 w-7 items-center justify-center rounded-xl bg-lime-400 text-black text-xs font-black shadow-[0_0_10px_#b7f34a]">2</span>
                <span>Payment Method</span>
              </h2>
              <span class="text-xs font-bold text-lime-400">⚡ Instant Verification</span>
            </div>

            <!-- Payment Tabs -->
            <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <!-- KHQR Option (Default & Recommended) -->
              <button
                type="button"
                @click="paymentMethod = 'khqr'"
                class="flex flex-col items-center justify-center rounded-2xl border-2 p-4 font-bold transition text-center relative overflow-hidden"
                :class="
                  paymentMethod === 'khqr'
                    ? 'border-red-500 bg-red-600/15 text-white ring-2 ring-red-500/40 shadow-lg shadow-red-600/20'
                    : 'border-white/10 text-gray-400 hover:text-white bg-white/5'
                "
              >
                <span class="text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded tracking-wide mb-1 shadow-sm">KHQR</span>
                <span class="text-xs font-black">Bakong / KHQR</span>
                <span class="text-[10px] text-gray-400">All Banking Apps</span>
              </button>

              <!-- Credit / Debit Card -->
              <button
                type="button"
                @click="paymentMethod = 'card'"
                class="flex flex-col items-center justify-center rounded-2xl border-2 p-4 font-bold transition text-center"
                :class="
                  paymentMethod === 'card'
                    ? 'border-lime-400 bg-lime-400/15 text-white shadow-lg ring-2 ring-lime-400/30'
                    : 'border-white/10 text-gray-400 hover:text-white bg-white/5'
                "
              >
                <span class="text-xl mb-1">💳</span>
                <span class="text-xs font-black">Credit Card</span>
                <span class="text-[10px] text-gray-400">Visa / Mastercard</span>
              </button>

              <!-- Cash On Delivery -->
              <button
                type="button"
                @click="paymentMethod = 'cod'"
                class="flex flex-col items-center justify-center rounded-2xl border-2 p-4 font-bold transition text-center"
                :class="
                  paymentMethod === 'cod'
                    ? 'border-lime-400 bg-lime-400/15 text-white shadow-lg ring-2 ring-lime-400/30'
                    : 'border-white/10 text-gray-400 hover:text-white bg-white/5'
                "
              >
                <span class="text-xl mb-1">🚚</span>
                <span class="text-xs font-black">Cash On Delivery</span>
                <span class="text-[10px] text-gray-400">Pay at Doorstep</span>
              </button>

              <!-- Bank Wire -->
              <button
                type="button"
                @click="paymentMethod = 'bank'"
                class="flex flex-col items-center justify-center rounded-2xl border-2 p-4 font-bold transition text-center"
                :class="
                  paymentMethod === 'bank'
                    ? 'border-lime-400 bg-lime-400/15 text-white shadow-lg ring-2 ring-lime-400/30'
                    : 'border-white/10 text-gray-400 hover:text-white bg-white/5'
                "
              >
                <span class="text-xl mb-1">🏦</span>
                <span class="text-xs font-black">Bank Transfer</span>
                <span class="text-[10px] text-gray-400">Manual Slip</span>
              </button>
            </div>

            <!-- PAYMENT CONTENT 1: KHQR EMBEDDED CODE WITH USER'S REAL KHQR -->
            <div v-if="paymentMethod === 'khqr'" class="mt-6 rounded-2xl border border-white/10 bg-black/60 p-6 text-white backdrop-blur-md">
              <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
                <!-- QR Visual Display -->
                <div class="flex flex-col items-center rounded-2xl bg-white p-4 text-black shadow-2xl">
                  <div class="flex items-center gap-1.5 mb-2">
                    <span class="text-xs font-black text-red-600">KHQR</span>
                    <span class="text-[11px] font-bold text-gray-800">· CHENG ROTANA</span>
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
                <div class="flex-1 space-y-3.5 text-xs">
                  <div class="flex items-center gap-2.5">
                    <span class="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black text-white uppercase shadow-sm">Step 1</span>
                    <span class="font-bold text-gray-200">Open any Bakong / ABA / ACLEDA / Wing app</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black text-white uppercase shadow-sm">Step 2</span>
                    <span class="font-bold text-gray-200">Scan this official KHQR code</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black text-white uppercase shadow-sm">Step 3</span>
                    <span class="font-bold text-gray-200">Confirm transfer & click below to verify</span>
                  </div>

                  <div class="pt-3">
                    <div class="rounded-xl bg-white/5 p-3.5 border border-white/10 text-[11px] text-gray-300">
                      <p>✨ <strong>Supported Banks:</strong> ABA PAY, Bakong, Wing, ACLEDA, Sathapana, TrueMoney, PromptPay</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PAYMENT CONTENT 2: CARD DETAILS -->
            <div v-else-if="paymentMethod === 'card'" class="mt-6 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div class="sm:col-span-2">
                  <label class="block font-bold text-gray-300 text-[11px] mb-1">Card Number *</label>
                  <input
                    v-model="cardInfo.cardNumber"
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    maxlength="19"
                    @input="formatCardNumber"
                    class="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-mono text-xs text-white outline-none transition focus:border-lime-400"
                  />
                </div>
                <div>
                  <label class="block font-bold text-gray-300 text-[11px] mb-1">Cardholder Name *</label>
                  <input
                    v-model="cardInfo.holderName"
                    type="text"
                    placeholder="John Doe"
                    class="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white outline-none transition focus:border-lime-400"
                  />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block font-bold text-gray-300 text-[11px] mb-1">Exp (MM/YY) *</label>
                    <input
                      v-model="cardInfo.expiry"
                      type="text"
                      placeholder="12/28"
                      maxlength="5"
                      class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 font-mono text-xs text-white outline-none transition focus:border-lime-400"
                    />
                  </div>
                  <div>
                    <label class="block font-bold text-gray-300 text-[11px] mb-1">CVC *</label>
                    <input
                      v-model="cardInfo.cvc"
                      type="text"
                      placeholder="123"
                      maxlength="4"
                      class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 font-mono text-xs text-white outline-none transition focus:border-lime-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- PAYMENT CONTENT 3: CASH ON DELIVERY -->
            <div v-else-if="paymentMethod === 'cod'" class="mt-6 rounded-2xl bg-white/5 p-5 border border-white/10 text-xs text-gray-300">
              <p class="font-bold text-white mb-1.5">💵 Cash on Delivery (Doorstep Payment)</p>
              <p>You can pay with cash or KHQR directly to our courier when your gear arrives. Please have the exact change ready.</p>
            </div>

            <!-- PAYMENT CONTENT 4: BANK TRANSFER -->
            <div v-else class="mt-6 rounded-2xl bg-white/5 p-5 border border-white/10 text-xs text-gray-300 space-y-1">
              <p class="font-bold text-white">🏦 Bank Wire Transfer Details:</p>
              <p>Bank: <strong>ABA Bank</strong> · Account Name: <strong>CHENG ROTANA</strong></p>
              <p>Account Number: <strong class="font-mono text-lime-400">001 999 365 (USD)</strong></p>
            </div>
          </div>
        </div>

        <!-- RIGHT: ORDER SUMMARY (4 cols) -->
        <div class="lg:col-span-4">
          <div class="sticky top-24 rounded-3xl border border-white/10 bg-[#0d1017]/90 backdrop-blur-2xl p-6 shadow-2xl">
            <h3 class="text-base font-black uppercase tracking-tight text-white">Order Summary</h3>

            <!-- Itemized List -->
            <div class="mt-4 space-y-3 border-b border-white/10 pb-4 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              <div
                v-for="(item, idx) in checkoutItems"
                :key="idx"
                class="flex gap-3 text-xs"
              >
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="h-14 w-14 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-white truncate">{{ item.product.name }}</h4>
                  <p class="text-[11px] text-gray-400">Size: {{ item.size || 'Standard' }} | Qty: {{ item.quantity }}</p>
                  <p class="font-black text-lime-400 mt-0.5">${{ (item.product.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <!-- Totals calculation -->
            <div class="mt-4 space-y-2.5 text-xs">
              <div class="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span class="font-bold text-white">${{ itemsSubtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span class="font-bold text-white">
                  {{ shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}` }}
                </span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Tax (Included)</span>
                <span class="font-bold text-white">$0.00</span>
              </div>

              <div class="border-t border-white/10 pt-3">
                <div class="flex items-baseline justify-between">
                  <span class="text-sm font-black text-white uppercase">Total Due</span>
                  <div class="text-right">
                    <span class="text-2xl font-black text-lime-400 drop-shadow-[0_0_10px_rgba(183,243,74,0.3)]">
                      ${{ finalTotal.toFixed(2) }}
                    </span>
                    <span class="block text-[10px] text-gray-400 font-bold">
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
                class="rounded-xl border border-lime-400/50 bg-lime-400/10 p-3.5 text-center text-xs font-bold text-lime-300 animate-pulse flex items-center justify-center gap-2"
              >
                <svg class="h-4 w-4 animate-spin text-lime-400" fill="none" viewBox="0 0 24 24">
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
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 py-4 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/30 transition hover:bg-lime-300 hover:shadow-[0_0_25px_rgba(183,243,74,0.5)] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span v-if="paymentMethod === 'khqr'">⚡ Confirm KHQR Payment</span>
                <span v-else-if="paymentMethod === 'card'">💳 Pay with Credit Card</span>
                <span v-else-if="paymentMethod === 'cod'">🚚 Place Order (COD)</span>
                <span v-else>🏦 Place Order via Bank Wire</span>
              </button>

              <NuxtLink
                to="/Cart"
                class="block w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-xs font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Modify Cart
              </NuxtLink>
            </div>

            <!-- Trust Badges -->
            <div class="mt-6 border-t border-white/10 pt-4 text-center text-[10px] text-gray-400 space-y-1">
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
import { ref, computed } from "vue";
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

const checkoutItems = computed(() => {
  if (cart.value.length > 0) {
    return cart.value;
  }
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
        ? "Payment detected from Bakong! Verifying transaction..."
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
