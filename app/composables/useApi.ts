export const useApiBase = () => {
  const config = useRuntimeConfig();
  return (config.public?.apiBase as string) || 'http://localhost:5000';
};
