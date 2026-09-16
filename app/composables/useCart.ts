import { computed } from "vue";
import { useState } from "#app";
import type { CartItem, Product } from "~/type/product";
export const useCart = () => {
  const cart = useState<CartItem[]>("cart", () => []);

  // =====================================================
  // Cart Count
  // =====================================================

  const cartCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  // =====================================================
  // Subtotal
  // =====================================================

  const subtotal = computed(() => {
    return cart.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  });

  // =====================================================
  // Add To Cart
  // =====================================================

  const addToCart = (
    product: Product,
    quantity: number = 1,
    size: string = "",
  ) => {
    if (product.stock <= 0) {
      return;
    }

    // Find same product + same size

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
  };

  // =====================================================
  // Increase
  // =====================================================

  const increaseQuantity = (productId: number, size?: string) => {
    const item = cart.value.find(
      (item) =>
        item.product.id === productId &&
        (size === undefined || item.size === size),
    );

    if (!item) return;

    if (item.quantity < item.product.stock) {
      item.quantity++;
    }
  };

  // =====================================================
  // Decrease
  // =====================================================

  const decreaseQuantity = (productId: number, size?: string) => {
    const item = cart.value.find(
      (item) =>
        item.product.id === productId &&
        (size === undefined || item.size === size),
    );

    if (!item) return;

    if (item.quantity > 1) {
      item.quantity--;
    }
  };

  // =====================================================
  // Remove
  // =====================================================

  const removeFromCart = (productId: number, size?: string) => {
    cart.value = cart.value.filter(
      (item) =>
        !(
          item.product.id === productId &&
          (size === undefined || item.size === size)
        ),
    );
  };

  // =====================================================
  // Clear
  // =====================================================

  const clearCart = () => {
    cart.value = [];
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
