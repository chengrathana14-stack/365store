import { defineEventHandler } from "h3";

export default defineEventHandler(() => {
  const globalStore = globalThis as any;
  const list = globalStore.__365_PREORDERS__ || [];
  return {
    success: true,
    total: list.length,
    preorders: list,
  };
});
