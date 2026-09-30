import { computed } from "vue";
import { useState } from "#app";
import type { CartItem, Product, Discount } from "~/type/product";
import { discountSeedData } from "~/data/admin";

export const useCart = () => {
  const isCartDrawerOpen = useState<boolean>("isCartDrawerOpen", () => false);
  const appliedDiscount = useState<Discount | null>("appliedDiscount", () => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("365_applied_discount");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load saved promo:", e);
      }
    }
    return null;
  });

  const appliedPromoCode = useState<string>("appliedPromoCode", () => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("365_applied_promo_code");
        if (saved) return saved;
      } catch (e) {
        console.error("Failed to load saved promo code:", e);
      }
    }
    return "";
  });

  const savePromoToStorage = () => {
    if (typeof window !== "undefined") {
      try {
        if (appliedDiscount.value) {
          sessionStorage.setItem("365_applied_discount", JSON.stringify(appliedDiscount.value));
          sessionStorage.setItem("365_applied_promo_code", appliedPromoCode.value);
        } else {
          sessionStorage.removeItem("365_applied_discount");
          sessionStorage.removeItem("365_applied_promo_code");
        }
      } catch (e) {
        console.error("Failed to persist promo:", e);
      }
    }
  };

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

  // Discount calculations
  const discountAmount = computed(() => {
    if (!appliedDiscount.value) return 0;
    if (appliedDiscount.value.type === "Percentage") {
      return (subtotal.value * appliedDiscount.value.value) / 100;
    }
    return Math.min(subtotal.value, appliedDiscount.value.value);
  });

  const discountLabel = computed(() => {
    if (!appliedDiscount.value) return "";
    if (appliedDiscount.value.type === "Percentage") {
      return `${appliedDiscount.value.value}%`;
    }
    return `$${appliedDiscount.value.value}`;
  });

  const applyPromo = (code: string, availableDiscounts?: Discount[]) => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      appliedDiscount.value = null;
      appliedPromoCode.value = "";
      savePromoToStorage();
      return { success: false, message: "Please enter a promo code" };
    }

    // Collect all discount sources (passed discounts, admin localStorage, seed data)
    const allDiscountsList: Discount[] = [];
    if (availableDiscounts && availableDiscounts.length > 0) {
      allDiscountsList.push(...availableDiscounts);
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("365_admin_discounts");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            allDiscountsList.push(...parsed);
          }
        }
      } catch (e) {
        console.error("Error reading admin discounts:", e);
      }
    }
    allDiscountsList.push(...discountSeedData);

    const match = allDiscountsList.find(
      (d) => String(d.code).trim().toUpperCase() === clean
    );

    if (match) {
      if (match.status === "Expired" || match.status === "Inactive") {
        appliedDiscount.value = null;
        appliedPromoCode.value = "";
        savePromoToStorage();
        return { success: false, message: `Promo code "${clean}" has expired or is inactive` };
      }
      if (match.minPurchase && subtotal.value < match.minPurchase) {
        appliedDiscount.value = null;
        appliedPromoCode.value = "";
        savePromoToStorage();
        return { success: false, message: `Minimum order of $${match.minPurchase} required` };
      }

      appliedDiscount.value = match;
      appliedPromoCode.value = clean;
      savePromoToStorage();
      const label = match.type === "Percentage" ? `${match.value}%` : `$${match.value}`;
      return { success: true, message: `✓ Code ${clean} applied: ${label} OFF!` };
    }

    // Fallback & Special promo codes
    if (clean === "168") {
      appliedDiscount.value = {
        id: 168,
        code: "168",
        description: "Special Mega Sale 90% OFF",
        type: "Percentage",
        value: 90,
        used: 1,
        usageLimit: 99999,
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        status: "Active",
        products: 999,
        minPurchase: 0,
      };
      appliedPromoCode.value = "168";
      savePromoToStorage();
      return { success: true, message: "✓ Code 168 applied: 90% OFF!" };
    }

    if (clean === "SPORT10" || clean === "WELCOME365" || clean === "WELCOME10") {
      appliedDiscount.value = {
        id: 9999,
        code: clean,
        description: "Welcome Promo",
        type: "Percentage",
        value: 10,
        used: 0,
        usageLimit: 1000,
        startDate: "",
        endDate: "",
        status: "Active",
        products: 0,
      };
      appliedPromoCode.value = clean;
      savePromoToStorage();
      return { success: true, message: `✓ Code ${clean} applied: 10% OFF!` };
    }

    appliedDiscount.value = null;
    appliedPromoCode.value = "";
    savePromoToStorage();
    return { success: false, message: `Invalid promo code "${clean}"` };
  };

  const removePromo = () => {
    appliedDiscount.value = null;
    appliedPromoCode.value = "";
    savePromoToStorage();
  };

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
    appliedDiscount,
    appliedPromoCode,
    discountAmount,
    discountLabel,
    applyPromo,
    removePromo,
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
