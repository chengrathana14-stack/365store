import { ref } from "vue";
import { useState } from "#app";
import type { CartItem, Product } from "~/type/product";

export interface QrPaymentPayload {
  items: Array<{
    product: Product;
    quantity: number;
    size: string;
  }>;
  total: number;
  subtotal: number;
  shipping: number;
  tax?: number;
  customer?: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
}

export const useQrPayment = () => {
  const isQrOpen = useState<boolean>("qr_payment_open", () => false);
  const currentQrPayload = useState<QrPaymentPayload | null>("qr_payment_payload", () => null);

  const openQrPayment = (payload: QrPaymentPayload) => {
    currentQrPayload.value = payload;
    isQrOpen.value = true;
  };

  const closeQrPayment = () => {
    isQrOpen.value = false;
  };

  return {
    isQrOpen,
    currentQrPayload,
    openQrPayment,
    closeQrPayment,
  };
};
