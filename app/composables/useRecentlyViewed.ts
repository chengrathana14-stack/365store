import { ref } from "vue";
import type { Product } from "~/type/product";

const recentlyViewed = ref<Product[]>([]);

export const useRecentlyViewed = () => {
  const loadRecentlyViewed = () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("365_recently_viewed");
      if (saved) {
        recentlyViewed.value = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load recently viewed:", e);
    }
  };

  const addRecentlyViewed = (product: Product) => {
    if (!product || !product.id) return;
    const filtered = recentlyViewed.value.filter((p) => p.id !== product.id);
    recentlyViewed.value = [product, ...filtered].slice(0, 6);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("365_recently_viewed", JSON.stringify(recentlyViewed.value));
      } catch (e) {
        console.error("Failed to persist recently viewed:", e);
      }
    }
  };

  const clearRecentlyViewed = () => {
    recentlyViewed.value = [];
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("365_recently_viewed");
      } catch {}
    }
  };

  return {
    recentlyViewed,
    loadRecentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
};
