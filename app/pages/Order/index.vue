<template>
  <div class="min-h-screen bg-gray-100 py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <div class="mb-6">
        <NuxtLink
          to="/Cart"
          class="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:-translate-x-1 hover:text-black"
        >
          ← Back to Cart
        </NuxtLink>
      </div>

      <!-- Auth Warning Banner if user is not yet logged in -->
      <div
        v-if="!user"
        class="mb-6 flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 shadow-xs"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">🔒</span>
          <span>
            <strong>Login Required:</strong> You must be logged in to complete your checkout and place an order.
          </span>
        </div>
        <NuxtLink
          :to="`/Auth/Login?redirect=${encodeURIComponent(route.fullPath)}`"
          class="rounded-lg bg-black px-4 py-1.5 text-xs font-bold text-white transition hover:bg-lime-400 hover:text-black"
        >
          Log In Now
        </NuxtLink>
      </div>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900">Checkout</h1>
        <p class="mt-2 text-gray-600">
          Complete your order and proceed to payment
        </p>
      </div>

      <!-- ================================================= -->
      <!-- ORDER COMPLETED SUCCESS VIEW -->
      <!-- ================================================= -->
      <div
        v-if="orderCompleted && completedOrder"
        class="rounded-2xl bg-white p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto"
      >
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-4xl mb-4 animate-bounce">
          ✓
        </div>

        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 mb-3 border border-emerald-200">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          Payment Verified by Bakong KHQR
        </span>

        <h2 class="text-3xl font-extrabold text-gray-900">Thank You for Your Order!</h2>
        <p class="mt-2 text-sm text-gray-600">
          Your payment has been received successfully. A confirmation email has been sent to
          <strong class="text-gray-900">{{ completedOrder.email }}</strong>.
        </p>

        <!-- Order Receipt Details -->
        <div class="mt-8 rounded-xl bg-gray-50 border border-gray-200 p-6 text-left space-y-3 text-sm">
          <div class="flex justify-between border-b border-gray-200 pb-3">
            <span class="text-gray-500">Order ID:</span>
            <span class="font-mono font-bold text-gray-900">{{ completedOrder.id }}</span>
          </div>

          <div v-if="completedOrder.billNumber" class="flex justify-between border-b border-gray-200 pb-3">
            <span class="text-gray-500">Bakong Bill Number:</span>
            <span class="font-mono font-bold text-[#d61827]">{{ completedOrder.billNumber }}</span>
          </div>

          <div class="flex justify-between border-b border-gray-200 pb-3">
            <span class="text-gray-500">Payment Method:</span>
            <span class="font-semibold text-gray-900">{{ completedOrder.paymentMethod }}</span>
          </div>

          <div class="flex justify-between border-b border-gray-200 pb-3">
            <span class="text-gray-500">Customer:</span>
            <span class="font-semibold text-gray-900">{{ completedOrder.customer }}</span>
          </div>

          <div class="flex justify-between border-b border-gray-200 pb-3">
            <span class="text-gray-500">Shipping To:</span>
            <span class="font-medium text-gray-700 text-right max-w-xs truncate">
              {{ completedOrder.phone }} · {{ shippingInfo.address }}, {{ shippingInfo.city }}
            </span>
          </div>

          <div class="flex justify-between pt-1 text-base">
            <span class="font-bold text-gray-900">Total Paid:</span>
            <span class="font-black text-2xl text-emerald-600">${{ Number(completedOrder.total).toFixed(2) }} USD</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <NuxtLink
            to="/Product"
            class="flex-1 rounded-xl bg-black py-3.5 text-sm font-bold text-white transition hover:bg-lime-400 hover:text-black"
          >
            Continue Shopping
          </NuxtLink>
          <NuxtLink
            to="/"
            class="flex-1 rounded-xl border border-gray-300 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back to Home
          </NuxtLink>
        </div>
      </div>

      <!-- ================================================= -->
      <!-- CHECKOUT FORM VIEW -->
      <!-- ================================================= -->
      <div v-else class="grid gap-8 lg:grid-cols-3">
        <!-- Left: Shipping & Payment -->
        <div class="lg:col-span-2">
          <!-- SHIPPING INFORMATION -->
          <div class="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-gray-900">
                Shipping Information
              </h2>
              <span v-if="user" class="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                Logged in as <strong>{{ user.name }}</strong>
              </span>
            </div>

            <form class="mt-6 space-y-4">
              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="shippingInfo.fullName"
                  type="text"
                  placeholder="John Doe"
                  class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="shippingInfo.email"
                  type="email"
                  placeholder="john@example.com"
                  class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Phone Number <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="shippingInfo.phone"
                  type="tel"
                  placeholder="+855 12 345 678"
                  class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                />
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Address <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="shippingInfo.address"
                  type="text"
                  placeholder="123 Street Name"
                  class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                />
              </div>

              <!-- City / State / ZIP -->
              <div class="grid gap-4 sm:grid-cols-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    City <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="shippingInfo.city"
                    type="text"
                    placeholder="Phnom Penh"
                    class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    State / Province <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="shippingInfo.state"
                    type="text"
                    placeholder="Phnom Penh"
                    class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    ZIP Code <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="shippingInfo.zipCode"
                    type="text"
                    placeholder="12000"
                    class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                  />
                </div>
              </div>

              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Country <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="shippingInfo.country"
                  type="text"
                  placeholder="Cambodia"
                  class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                />
              </div>
            </form>
          </div>

          <!-- PAYMENT INFORMATION -->
          <div class="rounded-2xl bg-white p-6 shadow-sm">
            <h2 class="text-2xl font-bold text-gray-900">Payment Method</h2>

            <!-- Payment Method Tabs -->
            <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <!-- Bakong KHQR (Primary / Default) -->
              <button
                type="button"
                @click="paymentMethod = 'bakong'"
                class="flex items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-3 font-semibold transition text-xs sm:text-sm"
                :class="
                  paymentMethod === 'bakong'
                    ? 'border-[#d61827] bg-red-50 text-[#d61827] ring-2 ring-red-200'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                "
              >
                <span class="inline-block bg-[#d61827] text-white font-black text-[9px] px-1 py-0.5 rounded">KHQR</span>
                Bakong
              </button>

              <!-- Credit Card -->
              <button
                type="button"
                @click="paymentMethod = 'card'"
                class="flex items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-3 font-semibold transition text-xs sm:text-sm"
                :class="
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                "
              >
                💳 Card
              </button>

              <!-- PayPal -->
              <button
                type="button"
                @click="paymentMethod = 'paypal'"
                class="flex items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-3 font-semibold transition text-xs sm:text-sm"
                :class="
                  paymentMethod === 'paypal'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                "
              >
                🅿️ PayPal
              </button>

              <!-- Bank Transfer -->
              <button
                type="button"
                @click="paymentMethod = 'bank'"
                class="flex items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-3 font-semibold transition text-xs sm:text-sm"
                :class="
                  paymentMethod === 'bank'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                "
              >
                🏦 Transfer
              </button>
            </div>

            <!-- Bakong KHQR Info Box -->
            <div v-if="paymentMethod === 'bakong'" class="mt-6 rounded-xl border border-red-200 bg-red-50/70 p-5">
              <div class="flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d61827] text-white font-black text-xs shadow-xs">
                  KHQR
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm">Bakong KHQR Instant Pay</h4>
                  <p class="text-xs text-gray-600">Scan & pay using Bakong App or any Cambodian Bank App</p>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-lg border border-red-100">
                <div>
                  <span class="text-gray-500">Receiver:</span>
                  <span class="ml-1 font-semibold text-gray-900">Rann Tharath (IRCT SHOP)</span>
                </div>
                <div>
                  <span class="text-gray-500">Currency:</span>
                  <span class="ml-1 font-semibold text-gray-900">USD ($)</span>
                </div>
              </div>

              <div class="mt-3 flex items-start gap-2 text-[12px] text-gray-600">
                <span class="text-[#d61827] font-bold">⚡</span>
                <span>
                  When you click <strong>Proceed to Payment</strong>, a real-time Bakong KHQR code will be created and displayed in a modal. The system will automatically detect and verify your payment upon scanning.
                </span>
              </div>
            </div>

            <!-- Card Details (shown when card is selected) -->
            <form v-if="paymentMethod === 'card'" class="mt-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Card Number</label>
                <input
                  v-model="cardInfo.cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-mono outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                  @input="formatCardNumber"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Cardholder Name</label>
                <input
                  v-model="cardInfo.holderName"
                  type="text"
                  placeholder="John Doe"
                  class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                />
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    v-model="cardInfo.expiry"
                    type="text"
                    placeholder="MM/YY"
                    maxlength="5"
                    class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-mono outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                    @input="formatExpiry"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">CVC</label>
                  <input
                    v-model="cardInfo.cvc"
                    type="text"
                    placeholder="123"
                    maxlength="4"
                    class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-mono outline-none transition focus:border-black focus:ring-2 focus:ring-lime-200"
                  />
                </div>
              </div>
            </form>

            <!-- PayPal Message -->
            <div v-if="paymentMethod === 'paypal'" class="mt-6">
              <p class="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                ✓ You will be redirected to PayPal to complete your payment
              </p>
            </div>

            <!-- Bank Transfer Message -->
            <div v-if="paymentMethod === 'bank'" class="mt-6">
              <p class="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                ✓ Bank transfer details will be provided after order confirmation
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Order Summary -->
        <div>
          <div class="sticky top-20 rounded-2xl bg-white p-6 shadow-sm">
            <h3 class="text-xl font-bold text-gray-900">Order Summary</h3>

            <!-- Cart Items Display -->
            <div v-if="cart.length > 0" class="mt-6 divide-y divide-gray-100 border-b border-gray-100 pb-4 max-h-80 overflow-y-auto">
              <div v-for="(item, idx) in cart" :key="idx" class="flex gap-3 py-3">
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="h-16 w-16 rounded-lg object-cover border border-gray-100"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-gray-900 text-sm truncate">
                    {{ item.product.name }}
                  </h4>
                  <p class="text-xs text-gray-500 mt-0.5">
                    Size: <span class="font-medium text-gray-700">{{ item.size || 'N/A' }}</span> ·
                    Qty: <span class="font-medium text-gray-700">{{ item.quantity }}</span>
                  </p>
                  <p class="mt-1 font-bold text-gray-900 text-sm">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Single Item Fallback (if direct orderItem) -->
            <div v-else-if="orderItem" class="mt-6 border-b border-gray-100 pb-6">
              <div class="flex gap-4">
                <img
                  :src="orderItem.product.image"
                  :alt="orderItem.product.name"
                  class="h-20 w-20 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">
                    {{ orderItem.product.name }}
                  </h4>
                  <p class="mt-1 text-sm text-gray-500">
                    Size: <span class="font-medium">{{ orderItem.size }}</span>
                  </p>
                  <p class="text-sm text-gray-500">
                    Qty: <span class="font-medium">{{ orderItem.quantity }}</span>
                  </p>
                  <p class="mt-2 font-semibold text-gray-900">
                    ${{ (orderItem.product.price * orderItem.quantity).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Pricing Details -->
            <div class="mt-4 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium text-gray-900">${{ subtotal.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium text-gray-900">${{ shipping.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tax (10%)</span>
                <span class="font-medium text-gray-900">${{ tax.toFixed(2) }}</span>
              </div>

              <div class="border-t border-gray-100 pt-3">
                <div class="flex justify-between items-baseline">
                  <span class="font-semibold text-gray-900">Total</span>
                  <span class="text-2xl font-black text-gray-900">
                    ${{ total.toFixed(2) }}
                    <span class="text-xs font-semibold text-gray-500">USD</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Checkout Button -->
            <button
              type="button"
              @click="handleCheckout"
              :disabled="!isFormValid || total <= 0"
              class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 font-bold text-white shadow-md transition hover:bg-lime-400 hover:text-black active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              <span v-if="paymentMethod === 'bakong'" class="inline-flex items-center gap-2">
                <span class="inline-block bg-[#d61827] text-white font-black text-[9px] px-1 py-0.5 rounded">KHQR</span>
                Pay with Bakong KHQR
              </span>
              <span v-else>
                Proceed to Payment
              </span>
            </button>

            <!-- Back to Cart -->
            <NuxtLink
              to="/Cart"
              class="mt-3 block w-full rounded-xl border border-gray-200 px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Cart
            </NuxtLink>

            <!-- Trust Badges -->
            <div class="mt-6 space-y-2 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
              <p>🔒 Secure & Encrypted Payment</p>
              <p>✓ Money-back Guarantee</p>
              <p>📞 24/7 Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- BAKONG KHQR PAYMENT MODAL -->
    <!-- ================================================= -->
    <BakongPaymentModal
      :isOpen="showBakongModal"
      :amount="total"
      currency="USD"
      :apiBase="bakongApiBase"
      :description="`Order for ${shippingInfo.fullName || 'Customer'}`"
      @close="showBakongModal = false"
      @success="handleBakongSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#app/composables/router";
import { useCart } from "~/composables/useCart";
import { useAuth } from "~/composables/useAuth";
import { useApiBase } from "~/composables/useApi";
import BakongPaymentModal from "~/components/BakongPaymentModal.vue";

// =====================================================
// Auth & Protection
// =====================================================

const route = useRoute();
const { user, loadUser } = useAuth();
const apiBase = useApiBase();

// Bakong Flask API URL
const bakongApiBase = apiBase || "http://127.0.0.1:5000";

// =====================================================
// Cart
// =====================================================

const { cart, clearCart } = useCart();

// =====================================================
// Shipping Information
// =====================================================

const shippingInfo = ref({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "Phnom Penh",
  state: "Phnom Penh",
  zipCode: "12000",
  country: "Cambodia",
});

onMounted(async () => {
  // Check login
  if (!user.value) {
    await loadUser();
  }

  // If user is still not logged in, redirect to login page
  if (!user.value) {
    navigateTo(`/Auth/Login?redirect=${encodeURIComponent(route.fullPath)}`);
    return;
  }

  // Pre-fill user data
  if (user.value) {
    if (!shippingInfo.value.fullName && user.value.name) {
      shippingInfo.value.fullName = user.value.name;
    }
    if (!shippingInfo.value.email && user.value.email) {
      shippingInfo.value.email = user.value.email;
    }
  }
});

// =====================================================
// Payment Method
// =====================================================

const paymentMethod = ref<"bakong" | "card" | "paypal" | "bank">("bakong");

// =====================================================
// Modal & Completed Order State
// =====================================================

const showBakongModal = ref(false);
const orderCompleted = ref(false);
const completedOrder = ref<any>(null);

// =====================================================
// Card Information
// =====================================================

const cardInfo = ref({
  cardNumber: "",
  holderName: "",
  expiry: "",
  cvc: "",
});

// =====================================================
// Order Item (from cart or route params)
// =====================================================

const orderItem = computed(() => {
  return cart.value[cart.value.length - 1] || null;
});

// =====================================================
// Calculations
// =====================================================

const subtotal = computed(() => {
  if (cart.value.length > 0) {
    return cart.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
  if (!orderItem.value) return 0;
  return orderItem.value.product.price * orderItem.value.quantity;
});

const shipping = computed(() => {
  return subtotal.value >= 100 ? 0 : 5;
});

const tax = computed(() => {
  return Number((subtotal.value * 0.1).toFixed(2));
});

const total = computed(() => {
  return Number((subtotal.value + shipping.value + tax.value).toFixed(2));
});

// =====================================================
// Form Validation
// =====================================================

const isFormValid = computed(() => {
  const { fullName, email, phone, address, city, state, zipCode, country } =
    shippingInfo.value;

  if (
    !fullName ||
    !email ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !zipCode ||
    !country
  ) {
    return false;
  }

  if (paymentMethod.value === "card") {
    const { cardNumber, holderName, expiry, cvc } = cardInfo.value;
    if (!cardNumber || !holderName || !expiry || !cvc) {
      return false;
    }
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      return false;
    }
  }

  return true;
});

// =====================================================
// Format Card Number
// =====================================================

const formatCardNumber = () => {
  let value = cardInfo.value.cardNumber.replace(/\s/g, "");
  if (value.length > 16) {
    value = value.slice(0, 16);
  }
  cardInfo.value.cardNumber = value.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

// =====================================================
// Format Expiry
// =====================================================

const formatExpiry = () => {
  let value = cardInfo.value.expiry.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  cardInfo.value.expiry = value;
};

// =====================================================
// Handle Bakong Success
// =====================================================

const handleBakongSuccess = async (paymentData: any) => {
  const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  const productName = cart.value.length > 0
    ? cart.value.map(i => `${i.product.name} (x${i.quantity})`).join(", ")
    : (orderItem.value?.product.name || "Sports Product");

  const orderRecord = {
    id: orderId,
    customer: shippingInfo.value.fullName,
    email: shippingInfo.value.email,
    phone: shippingInfo.value.phone,
    product: productName,
    quantity: cart.value.reduce((acc, i) => acc + i.quantity, 0) || 1,
    subtotal: subtotal.value,
    shipping: shipping.value,
    total: total.value,
    status: "Completed",
    paymentStatus: "Paid",
    paymentMethod: "Bakong KHQR",
    billNumber: paymentData?.bill_number || "",
    md5: paymentData?.md5 || "",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
  };

  // Attempt to save order to backend DB
  try {
    await fetch(`${apiBase}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderRecord),
    });
  } catch (err) {
    console.warn("Could not persist order to /orders endpoint:", err);
  }

  // Clear Cart
  clearCart();

  // Set order details & close modal
  completedOrder.value = orderRecord;
  orderCompleted.value = true;
  showBakongModal.value = false;
};

// =====================================================
// Handle Checkout
// =====================================================

const handleCheckout = async () => {
  // Ensure user is logged in
  if (!user.value) {
    navigateTo(`/Auth/Login?redirect=${encodeURIComponent(route.fullPath)}`);
    return;
  }

  if (!isFormValid.value) {
    alert("Please fill in all required shipping fields.");
    return;
  }

  if (total.value <= 0) {
    alert("Your order total must be greater than $0.");
    return;
  }

  // Bakong KHQR Flow: Auto create QR and show modal
  if (paymentMethod.value === "bakong") {
    showBakongModal.value = true;
    return;
  }

  // Non-Bakong fallback simulation
  const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  completedOrder.value = {
    id: orderId,
    customer: shippingInfo.value.fullName,
    email: shippingInfo.value.email,
    phone: shippingInfo.value.phone,
    total: total.value,
    paymentMethod: paymentMethod.value.toUpperCase(),
  };
  clearCart();
  orderCompleted.value = true;
};
</script>
