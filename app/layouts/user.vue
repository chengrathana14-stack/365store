<template>
  <div class="relative min-h-screen flex flex-col selection:bg-lime-400 selection:text-black text-white">
    <!-- Smooth Interactive Animated Background -->
    <InteractiveBackground />

    <!-- Main Navigation Bar -->
    <Navbar />

    <!-- Page Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Global High-Tech Modals, Drawers & Notifications -->
    <GlobalSearchModal />
    <CartDrawer />
    <CompareDrawer />
    <CompareModal />
    <PreOrderModal />
    <QrPaymentModal />
    <QuickDetailModal />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import InteractiveBackground from "~/components/InteractiveBackground.vue";
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";
import GlobalSearchModal from "~/components/GlobalSearchModal.vue";
import CartDrawer from "~/components/CartDrawer.vue";
import CompareDrawer from "~/components/CompareDrawer.vue";
import CompareModal from "~/components/CompareModal.vue";
import PreOrderModal from "~/components/PreOrderModal.vue";
import QrPaymentModal from "~/components/QrPaymentModal.vue";
import QuickDetailModal from "~/components/QuickDetailModal.vue";
import ToastContainer from "~/components/ToastContainer.vue";
</script>