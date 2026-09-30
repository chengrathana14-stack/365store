export const useApiBase = () => {
  const config = useRuntimeConfig();
  const base = (config.public?.apiBase as string) || "";
  // If no external URL is configured, use built-in Nitro /api endpoints for instant same-origin response
  return base || "/api";
};
