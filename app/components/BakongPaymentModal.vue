<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
        @click.self="handleClose"
      >
        <div
          class="relative max-w-sm w-full bg-white rounded-3xl p-5 shadow-2xl flex flex-col items-center border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
        >
          <!-- Close button -->
          <button
            type="button"
            @click="handleClose"
            class="absolute top-3 right-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black transition text-sm cursor-pointer"
            title="Close"
          >
            ✕
          </button>

          <!-- Loading State -->
          <div v-if="isLoading" class="py-20 flex flex-col items-center">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#E1251B]"></div>
            <p class="mt-4 text-xs font-bold text-gray-600 tracking-wide uppercase">Generating KHQR...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="errorMessage" class="py-12 px-4 text-center">
            <div class="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              !
            </div>
            <p class="text-sm font-semibold text-gray-800">{{ errorMessage }}</p>
            <button
              type="button"
              @click="generateQr"
              class="mt-4 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-lime-400 hover:text-black transition cursor-pointer"
            >
              Retry
            </button>
          </div>

          <!-- Payment Success State -->
          <div v-else-if="paymentStatus === 'PAID'" class="py-12 text-center w-full">
            <div class="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-black mb-3 mx-auto animate-bounce">
              ✓
            </div>
            <h3 class="text-xl font-black text-gray-900">Payment Successful!</h3>
            <p class="text-xs text-gray-500 mt-1">Transaction confirmed by ACLEDA Bank & Bakong KHQR.</p>
            <div class="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              <p class="font-bold text-gray-800">CHENG ROTANA (365 Sport)</p>
              <p class="text-emerald-600 font-extrabold text-sm mt-1">
                {{ activeCurrency === 'KHR' ? `${formattedAmount} ៛` : `$${formattedAmount} USD` }}
              </p>
            </div>
          </div>

          <!-- Authentic KHQR Card Display -->
          <div v-else-if="qrData" class="w-full flex flex-col items-center">
            <!-- Authentic KHQR Card Container -->
            <div class="w-full max-w-[310px] rounded-2xl bg-white border-2 border-red-500/20 shadow-xl overflow-hidden flex flex-col items-center">
              <!-- KHQR Official Red Header -->
              <div class="relative w-full bg-[#E1251B] px-4 py-3 flex items-center justify-center text-white overflow-hidden">
                <!-- Top Right Diagonal Cut (Official KHQR Standee style) -->
                <div class="absolute -top-6 -right-6 w-12 h-12 bg-white rotate-45"></div>

                <!-- KHQR Logo -->
                <div class="flex items-center gap-1.5 font-black text-lg tracking-wider select-none">
                  <span class="text-white font-extrabold tracking-widest text-base">KHQR</span>
                </div>
              </div>

              <!-- Merchant Name & Dynamic Amount -->
              <div class="w-full px-4 pt-3.5 pb-2 text-center bg-white">
                <div class="flex items-center justify-center gap-1.5">
                  <span class="font-black text-gray-900 text-sm tracking-wide uppercase">CHENG ROTANA</span>
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">365 Sport</span>
                </div>

                <!-- Determined Amount from Product Price -->
                <div class="mt-1 flex items-baseline justify-center gap-1">
                  <span class="text-2xl font-black text-gray-900 tracking-tight">
                    {{ activeCurrency === 'KHR' ? formattedAmount : `$${formattedAmount}` }}
                  </span>
                  <span class="text-xs font-bold text-gray-500">
                    {{ activeCurrency === 'KHR' ? 'KHR' : 'USD' }}
                  </span>
                </div>
              </div>

              <!-- Dashed Divider -->
              <div class="w-full px-4">
                <div class="border-b border-dashed border-gray-200"></div>
              </div>

              <!-- QR Code with ACLEDA Center Emblem -->
              <div class="relative p-3.5 bg-white flex items-center justify-center">
                <img
                  :src="qrData.qr_image"
                  alt="KHQR Code - Scan to Pay"
                  class="w-[210px] h-[210px] rounded-lg object-contain block select-none"
                />

                <!-- ACLEDA Emblem in Center of QR -->
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="h-9 w-9 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center">
                    <div class="h-8 w-8 rounded-full bg-[#bf1e2e] flex items-center justify-center">
                      <!-- ACLEDA Emblem Crest SVG -->
                      <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12,2 15,6 20,6 18,11 21,15 16,17 14,22 12,18 10,22 8,17 3,15 6,11 4,6 9,6" fill="white" stroke="white" stroke-width="0.5"/>
                        <circle cx="12" cy="12" r="2.5" fill="#bf1e2e" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- KHQR Card Footer -->
              <div class="w-full bg-gray-50 px-4 py-2.5 text-center border-t border-gray-100">
                <p class="text-[11px] font-semibold text-gray-500">
                  Scan to pay with any KHQR-supported Mobile Apps.
                </p>
              </div>
            </div>

            <!-- Currency Switcher (USD / KHR Dual Currency) -->
            <div class="mt-3.5 flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                @click="switchCurrency('USD')"
                :class="[
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  activeCurrency === 'USD'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-500 hover:text-black'
                ]"
              >
                💵 USD (${{ Number(amount).toFixed(2) }})
              </button>
              <button
                type="button"
                @click="switchCurrency('KHR')"
                :class="[
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  activeCurrency === 'KHR'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-500 hover:text-black'
                ]"
              >
                🇰🇭 KHR ({{ Math.round(Number(amount) * 4100).toLocaleString() }} ៛)
              </button>
            </div>

            <!-- Simulation Button -->
            <div class="mt-4 w-full flex flex-col gap-2">
              <button
                type="button"
                @click="simulatePayment"
                class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>✓</span> Simulate Payment Complete
              </button>
              <button
                type="button"
                @click="handleClose"
                class="w-full py-2 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    amount: number;
    currency?: string;
    description?: string;
    apiBase?: string;
  }>(),
  {
    currency: "USD",
    description: "Order Payment",
    apiBase: "",
  }
);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success", data: any): void;
}>();

