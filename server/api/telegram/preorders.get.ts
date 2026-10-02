import { defineEventHandler } from "h3";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler((event) => {
  // Protect customer personal information from unauthorized scraping
  requireAdmin(event);

  const globalStore = globalThis as any;
  const list = globalStore.__365_PREORDERS__ || [];
  return {
    success: true,
    total: list.length,
    preorders: list,
  };
});
