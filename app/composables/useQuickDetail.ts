import { useState } from "#app";
import type { Product } from "~/type/product";

export const useQuickDetail = () => {
  const isDetailOpen = useState<boolean>("quick_detail_open", () => false);
  const selectedProduct = useState<Product | null>("quick_detail_product", () => null);

  const openQuickDetail = (product: Product) => {
    selectedProduct.value = product;
    isDetailOpen.value = true;
  };

  const closeQuickDetail = () => {
    isDetailOpen.value = false;
  };

  return {
    isDetailOpen,
    selectedProduct,
    openQuickDetail,
    closeQuickDetail,
  };
};
