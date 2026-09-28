<template>
  <div class="relative min-h-screen flex flex-col selection:bg-lime-400 selection:text-black">
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

    <!-- Global Modals & Notifications -->
    <QrPaymentModal />
    <QuickDetailModal />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import InteractiveBackground from "~/components/InteractiveBackground.vue";
import QrPaymentModal from "~/components/QrPaymentModal.vue";
import QuickDetailModal from "~/components/QuickDetailModal.vue";
import ToastContainer from "~/components/ToastContainer.vue";
</script>