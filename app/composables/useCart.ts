import { computed, watch } from "vue";
import { useState } from "#app";
import type { CartItem, Product } from "~/type/product";

export const useCart = () => {
  const cart = useState<CartItem[]>("cart", () => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("365_cart");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load saved cart:", e);
      }
    }
    return [];
  });

  const saveToStorage = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("365_cart", JSON.stringify(cart.value));
      } catch (e) {
        console.error("Failed to persist cart:", e);
      }
    }
  };

  // Cart Count
  const cartCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  // Subtotal
  const subtotal = computed(() => {
    return cart.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  });

  // Add To Cart
  const addToCart = (
    product: Product,
    quantity: number = 1,
    size: string = "",
  ) => {
    if (product.stock <= 0) {
      return;
    }

    const existingItem = cart.value.find(
      (item) => item.product.id === product.id && item.size === size,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      existingItem.quantity = Math.min(newQuantity, product.stock);
    } else {
      cart.value.push({
        product,
        quantity: Math.min(quantity, product.stock),
        size,
      });
    }
    saveToStorage();
  };

  // Increase
  const increaseQuantity = (productId: number, size?: string) => {
    const item = cart.value.find(
      (item) =>
        item.product.id === productId &&
        (size === undefined || item.size === size),
    );

    if (!item) return;

    if (item.quantity < item.product.stock) {
      item.quantity++;
      saveToStorage();
    }
  };

  // Decrease
  const decreaseQuantity = (productId: number, size?: string) => {
    const item = cart.value.find(
      (item) =>
        item.product.id === productId &&
        (size === undefined || item.size === size),
    );

    if (!item) return;

    if (item.quantity > 1) {
      item.quantity--;
      saveToStorage();
    }
  };

  // Remove
  const removeFromCart = (productId: number, size?: string) => {
    cart.value = cart.value.filter(
      (item) =>
        !(
          item.product.id === productId &&
          (size === undefined || item.size === size)
        ),
    );
    saveToStorage();
  };

  // Clear
  const clearCart = () => {
    cart.value = [];
    saveToStorage();
  };

  return {
    cart,
    cartCount,
    subtotal,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  };
};
