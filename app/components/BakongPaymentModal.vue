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

          <!-- Only QR Image -->
          <div v-else-if="qrData?.qr_image" class="w-full flex justify-center pt-2">
            <img
              :src="qrData.qr_image"
              alt="Bakong KHQR"
              class="w-full max-w-[320px] rounded-xl object-contain"
            />
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

const checkPaymentStatus = async (md5: string) => {
  try {
    const res = await fetch(`${props.apiBase}/api/check-payment?md5=${md5}`);
    if (!res.ok) return;
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
    const res = await fetch(`${props.apiBase}/api/generate-qr`, {
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

    if (!res.ok) {
      throw new Error(`Failed to generate QR (status: ${res.status})`);
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Unable to generate KHQR code.");
    }

    qrData.value = data;
    paymentStatus.value = "WAITING";

    // Poll every 2.5s for payment
    pollTimer = setInterval(() => {
      if (qrData.value?.md5) {
        checkPaymentStatus(qrData.value.md5);
      }
    }, 2500);
  } catch (err: any) {
    errorMessage.value = err.message || "Failed to connect to Bakong Payment Gateway.";
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
