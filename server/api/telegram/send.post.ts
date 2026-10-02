import { defineEventHandler, readBody } from "h3";
import { getTelegramConfig } from "./config";
import { checkRateLimit } from "../../utils/rateLimit";

export default defineEventHandler(async (event) => {
  // Prevent Telegram notification spam / flooding (max 10 notifications per minute per IP)
  checkRateLimit(event, { key: "telegram_send", maxRequests: 10, windowMs: 60000 });

  const body = await readBody(event);
  const rawText = String(body?.text || "").trim();
  const parse_mode = body?.parse_mode === "Markdown" ? "Markdown" : "HTML";

  // Prevent memory/API abuse with oversized payloads (max 4096 chars per Telegram API limit)
  if (!rawText) {
    return { success: false, error: "Missing message text" };
  }
  const text = rawText.slice(0, 4096);

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
          text,
          parse_mode,
        }),
      });

      const data = await response.json();
      botDelivered = Boolean(data.ok);
      if (!data.ok) {
        telegramError = data.description || "Telegram API error";
        console.warn("[Telegram Bot Error]:", data);
      }
    } catch (err: any) {
      telegramError = err.message;
      console.error("[Telegram Bot Send Error]:", err);
    }
  }

  return {
    success: true,
    botDelivered,
    telegramError,
    configured: Boolean(botToken && chatId),
  };
});
