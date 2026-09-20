import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  // Only protect admin routes
  if (to.path.toLowerCase().startsWith("/admin")) {
    const { user, loadUser, isSuperAdmin } = useAuth();

    if (!user.value) {
      await loadUser();
    }

    // If not authenticated, redirect to Login
    if (!user.value) {
      return navigateTo(
        `/Auth/Login?redirect=${encodeURIComponent(to.fullPath)}&unauthorized=admin`,
      );
    }

    // If authenticated user is NOT the authorized superadmin/admin, deny access
    if (!isSuperAdmin.value && user.value.role !== "Admin") {
      return navigateTo("/Profile?unauthorized=admin");
    }
  }
});
