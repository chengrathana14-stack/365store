export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  roles?: string[];
  isSuperAdmin?: boolean;
  canAccessAdmin?: boolean;
}

export const useAuth = () => {
  const user = useState<AuthUser | null>("auth-user", () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem("365_auth_user");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return null;
  });

  const isLoading = useState("auth-loading", () => false);

  const setUser = (userData: AuthUser | null) => {
    user.value = userData;
    if (import.meta.client) {
      try {
        if (userData) {
          localStorage.setItem("365_auth_user", JSON.stringify(userData));
        } else {
          localStorage.removeItem("365_auth_user");
        }
      } catch {}
    }
  };

  const isSuperAdmin = computed(() => {
    if (!user.value) return false;
    return (
      user.value.email.toLowerCase() === "chengrathana14@gmail.com" ||
      user.value.role === "Admin" ||
      user.value.isSuperAdmin === true
    );
  });

  const canSwitchToAdmin = computed(() => isSuperAdmin.value);

  const switchToAdmin = async () => {
    if (!canSwitchToAdmin.value) return;
    await navigateTo("/admin");
  };

  const switchToUser = async () => {
    await navigateTo("/");
  };

  const loadUser = async () => {
    if (isLoading.value) return;

    // Check localStorage first
    if (import.meta.client && !user.value) {
      try {
        const stored = localStorage.getItem("365_auth_user");
        if (stored) {
          user.value = JSON.parse(stored);
        }
      } catch {}
    }

    isLoading.value = true;

    try {
      const serverUser = await $fetch<AuthUser>("/api/auth/me");
      if (serverUser) {
        setUser(serverUser);
      }
    } catch {
      // Don't wipe the user if serverless session cold-starts
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    }
    setUser(null);
    await navigateTo("/");
  };

  return {
    user,
    isLoading,
    isSuperAdmin,
    canSwitchToAdmin,
    switchToAdmin,
    switchToUser,
    loadUser,
    logout,
    setUser,
  };
};
