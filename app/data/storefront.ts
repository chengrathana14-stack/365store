import type {
  CategoryCard,
  HeroSlide,
  NavigationSection,
} from "~/type/storefront";

export const categoryCardSeedData: CategoryCard[] = [
  {
    name: "All",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Football",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Clothing",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Goalkeeper",
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=800&q=80",
  },
];

export const heroSlideSeedData: HeroSlide[] = [
  {
    title: "Move With Power",
    subtitle: "365 Sport",
    description:
      "Discover premium sportswear designed to help you perform at your best.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Run Your Game",
    subtitle: "New Collection",
    description: "Performance running shoes and gear built for every step.",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Play Without Limits",
    subtitle: "Basketball",
    description:
      "Upgrade your basketball game with the latest performance collection.",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80",
  },
];

export const adminNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", icon: "📊", path: "/admin" }],
  },
  {
    title: "Shop Management",
    items: [
      { name: "Products", icon: "👟", path: "/admin/products" },
      { name: "Brands", icon: "🏷️", path: "/admin/brands" },
      { name: "Categories", icon: "📂", path: "/admin/categories" },
      { name: "Inventory", icon: "📦", path: "/admin/inventory" },
    ],
  },
  {
    title: "Sales",
    items: [{ name: "Orders", icon: "🛒", path: "/admin/orders", badge: 8 }],
  },
  {
    title: "Customers",
    items: [
      { name: "Users", icon: "👥", path: "/admin/users" },
      { name: "Reviews", icon: "⭐", path: "/admin/reviews" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { name: "Discounts", icon: "🔥", path: "/admin/discounts" },
      { name: "Notifications", icon: "🔔", path: "/admin/notifications" },
    ],
  },
  {
    title: "Analytics",
    items: [{ name: "Reports", icon: "📈", path: "/admin/reports" }],
  },
  {
    title: "System",
    items: [{ name: "Settings", icon: "⚙️", path: "/admin/settings" }],
  },
];

export const productFilterOptions = {
  types: ["All", "Popular", "Discount"],
  categories: ["All", "Football", "Clothing", "Accessories", "Goalkeeper"],
  brands: ["All", "Mizuno", "Nike", "Adidas", "Puma", "New Balance"],
  genders: ["All", "Men", "Women", "Unisex"],
} as const;
