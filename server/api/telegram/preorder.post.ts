import { defineEventHandler, readBody } from "h3";
import { getTelegramConfig } from "./config";
import { checkRateLimit } from "../../utils/rateLimit";
import { escapeHtml, sanitizeText } from "../../utils/security";
import { maskEmail, maskPhone } from "../../utils/crypto";

export default defineEventHandler(async (event) => {
  // Prevent spamming customer inquiries (max 5 per minute per IP)
  checkRateLimit(event, { key: "telegram_preorder", maxRequests: 5, windowMs: 60000 });

  const body = await readBody(event);
  const {
    product,
    size,
    quantity = 1,
    customerName,
    customerEmail,
    customerPhone,
    customerLocation,
    notes,
  } = body || {};

  const cleanName = sanitizeText(customerName, 100);
  const cleanEmail = sanitizeText(customerEmail, 120);
  const cleanPhone = sanitizeText(customerPhone, 50);
  const cleanLocation = sanitizeText(customerLocation, 120);
  const cleanNotes = sanitizeText(notes, 500);

  const qty = Math.max(1, Math.min(50, Number(quantity) || 1));
  const unitPrice = product?.price ? Math.max(0, Number(product.price)) : 0;
  const totalPrice = (unitPrice * qty).toFixed(2);
  const cambodiaTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Phnom_Penh",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const messageLines = [
    "🚨 <b>365 SPORTS - OUT-OF-STOCK SHOE INQUIRY</b> 🚨",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "👤 <b>CUSTOMER INFORMATION:</b>",
    `• <b>Full Name:</b> ${escapeHtml(cleanName) || "Not provided"}`,
    `• <b>Gmail / Email:</b> ${escapeHtml(cleanEmail) || "Not provided"}`,
    `• <b>Phone / Telegram:</b> ${escapeHtml(cleanPhone) || "Not provided"}`,
    `• <b>Delivery Location:</b> ${escapeHtml(cleanLocation) || "Phnom Penh"}`,
    "",
    "👟 <b>REQUESTED SHOE:</b>",
    `• <b>Shoe:</b> ${escapeHtml(product?.name || "Special Order Shoe")}`,
    `• <b>Brand:</b> ${escapeHtml(product?.brand || "Sport Brand")} (${escapeHtml(product?.category || "Shoes")})`,
    `• <b>Size:</b> ${escapeHtml(size || "Standard")}`,
    `• <b>Quantity:</b> ${qty} pair(s)`,
    `• <b>Unit Price:</b> $${unitPrice.toFixed(2)}`,
    `• <b>Estimated Total:</b> $${totalPrice}`,
    "",
    "💬 <b>CUSTOMER NOTE / URGENCY:</b>",
    `<i>"${escapeHtml(cleanNotes || "Customer would like to order this out-of-stock pair ASAP.")}"</i>`,
    "",
    `⏰ <b>Requested At:</b> ${cambodiaTime} (Cambodia Time)`,
    `🏬 <b>Store:</b> 365 Sports Cambodia (@Rotana_cheng · 096 961 1977)`,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "⚡ <b>Next Step:</b> Tap customer's phone or email above to confirm restock or arrange payment/delivery.",
  ];

  const orderText = messageLines.join("\n");

  const { botToken, chatId } = await getTelegramConfig();

  let botDelivered = false;
  let telegramError: string | null = null;

  if (botToken && chatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: orderText,
          parse_mode: "HTML",
        }),
      });

      const data = await response.json();
      botDelivered = Boolean(data.ok);
      if (!data.ok) {
        telegramError = data.description || "Unknown Telegram API error";
        console.warn("[Telegram Bot Error]:", data);
      }
    } catch (err: any) {
      telegramError = err.message;
      console.error("[Telegram Bot Fetch Error]:", err);
    }
  }

  const newRecord = {
    id: Date.now(),
    customerName,
    customerEmail,
    customerPhone,
    customerLocation,
    notes,
    product: {
      name: product?.name,
      brand: product?.brand,
      category: product?.category,
      price: unitPrice,
      image: product?.image,
    },
    size,
    quantity: qty,
    totalPrice,
    botDelivered,
    telegramError,
    createdAt: new Date().toISOString(),
  };

  const globalStore = globalThis as any;
  if (!globalStore.__365_PREORDERS__) {
    globalStore.__365_PREORDERS__ = [];
  }
  globalStore.__365_PREORDERS__.unshift(newRecord);
  if (globalStore.__365_PREORDERS__.length > 100) {
    globalStore.__365_PREORDERS__.length = 100;
  }

  // Server record log with masked PII for privacy and compliance
  console.log("[365 Sports Telegram Bot Dispatch]:", {
    customerName: cleanName,
    customerEmail: maskEmail(cleanEmail),
    customerPhone: maskPhone(cleanPhone),
    product: product?.name,
    size,
    qty,
    botDelivered,
    telegramError,
  });

  return {
    success: true,
    botDelivered,
    telegramError,
    configured: Boolean(botToken && chatId),
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      location: customerLocation,
    },
    shoe: {
      name: product?.name,
      brand: product?.brand,
      size,
      qty,
      totalPrice,
    },
    adminUsername: "@ROTANA_CHENG",
    adminPhone: "0969611977",
    message: orderText,
  };
});
