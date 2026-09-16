<script setup lang="ts">
import { dashboardStats } from "~/data/admin";

definePageMeta({
  layout: "admin",
});

const stats = dashboardStats;
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <AdminHeader
      title="Dashboard"
      description="Welcome back, Admin. Here's what's happening with your store."
    />

    <!-- Statistics -->
    <AdminStats :stats="stats" />

    <!-- Sales + Top Products -->
    <div class="grid gap-6 xl:grid-cols-3">
      <!-- Sales -->
      <div class="xl:col-span-2">
        <AdminSalesChart />
      </div>

      <!-- Top Products -->
      <AdminTopProducts />
    </div>

    <!-- Recent Orders -->
    <AdminRecentOrders />
  </div>
</template>
