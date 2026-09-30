import type { Product } from "~/type/product";

export const products: Product[] = [
  // =====================================================
  // POPULAR PRODUCTS
  // =====================================================

  {
    id: 1,
    name: "Nike Air Zoom Pegasus 40",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    hoverimg:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
      "https://images.unsplash.com/photo-1579958118587-cd4628902d4a?w=800&q=80",
    ],
    description:
      "Responsive cushioning and smooth transitions make it a great choice for everyday running. The Nike Air Zoom Pegasus 40 delivers the responsive support you need.",
    category: "Running Shoes",
    brand: "Nike",
    gender: "Men",
    color: "Black / White / University Red",
    size: ["7", "8", "9", "10", "11", "12", "13"],
    discount: 15,
    rating: 4.8,
    reviews: 1247,
    stock: 0,
    featured: true,
    isNew: true,
    popular: true,
  },

  {
    id: 2,
    name: "Adidas Ultraboost 22",
    price: 189.99,
    image:
      "https://imgs.search.brave.com/poRUZ37YcDCWMuiHT15J-VQ9jll7hVHCVmVJi-grdSc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL2g0RUFB/ZVN3T0tocWJRVkkv/cy1sNDAwLndlYnA",
    hoverimg:
      "https://imgs.search.brave.com/_YgHcEjeHdVLHLl6Qw2TGDAVLcSVxacAHceIrIgC7zg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL0VWZ0FB/T1N3TnhwbEpDTkMv/cy1sNTAwLmpwZw",
    images: [
      "https://images.unsplash.com/photo-1556821552-5f94c71f2f3b?w=800&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcebf0055d5f?w=800&q=80",
      "https://images.unsplash.com/photo-1523170535258-f5ed11844a49?w=800&q=80",
    ],
    description:
      "Designed for comfort and performance, Ultraboost 22 provides exceptional energy return with advanced Boost technology. Perfect for long-distance running.",
    category: "Running Shoes",
    brand: "Adidas",
    gender: "Men",
    color: "Cloud White / Core Black",
    size: ["7", "8", "9", "10", "11", "12", "13"],
    discount: 20,
    rating: 4.9,
    reviews: 2156,
    stock: 18,
    featured: true,
    isNew: false,
    popular: true,
  },

  {
    id: 3,
    name: "Puma RS-X Super",
    price: 109.99,
    image:
      "https://imgs.search.brave.com/uRoXx_jyNJZdnGqhWxe7yD9LvPu0uxkGOKvGObfXhBo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcnR3/YWxrLnZ0ZXhhc3Nl/dHMuY29tL2FycXVp/dm9zL2lkcy8yMjE1/OTcvVGVuaXMtUHVt/YS1SUy1YLVN1cGVy/LU11bHRpY29sb3It/My5qcGc_dj02Mzcx/OTYxMTMwODE2MDAw/MDA",
    hoverimg:
      "https://imgs.search.brave.com/YasNbFLKBPo4JlcLc2v3ec3XZTSy99Phk5EAzEdHx9U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL2d2Y0FB/ZVN3T09GcHFQMm0v/cy1sOTYwLndlYnA",
    images: [
      "https://images.unsplash.com/photo-1539185441766-40950953cd6f?w=800&q=80",
      "https://images.unsplash.com/photo-1549298881-0710dc682b7b?w=800&q=80",
      "https://images.unsplash.com/photo-1542546068-19db7dc21d74?w=800&q=80",
    ],
    description:
      "The RS-X Super combines street style with premium comfort. A modern take on a retro favorite, perfect for casual wear and light training.",
    category: "Casual Sneakers",
    brand: "Puma",
    gender: "Unisex",
    color: "Puma White / Puma Black",
    size: ["5", "6", "7", "8", "9", "10", "11", "12"],
    discount: 25,
    rating: 4.7,
    reviews: 892,
    stock: 32,
    featured: true,
    isNew: true,
    popular: true,
  },

  {
    id: 4,
    name: "New Balance 990v6",
    price: 184.99,
    image:
      "https://imgs.search.brave.com/BFprRYQtK3R2hGDlme3gZge8n31ZcRUCzX39wLb0los/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc29sZXJldHJp/ZXZlci5jb20vc2Iv/cHJvZHVjdHMvbmV3/X2JhbGFuY2VfOTkw/djZfbWFkZV9pbl91/c2FfYmxhY2stZ3Jl/eS1VOTkwamM2LTE3/Mzk0NjU1OTcxMTUu/d2VicD93aWR0aD0z/OTImcXVhbGl0eT03/NSZmaXQ9Y29udGFp/bg",
    hoverimg:
      "https://imgs.search.brave.com/Uak0HR3ZVPRKNl-xJsIZ_uNwgd0Hgo-sMlDg-8bFIf8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9qdXN0/ZnJlc2hraWNrcy5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjEvMTIvTmV3LUJh/bGFuY2UtOTkwdjYt/R3JleS1SZWxlYXNl/LURhdGUtNC53ZWJw",
    images: [
      "https://images.unsplash.com/photo-1612521150235-e80e0b5f51d5?w=800&q=80",
      "https://images.unsplash.com/photo-1549622582-1e5a27a63c86?w=800&q=80",
      "https://images.unsplash.com/photo-1530309592458-340c1d05b9df?w=800&q=80",
    ],
    description:
      "Legendary comfort and heritage design. The 990v6 features premium materials and advanced cushioning technology for all-day comfort and support.",
    category: "Running Shoes",
    brand: "New Balance",
    gender: "Men",
    color: "Grey / White",
    size: ["7", "8", "9", "10", "11", "12", "13"],
    discount: 10,
    rating: 4.9,
    reviews: 1834,
    stock: 15,
    featured: true,
    isNew: false,
    popular: true,
  },

  // =====================================================
  // DISCOUNT PRODUCTS
  // =====================================================

  {
    id: 5,
    name: "Adidas NMD R1",
    price: 99.99,
    image:
      "https://imgs.search.brave.com/-8zDMz8z6Am-tn1sJdceQYzV9sXejlwcVhGiHCMPJc4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL0Y4WUFB/T1N3cmJSa0pFSlMv/cy1sNDAwLndlYnA",
    hoverimg:
      "https://imgs.search.brave.com/Cp7Eq8Qcr2kUUc4jU1fZfj05s7O66Ygnmj5iZ31xqdY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZS1jZG4uaHlwYi5z/dC9odHRwczovL2h5/cGViZWFzdC5jb20v/aW1hZ2UvMjAxOC8w/Ni9hZGlkYXMtbm1k/LXIxLWJsYWNrLWd1/bS1yZWxlYXNlLTAu/anBnP2ZpdD1tYXgm/Y2JyPTEmcT05MCZ3/PTc1MCZoPTUwMA",
    images: [
      "https://images.unsplash.com/photo-1577872200969-2b12d56c3c45?w=800&q=80",
      "https://images.unsplash.com/photo-1540020773857-3e3b86f6b9da?w=800&q=80",
      "https://images.unsplash.com/photo-1513455835260-430cecad64fd?w=800&q=80",
    ],
    description:
      "The classic NMD R1 offers modern style with Boost technology cushioning. Great for everyday wear with street-style appeal.",
    category: "Casual Sneakers",
    brand: "Adidas",
    gender: "Unisex",
    color: "Cloud White / Green",
    size: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
    discount: 35,
    rating: 4.6,
    reviews: 1523,
    stock: 28,
    featured: false,
    isNew: false,
    popular: false,
  },

  {
    id: 6,
    name: "Nike Revolution 6",
    price: 64.99,
    image:
      "https://imgs.search.brave.com/CLjt7qf8KiuC6rV5J_E0xaMkDkWx27SoWlUb4l7Owig/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL0E2UUFB/ZVN3OEVGcVdmV2Iv/cy1sOTYwLndlYnA",
    hoverimg:
      "https://imgs.search.brave.com/bfhkT6ak4v_l6RxKlujrTMQHiGWj1UulWlgpYk_-sDM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL01BSUFB/T1N3Qml0bnU5d0Ev/cy1sNTAwLmpwZw",
    images: [
      "https://images.unsplash.com/photo-1606107557529-da4b46f20128?w=800&q=80",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    description:
      "Simple, comfortable, and affordable. The Nike Revolution 6 provides essential performance for casual training and everyday activities.",
    category: "Running Shoes",
    brand: "Nike",
    gender: "Kids",
    color: "Black / White",
    size: ["3", "4", "5", "6", "7", "8"],
    discount: 40,
    rating: 4.5,
    reviews: 876,
    stock: 45,
    featured: false,
    isNew: false,
    popular: false,
  },

  {
    id: 7,
    name: "Saucony Triumph 20",
    price: 139.99,
    image:
      "https://imgs.search.brave.com/wxzyGj2JJNreDd9CBAIXfOC-BS-ZC3L4iyaLx2b4IHg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c29sZXJldmlldy5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjIvMTIvU2F1Y29u/eV9Ucml1bXBoXzIw/X3VwcGVyLmpwZw",
    hoverimg:
      "https://imgs.search.brave.com/mtU-ISWShO1cC5M3pN4XFcIECI4oP7GNN2BOkFc98Io/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c29sZXJldmlldy5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjIvMTIvU2F1Y29u/eV9Ucml1bXBoXzIw/X3dpdGhfU3VwZXJm/ZWV0X2JsdWUuanBn",
    images: [
      "https://images.unsplash.com/photo-1526062881576-09a72c4c7f8b?w=800&q=80",
      "https://images.unsplash.com/photo-1542456292-cbe1f5caa6db?w=800&q=80",
      "https://images.unsplash.com/photo-1479622753714-4e3871c667e1?w=800&q=80",
    ],
    description:
      "Saucony's premium cushioned runner with PlushGel technology. Built for maximum comfort on long-distance runs and daily training.",
    category: "Running Shoes",
    brand: "Saucony",
    gender: "Men",
    color: "Ocean / Storm",
    size: ["7", "8", "9", "10", "11", "12", "13"],
    discount: 30,
    rating: 4.8,
    reviews: 945,
    stock: 20,
    featured: false,
    isNew: false,
    popular: false,
  },

  {
    id: 8,
    name: "ASICS Gel-Kayano 29",
    price: 169.99,
    image:
      "https://imgs.search.brave.com/kKGhqKpxItGunaBaPNDD8dOOfAWJDMKpaMNDZ4a4diA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c3ZzcG9ydHMuY29t/L2Nkbi9zaG9wL2Zp/bGVzLzEwMTFiNDc0/LTQwMS0zLmpwZz92/PTE3MTE0MTQ5NTMm/d2lkdGg9MTQ0NQ",
    hoverimg:
      "https://imgs.search.brave.com/8MfiUw94KMkrcxK3w3OFZF2O_oIUBJCQ0wO5uEvehBI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c29sZXJldmlldy5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjIvMTEvQXNpY3Nf/S2F5YW5vXzI5X3Rv/bmd1ZS5qcGc",
    images: [
      "https://images.unsplash.com/photo-1463622328062-d692c695ba36?w=800&q=80",
      "https://images.unsplash.com/photo-1542546068-19db7dc21d74?w=800&q=80",
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&q=80",
    ],
    description:
      "Premium stability shoe with advanced GEL technology. Designed for runners who need support and comfort on every stride.",
    category: "Running Shoes",
    brand: "ASICS",
    gender: "Men",
    color: "Peacoat / White",
    size: ["7", "8", "9", "10", "11", "12", "13"],
    discount: 28,
    rating: 4.9,
    reviews: 1456,
    stock: 17,
    featured: false,
    isNew: false,
    popular: false,
  },

  {
    id: 9,
    name: "Reebok Classic Leather Legacy",
    price: 89.99,
    image:
      "https://imgs.search.brave.com/VnU8guAFI8JIUAlJtle2fWfzmdMCyaWITbOU8zXGhmM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL2JFTUFB/ZVN3cmFWcVd5bUgv/cy1sOTYwLndlYnA",
    hoverimg:
      "https://imgs.search.brave.com/H_UZlTwOCczROh5_Z5GjU5bNT0tRESnWs9QrRLdpnbU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFvMzcwMTIyeEwu/anBn",
    images: [
      "https://images.unsplash.com/photo-1608231387042-352e5dea6917?w=800&q=80",
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    ],
    description:
      "Iconic retro design meets modern comfort. The Classic Leather Legacy is perfect for casual wear and offers timeless style.",
    category: "Casual Sneakers",
    brand: "Reebok",
    gender: "Unisex",
    color: "White / Pure Grey",
    size: ["5", "6", "7", "8", "9", "10", "11", "12"],
    discount: 32,
    rating: 4.6,
    reviews: 728,
    stock: 35,
    featured: false,
    isNew: false,
    popular: false,
  },

  {
    id: 10,
    name: "Converse Chuck Taylor All Star",
    price: 64.99,
    image:
      "https://imgs.search.brave.com/-IyspomKToHVr5fhhq5OXoUrUTGaDORicsBDDzcF_p8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzE3bFM1SUFpNEwu/anBn",
    hoverimg:
      "https://imgs.search.brave.com/ubnSg3s-1ORM6YhR8zUpOFMoOY6cyEk4YvsKHtAQQfo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/bWVkaWEuYW1wbGll/bmNlLm5ldC9pL3Nj/dmwvOTE4OTNfMzU5/MTQzXzE_Zm10PWF1/dG8mdz02NDA",
    images: [
      "https://images.unsplash.com/photo-1577222055194-41cf4a33f011?w=800&q=80",
      "https://images.unsplash.com/photo-1579538481759-d8d769cf22ca?w=800&q=80",
      "https://images.unsplash.com/photo-1598694159484-3671e856c8e5?w=800&q=80",
    ],
    description:
      "The legendary All Star. A timeless classic canvas sneaker that goes with everything. Perfect for street style and casual adventures.",
    category: "Casual Sneakers",
    brand: "Converse",
    gender: "Unisex",
    color: "Classic White",
    size: ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
    discount: 45,
    rating: 4.7,
    reviews: 3421,
    stock: 60,
    featured: false,
    isNew: false,
    popular: false,
  },

  {
    id: 11,
    name: "Nike Phantom GX 2 Elite FG",
    price: 259.99,
    image:
      "https://imgs.search.brave.com/ykLwTMrp97LFoECMw8VPOoji7t5T7lk638KEDbvlxes/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YmxyLnVuaWlkLml0/L3Byb2R1Y3QvMzY5/MjM3LzljYjUzZTI4/OTQyOS5qcGc_d2lk/dGg9Mzg0MCZmb3Jt/YXQ9d2VicCZxPTc1",
    hoverimg:
      "https://imgs.search.brave.com/GfhHBgXM6B_njCkbhJ_CMDRnu5nZFOzrVG7yPlDxBow/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzcxaTQrMmc2bjBM/LmpwZw",
    images: [
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    ],
    description:
      "Elite football boots with a precise touch zone and aggressive traction for natural-grass pitches.",
    category: "Football Shoes",
    brand: "Nike",
    gender: "Unisex",
    color: "White / Bright Crimson",
    size: ["7", "8", "9", "10", "11", "12"],
    discount: 12,
    rating: 4.8,
    reviews: 642,
    stock: 12,
    featured: true,
    isNew: true,
    popular: false,
  },

  {
    id: 12,
    name: "Adidas Predator League FG",
    price: 119.99,
    image:
      "https://imgs.search.brave.com/IoEiLlbSAjgYIyLJd0yJWBdOQVBz7pnNpjtOGR4UnPY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZm9vdGxvY2tl/ci5jb20vaXMvaW1h/Z2UvRUJGTDIvSkkx/MTE3P3dpZD01MDAm/aGVpPTUwMA",
    hoverimg:
      "https://imgs.search.brave.com/_nuYUsyRAUIOovVB_B2HIPN_SfMp61hNR0arn9D-Eqw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YmxyLnVuaWlkLml0/L3Byb2R1Y3QvNDMx/MTEwLzE5ZTA5NDQ0/ZTE0MC5qcGc_d2lk/dGg9Mzg0MCZmb3Jt/YXQ9d2VicCZxPTc1",
    images: [
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    ],
    description:
      "Control-focused football boots with a textured upper for confident passing and finishing.",
    category: "Football Shoes",
    brand: "Adidas",
    gender: "Men",
    color: "Black / Solar Red",
    size: ["7", "8", "9", "10", "11", "12"],
    discount: 22,
    rating: 4.7,
    reviews: 488,
    stock: 16,
    featured: false,
    isNew: true,
    popular: false,
  },

  {
    id: 13,
    name: "Jordan One Take 5",
    price: 115,
    image:
      "https://imgs.search.brave.com/2pY3pHqx1Wza3DGpzJjkFKD-QWFgfWd4Fb0um6oAgR0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YmFza2V0YmFsbHN0/b3JlLm5ldC9jZG4v/c2hvcC9maWxlcy9G/RDIzMzUtMTYwLWpv/cmRhbi1vbmUtdGFr/ZS01LXNjYXJwYS1k/YS1iYXNrZXQtcnVz/c2VsbC13ZXN0YnJv/b2stbmJhLTAtMTAw/MHgxMDAwLmpwZz92/PTE3Mzg2NzcwMzQm/d2lkdGg9MTAwMA",
    hoverimg:
      "https://imgs.search.brave.com/PEt2IYjBap816KGES7L2liArS5ExXOAZlzNbFWnzGdU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL21WNEFB/T1N3Tjk5bXB2NWMv/cy1sNDAwLndlYnA",
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
    ],
    description:
      "Responsive basketball shoes with court-ready grip and lightweight cushioning for quick changes of direction.",
    category: "Basketball Shoes",
    brand: "Jordan",
    gender: "Men",
    color: "Black / University Red",
    size: ["8", "9", "10", "11", "12", "13"],
    discount: 18,
    rating: 4.6,
    reviews: 367,
    stock: 21,
    featured: true,
    isNew: true,
    popular: false,
  },

  {
    id: 14,
    name: "Nike Metcon 9 AMP",
    price: 150,
    image:
      "https://imgs.search.brave.com/XUmGwt8vg1R9CsszG8Rc9uSl1o0PzeILUF2JsMOyI0E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hY2Fk/ZW15LnNjZW5lNy5j/b20vaXMvaW1hZ2Uv/YWNhZGVteS8yMTEz/MjM4Mj8kcGRwLW1v/YmlsZS1nYWxsZXJ5/LW5nJA",
    hoverimg:
      "https://imgs.search.brave.com/a36bzFIlsZqBr71huiUSNBfe-bv8NvzCzE7DA3IUDM4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMubmlrZS5jb20v/YS9pbWFnZXMvdF93/ZWJfcHdfNTkyX3Yy/L2ZfYXV0by91Xzlk/ZGYwNGM3LTJhOWEt/NGQ3Ni1hZGQxLWQx/NWFmOGYwMjYzZCxj/X3NjYWxlLGZsX3Jl/bGF0aXZlLHdfMS4w/LGhfMS4wLGZsX2xh/eWVyX2FwcGx5L2U1/MzQzMDEyLTQzODEt/NDQ4Zi1hZDNiLWQ5/MzhmZDUwMWRkNC9X/K05JS0UrTUVUQ09O/KzEwK05CWS5wbmc",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
    ],
    description:
      "Stable training shoes built for lifting, short runs, rope climbs and demanding gym sessions.",
    category: "Training Shoes",
    brand: "Nike",
    gender: "Unisex",
    color: "Sail / Black / Gum",
    size: ["7", "8", "9", "10", "11", "12", "13"],
    discount: 15,
    rating: 4.8,
    reviews: 531,
    stock: 14,
    featured: true,
    isNew: false,
    popular: false,
  },

  {
    id: 15,
    name: "Under Armour HOVR Sonic 6",
    price: 110,
    image:
      "https://imgs.search.brave.com/pLh537KUUeJw_2E_qsSP4A-61lpwwD3B58D5_hr4H-o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL3pFWUFB/T1N3N1VsbnVvOGUv/cy1sMTYwMC53ZWJw",
    hoverimg:
      "https://imgs.search.brave.com/CXQUug4XvS6H8xfC9zD9RXc-Bw1sN8wMPULxcg9mk9U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL29NY0FB/ZVN3MWJscExrVDcv/cy1sNDAwLndlYnA",
    images: [
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
    ],
    description:
      "Lightweight connected running shoes with responsive cushioning for daily road miles.",
    category: "Running Shoes",
    brand: "Under Armour",
    gender: "Unisex",
    color: "Blue / White",
    size: ["7", "8", "9", "10", "11", "12"],
    discount: 24,
    rating: 4.5,
    reviews: 286,
    stock: 19,
    featured: false,
    isNew: true,
    popular: false,
  },

  {
    id: 16,
    name: "Nike Dri-FIT Academy Jersey",
    price: 45,
    image:
      "https://imgs.search.brave.com/Xlx-3_XhJoc6w2fdLft9D4sb1dAwTRDWC-DnJ1AruXM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly94dHJl/bWVzb2NjZXJvbmxp/bmUuY29tL2Nkbi9z/aG9wL2ZpbGVzLzEt/bmlrZS1kcmktZml0/LWFjYWRlbXktZGg4/MDMzLTQxOS5qcGc_/dj0xNzQwNjI4NDkx/JndpZHRoPTIwMDA",
    hoverimg:
      "https://imgs.search.brave.com/TxQU01ntRAjjEi1Qr6zdB_bo4LwCPuLhLpPqrExvdMs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMubWVkaWEtYXJv/Y2FtLmNvbS9qNUVa/cDE0enBGYjZRbEdz/QXR5UTRRblF2WDA9/L2ZpdC1pbi80NTB4/NDUwL1cyODUwMi9W/QksvMXNCNE5IN2xf/VkJLLnBuZw",
    images: [
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&q=80",
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&q=80",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
    ],
    description:
      "Breathable football jersey with sweat-wicking fabric for training and match-day comfort.",
    category: "Sports Clothing",
    brand: "Nike",
    gender: "Unisex",
    color: "Volt / Black",
    size: ["S", "M", "L", "XL", "XXL"],
    discount: 20,
    rating: 4.6,
    reviews: 154,
    stock: 30,
    featured: false,
    isNew: true,
    popular: false,
  },

  {
    id: 17,
    name: "Adidas Training Backpack 30L",
    price: 65,
    image:
      "https://imgs.search.brave.com/xrjdPOuSCGGPRnZ-sRqAx3BRjP_rOmOI52HQC7E_ff0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nLy1pSUFB/ZVN3ZDAxb3VhcW4v/cy1sNTAwLmpwZw",
    hoverimg:
      "https://imgs.search.brave.com/WqWELS9WcRexHmi2ISlzm4TNaU-4avqlOajjXCMu0EA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dHJhZGVpbm4uY29t/L2YvMTM4NDIvMTM4/NDI1OTM0XzUvYWRp/ZGFzLWVwLXN5c3Rl/bS0zMGwtYmFja3Bh/Y2sud2VicA",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
    ],
    description:
      "Durable 30-litre backpack with separate shoe storage and organized pockets for training essentials.",
    category: "Sports Bags",
    brand: "Adidas",
    gender: "Unisex",
    color: "Black / White",
    size: ["One Size"],
    discount: 15,
    rating: 4.7,
    reviews: 203,
    stock: 25,
    featured: false,
    isNew: false,
    popular: false,
  },

  {
    id: 18,
    name: "Thermos Performance Water Bottle",
    price: 24.99,
    image:
      "https://imgs.search.brave.com/cy-xBPtkquawBhgIYREgoCPJG3Yke9rHiXofkel9Ii4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aGVy/bW9zLmNvbS9jZG4v/c2hvcC9wcm9kdWN0/cy90czQzMWJrX2Jv/dHRsZV93ZGltc19y/MS5qcGc_dj0xNjM2/NzM1MDU2JndpZHRo/PTEwODA",
    hoverimg:
      "https://imgs.search.brave.com/jGM_ZO9NXxVNsN2sHtQ7riyQ-D5IHOiBmM9mExghbSE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aGVy/bW9zLmNvbS9jZG4v/c2hvcC9wcm9kdWN0/cy90czQzMTlkcl8y/NG96X2h5ZHJhdGlv/bl9kYXJrcmVkX2xp/ZGluc2V0X29wZW5f/djIuanBnP3Y9MTYy/MzY4MDUyMyZ3aWR0/aD03MjA",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=800&q=80",
      "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?w=800&q=80",
    ],
    description:
      "Double-wall insulated bottle that keeps drinks cold through workouts, matches and outdoor sessions.",
    category: "Sports Accessories",
    brand: "Thermos",
    gender: "Unisex",
    color: "Matte Black",
    size: ["750ml"],
    discount: 10,
    rating: 4.5,
    reviews: 118,
    stock: 42,
    featured: false,
    isNew: true,
    popular: false,
  },
];
