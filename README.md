# ⚡ 365 Sports — Premium Athletic Footwear & Gear Platform

<p align="center">
  <img src="public/favicon.ico" alt="365 Sports Logo" width="80" height="80" />
</p>

<p align="center">
  <b>A modern, high-performance sports e-commerce and administration platform built with Nuxt 4, Vue 3, Tailwind CSS v4, Bakong KHQR payments, and Telegram bot automations.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-4.5.2-00DC82?style=for-the-badge&logo=nuxtdotjs&logoColor=white" alt="Nuxt 4" />
  <img src="https://img.shields.io/badge/Vue.js-3.5.41-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Bakong_KHQR-Integrated-red?style=for-the-badge" alt="Bakong KHQR" />
  <img src="https://img.shields.io/badge/Telegram_Bot-Automated-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram Bot" />
</p>

---

## 📖 Overview

**365 Sports** is a complete, full-stack athletic footwear and sportswear web application tailored for the Cambodian and Southeast Asian market. It provides a sleek, dark-neon athletic storefront experience for shoppers and an administrative dashboard for inventory, orders, discounts, and real-time sales reporting.

The platform integrates **National Bakong KHQR (NBC)** for automated QR code payments (supporting both USD and KHR), alongside a dual-layer **Telegram Bot** alert system for instant order notifications to store owners.

---

## ✨ Key Features

### 🛍️ Customer Experience & Storefront
- **Modern Dark Athletic Aesthetic:** Custom cyber/dark design system with sports lime and cyan accents, micro-animations, glassmorphism, and responsive layouts.
- **Product Catalog & Advanced Filters:** Filter athletic footwear and gear by Brand, Category, Sport discipline, Price range, and Stock availability.
- **Product Detail & Gallery:** High-resolution product images, dynamic size selector, real-time stock indicators, and related recommendations.
- **Interactive Product Comparison:** Side-by-side comparison modal (`CompareModal.vue`) and quick-access compare drawer for footwear specifications.
- **Instant Global Search:** Fast predictive modal search (`GlobalSearchModal.vue`) indexing products, categories, and brands.
- **Cart & Pre-Order System:** Persistent shopping cart drawer, promo code discounts, and pre-order capabilities for upcoming limited edition releases.
- **Customer Wishlist & Recently Viewed:** Dedicated wishlist page and sticky recently-viewed drawer.

### 💳 Payment & Checkout
- **Bakong KHQR Integration:** Native Cambodian KHQR generation with dynamic MD5 transaction polling, ACLEDA Bank compatibility, and USD/KHR currency conversion.
- **Multi-Method Checkout:** Supports Bakong KHQR, Bank Transfer, and Cash on Delivery (COD).
- **Automated Telegram Order Alerts:** Instant HTML-formatted Telegram messages dispatch to store administrators upon order placement or pre-order submission.

