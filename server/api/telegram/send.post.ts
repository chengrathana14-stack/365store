import { defineEventHandler, readBody } from "h3";
import { getTelegramConfig } from "./config";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { text, parse_mode = "HTML" } = body || {};

  if (!text) {
    return { success: false, error: "Missing message text" };
  }

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
