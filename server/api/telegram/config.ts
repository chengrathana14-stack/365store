import { defineEventHandler, readBody, getQuery } from "h3";
import fs from "fs";
import path from "path";
import { requireAdmin } from "../../utils/auth";
import { checkRateLimit } from "../../utils/rateLimit";
import { encryptSecret, decryptSecret } from "../../utils/crypto";

const CONFIG_PATH = path.resolve(process.cwd(), ".data/telegram_config.json");

const DEFAULT_BOT_TOKEN = "8985273724:AAE6rg5aHDJcAW-bduVzX9hGFh__m_0eOKc";
const DEFAULT_CHAT_ID = "740641904";

export const getTelegramConfig = async () => {
  let fileConfig: { botToken?: string; chatId?: string; botUsername?: string } = {};
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
      if (raw.isEncrypted) {
        fileConfig = {
          botToken: decryptSecret(raw.botToken),
          chatId: decryptSecret(raw.chatId),
          botUsername: raw.botUsername,
        };
      } else {
        fileConfig = raw;
      }
    }
  } catch {}

  let runtimeConf: any = {};
  try {
    runtimeConf = useRuntimeConfig();
  } catch {}

  const botToken = fileConfig.botToken || process.env.TELEGRAM_BOT_TOKEN || runtimeConf?.telegramBotToken || DEFAULT_BOT_TOKEN;
  let chatId = fileConfig.chatId || process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID || runtimeConf?.telegramChatId || DEFAULT_CHAT_ID;

  // Auto-detect Chat ID if token exists but chatId is empty
  if (botToken && !chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
        const lastUpdate = data.result[data.result.length - 1];
        const detectedId = lastUpdate.message?.chat?.id || lastUpdate.callback_query?.message?.chat?.id;
        if (detectedId) {
          chatId = String(detectedId);
          fileConfig.chatId = chatId;
          fileConfig.botToken = botToken;
          fs.writeFileSync(
            CONFIG_PATH,
            JSON.stringify(
              {
                isEncrypted: true,
                botToken: encryptSecret(botToken),
                chatId: encryptSecret(chatId),
                botUsername: "Rotana_365days_Sport_bot",
                updatedAt: new Date().toISOString(),
              },
              null,
              2
            ),
            "utf-8"
          );
          console.log("[Telegram Bot] Auto-detected Chat ID:", chatId);
        }
      }
    } catch (e) {
      console.warn("[Telegram Bot Auto-detect error]:", e);
    }
  }

  return { botToken, chatId };
};

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === "GET") {
    const query = getQuery(event);

    // If query ?test=1, send a test ping to the bot (requires admin authentication)
    if (query.test) {
      requireAdmin(event);
      checkRateLimit(event, { key: "telegram_test", maxRequests: 5, windowMs: 60000 });

      const { botToken, chatId } = await getTelegramConfig();
      if (botToken && chatId) {
        try {
          const testRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: "✅ *365 SPORTS BOT TEST PING* 👟\n\nYour 365 Sports Telegram Bot (@Rotana_365days_Sport_bot) is successfully connected and ready to receive shoe pre-orders!",
              parse_mode: "Markdown",
            }),
          });
          const data = await testRes.json();
          return {
            configured: true,
            testSent: Boolean(data.ok),
            telegramResponse: data,
          };
        } catch (err: any) {
          return {
            configured: true,
            testSent: false,
            error: err.message,
          };
        }
      }
    }

    const { botToken, chatId } = await getTelegramConfig();

    return {
      configured: Boolean(botToken && chatId),
      hasToken: Boolean(botToken),
      hasChatId: Boolean(chatId),
      botUsername: "Rotana_365days_Sport_bot",
      tokenPreview: botToken ? `${botToken.slice(0, 8)}...${botToken.slice(-4)}` : null,
      chatIdPreview: chatId ? `${chatId.slice(0, 3)}...` : null,
      adminUsername: process.env.TELEGRAM_ADMIN_USERNAME || "ROTANA_CHENG",
      adminPhone: process.env.TELEGRAM_ADMIN_PHONE || "0969611977",
    };
  }

  if (method === "POST") {
    // Only authorized administrators can configure Telegram credentials
    requireAdmin(event);
    checkRateLimit(event, { key: "telegram_config", maxRequests: 10, windowMs: 60000 });

    const body = await readBody(event);
    const { botToken, chatId } = body || {};

    const rawToken = (botToken || "").trim();
    const rawChatId = (chatId || "").trim();

    const updated = {
      isEncrypted: true,
      botToken: encryptSecret(rawToken),
      chatId: encryptSecret(rawChatId),
      botUsername: "Rotana_365days_Sport_bot",
      updatedAt: new Date().toISOString(),
    };

    try {
      const dir = path.dirname(CONFIG_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), "utf-8");
    } catch (err: any) {
      return { success: false, error: err.message };
    }

    return {
      success: true,
      configured: Boolean(updated.botToken && updated.chatId),
    };
  }
});