const activeCurrency = ref<"USD" | "KHR">(props.currency === "KHR" ? "KHR" : "USD");
const isLoading = ref(false);
const errorMessage = ref("");
const paymentStatus = ref<"IDLE" | "WAITING" | "PAID">("IDLE");
const qrData = ref<{
  qr_image: string;
  qr_string: string;
  md5: string;
  bill_number: string;
  amount: number;
  currency: string;
  merchant: string;
} | null>(null);

let pollTimer: any = null;

// Formatted amount depending on currency
const formattedAmount = computed(() => {
  if (activeCurrency.value === "KHR") {
    return Math.round(Number(props.amount) * 4100).toLocaleString();
  }
  return Number(props.amount).toFixed(2);
});

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

const handleClose = () => {
  stopPolling();
  emit("close");
};

const switchCurrency = (cur: "USD" | "KHR") => {
  if (activeCurrency.value !== cur) {
    activeCurrency.value = cur;
    generateQr();
  }
};

const simulatePayment = () => {
  paymentStatus.value = "PAID";
  stopPolling();
  setTimeout(() => {
    emit("success", {
      bill_number: qrData.value?.bill_number || `BK${Date.now()}`,
      md5: qrData.value?.md5 || "demo_md5",
      amount: props.amount,
      currency: activeCurrency.value,
      paymentMethod: "Bakong KHQR (ACLEDA Bank)",
    });
  }, 1200);
};

const checkPaymentStatus = async (md5: string) => {
  try {
    const urls = [
      `/api/check-payment?md5=${md5}`,
      ...(props.apiBase ? [`${props.apiBase.replace(/\/+$/, "")}/api/check-payment?md5=${md5}`] : []),
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const result = await res.json();

        if (result.status === "PAID") {
          paymentStatus.value = "PAID";
          stopPolling();
          setTimeout(() => {
            emit("success", {
              bill_number: qrData.value?.bill_number,
              md5: md5,
              amount: props.amount,
              currency: activeCurrency.value,
              paymentMethod: "Bakong KHQR (ACLEDA Bank)",
            });
          }, 1500);
          return;
        }
      } catch {
        // try next endpoint
      }
    }
  } catch (err) {
    console.error("Error polling payment status:", err);
  }
};

// Pure client-side generator of user's real ACLEDA KHQR
const generateClientFallbackKhqr = (amt: number, curr: "USD" | "KHR") => {
  const tag = (id: string, val: string) => `${id}${val.length.toString().padStart(2, "0")}${val}`;
  const amountStr = curr === "KHR" ? Math.round(amt).toString() : amt.toFixed(2);
  const billNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

  const raw =
    tag("00", "01") +
    tag("01", "11") +
    tag("29", "0009khqr@aclb0111855235228650206ACLEDA") +
    tag("39", "00042CCY01014") +
    tag("52", "5999") +
    tag("58", "KH") +
    tag("53", curr === "KHR" ? "116" : "840") +
    tag("54", amountStr) +
    tag("59", "CHENG ROTANA") +
    tag("60", "Phnom Penh") +
    tag("62", tag("02", "0969611977")) +
    "6304";

  let crc = 0xffff;
  for (let i = 0; i < raw.length; i++) {
    crc ^= raw.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  const khqrString = raw + crc.toString(16).toUpperCase().padStart(4, "0");
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=8&data=${encodeURIComponent(
    khqrString
  )}`;

  return {
    qr_image: qrImage,
    qr_string: khqrString,
    md5: `md5_${billNumber}`,
    bill_number: billNumber,
    amount: amt,
    currency: curr,
    merchant: "CHENG ROTANA",
    store: "365 Sport",
  };
};

const generateQr = async () => {
  stopPolling();
  isLoading.value = true;
  errorMessage.value = "";
  paymentStatus.value = "IDLE";
  qrData.value = null;

  const currentAmt =
    activeCurrency.value === "KHR"
      ? Math.round(Number(props.amount) * 4100)
      : Number(props.amount);

  try {
    const endpointsToTry = [
      "/api/generate-qr",
      ...(props.apiBase ? [`${props.apiBase.replace(/\/+$/, "")}/api/generate-qr`] : []),
    ];

    let data: any = null;
    for (const url of endpointsToTry) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: currentAmt,
            currency: activeCurrency.value,
            description: props.description || "Order Payment",
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.qr_image) {
            data = json;
            break;
          }
        }
      } catch {
        // continue to next endpoint
      }
    }

    if (data) {
      qrData.value = data;
    } else {
      // Use client-side accurate generator
      qrData.value = generateClientFallbackKhqr(currentAmt, activeCurrency.value);
    }

    paymentStatus.value = "WAITING";
    errorMessage.value = "";

    // Poll every 2.5s for live payment status
    pollTimer = setInterval(() => {
      if (qrData.value?.md5) {
        checkPaymentStatus(qrData.value.md5);
      }
    }, 2500);
  } catch (err: any) {
    console.warn("Using client-side KHQR generation:", err);
    qrData.value = generateClientFallbackKhqr(currentAmt, activeCurrency.value);
    paymentStatus.value = "WAITING";
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      activeCurrency.value = props.currency === "KHR" ? "KHR" : "USD";
      generateQr();
    } else {
      stopPolling();
    }
  }
);

onBeforeUnmount(() => {
  stopPolling();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
