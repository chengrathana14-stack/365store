import { computed } from "vue";
import { useState } from "#app";
import type { CartItem, Product } from "~/type/product";

export const useCart = () => {
  const isCartDrawerOpen = useState<boolean>("isCartDrawerOpen", () => false);

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

  const openCartDrawer = () => {
    isCartDrawerOpen.value = true;
  };

  const closeCartDrawer = () => {
    isCartDrawerOpen.value = false;
  };

  const toggleCartDrawer = () => {
    isCartDrawerOpen.value = !isCartDrawerOpen.value;
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

  // Free shipping threshold ($120)
  const freeShippingThreshold = 120;
  const freeShippingProgress = computed(() => {
    return Math.min(100, Math.round((subtotal.value / freeShippingThreshold) * 100));
  });
  const freeShippingRemaining = computed(() => {
    return Math.max(0, freeShippingThreshold - subtotal.value);
  });

  // Add To Cart
  const addToCart = (
    product: Product,
    quantity: number = 1,
    size: string = "",
    openDrawer: boolean = true,
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

    if (openDrawer) {
      openCartDrawer();
    }
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
    isCartDrawerOpen,
    freeShippingThreshold,
    freeShippingProgress,
    freeShippingRemaining,
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  };
};
