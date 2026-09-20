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
  const user = useState<AuthUser | null>("auth-user", () => null);
  const isLoading = useState("auth-loading", () => false);
  const activeRoleMode = useState<"user" | "admin">("auth-active-role-mode", () => "user");

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
    activeRoleMode.value = "admin";
    await navigateTo("/admin");
  };

  const switchToUser = async () => {
    activeRoleMode.value = "user";
    await navigateTo("/");
  };

  const loadUser = async () => {
    if (isLoading.value) return;

    isLoading.value = true;

    try {
      user.value = await $fetch<AuthUser>("/api/auth/me");
    } catch {
      user.value = null;
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
    user.value = null;
    activeRoleMode.value = "user";
    await navigateTo("/");
  };

  return {
    user,
    isLoading,
    isSuperAdmin,
    canSwitchToAdmin,
    activeRoleMode,
    switchToAdmin,
    switchToUser,
    loadUser,
    logout,
  };
};

