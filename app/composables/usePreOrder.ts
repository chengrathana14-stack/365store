import { ref } from "vue";
import type { Product } from "~/type/product";
import { useToast } from "~/composables/useToast";

const isPreOrderModalOpen = ref(false);
const preOrderProduct = ref<Product | null>(null);
const preOrderSize = ref<string>("");

export const TELEGRAM_USERNAME = "ROTANA_CHENG";
export const TELEGRAM_PHONE = "0969611977";
export const TELEGRAM_INTL_PHONE = "+855969611977";

export interface PreOrderPayload {
  product: Product;
  size?: string;
  quantity?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerLocation?: string;
  notes?: string;
}

export const usePreOrder = () => {
  const { success } = useToast();

  const openPreOrder = (product: Product, size?: string) => {
    preOrderProduct.value = product;
    preOrderSize.value = size || product.size?.[0] || "";
    isPreOrderModalOpen.value = true;
  };

  const closePreOrder = () => {
    isPreOrderModalOpen.value = false;
  };

  const formatOrderMessage = (payload: PreOrderPayload) => {
    const {
      product,
      size,
      quantity = 1,
      customerName,
      customerEmail,
      customerPhone,
      customerLocation,
      notes,
    } = payload;
    const chosenSize = size || product.size?.[0] || "Standard";

    let message = `Hello 365 Sports Admin! 👟\n\n`;
    message += `I would like to order this shoe (Currently out of stock):\n`;
    message += `• Shoe: ${product.name}\n`;
    message += `• Brand: ${product.brand} (${product.category})\n`;
    message += `• Size: ${chosenSize}\n`;
    message += `• Quantity: ${quantity} pair(s)\n`;
    message += `• Unit Price: $${product.price.toFixed(2)}\n\n`;

    message += `CUSTOMER INFO:\n`;
    if (customerName) message += `• Name: ${customerName}\n`;
    if (customerEmail) message += `• Gmail: ${customerEmail}\n`;
    if (customerPhone) message += `• Phone / Telegram: ${customerPhone}\n`;
    if (customerLocation) message += `• Location: ${customerLocation}\n`;
    if (notes) message += `• Note: ${notes}\n`;

    message += `\nPlease check warehouse reserves or restock order. Thank you!`;
    return message;
  };

  const notifyTelegramApi = async (payload: PreOrderPayload) => {
    try {
      const res = await fetch("/api/telegram/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: payload.product,
          size: payload.size || payload.product.size?.[0] || "Standard",
          quantity: payload.quantity || 1,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          customerLocation: payload.customerLocation,
          notes: payload.notes,
        }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, botDelivered: false };
    }
  };

  const getTelegramUrl = (_product?: Product, _size?: string) => {
    return `https://t.me/${TELEGRAM_USERNAME}`;
  };

  const copyAndOpenTelegram = (
    productOrPayload: Product | PreOrderPayload,
    maybeSize?: string,
  ) => {
    let payload: PreOrderPayload;
    if ("name" in productOrPayload) {
      payload = {
        product: productOrPayload,
        size: maybeSize || productOrPayload.size?.[0] || "Standard",
      };
    } else {
      payload = productOrPayload;
    }

    const message = formatOrderMessage(payload);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(message).catch(() => {});
    }

    // Trigger background webhook/api notification
    notifyTelegramApi(payload);

    success(
      "Opening Telegram (@ROTANA_CHENG)",
      "Shoe order copied to clipboard! Chatting with Admin @ROTANA_CHENG...",
    );

    const url = getTelegramUrl();
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  return {
    isPreOrderModalOpen,
    preOrderProduct,
    preOrderSize,
    TELEGRAM_USERNAME,
    TELEGRAM_PHONE,
    TELEGRAM_INTL_PHONE,
    openPreOrder,
    closePreOrder,
    formatOrderMessage,
    getTelegramUrl,
    notifyTelegramApi,
    copyAndOpenTelegram,
  };
};
