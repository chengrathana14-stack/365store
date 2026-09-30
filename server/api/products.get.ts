import { products } from "~/data/product";

export default defineEventHandler((event) => {
  // Set cache headers: 2 minutes in browser, 10 minutes on edge CDN
  setHeader(event, "Cache-Control", "public, max-age=120, s-maxage=600");
  return products;
});
