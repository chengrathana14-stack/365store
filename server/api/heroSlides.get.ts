import { heroSlideSeedData } from "~/data/storefront";

export default defineEventHandler((event) => {
  // Set cache headers: 5 minutes in browser, 20 minutes on edge CDN
  setHeader(event, "Cache-Control", "public, max-age=300, s-maxage=1200");
  return heroSlideSeedData;
});
