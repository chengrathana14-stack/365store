import { onMounted, onUnmounted } from "vue";
import { useAdminStore } from "~/composables/useAdminStore";
import { useCart } from "~/composables/useCart";

/**
 * useAutoSync
 * 
 * Provides completely silent, zero-flicker background auto-refreshing:
 * 1. Automatically syncs discounts, products, orders, and overrides.
 * 2. NEVER navigates or resets the route (user stays on current page).
 * 3. NEVER reloads the browser window or flashes a loading screen.
 * 4. Silently updates Vue reactive state in-place (Stale-While-Revalidate).
 * 5. Runs on a gentle 20s interval, when tab gains focus, or phone resumes.
 */
export const useAutoSync = () => {
  if (typeof window === "undefined") return;

  const { loadOrders, loadDiscounts, loadProducts, allDiscounts } = useAdminStore();
  const { appliedDiscount, appliedPromoCode, applyPromo } = useCart();

  let syncTimer: ReturnType<typeof setInterval> | null = null;
  let isSyncing = false;
  let lastSyncTime = 0;

  const performSilentSync = async (force = false) => {
    // Avoid overlapping sync runs
    if (isSyncing) return;

    // Minimum 5-second debounce between rapid focus/resume events
    const now = Date.now();
    if (!force && now - lastSyncTime < 5000) return;

    // Don't waste battery/CPU if phone screen is locked or tab is hidden
    if (typeof document !== "undefined" && document.hidden) return;

    isSyncing = true;
    lastSyncTime = now;

    try {
      // 1. Silently sync orders from localStorage / storage events
      loadOrders();

      // 2. Silently sync products and overrides
      loadProducts();

      // 3. Silently sync discounts from server / storage
      await loadDiscounts();

      // 4. If a promo code is currently active, ensure its calculation remains fresh
      if (appliedPromoCode.value && allDiscounts.value.length > 0) {
        applyPromo(appliedPromoCode.value, allDiscounts.value);
      }
    } catch {
      // Silent error suppression so user is never interrupted
    } finally {
      isSyncing = false;
    }
  };

  const handleVisibilityChange = () => {
    if (typeof document !== "undefined" && !document.hidden) {
      // Immediate silent refresh when user switches back to this tab or unlocks phone
      performSilentSync();
    }
  };

  const handleFocus = () => {
    performSilentSync();
  };

  const handleOnline = () => {
    performSilentSync(true);
  };

  const startAutoSync = () => {
    // Initial sync
    performSilentSync(true);

    // Heartbeat every 60 seconds (gentle on mobile battery, memory, and bandwidth)
    if (!syncTimer) {
      syncTimer = setInterval(() => performSilentSync(false), 60000);
    }

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
    }
    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleFocus, { passive: true });
      window.addEventListener("online", handleOnline, { passive: true });
    }
  };

  const stopAutoSync = () => {
    if (syncTimer) {
      clearInterval(syncTimer);
      syncTimer = null;
    }
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
    }
  };

  onMounted(() => {
    startAutoSync();
  });

  onUnmounted(() => {
    stopAutoSync();
  });

  return {
    performSilentSync,
    startAutoSync,
    stopAutoSync,
  };
};
