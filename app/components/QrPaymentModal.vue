<template>
  <Teleport to="body">
    <div
      v-if="isQrOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md"
      @click.self="handleClose"
    >
      <div
        class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 text-white shadow-2xl transition-all duration-300"
        :class="{ 'scale-95 opacity-0': !isQrOpen, 'scale-100 opacity-100': isQrOpen }"
      >
        <!-- Header Banner: KHQR / Bakong Authentic Style -->
        <div class="relative bg-gradient-to-r from-red-700 via-rose-600 to-red-700 px-6 py-4 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white p-1 shadow-xs">
                <span class="text-xs font-black tracking-tight text-red-600">KHQR</span>
              </div>
              <div>
                <h3 class="text-sm font-black uppercase tracking-wider">KHQR · Bakong Instant Pay</h3>
                <p class="text-[11px] text-red-100">Scan with any mobile banking app</p>
              </div>
            </div>

            <button
              type="button"
              @click="handleClose"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/40"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6">
          <!-- Step 1: Missing Customer info collection (if not provided) -->
          <div v-if="needsCustomerInfo" class="mb-5 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-lime-400 mb-3 flex items-center gap-2">
              <span>📍 Delivery & Contact Information</span>
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="block text-gray-400 text-[11px] mb-1">Your Name *</label>
                <input
                  v-model="customerForm.name"
                  type="text"
                  placeholder="e.g. Rothana Cheng"
                  class="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-gray-400 text-[11px] mb-1">Phone Number *</label>
                <input
                  v-model="customerForm.phone"
                  type="tel"
                  placeholder="e.g. 012 345 678"
                  class="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-gray-400 text-[11px] mb-1">Shipping Address *</label>
                <input
                  v-model="customerForm.address"
                  type="text"
                  placeholder="e.g. Street 271, Phnom Penh"
                  class="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Network selection tabs -->
          <div class="mb-4 flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
            <button
              v-for="net in networks"
              :key="net.id"
              type="button"
              @click="selectedNetwork = net.id"
              class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition whitespace-nowrap"
              :class="
                selectedNetwork === net.id
                  ? 'bg-lime-400 text-black shadow-xs'
                  : 'bg-neutral-800 text-gray-400 hover:text-white'
              "
            >
              <span>{{ net.icon }}</span>
              <span>{{ net.name }}</span>
            </button>
          </div>

          <!-- QR Presentation Card -->
          <div class="flex flex-col items-center rounded-2xl border border-neutral-800 bg-white p-5 text-neutral-900 shadow-inner">
            <!-- Merchant Info Header -->
            <div class="text-center mb-3">
              <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Merchant</span>
              <h4 class="text-base font-black text-black">365 SPORTS OFFICIAL STORE</h4>
              <p class="text-xs text-gray-500">ID: 365-SPORTS-KHQR-99</p>
            </div>

            <!-- Authentic Crisp QR Canvas -->
            <div class="relative flex items-center justify-center rounded-xl bg-white p-2 border-2 border-dashed border-gray-300 shadow-xs">
              <!-- Corner brackets styling -->
              <div class="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-red-600"></div>
              <div class="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-red-600"></div>
              <div class="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-red-600"></div>
              <div class="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-red-600"></div>

              <!-- High Quality Stylized SVG QR -->
              <svg
                class="h-48 w-48 sm:h-52 sm:w-52"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!-- Outer Finder Pattern Top-Left -->
                <rect x="10" y="10" width="50" height="50" rx="6" fill="#000" />
                <rect x="18" y="18" width="34" height="34" rx="4" fill="#fff" />
                <rect x="24" y="24" width="22" height="22" rx="2" fill="#E11D48" />

                <!-- Outer Finder Pattern Top-Right -->
                <rect x="140" y="10" width="50" height="50" rx="6" fill="#000" />
                <rect x="148" y="18" width="34" height="34" rx="4" fill="#fff" />
                <rect x="154" y="24" width="22" height="22" rx="2" fill="#E11D48" />

                <!-- Outer Finder Pattern Bottom-Left -->
                <rect x="10" y="140" width="50" height="50" rx="6" fill="#000" />
                <rect x="18" y="148" width="34" height="34" rx="4" fill="#fff" />
                <rect x="24" y="154" width="22" height="22" rx="2" fill="#E11D48" />

                <!-- Stylized QR Matrix Dots -->
                <g fill="#18181B">
                  <!-- Row patterns -->
                  <rect x="70" y="15" width="8" height="8" rx="2" />
                  <rect x="90" y="15" width="16" height="8" rx="2" />
                  <rect x="115" y="15" width="8" height="8" rx="2" />

                  <rect x="68" y="30" width="12" height="12" rx="2" />
                  <rect x="95" y="32" width="10" height="10" rx="2" />
                  <rect x="115" y="30" width="14" height="8" rx="2" />

                  <rect x="75" y="50" width="18" height="8" rx="2" />
                  <rect x="105" y="50" width="8" height="18" rx="2" />
                  <rect x="120" y="50" width="12" height="12" rx="2" />

                  <!-- Left columns -->
                  <rect x="15" y="70" width="14" height="8" rx="2" />
                  <rect x="35" y="75" width="18" height="12" rx="2" />
                  <rect x="20" y="95" width="10" height="18" rx="2" />
                  <rect x="38" y="95" width="14" height="10" rx="2" />
                  <rect x="15" y="120" width="20" height="10" rx="2" />

                  <!-- Center Body -->
                  <rect x="65" y="70" width="12" height="12" rx="2" />
                  <rect x="125" y="70" width="15" height="10" rx="2" />
                  <rect x="65" y="120" width="14" height="10" rx="2" />
                  <rect x="120" y="120" width="12" height="12" rx="2" />

                  <!-- Right columns -->
                  <rect x="145" y="70" width="18" height="12" rx="2" />
                  <rect x="170" y="75" width="14" height="8" rx="2" />
                  <rect x="145" y="95" width="12" height="20" rx="2" />
                  <rect x="165" y="95" width="20" height="12" rx="2" />
                  <rect x="150" y="125" width="18" height="10" rx="2" />

                  <!-- Bottom Right cluster -->
                  <rect x="70" y="145" width="15" height="10" rx="2" />
                  <rect x="95" y="145" width="10" height="15" rx="2" />
                  <rect x="115" y="145" width="15" height="10" rx="2" />
                  <rect x="140" y="145" width="12" height="12" rx="2" />
                  <rect x="160" y="145" width="25" height="8" rx="2" />

                  <rect x="75" y="168" width="12" height="15" rx="2" />
                  <rect x="95" y="168" width="18" height="12" rx="2" />
                  <rect x="125" y="168" width="10" height="18" rx="2" />
                  <rect x="145" y="165" width="20" height="10" rx="2" />
                  <rect x="175" y="165" width="12" height="15" rx="2" />
                </g>

                <!-- Center Brand Badge -->
                <circle cx="100" cy="100" r="22" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
                <circle cx="100" cy="100" r="18" fill="#101310" />
                <text
                  x="100"
                  y="104"
                  fill="#B7F34A"
                  font-size="11"
                  font-weight="900"
                  text-anchor="middle"
                  font-family="sans-serif"
                >
                  365
                </text>
              </svg>

              <!-- Live scan animation line -->
              <div
                v-if="!paymentSuccess && isVerifying"
                class="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent shadow-[0_0_12px_#b7f34a] animate-pulse"
                style="top: 50%"
              ></div>
            </div>

            <!-- Amount Breakdown in USD & KHR -->
            <div class="mt-4 text-center">
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount</span>
              <div class="flex items-baseline justify-center gap-2">
                <span class="text-3xl font-black text-black">
                  ${{ totalAmount.toFixed(2) }}
                </span>
                <span class="text-sm font-bold text-gray-600">
                  ≈ {{ khrAmount.toLocaleString() }} ៛
                </span>
              </div>
            </div>

            <!-- Expiration Countdown Bar -->
            <div class="mt-3 w-full max-w-xs">
              <div class="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                <span>QR expires in</span>
                <span class="font-mono font-bold text-red-600">{{ formattedCountdown }}</span>
              </div>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  class="h-full bg-red-500 transition-all duration-1000"
                  :style="{ width: `${(countdown / 300) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Items Summary preview -->
          <div v-if="currentQrPayload?.items?.length" class="mt-4 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs">
            <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Order Items ({{ currentQrPayload.items.length }})</span>
            <div class="space-y-2 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
              <div
                v-for="(item, idx) in currentQrPayload.items"
                :key="idx"
                class="flex items-center justify-between gap-2"
              >
                <span class="truncate font-medium text-gray-200">
                  {{ item.quantity }}x {{ item.product.name }}
                  <span v-if="item.size" class="text-gray-400 text-[10px]">({{ item.size }})</span>
                </span>
                <span class="font-bold text-lime-400 shrink-0">
                  ${{ (item.product.price * item.quantity).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Verification / Payment Actions -->
          <div class="mt-5 space-y-3">
            <!-- If Verifying / Simulating State -->
            <div
              v-if="isVerifying"
              class="rounded-xl border border-lime-400/40 bg-lime-400/10 p-4 text-center text-sm font-semibold text-lime-300 animate-pulse"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="h-5 w-5 animate-spin text-lime-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ verifyStatusText }}</span>
              </div>
            </div>

            <!-- If Success State -->
            <div
              v-else-if="paymentSuccess"
              class="rounded-xl border border-emerald-400 bg-emerald-500/20 p-4 text-center text-white"
            >
              <div class="flex flex-col items-center justify-center gap-2">
                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-black text-xl font-bold">✓</span>
                <p class="font-bold text-base text-emerald-300">Payment Confirmed!</p>
                <p class="text-xs text-gray-200">Redirecting to official order receipt...</p>
              </div>
            </div>

            <!-- Normal Action Buttons -->
            <template v-else>
              <button
                type="button"
                @click="simulatePayment"
                :disabled="!isCustomerValid"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-lg hover:shadow-lime-400/20 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>⚡ I Have Paid / Simulate Payment</span>
              </button>

              <div class="flex items-center justify-between gap-3 text-xs text-gray-400">
                <button
                  type="button"
                  @click="copyMerchantId"
                  class="flex-1 rounded-lg border border-neutral-800 bg-neutral-800/60 py-2.5 text-center transition hover:bg-neutral-800 hover:text-white"
                >
                  {{ copied ? "Copied!" : "📋 Copy Payment Details" }}
                </button>
                <button
                  type="button"
                  @click="handleClose"
                  class="flex-1 rounded-lg border border-neutral-800 bg-neutral-800/60 py-2.5 text-center transition hover:bg-neutral-800 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useQrPayment } from "~/composables/useQrPayment";
import { useToast } from "~/composables/useToast";
import { useCart } from "~/composables/useCart";
import { navigateTo } from "#app/composables/router";

const { isQrOpen, currentQrPayload, closeQrPayment } = useQrPayment();
const { success, error } = useToast();
const { clearCart } = useCart();

const selectedNetwork = ref("bakong");
const networks = [
  { id: "bakong", name: "Bakong / KHQR", icon: "🇰🇭" },
  { id: "aba", name: "ABA PAY", icon: "🟦" },
  { id: "acleda", name: "ACLEDA", icon: "🟡" },
  { id: "wing", name: "Wing Bank", icon: "🟢" },
];

const customerForm = ref({
  name: "",
  phone: "",
  address: "",
});

const needsCustomerInfo = computed(() => {
  return (
    !currentQrPayload.value?.customer?.name ||
    !currentQrPayload.value?.customer?.phone ||
    !currentQrPayload.value?.customer?.address
  );
});

const isCustomerValid = computed(() => {
  if (!needsCustomerInfo.value) return true;
  return (
    customerForm.value.name.trim().length > 0 &&
    customerForm.value.phone.trim().length > 0 &&
    customerForm.value.address.trim().length > 0
  );
});

const totalAmount = computed(() => {
  return currentQrPayload.value?.total || 0;
});

const khrAmount = computed(() => {
  return Math.round(totalAmount.value * 4100);
});

// Countdown Timer (5:00 = 300 seconds)
const countdown = ref(300);
let timerInterval: ReturnType<typeof setInterval> | null = null;

const startTimer = () => {
  countdown.value = 300;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }, 1000);
};

