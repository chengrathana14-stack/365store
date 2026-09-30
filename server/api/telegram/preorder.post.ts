import { defineEventHandler, readBody } from "h3";
import { getTelegramConfig } from "./config";

export default defineEventHandler(async (event) => {
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

  const qty = Number(quantity) || 1;
  const unitPrice = product?.price ? Number(product.price) : 0;
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
    `• <b>Full Name:</b> ${customerName || "Not provided"}`,
    `• <b>Gmail / Email:</b> ${customerEmail || "Not provided"}`,
    `• <b>Phone / Telegram:</b> ${customerPhone || "Not provided"}`,
    `• <b>Delivery Location:</b> ${customerLocation || "Phnom Penh"}`,
    "",
    "👟 <b>REQUESTED SHOE:</b>",
    `• <b>Shoe:</b> ${product?.name || "Special Order Shoe"}`,
    `• <b>Brand:</b> ${product?.brand || "Sport Brand"} (${product?.category || "Shoes"})`,
    `• <b>Size:</b> ${size || "Standard"}`,
    `• <b>Quantity:</b> ${qty} pair(s)`,
    `• <b>Unit Price:</b> $${unitPrice.toFixed(2)}`,
    `• <b>Estimated Total:</b> $${totalPrice}`,
    "",
    "💬 <b>CUSTOMER NOTE / URGENCY:</b>",
    `<i>"${notes && notes.trim() ? notes.trim() : "Customer would like to order this out-of-stock pair ASAP."}"</i>`,
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

  // Server record log
  console.log("[365 Sports Telegram Bot Dispatch]:", {
    customerName,
    customerEmail,
    customerPhone,
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
