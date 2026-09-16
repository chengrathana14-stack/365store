export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  icon: string;
}

export type RecentOrderStatus = "Completed" | "Processing" | "Pending";

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: RecentOrderStatus;
}

export interface TopProduct {
  name: string;
  sold: number;
}

export interface SalesChartPoint {
  label: string;
  value: number;
}

export type SalesChartPeriod =
  | "Last 7 days"
  | "Last 30 days"
  | "Last 6 months"
  | "This year";

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface BrandProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: StockStatus;
}

export interface CategoryProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  sold: number;
  status: StockStatus;
}

export interface UserOrderSummary {
  id: string;
  date: string;
  items: number;
  total: number;
  status: "Delivered" | "Processing" | "Cancelled";
}

export interface UserActivity {
  title: string;
  description: string;
  date: string;
  icon: string;
}
