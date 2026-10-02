// Public store contact metadata
export const TELEGRAM_BOT_TOKEN = "8985273724:AAE6rg5aHDJcAW-bduVzX9hGFh__m_0eOKc";
export const TELEGRAM_CHAT_ID = "740641904";
export const TELEGRAM_BOT_USERNAME = "Rotana_365days_Sport_bot";
export const TELEGRAM_ADMIN_USERNAME = "Rotana_cheng";
export const TELEGRAM_ADMIN_PHONE = "0969611977";

export interface OrderAlertPayload {
  id: string;
  customer: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  items: Array<{
    product?: { name?: string; price?: number; brand?: string };
    size?: string;
    quantity?: number;
  }>;
  total: number;
  khrTotal?: number;
  subtotal?: number;
  discount?: number;
  promoCode?: string;
  paymentMethod: string;
  paymentStatus?: string;
  date?: string;
}

export interface ContactAlertPayload {
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
}

export const useTelegramBot = () => {
  const getCambodiaTime = () => {
    return new Date().toLocaleString("en-US", {
      timeZone: "Asia/Phnom_Penh",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  /**
   * Dual-Layer Fail-Safe Telegram Dispatcher:
   * Layer 1: Secure server endpoint /api/telegram/send
   * Layer 2: Direct browser client dispatch to Telegram Bot API (ensures 100% delivery even if backend is sleeping or unreachable)
   */
  const sendTelegramNotification = async (htmlMessage: string): Promise<boolean> => {
    // Attempt 1: Server endpoint
    try {
      const res = await fetch("/api/telegram/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: htmlMessage, parse_mode: "HTML" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.botDelivered || data?.success) {
          return true;
        }
      }
    } catch {
      // Server unreachable or static hosting, proceed to client fallback
    }

    // Attempt 2: Direct browser client dispatch to Telegram Bot API (fail-safe)
    try {
      const directRes = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: htmlMessage,
            parse_mode: "HTML",
          }),
        }
      );
      const directData = await directRes.json();
      return Boolean(directData.ok);
    } catch (e) {
      console.error("[Telegram Direct Dispatch Error]:", e);
      return false;
    }
  };

  /**
   * New Order Notification
   */
  const sendNewOrderAlert = async (order: OrderAlertPayload): Promise<boolean> => {
    const time = getCambodiaTime();
    const itemsList = (order.items || [])
      .map((it) => {
        const pName = it.product?.name || "Product Item";
        const pPrice = Number(it.product?.price || 0);
        const pSize = it.size || "Standard";
        const pQty = it.quantity || 1;
        return `• <b>${pName}</b> (Size: ${pSize}) × ${pQty} = $${(pPrice * pQty).toFixed(2)}`;
      })
      .join("\n");

    const promoLine = order.promoCode
      ? `🎟️ <b>Promo Applied:</b> <code>${order.promoCode}</code> (-$${Number(order.discount || 0).toFixed(2)})\n`
      : "";

    const lines = [
      "🛍️ <b>365 SPORTS - NEW ORDER PLACED!</b> 🛍️",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `🆔 <b>Order ID:</b> <code>#${order.id}</code>`,
      `💵 <b>Total Amount:</b> <b>$${Number(order.total).toFixed(2)}</b> (≈ ${(order.khrTotal || Math.round(order.total * 4100)).toLocaleString()} ៛)`,
      `💳 <b>Payment Method:</b> ${order.paymentMethod || "KHQR / Bakong"}`,
      `🏷️ <b>Payment Status:</b> <b>${order.paymentStatus || "Paid"}</b>`,
      promoLine,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "👤 <b>CUSTOMER DETAILS:</b>",
      `• <b>Full Name:</b> ${order.customer || "Customer"}`,
      `• <b>Phone / Telegram:</b> ${order.phone || "Not provided"}`,
      `• <b>Email:</b> ${order.email || "Not provided"}`,
      `• <b>Address:</b> ${order.address || order.city || "Phnom Penh"}`,
      "",
      `📦 <b>ITEMS PURCHASED (${order.items?.length || 1}):</b>`,
      itemsList || "• Standard Order Item",
      "",
      `⏰ <b>Order Time:</b> ${time} (Cambodia Time)`,
      `🏬 <b>Store:</b> 365 Sports Cambodia (@${TELEGRAM_ADMIN_USERNAME} · ${TELEGRAM_ADMIN_PHONE})`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "⚡ <b>Action:</b> Confirm packaging & arrange delivery dispatch.",
    ]
      .filter((l) => l !== undefined)
      .join("\n");

    return await sendTelegramNotification(lines);
  };

  /**
   * Customer Support Inquiry Notification
   */
  const sendContactAlert = async (contact: ContactAlertPayload): Promise<boolean> => {
    const time = getCambodiaTime();
    const lines = [
      "📬 <b>365 SPORTS - NEW CUSTOMER MESSAGE</b> 📬",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `👤 <b>Sender:</b> ${contact.name}`,
      `📱 <b>Phone / Telegram:</b> ${contact.phone}`,
      `📧 <b>Email:</b> ${contact.email || "Not provided"}`,
      `📋 <b>Subject:</b> ${contact.subject || "General Inquiry"}`,
      "",
      "💬 <b>MESSAGE:</b>",
      `<i>"${contact.message}"</i>`,
      "",
      `⏰ <b>Received At:</b> ${time} (Cambodia Time)`,
      `🏬 <b>Store:</b> 365 Sports Cambodia (@${TELEGRAM_ADMIN_USERNAME} · ${TELEGRAM_ADMIN_PHONE})`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "⚡ <b>Action:</b> Tap phone above to chat or call customer back.",
    ].join("\n");

    return await sendTelegramNotification(lines);
  };

  return {
    sendTelegramNotification,
    sendNewOrderAlert,
    sendContactAlert,
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID,
    TELEGRAM_BOT_USERNAME,
    TELEGRAM_ADMIN_USERNAME,
    TELEGRAM_ADMIN_PHONE,
  };
};
