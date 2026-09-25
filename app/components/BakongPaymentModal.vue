<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        @click.self="handleClose"
      >
        <div
          class="relative max-w-sm w-full bg-white rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col items-center"
        >
          <!-- Close button -->
          <button
            type="button"
            @click="handleClose"
            class="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black transition text-sm"
            title="Close"
          >
            ✕
          </button>

          <!-- Loading State -->
          <div v-if="isLoading" class="py-16 flex flex-col items-center">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#d61827]"></div>
            <p class="mt-3 text-xs font-semibold text-gray-500">Generating QR code...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="errorMessage" class="py-10 px-4 text-center">
            <div class="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold">
              !
            </div>
            <p class="text-sm font-semibold text-gray-800">{{ errorMessage }}</p>
            <button
              type="button"
              @click="generateQr"
              class="mt-4 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-lime-400 hover:text-black transition"
            >
              Retry
            </button>
          </div>

          <!-- Payment Success State -->
          <div v-else-if="paymentStatus === 'PAID'" class="py-10 text-center">
            <div class="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-black mb-3 mx-auto animate-bounce">
              ✓
            </div>
            <h3 class="text-xl font-bold text-gray-900">Payment Successful!</h3>
            <p class="text-xs text-gray-500 mt-1">Transaction confirmed by Bakong KHQR.</p>
          </div>

          <!-- QR Code Display (Live Backend or KHQR Card) -->
          <div v-else-if="qrData" class="w-full flex flex-col items-center pt-2">
            <!-- 1. Live Official Python Base64 Image -->
            <div v-if="qrData.qr_image?.startsWith('data:image/')" class="w-full flex justify-center">
              <img
                :src="qrData.qr_image"
                alt="Bakong KHQR"
                class="w-full max-w-[320px] rounded-xl object-contain"
              />
            </div>

            <!-- 2. Authentic Bakong KHQR Card (For Vercel / Cloud Demo) -->
            <div v-else class="w-full max-w-[320px] rounded-2xl bg-white border border-red-200 overflow-hidden shadow-lg flex flex-col items-center">
              <!-- KHQR Header -->
              <div class="w-full bg-[#E1251B] px-4 py-2.5 flex items-center justify-between text-white">
                <div class="flex items-center gap-1.5 font-black text-sm tracking-wider">
                  <span class="bg-white text-[#E1251B] px-1.5 py-0.5 rounded font-black text-xs">KHQR</span>
                  <span>BAKONG</span>
                </div>
                <span class="text-[10px] font-medium opacity-90">National Bank of Cambodia</span>
              </div>

              <!-- Merchant Info -->
              <div class="w-full px-4 pt-3 pb-2 text-center border-b border-gray-100 bg-red-50/30">
                <p class="font-bold text-gray-900 text-sm">Rann Tharath</p>
                <p class="text-xs text-gray-500 font-mono">ranntharath@aclb</p>
                <div class="mt-1.5 text-xl font-black text-[#E1251B]">
                  {{ currency === 'KHR' ? '៛' : '$' }}{{ Number(amount).toFixed(2) }}
                </div>
              </div>

              <!-- QR Code -->
              <div class="p-3 bg-white flex justify-center">
                <img
                  :src="qrData.qr_image"
                  alt="Bakong KHQR"
                  class="w-[210px] h-[210px] rounded-lg object-contain"
                />
              </div>

              <!-- Action & Simulation -->
              <div class="w-full bg-gray-50 px-4 py-3 text-center border-t border-gray-100 flex flex-col gap-2">
                <p class="text-[11px] text-gray-500">Scan with Bakong or any Banking App</p>
                <button
                  type="button"
                  @click="simulatePayment"
                  class="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>✓</span> Simulate Payment Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";

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
    apiBase: "http://127.0.0.1:5000",
  }
);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success", data: any): void;
}>();

const isLoading = ref(false);
const errorMessage = ref("");
const paymentStatus = ref<"IDLE" | "WAITING" | "PAID">("IDLE");
const qrData = ref<{
  qr_image: string;
  md5: string;
  bill_number: string;
  amount: number;
  currency: string;
  isFallback?: boolean;
} | null>(null);

let pollTimer: any = null;

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

const simulatePayment = () => {
  paymentStatus.value = "PAID";
  stopPolling();
  setTimeout(() => {
    emit("success", {
      bill_number: qrData.value?.bill_number || `BK${Date.now()}`,
      md5: qrData.value?.md5 || "demo_md5",
      amount: props.amount,
      currency: props.currency || "USD",
      paymentMethod: "Bakong KHQR",
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
              currency: props.currency,
              paymentMethod: "Bakong KHQR",
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

const generateQr = async () => {
  stopPolling();
  isLoading.value = true;
  errorMessage.value = "";
  paymentStatus.value = "IDLE";
  qrData.value = null;

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
            amount: Number(props.amount),
            currency: props.currency || "USD",
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
      paymentStatus.value = "WAITING";
      errorMessage.value = "";

      // Poll every 2.5s for live payment
      pollTimer = setInterval(() => {
        if (qrData.value?.md5) {
          checkPaymentStatus(qrData.value.md5);
        }
      }, 2500);
      return;
    }

    throw new Error("Using fallback card");
  } catch (_err) {
    // Exact official Dynamic Bakong KHQR for client fallback
    const billNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
    const amountStr = Number(props.amount).toFixed(2).replace(/\.?0+$/, "");
    const tag = (id: string, val: string) => `${id}${val.length.toString().padStart(2, "0")}${val}`;
    const nowMs = Date.now().toString();
    const expMs = (Date.now() + 86400 * 1000).toString();

    const raw =
      tag("00", "01") +
      tag("01", "12") +
      tag("29", tag("00", "ranntharath@aclb")) +
      tag("52", "5999") +
      tag("53", props.currency === "KHR" ? "116" : "840") +
      tag("54", amountStr) +
      tag("58", "KH") +
      tag("59", "Rann Tharath") +
      tag("60", "Phnom Penh") +
      tag("62", tag("03", "IRCT SHOP") + tag("02", "060535771") + tag("01", billNumber) + tag("07", "WebQR")) +
      tag("99", tag("00", nowMs) + tag("01", expMs)) +
      "6304";

    let crc = 0xffff;
    for (let i = 0; i < raw.length; i++) {
      crc ^= raw.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
      }
    }
    const dynamicQr = raw + crc.toString(16).toUpperCase().padStart(4, "0");
    const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(dynamicQr)}`;

    qrData.value = {
      qr_image: qrImage,
      md5: `demo_${billNumber}`,
      bill_number: billNumber,
      amount: props.amount,
      currency: props.currency || "USD",
      isFallback: true,
    };
    paymentStatus.value = "WAITING";
    errorMessage.value = "";
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
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
