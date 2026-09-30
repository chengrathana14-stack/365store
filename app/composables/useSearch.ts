import { ref, onMounted, onUnmounted } from "vue";

const isSearchOpen = ref(false);
const searchQuery = ref("");
const recentSearches = ref<string[]>([]);

export const useSearch = () => {
  const openSearch = (initialQuery = "") => {
    searchQuery.value = initialQuery;
    isSearchOpen.value = true;
  };

  const closeSearch = () => {
    isSearchOpen.value = false;
  };

  const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value;
  };

  const loadRecentSearches = () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("365_recent_searches");
      if (saved) {
        recentSearches.value = JSON.parse(saved);
      } else {
        recentSearches.value = ["Nike Air", "Running shoes", "Alphafly", "Hoodie", "Under $100"];
      }
    } catch {
      recentSearches.value = [];
    }
  };

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const filtered = recentSearches.value.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
    recentSearches.value = [trimmed, ...filtered].slice(0, 8);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("365_recent_searches", JSON.stringify(recentSearches.value));
      } catch (e) {
        console.error("Failed to save recent search:", e);
      }
    }
  };

  const clearRecentSearches = () => {
    recentSearches.value = [];
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("365_recent_searches");
      } catch {}
    }
  };

  return {
    isSearchOpen,
    searchQuery,
    recentSearches,
    openSearch,
    closeSearch,
    toggleSearch,
    loadRecentSearches,
    addRecentSearch,
    clearRecentSearches,
  };
};
