export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  hoverimg: string;
  images: string[];
  description: string;
  category: string;
  brand: string;
  gender: string;
  color: string;
  size: string[];
  discount: number;
  rating: number;
  reviews: number;
  stock: number;
  featured: boolean;
  isNew: boolean;
  popular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}
export interface Category {
  id: number;
  name: string;
  description: string;
  products: number;
  status: "Active" | "Inactive";
  created: string;
}

export interface Discount {
  id: number;
  code: string;
  description: string;
  type: "Percentage" | "Fixed";
  value: number;
  used: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Scheduled" | "Inactive";
  products: number;
}
export interface InventoryProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}
export type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

export type PaymentStatus = "Paid" | "Pending" | "Refunded";

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  date: string;
}

export type ProductStatus = "All" | "In Stock" | "Low Stock" | "Out of Stock";

export type ViewMode = "table" | "grid";

export interface Review {
  id: number;
  customer: string;
  email: string;
  avatar: string;
  product: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: "Published" | "Pending" | "Hidden";
  verified: boolean;
}
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Customer";
  status: "Active" | "Blocked";
  orders: number;
  spent: number;
  joined: string;
  avatar: string;
}
