import { computed } from "vue";
import { useState } from "#app";
import type { Product } from "~/type/product";
import { useToast } from "~/composables/useToast";

export const useProductCompare = () => {
  const comparedProducts = useState<Product[]>("comparedProducts", () => []);
  const isCompareModalOpen = useState<boolean>("isCompareModalOpen", () => false);
  const { info, error } = useToast();

  const maxCompareCount = 4;

  const compareCount = computed(() => comparedProducts.value.length);

  const isInCompare = (productId: number) => {
    return comparedProducts.value.some((p) => p.id === productId);
  };

  const addToCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      return;
    }
    if (comparedProducts.value.length >= maxCompareCount) {
      error("Comparison Limit Reached", `You can compare up to ${maxCompareCount} products at once.`);
      return;
    }
    comparedProducts.value.push(product);
    info("Added to Compare", `${product.name} added to comparison queue`);
  };

  const removeFromCompare = (productId: number) => {
    comparedProducts.value = comparedProducts.value.filter((p) => p.id !== productId);
    if (comparedProducts.value.length === 0) {
      isCompareModalOpen.value = false;
    }
  };

  const toggleCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    comparedProducts.value = [];
    isCompareModalOpen.value = false;
  };

  const openCompareModal = () => {
    if (comparedProducts.value.length < 2) {
      info("Select Products", "Please select at least 2 products to compare side-by-side.");
      return;
    }
    isCompareModalOpen.value = true;
  };

  const closeCompareModal = () => {
    isCompareModalOpen.value = false;
  };

  return {
    comparedProducts,
    isCompareModalOpen,
    compareCount,
    maxCompareCount,
    isInCompare,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
    openCompareModal,
    closeCompareModal,
  };
};