### 🛡️ Admin Dashboard (`/admin`)
- **Protected RBAC Access:** Global middleware (`auth-admin.global.ts`) with cryptographic password verification (Node.js `scrypt` hashing).
- **Real-Time Analytics & Reports:** Revenue trends, sales breakdowns, top-selling gear, and exportable financial reports (`/admin/reports`).
- **Product Management:** Full CRUD operations for sports footwear, sportswear, variants, sizing, and pricing.
- **Order Management:** Order status lifecycle management (`Pending`, `Paid`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Inventory Tracking:** Stock warning levels, bulk inventory updates, and re-order triggers.
- **Discounts & Coupons:** Configurable percentage and fixed discount promo codes with expiry limits.
- **Category & Brand Management:** Manage athletic brands (Nike, Adidas, Puma, etc.) and gear classifications.
- **User & Review Moderation:** Manage customer accounts and approve/moderate product reviews.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Nuxt 4](https://nuxt.com/) (v4.5.2) + [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite` |
| **Language & Typings** | [TypeScript](https://www.typescriptlang.org/) (Strict mode) |
| **Server Engine** | Nuxt Nitro Server (H3 event handlers, server API routes) |
| **Data & Storage** | Local JSON Store (`.data/365-sport.json`), `better-sqlite3`, and `json-server` |
| **Payments** | Bakong KHQR generation (`qrcode`, `bakong_khqr`, ACLEDA EMVCo standard) |
| **Microservices** | Python Flask KHQR Service (`server/bakong_server.py`) |
| **Notifications** | Telegram Bot API (`node-fetch` server bridge + browser fallback) |

---

## 📁 Project Structure

```text
365_Sport_Web_Frontend/
├── .data/                      # Local persistent application database state
├── app/
│   ├── api/                    # Mock / fixture databases (db.json)
│   ├── assets/css/             # Tailwind v4 import & custom CSS theme tokens
│   ├── components/             # Reusable UI components
│   │   ├── admin/              # Admin-specific navigation, headers, tables
│   │   ├── Categories/         # Category cards & grids
│   │   ├── BakongPaymentModal.vue # KHQR Bakong payment interface
│   │   ├── CartDrawer.vue      # Sliding cart drawer with discount inputs
│   │   ├── CompareModal.vue    # Side-by-side product comparison
│   │   ├── GlobalSearchModal.vue # Instant search overlay
│   │   ├── Navbar.vue & Footer.vue # Storefront navigation
│   │   └── ProductCard.vue     # Interactive athletic product card
│   ├── composables/            # Vue 3 reactive composables
│   │   ├── useAdminStore.ts    # Admin centralized state
│   │   ├── useAuth.ts          # Authentication, sessions, & RBAC
│   │   ├── useCart.ts          # Shopping cart reactive state
│   │   ├── usePreOrder.ts      # Pre-order handling
│   │   ├── useTelegramBot.ts   # Dual-layer Telegram notification engine
│   │   └── useWishlist.ts      # Wishlist persistent store
│   ├── layouts/                # Nuxt layouts (user & admin)
│   ├── middleware/             # Route guards (auth-admin.global.ts)
│   ├── pages/
│   │   ├── Admin/              # Complete admin portal routes
│   │   ├── Auth/               # Login, Register, Forgot Password
│   │   ├── Cart/               # Dedicated checkout & cart view
│   │   ├── Order/              # Order status, tracking, and confirmation
│   │   ├── Product/            # Catalog browsing & individual [id] view
│   │   ├── Profile/            # User profile and order history
│   │   ├── Wishlist/           # Saved favorites
│   │   ├── about.vue           # Brand story & store information
│   │   └── index.vue           # Hero landing page & showcase
│   └── app.vue                 # App entry point with auto-sync
├── server/
│   ├── api/
│   │   ├── auth/               # Login, logout, register, session verification
│   │   ├── telegram/           # Encrypted Telegram config, pre-order & alerts
│   │   ├── check-payment.get.ts# Rate-limited Bakong KHQR verification
│   │   ├── generate-qr.post.ts # EMVCo KHQR generator with TTL store
│   │   └── products.get.ts     # Products endpoint
│   ├── middleware/
│   │   └── security.ts         # Active defense: CSRF, scanner probe blocker, DoS protection
│   ├── utils/
│   │   ├── crypto.ts           # AES-256-GCM encryption & PII data masking
│   │   ├── auth.ts             # Server session & role authorization checks
│   │   ├── rateLimit.ts        # Memory-safe sliding window rate limiter
│   │   ├── bakongTransactions.ts # Memory-bounded TTL store for payments
│   │   ├── security.ts         # HTML escape & text sanitization
│   │   └── database.ts         # Scrypt-hashed user database management
│   └── bakong_server.py        # Standalone Python Flask Bakong gateway
├── nuxt.config.ts              # Nuxt 4 configuration, CSP, security headers & chunking
├── package.json                # Project dependencies & scripts
└── tsconfig.json               # TypeScript compiler config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or `v20.x` or higher
- **Package Manager**: `npm`, `pnpm`, `yarn`, or `bun`
- **Python** *(Optional, for standalone Bakong server)*: `Python 3.9+`

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/chengrathana14-stack/Rothana_full_web.git
cd 365_Sport_Web_Frontend
npm install
```

### 2. Environment Variables

Create or configure your `.env` file in the root directory:

```env
# Nuxt Public API Base (Optional - leaves empty to use built-in Nitro /api)
NUXT_PUBLIC_API_BASE=

# 365 Sports Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=Rotana_365days_Sport_bot
TELEGRAM_ADMIN_USERNAME=Rotana_cheng
TELEGRAM_ADMIN_PHONE=0969611977
TELEGRAM_CHAT_ID=your_chat_id_here
```

### 3. Running the Development Server

Start the Nuxt 4 development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Nuxt development server at `http://localhost:3000` |
| `npm run build` | Compiles the production application bundle into `.output/` |
| `npm run preview` | Locally preview the built production bundle |
| `npm run generate` | Pre-renders static HTML pages |
| `npm run json-server` | Launches local JSON mock API server on port `5000` |

---

## 🏦 Bakong KHQR Payment Flow

1. **Generation:** When a customer selects Bakong QR at checkout, `server/api/generate-qr.post.ts` produces an EMVCo-compliant KHQR string with merchant credentials and bill ID.
2. **Display:** The QR code renders dynamically via `BakongPaymentModal.vue` with an interactive countdown timer and dual USD/KHR amounts.
3. **Verification:** The client polls `server/api/check-payment.get.ts` with the transaction MD5 hash to confirm payment settlement before finalizing the order.
4. *(Optional Python Service)*: `server/bakong_server.py` can be run independently if connecting directly to the Bakong Open API gateway:
   ```bash
   pip install flask flask-cors bakong-khqr
   python server/bakong_server.py
   ```

---

## 🤖 Telegram Bot Integration

The store automatically sends rich notifications directly to the merchant's Telegram:
- **New Order Alerts:** Displays order ID, customer contact info, delivery address, ordered footwear/gear with sizes, discount codes, total USD/KHR, and payment status.
- **Pre-Order Alerts:** Notifies staff immediately when an out-of-stock or upcoming item is pre-ordered.
- **Customer Inquiries:** Forwards messages sent from the Contact page.

---

---

## 🛡️ Enterprise Security & Encryption

The platform incorporates comprehensive defense-in-depth security to protect customer privacy and prevent attacks:

### 1. AES-256-GCM Authenticated Encryption at Rest
- Sensitive credentials (such as Telegram bot tokens and chat IDs in `.data/telegram_config.json`) are automatically encrypted using authenticated **AES-256-GCM** with 96-bit random IVs and 128-bit authentication tags (`server/utils/crypto.ts`).
- If an attacker gains filesystem access to config files or backups, the credentials cannot be decrypted without the application's master key.

### 2. Active Anti-Hacker Shield (`server/middleware/security.ts`)
- **Anti-Exploit Scanner Blocker:** Instantly detects and blocks directory traversal (`../`, `..\`) and scanner probes for `.env`, `.git`, `wp-admin`, `.sql`, and backup archives.
- **CSRF Defense:** Enforces Origin / Host header validation on state-changing API endpoints (`POST`, `PUT`, `DELETE`).
- **DoS Payload Limiter:** Rejects oversized request payloads (> 2MB) to prevent memory exhaustion attacks.
- **Header Fingerprint Removal:** Strips `X-Powered-By` headers to prevent framework identification by automated crawlers.

### 3. Rate Limiting & Brute-Force Defense (`server/utils/rateLimit.ts`)
- In-memory, memory-capped rate limiter with automatic pruning prevents:
  - Password brute-forcing on `/api/auth/login` (max 10 attempts/min).
  - Registration spam on `/api/auth/register` (max 5 accounts/10 mins).
  - Notification flooding on `/api/telegram/send` & `/api/telegram/preorder`.
  - Transaction flooding on `/api/generate-qr` (max 30 QRs/min).

### 4. Memory Optimization & Leak Prevention (`server/utils/bakongTransactions.ts`)
- Bakong QR transactions operate on a **20-minute TTL lifecycle** with automated cleanup and a hard cap of 500 entries, preventing unbounded RAM consumption during high-traffic periods.

### 5. Content Security Policy & Security Headers (`nuxt.config.ts`)
- `Content-Security-Policy (CSP)`: Strict allow-listing of script, style, and API domains.
- `Strict-Transport-Security (HSTS)`: Forces secure HTTPS connections (`max-age=31536000; includeSubDomains; preload`).
- `X-Frame-Options: SAMEORIGIN`: Eliminates clickjacking risks.
- `X-Content-Type-Options: nosniff`: Prevents MIME type confusion attacks.
- `Referrer-Policy: strict-origin-when-cross-origin`.

### 6. PII Masking & Privacy Compliance
- Customer telephone numbers and emails are automatically masked in server dispatch logs (e.g. `096****977`, `ch***@gmail.com`).

---

## 🔑 Default Superadmin Access

The platform seeds an initial administrative account on startup for dashboard access (`/admin`):

- **Email:** `chengrathana14@gmail.com`
- **Default Password:** `11112222`
- **Role:** `Admin`

> ⚠️ *Security Recommendation: Change the default password upon initial production deployment.*

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary to **365 Sports Cambodia**. All rights reserved.