const formattedCountdown = computed(() => {
  const m = Math.floor(countdown.value / 60);
  const s = countdown.value % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
});

watch(isQrOpen, (open) => {
  if (open) {
    paymentSuccess.value = false;
    isVerifying.value = false;
    startTimer();
    // Populate form if existing
    if (currentQrPayload.value?.customer) {
      customerForm.value = {
        name: currentQrPayload.value.customer.name || "",
        phone: currentQrPayload.value.customer.phone || "",
        address: currentQrPayload.value.customer.address || "",
      };
    }
  } else {
    if (timerInterval) clearInterval(timerInterval);
  }
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const handleClose = () => {
  closeQrPayment();
};

const copied = ref(false);
const copyMerchantId = () => {
  const info = `365 SPORTS STORE - Total: $${totalAmount.value.toFixed(2)} (${khrAmount.value.toLocaleString()} KHR) - Ref: 365-KHQR-99`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(info);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};

// Payment Simulation
const isVerifying = ref(false);
const verifyStatusText = ref("Connecting to Bakong Gateway...");
const paymentSuccess = ref(false);

const simulatePayment = () => {
  if (!isCustomerValid.value) {
    error("Missing details", "Please enter your name, phone, and address first.");
    return;
  }

  isVerifying.value = true;
  verifyStatusText.value = "Listening for incoming transaction from Bakong...";

  setTimeout(() => {
    verifyStatusText.value = "Payment signal received! Verifying transfer...";
  }, 1200);

  setTimeout(() => {
    verifyStatusText.value = "Transfer verified! Generating official order...";
  }, 2200);

  setTimeout(() => {
    isVerifying.value = false;
    paymentSuccess.value = true;
    success("Payment Received!", "Your order has been placed successfully via KHQR.");

    // Create Order record and persist
    const orderId = "365-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const finalCustomer = {
      name: currentQrPayload.value?.customer?.name || customerForm.value.name,
      phone: currentQrPayload.value?.customer?.phone || customerForm.value.phone,
      email: currentQrPayload.value?.customer?.email || "customer@365sports.com",
      address: currentQrPayload.value?.customer?.address || customerForm.value.address,
    };

    const orderRecord = {
      id: orderId,
      customer: finalCustomer.name,
      phone: finalCustomer.phone,
      email: finalCustomer.email,
      address: finalCustomer.address,
      items: currentQrPayload.value?.items || [],
      subtotal: currentQrPayload.value?.subtotal || totalAmount.value,
      shipping: currentQrPayload.value?.shipping || 0,
      tax: currentQrPayload.value?.tax || 0,
      total: totalAmount.value,
      khrTotal: khrAmount.value,
      status: "Processing",
      paymentStatus: "Paid",
      paymentMethod: `KHQR (${selectedNetwork.value.toUpperCase()})`,
      date: new Date().toISOString(),
    };

    // Save to local storage
    if (typeof window !== "undefined") {
      try {
        const existingOrders = JSON.parse(localStorage.getItem("365_orders") || "[]");
        existingOrders.unshift(orderRecord);
        localStorage.setItem("365_orders", JSON.stringify(existingOrders));
        localStorage.setItem("last_order", JSON.stringify(orderRecord));
      } catch (e) {
        console.error("Storage error:", e);
      }
    }

    // Clear cart if this was a cart checkout
    clearCart();

    // Close modal and navigate
    setTimeout(() => {
      closeQrPayment();
      navigateTo(`/Order/${orderId}`);
    }, 1200);
  }, 3200);
};
</script>
