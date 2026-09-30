import { discountSeedData } from "~/data/admin";

export default defineEventHandler((event) => {
  // Set cache headers: 60s in browser, 5 minutes on CDN
  setHeader(event, "Cache-Control", "public, max-age=60, s-maxage=300");
  return discountSeedData;
});
