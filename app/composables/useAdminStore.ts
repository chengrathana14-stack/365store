import { ref, computed } from "vue";
import { orderSeedData, discountSeedData, userSeedData } from "~/data/admin";
import { products as fallbackProducts } from "~/data/product";
import type { Order, OrderStatus, PaymentStatus, Discount, User, Product } from "~/type/product";

export interface CustomOrder extends Order {
  address?: string;
  khrTotal?: number;
  items?: Array<{
    product: Product;
    quantity: number;
    size?: string;
  }>;
}

export const useAdminStore = () => {
  /* =========================================================
     1. ORDERS STATE & SYNC WITH STOREFRONT (365_orders)
     ========================================================= */
  const customOrders = ref<CustomOrder[]>([]);
  const isOrdersLoaded = ref(false);

  const loadOrders = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("365_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Normalize storefront orders into Admin Order format
          customOrders.value = parsed.map((item: any) => {
            const firstProduct = item.items?.[0]?.product?.name || "365 Sports Performance Gear";
            const itemCount = item.items?.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0) || 1;
            const formattedTotal = Number(item.total || 0);

            return {
              id: String(item.id).startsWith("#") ? String(item.id) : `#${item.id}`,
              customer: item.customer || "Customer",
              email: item.email || "customer@365sport.com",
              phone: item.phone || "+855 12 888 365",
              product: itemCount > 1 ? `${firstProduct} (+${itemCount - 1} more)` : firstProduct,
              quantity: itemCount,
              subtotal: Number(item.subtotal || formattedTotal),
              shipping: Number(item.shipping || 0),
              total: formattedTotal,
              khrTotal: item.khrTotal || Math.round(formattedTotal * 4100),
              status: (item.status as OrderStatus) || "Processing",
              paymentStatus: (item.paymentStatus as PaymentStatus) || "Paid",
              paymentMethod: item.paymentMethod || "KHQR (Bakong)",
              date: item.date ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today",
              address: item.address || "Phnom Penh, Cambodia",
              items: item.items || [],
            };
          });
        }
      }
    } catch (e) {
      console.error("Failed to load orders from localStorage:", e);
    } finally {
      isOrdersLoaded.value = true;
    }
  };

  // Combined orders (customer placed orders first, followed by seed orders)
  const allOrders = computed<Order[]>(() => {
    return [...customOrders.value, ...orderSeedData];
  });

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    // Check in custom orders
    const targetCustom = customOrders.value.find((o) => o.id === orderId || o.id === `#${orderId}`);
    if (targetCustom) {
      targetCustom.status = newStatus;
      // persist back to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("365_orders") || "[]");
        const match = stored.find((o: any) => o.id === targetCustom.id || `#${o.id}` === targetCustom.id);
        if (match) {
          match.status = newStatus;
          localStorage.setItem("365_orders", JSON.stringify(stored));
        }
      } catch (e) {
        console.error("Storage error:", e);
      }
    }

    // Check in seed orders
    const targetSeed = orderSeedData.find((o) => o.id === orderId || o.id === `#${orderId}`);
    if (targetSeed) {
      targetSeed.status = newStatus;
    }
  };

  const updatePaymentStatus = (orderId: string, newPaymentStatus: PaymentStatus) => {
    const targetCustom = customOrders.value.find((o) => o.id === orderId || o.id === `#${orderId}`);
    if (targetCustom) {
      targetCustom.paymentStatus = newPaymentStatus;
      try {
        const stored = JSON.parse(localStorage.getItem("365_orders") || "[]");
        const match = stored.find((o: any) => o.id === targetCustom.id || `#${o.id}` === targetCustom.id);
        if (match) {
          match.paymentStatus = newPaymentStatus;
          localStorage.setItem("365_orders", JSON.stringify(stored));
        }
      } catch (e) {
        console.error("Storage error:", e);
      }
    }

    const targetSeed = orderSeedData.find((o) => o.id === orderId || o.id === `#${orderId}`);
    if (targetSeed) {
      targetSeed.paymentStatus = newPaymentStatus;
    }
  };

  const deleteOrder = (orderId: string) => {
    customOrders.value = customOrders.value.filter((o) => o.id !== orderId && o.id !== `#${orderId}`);
    try {
      const stored = JSON.parse(localStorage.getItem("365_orders") || "[]");
      const filtered = stored.filter((o: any) => o.id !== orderId && `#${o.id}` !== orderId);
      localStorage.setItem("365_orders", JSON.stringify(filtered));
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  /* =========================================================
     2. DISCOUNTS STATE & PERSISTENCE (365_admin_discounts)
     ========================================================= */
  const customDiscounts = ref<Discount[]>([]);

  const loadDiscounts = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("365_admin_discounts");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          customDiscounts.value = parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load discounts from localStorage:", e);
    }
  };

  const allDiscounts = computed<Discount[]>(() => {
    return [...customDiscounts.value, ...discountSeedData];
  });

  const addDiscount = (discount: Discount) => {
    customDiscounts.value.unshift(discount);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("365_admin_discounts", JSON.stringify(customDiscounts.value));
      } catch (e) {
        console.error("Storage error:", e);
      }
    }
  };

  const toggleDiscountStatus = (code: string) => {
    const targetCustom = customDiscounts.value.find((d) => d.code === code);
    if (targetCustom) {
      targetCustom.status = targetCustom.status === "Active" ? "Expired" : "Active";
      if (typeof window !== "undefined") {
        localStorage.setItem("365_admin_discounts", JSON.stringify(customDiscounts.value));
      }
      return;
    }

    const targetSeed = discountSeedData.find((d) => d.code === code);
    if (targetSeed) {
      targetSeed.status = targetSeed.status === "Active" ? "Expired" : "Active";
    }
  };

  const deleteDiscount = (code: string) => {
    customDiscounts.value = customDiscounts.value.filter((d) => d.code !== code);
    if (typeof window !== "undefined") {
      localStorage.setItem("365_admin_discounts", JSON.stringify(customDiscounts.value));
    }
  };

  /* =========================================================
     3. USERS STATE & PERSISTENCE (365_admin_users)
     ========================================================= */
  const customUsers = ref<User[]>([]);

  const loadUsers = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("365_admin_users");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          customUsers.value = parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load users from localStorage:", e);
    }
  };

  const allUsers = computed<User[]>(() => {
    return [...customUsers.value, ...userSeedData];
  });

  const addUser = (user: User) => {
    customUsers.value.unshift(user);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("365_admin_users", JSON.stringify(customUsers.value));
      } catch (e) {
        console.error("Storage error:", e);
      }
    }
  };

  const toggleUserStatus = (userId: number) => {
    const targetCustom = customUsers.value.find((u) => u.id === userId);
    if (targetCustom) {
      targetCustom.status = targetCustom.status === "Active" ? "Blocked" : "Active";
      if (typeof window !== "undefined") {
        localStorage.setItem("365_admin_users", JSON.stringify(customUsers.value));
      }
      return;
    }

    const targetSeed = userSeedData.find((u) => u.id === userId);
    if (targetSeed) {
      targetSeed.status = targetSeed.status === "Active" ? "Blocked" : "Active";
    }
  };

  const deleteUser = (userId: number) => {
    customUsers.value = customUsers.value.filter((u) => u.id !== userId);
    if (typeof window !== "undefined") {
      localStorage.setItem("365_admin_users", JSON.stringify(customUsers.value));
    }
  };

  /* =========================================================
     4. PRODUCTS STATE & PERSISTENCE (365_custom_products)
     ========================================================= */
  const customProducts = ref<Product[]>([]);

  const loadProducts = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("365_custom_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          customProducts.value = parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load products from localStorage:", e);
    }
  };

  const allProducts = computed<Product[]>(() => {
    return [...customProducts.value, ...fallbackProducts];
  });

  const addProduct = (product: Product) => {
    customProducts.value.unshift(product);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("365_custom_products", JSON.stringify(customProducts.value));
      } catch (e) {
        console.error("Storage error:", e);
      }
    }
  };

  const deleteProduct = (id: number) => {
    customProducts.value = customProducts.value.filter((p) => p.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("365_custom_products", JSON.stringify(customProducts.value));
    }
  };

  // Initialize
  if (typeof window !== "undefined") {
    loadOrders();
    loadDiscounts();
    loadUsers();
    loadProducts();
  }

  return {
    // Orders
    allOrders,
    customOrders,
    loadOrders,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,

    // Discounts
    allDiscounts,
    customDiscounts,
    loadDiscounts,
    addDiscount,
    toggleDiscountStatus,
    deleteDiscount,

    // Users
    allUsers,
    customUsers,
    loadUsers,
    addUser,
    toggleUserStatus,
    deleteUser,

    // Products
    allProducts,
    customProducts,
    loadProducts,
    addProduct,
    deleteProduct,
  };
};
