<template>
  <Teleport to="body">
    <div
      v-if="isQrOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      @click.self="handleClose"
    >
      <div
        class="relative w-full max-w-xl my-auto overflow-hidden rounded-3xl border border-white/20 bg-[#0d1017] text-white shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300"
      >
        <!-- Modal Top Header Banner -->
        <div class="relative bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 px-6 py-4 border-b border-white/10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-black font-black text-sm shadow-[0_0_15px_rgba(183,243,74,0.4)]">
                ⚡
              </span>
              <div>
                <h3 class="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                  Buy Now · Instant Checkout
                </h3>
                <p class="text-[11px] text-gray-400">
                  {{ step === 1 ? 'Step 1: Fill delivery details' : 'Step 2: Pay with Card or KHQR' }}
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="handleClose"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition active:scale-95"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <!-- Stepper Progress Bar -->
          <div class="mt-3 flex items-center gap-2">
            <button
              type="button"
              @click="step = 1"
              class="flex-1 flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition text-left"
              :class="step === 1 ? 'bg-lime-400 text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'"
            >
              <span class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black" :class="step === 1 ? 'bg-black text-lime-400' : 'bg-lime-400 text-black'">
                {{ isCustomerValid ? '✓' : '1' }}
              </span>
              <span class="truncate">1. Delivery Info</span>
            </button>

            <button
              type="button"
              @click="goToPaymentStep"
              class="flex-1 flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition text-left"
              :class="step === 2 ? 'bg-lime-400 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'"
            >
              <span class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black" :class="step === 2 ? 'bg-black text-lime-400' : 'bg-white/20 text-gray-300'">
                2
              </span>
              <span class="truncate">2. Pay (Card / QR)</span>
            </button>
          </div>
        </div>

        <!-- Order Item Summary Header (Product & Determined Cost) -->
        <div class="bg-neutral-900/90 border-b border-white/10 px-6 py-3.5 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 overflow-hidden">
            <img
              v-if="primaryItem?.product?.image"
              :src="primaryItem.product.image"
              :alt="primaryItem.product.name"
              class="h-12 w-12 rounded-xl object-cover border border-white/10 shrink-0 bg-neutral-800"
            />
            <div class="min-w-0">
              <span class="text-[10px] font-bold uppercase tracking-wider text-lime-400 block truncate">
                Selected Product
              </span>
              <h4 class="text-xs sm:text-sm font-bold text-white truncate">
                {{ primaryItem?.product?.name || 'Selected Item' }}
              </h4>
              <p class="text-[11px] text-gray-400">
                <span v-if="primaryItem?.size">Size: <strong class="text-gray-200">{{ primaryItem.size }}</strong> &middot; </span>
                Qty: <strong class="text-gray-200">{{ primaryItem?.quantity || 1 }}</strong>
              </p>
            </div>
          </div>

          <!-- Total Determined Cost Badge -->
          <div class="text-right shrink-0">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Determined Cost</span>
            <span class="text-base sm:text-lg font-black text-lime-400 drop-shadow-[0_0_8px_rgba(183,243,74,0.3)]">
              ${{ totalAmount.toFixed(2) }}
            </span>
            <span class="block text-[10px] font-semibold text-gray-400">
              ≈ {{ khrAmount.toLocaleString() }} ៛
            </span>
          </div>
        </div>

        <!-- Modal Body Content -->
        <div class="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <!-- ================= STEP 1: FILL CUSTOMER DETAILS ================= -->
          <div v-if="step === 1" class="space-y-4">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-4">
              <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h4 class="text-xs font-black uppercase tracking-wider text-lime-400 flex items-center gap-2">
                  <span>📍 Customer Delivery Information</span>
                </h4>
                <span class="text-[11px] text-gray-400">* Required</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <!-- Full Name -->
                <div>
                  <label class="block font-bold text-gray-300 text-[11px] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    v-model="customerForm.name"
                    type="text"
                    placeholder="e.g. Rothana Cheng"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2.5 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition"
                  />
                  <p v-if="submittedStep1 && !customerForm.name.trim()" class="text-[10px] text-red-400 mt-1">
                    Please enter your name
                  </p>
                </div>

                <!-- Phone Number -->
                <div>
                  <label class="block font-bold text-gray-300 text-[11px] mb-1">
                    Phone Number (Telegram / Mobile) *
                  </label>
                  <input
                    v-model="customerForm.phone"
                    type="tel"
                    placeholder="e.g. 012 345 678"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2.5 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition"
                  />
                  <p v-if="submittedStep1 && !customerForm.phone.trim()" class="text-[10px] text-red-400 mt-1">
                    Please enter your phone number
                  </p>
                </div>

                <!-- City / Province -->
                <div>
                  <label class="block font-bold text-gray-300 text-[11px] mb-1">
                    City / Province *
                  </label>
                  <select
                    v-model="customerForm.city"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2.5 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition"
                  >
                    <option value="Phnom Penh">Phnom Penh (Express 1-2 Days)</option>
                    <option value="Siem Reap">Siem Reap</option>
                    <option value="Battambang">Battambang</option>
                    <option value="Sihanoukville">Sihanoukville</option>
                    <option value="Kampot">Kampot</option>
                    <option value="Kandal">Kandal</option>
                    <option value="Other Province">Other Provinces</option>
                  </select>
                </div>

                <!-- Delivery Address -->
                <div>
                  <label class="block font-bold text-gray-300 text-[11px] mb-1">
                    Street Address / House No. *
                  </label>
                  <input
                    v-model="customerForm.address"
                    type="text"
                    placeholder="e.g. #14, Street 271, Boeng Tumpun"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2.5 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition"
                  />
                  <p v-if="submittedStep1 && !customerForm.address.trim()" class="text-[10px] text-red-400 mt-1">
                    Please enter your address
                  </p>
                </div>

                <!-- Delivery Notes -->
                <div class="sm:col-span-2">
                  <label class="block font-bold text-gray-300 text-[11px] mb-1">
                    Order Note / Delivery Instructions (Optional)
                  </label>
                  <input
                    v-model="customerForm.note"
                    type="text"
                    placeholder="e.g. Call before arrival, leave at reception"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2.5 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <!-- Price Breakdown Review -->
            <div class="rounded-2xl border border-white/10 bg-neutral-950 p-4 text-xs space-y-2">
              <div class="flex justify-between text-gray-400">
                <span>Item Subtotal</span>
                <span class="font-bold text-white">${{ totalAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>Shipping & Handling</span>
                <span class="font-bold text-emerald-400">FREE</span>
              </div>
              <div class="border-t border-white/10 pt-2 flex justify-between items-baseline">
                <span class="font-black uppercase tracking-wider text-white">Determined Total</span>
                <div class="text-right">
                  <span class="text-lg font-black text-lime-400">${{ totalAmount.toFixed(2) }}</span>
                  <span class="block text-[10px] text-gray-400">≈ {{ khrAmount.toLocaleString() }} KHR</span>
                </div>
              </div>
            </div>

            <!-- Next Button to Step 2 -->
            <button
              type="button"
              @click="goToPaymentStep"
              class="w-full flex items-center justify-center gap-2 rounded-2xl bg-lime-400 px-6 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_25px_rgba(183,243,74,0.4)] active:scale-98"
            >
              <span>Continue to Payment (Choose Card or QR)</span>
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <!-- ================= STEP 2: CHOOSE PAYMENT METHOD (CARD OR QR) ================= -->
          <div v-else-if="step === 2" class="space-y-5">
            <!-- Payment Method Selector Tabs -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-black uppercase tracking-wider text-gray-300">
                  Select Payment Method
                </span>
                <button
                  type="button"
                  @click="step = 1"
                  class="text-[11px] font-bold text-lime-400 hover:underline flex items-center gap-1"
                >
                  &larr; Edit Address
                </button>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <!-- Tab: KHQR -->
                <button
                  type="button"
                  @click="selectedMethod = 'khqr'"
                  class="relative flex flex-col items-center justify-center rounded-2xl border-2 p-3.5 font-bold transition text-center"
                  :class="
                    selectedMethod === 'khqr'
                      ? 'border-red-500 bg-red-500/15 text-white ring-2 ring-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  "
                >
                  <span class="text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded tracking-wide mb-1 shadow-xs">
                    KHQR
                  </span>
                  <span class="text-xs font-black">Bakong / KHQR</span>
                  <span class="text-[10px] text-gray-400">Scan Banking QR</span>
                  <div
                    v-if="selectedMethod === 'khqr'"
                    class="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"
                  ></div>
                </button>

                <!-- Tab: Card -->
                <button
                  type="button"
                  @click="selectedMethod = 'card'"
                  class="relative flex flex-col items-center justify-center rounded-2xl border-2 p-3.5 font-bold transition text-center"
                  :class="
                    selectedMethod === 'card'
                      ? 'border-lime-400 bg-lime-400/15 text-white ring-2 ring-lime-400/30 shadow-[0_0_20px_rgba(183,243,74,0.25)]'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  "
                >
                  <span class="text-xl mb-0.5">💳</span>
                  <span class="text-xs font-black">Credit / Debit Card</span>
                  <span class="text-[10px] text-gray-400">Visa / Mastercard</span>
                  <div
                    v-if="selectedMethod === 'card'"
                    class="absolute top-2 right-2 h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_8px_#b7f34a]"
                  ></div>
                </button>
              </div>
            </div>

            <!-- ----------------- OPTION A: KHQR PAYMENT ----------------- -->
            <div v-if="selectedMethod === 'khqr'" class="space-y-4">
              <!-- Determined Cost Callout Banner -->
              <div class="rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/70 via-red-900/40 to-neutral-900 p-4 text-center shadow-inner">
                <span class="text-[10px] font-black uppercase tracking-widest text-red-400">
                  🎯 Determined Cost for this Product
                </span>
                <div class="flex items-baseline justify-center gap-2 mt-1">
                  <span class="text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                    ${{ totalAmount.toFixed(2) }}
                  </span>
                  <span class="text-sm font-bold text-red-300">
                    ≈ {{ khrAmount.toLocaleString() }} ៛
                  </span>
                </div>
                <p class="text-[11px] text-gray-300 mt-1 max-w-sm mx-auto">
                  Scan with Bakong, ABA, ACLEDA or any banking app. The exact determined price has been set for this purchase.
                </p>
              </div>

              <!-- Bank network quick tabs -->
              <div class="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  v-for="net in networks"
                  :key="net.id"
                  type="button"
                  @click="selectedNetwork = net.id"
                  class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold transition whitespace-nowrap text-[11px]"
                  :class="
                    selectedNetwork === net.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-neutral-800 text-gray-400 hover:text-white'
                  "
                >
                  <span>{{ net.icon }}</span>
                  <span>{{ net.name }}</span>
                </button>
              </div>

              <!-- Authentic QR Display Card -->
              <div class="flex flex-col items-center rounded-2xl border border-neutral-800 bg-white p-5 text-neutral-900 shadow-inner">
                <!-- Merchant Title -->
                <div class="text-center mb-3">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Official Merchant</span>
                  <h4 class="text-base font-black text-black">CHENG ROTANA</h4>
                  <p class="text-xs text-gray-500">Bakong Account · KHQR</p>
                </div>

                <!-- Authentic Real KHQR Image -->
                <div class="relative flex items-center justify-center rounded-2xl bg-white p-2 border-2 border-gray-200 shadow-md max-w-[220px] sm:max-w-[240px] overflow-hidden">
                  <img
                    src="/images/khqr.png"
                    alt="CHENG ROTANA KHQR"
                    class="w-full h-auto object-contain rounded-xl"
                  />

                  <!-- Live scan laser animation line -->
                  <div
                    v-if="!paymentSuccess && isVerifying"
                    class="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ef4444] animate-pulse"
                    style="top: 50%"
                  ></div>
                </div>

                <!-- Expiration Countdown Bar -->
                <div class="mt-3 w-full max-w-xs">
                  <div class="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span>QR active for</span>
                    <span class="font-mono font-bold text-red-600">{{ formattedCountdown }}</span>
                  </div>
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      class="h-full bg-red-500 transition-all duration-1000"
                      :style="{ width: `${(countdown / 300) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Copy Amount and Merchant info -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  @click="copyExactAmount"
                  class="rounded-xl border border-white/15 bg-white/5 py-2.5 text-center font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  {{ copiedAmount ? "✓ Copied!" : `📋 Copy $${totalAmount.toFixed(2)}` }}
                </button>
                <button
                  type="button"
                  @click="copyMerchant"
                  class="rounded-xl border border-white/15 bg-white/5 py-2.5 text-center font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  {{ copiedMerchant ? "✓ Copied!" : "📋 Copy Merchant" }}
                </button>
              </div>

              <!-- Action Confirmation Button -->
              <button
                type="button"
                @click="processPayment('khqr')"
                :disabled="isVerifying || paymentSuccess"
                class="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>⚡ I Have Paid (${{ totalAmount.toFixed(2) }}) — Confirm Order</span>
              </button>
            </div>

            <!-- ----------------- OPTION B: CREDIT / DEBIT CARD PAYMENT ----------------- -->
            <div v-else class="space-y-4">
              <!-- Visual Card Preview -->
              <div class="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-tr from-[#111625] via-[#1a2035] to-[#0c1220] p-5 shadow-2xl text-white">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-black uppercase tracking-widest text-lime-400">365 SECURE PAY</span>
                  <span class="text-sm font-black tracking-widest">VISA / MC</span>
                </div>

                <div class="my-5">
                  <span class="font-mono text-base sm:text-lg tracking-widest text-gray-200">
                    {{ formattedCardNumber || '•••• •••• •••• ••••' }}
                  </span>
                </div>

                <div class="flex items-center justify-between text-xs">
                  <div>
                    <span class="text-[9px] uppercase tracking-wider text-gray-400 block">Card Holder</span>
                    <span class="font-bold tracking-wide uppercase truncate max-w-[150px] block">
                      {{ cardForm.name || customerForm.name || 'YOUR NAME' }}
                    </span>
                  </div>
                  <div class="text-right">
                    <span class="text-[9px] uppercase tracking-wider text-gray-400 block">Expires</span>
                    <span class="font-mono font-bold">{{ cardForm.expiry || 'MM/YY' }}</span>
                  </div>
                </div>
              </div>

              <!-- Card Form Inputs -->
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 text-xs">
                <div>
                  <label class="block font-bold text-gray-300 text-[11px] mb-1">
                    Cardholder Name *
                  </label>
                  <input
                    v-model="cardForm.name"
                    type="text"
                    placeholder="e.g. Rothana Cheng"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2.5 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition"
                  />
                </div>

                <div>
                  <label class="block font-bold text-gray-300 text-[11px] mb-1">
                    Card Number (16 Digits) *
                  </label>
                  <input
                    v-model="cardForm.number"
                    type="text"
                    maxlength="19"
                    placeholder="4242 •••• •••• 4242"
                    @input="handleCardNumberInput"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2.5 font-mono text-white placeholder-gray-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block font-bold text-gray-300 text-[11px] mb-1">
                      Expiry Date *
                    </label>
                    <input
                      v-model="cardForm.expiry"
                      type="text"
                      maxlength="5"
                      placeholder="MM/YY"
                      @input="handleExpiryInput"
                      class="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2.5 font-mono text-white placeholder-gray-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition text-center"
                    />
                  </div>

                  <div>
                    <label class="block font-bold text-gray-300 text-[11px] mb-1">
                      Security Code (CVC) *
                    </label>
                    <input
                      v-model="cardForm.cvc"
                      type="password"
                      maxlength="4"
                      placeholder="•••"
                      class="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2.5 font-mono text-white placeholder-gray-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition text-center"
                    />
                  </div>
                </div>

                <div class="pt-2 text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                  <svg class="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
                </div>
              </div>

              <!-- Action Card Button -->
              <button
                type="button"
                @click="processPayment('card')"
                :disabled="isVerifying || paymentSuccess"
                class="w-full flex items-center justify-center gap-2 rounded-2xl bg-lime-400 px-6 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_25px_rgba(183,243,74,0.4)] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>💳 Pay ${{ totalAmount.toFixed(2) }} USD with Card</span>
              </button>
            </div>

            <!-- Processing / Verification State Banner -->
            <div
              v-if="isVerifying"
              class="rounded-2xl border border-lime-400/40 bg-lime-400/10 p-4 text-center text-sm font-semibold text-lime-300 animate-pulse"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="h-5 w-5 animate-spin text-lime-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ verifyStatusText }}</span>
              </div>
            </div>

            <!-- Success State Banner -->
            <div
              v-else-if="paymentSuccess"
              class="rounded-2xl border border-emerald-400 bg-emerald-500/20 p-5 text-center text-white"
            >
              <div class="flex flex-col items-center justify-center gap-2">
                <span class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-black text-2xl font-bold">
                  ✓
                </span>
                <p class="font-black text-lg text-emerald-300">Payment Confirmed!</p>
                <p class="text-xs text-gray-200">
                  Your order has been recorded. Redirecting to official receipt...
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Bottom Footer Bar -->
        <div class="bg-neutral-950 border-t border-white/10 px-6 py-3 flex items-center justify-between text-xs text-gray-400">
          <div class="flex items-center gap-2 text-[11px]">
            <span class="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>365 Sports Official Instant Store</span>
          </div>

          <button
            type="button"
            @click="handleClose"
            class="text-[11px] font-bold text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";
import { useQrPayment } from "~/composables/useQrPayment";
import { useToast } from "~/composables/useToast";
import { useCart } from "~/composables/useCart";
import { navigateTo } from "#app/composables/router";

const { isQrOpen, currentQrPayload, closeQrPayment } = useQrPayment();
const { success, error } = useToast();
const { clearCart } = useCart();

// Flow Steps: 1 = Customer Details, 2 = Payment Method (Card or QR)
const step = ref<1 | 2>(1);
const submittedStep1 = ref(false);
const selectedMethod = ref<"khqr" | "card">("khqr");

// Bank networks
const selectedNetwork = ref("bakong");
const networks = [
  { id: "bakong", name: "Bakong / KHQR", icon: "🇰🇭" },
  { id: "aba", name: "ABA PAY", icon: "🟦" },
  { id: "acleda", name: "ACLEDA", icon: "🟡" },
  { id: "wing", name: "Wing Bank", icon: "🟢" },
];

// Customer Info Form
const customerForm = ref({
  name: "",
  phone: "",
  address: "",
  city: "Phnom Penh",
  note: "",
});

// Card Payment Form
const cardForm = ref({
  name: "",
  number: "",
  expiry: "",
  cvc: "",
});

const formattedCardNumber = computed(() => {
  return cardForm.value.number;
});

const handleCardNumberInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  let val = input.value.replace(/\D/g, "").substring(0, 16);
  val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
  cardForm.value.number = val;
};

const handleExpiryInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  let val = input.value.replace(/\D/g, "").substring(0, 4);
  if (val.length >= 3) {
    val = val.substring(0, 2) + "/" + val.substring(2);
  }
  cardForm.value.expiry = val;
};

// Item summaries
const primaryItem = computed(() => {
  return currentQrPayload.value?.items?.[0] || null;
});

const totalAmount = computed(() => {
  return currentQrPayload.value?.total || 0;
});

const khrAmount = computed(() => {
  return Math.round(totalAmount.value * 4100);
});

// Validation
const isCustomerValid = computed(() => {
  return (
    customerForm.value.name.trim().length > 0 &&
    customerForm.value.phone.trim().length > 0 &&
    customerForm.value.address.trim().length > 0
  );
});

const goToPaymentStep = () => {
  submittedStep1.value = true;
  if (!isCustomerValid.value) {
    error("Missing details", "Please enter your name, phone number, and address.");
    return;
  }
  // Auto-fill cardholder name if empty
  if (!cardForm.value.name) {
    cardForm.value.name = customerForm.value.name;
  }
  step.value = 2;
};

// Countdown Timer for QR
const countdown = ref(300);
let timerInterval: ReturnType<typeof setInterval> | null = null;

const startTimer = () => {
  countdown.value = 300;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }, 1000);
};

const formattedCountdown = computed(() => {
  const m = Math.floor(countdown.value / 60);
  const s = countdown.value % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
});

// Reset on Modal Open
watch(isQrOpen, (open) => {
  if (open) {
    paymentSuccess.value = false;
    isVerifying.value = false;
    submittedStep1.value = false;
    step.value = 1;
    selectedMethod.value = "khqr";
    startTimer();

    // Populate form if payload has customer
    if (currentQrPayload.value?.customer) {
      customerForm.value = {
        name: currentQrPayload.value.customer.name || "",
        phone: currentQrPayload.value.customer.phone || "",
        address: currentQrPayload.value.customer.address || "",
        city: "Phnom Penh",
        note: "",
      };
      if (customerForm.value.name && customerForm.value.phone && customerForm.value.address) {
        step.value = 2;
      }
    }
  } else {
    if (timerInterval) clearInterval(timerInterval);
  }
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const handleClose = () => {
  closeQrPayment();
};

// Copy helper
const copiedAmount = ref(false);
const copyExactAmount = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(`${totalAmount.value.toFixed(2)} USD`);
    copiedAmount.value = true;
    setTimeout(() => {
      copiedAmount.value = false;
    }, 2000);
  }
};

const copiedMerchant = ref(false);
const copyMerchant = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText("CHENG ROTANA (Bakong / KHQR)");
    copiedMerchant.value = true;
    setTimeout(() => {
      copiedMerchant.value = false;
    }, 2000);
  }
};

// Payment processing simulation
const isVerifying = ref(false);
const verifyStatusText = ref("");
const paymentSuccess = ref(false);

const processPayment = (method: "khqr" | "card") => {
  if (!isCustomerValid.value) {
    step.value = 1;
    error("Missing details", "Please complete your delivery details first.");
    return;
  }

  if (method === "card") {
    if (!cardForm.value.number || cardForm.value.number.replace(/\s/g, "").length < 15) {
      error("Card Number Required", "Please enter a valid 16-digit card number.");
      return;
    }
    if (!cardForm.value.expiry || cardForm.value.expiry.length < 5) {
      error("Expiry Date Required", "Please enter MM/YY.");
      return;
    }
    if (!cardForm.value.cvc || cardForm.value.cvc.length < 3) {
      error("CVC Required", "Please enter 3-digit security code.");
      return;
    }
  }

  isVerifying.value = true;
  verifyStatusText.value =
    method === "khqr"
      ? `Connecting to Bakong Gateway for $${totalAmount.value.toFixed(2)}...`
      : `Authorizing $${totalAmount.value.toFixed(2)} charge with Card Issuer...`;

  setTimeout(() => {
    verifyStatusText.value =
      method === "khqr"
        ? "Payment signal detected! Verifying exact transfer amount..."
        : "Card 3D-Secure verified! Confirming transaction...";
  }, 1200);

  setTimeout(() => {
    verifyStatusText.value = "Payment confirmed! Generating official order receipt...";
  }, 2300);

  setTimeout(() => {
    isVerifying.value = false;
    paymentSuccess.value = true;
    success(
      "Payment Received!",
      `Order confirmed via ${method === "khqr" ? "KHQR / Bakong" : "Credit Card"}.`
    );

    // Build Order Record
    const orderId = "365-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const finalCustomer = {
      name: customerForm.value.name,
      phone: customerForm.value.phone,
      email: `${customerForm.value.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
      address: `${customerForm.value.address}, ${customerForm.value.city}`,
    };

    const orderRecord = {
      id: orderId,
      customer: finalCustomer.name,
      phone: finalCustomer.phone,
      email: finalCustomer.email,
      address: finalCustomer.address,
      items: currentQrPayload.value?.items || [],
      subtotal: currentQrPayload.value?.subtotal || totalAmount.value,
      shipping: currentQrPayload.value?.shipping || 0,
      tax: currentQrPayload.value?.tax || 0,
      total: totalAmount.value,
      khrTotal: khrAmount.value,
      status: "Processing",
      paymentStatus: "Paid",
      paymentMethod:
        method === "khqr"
          ? `KHQR / Bakong (${selectedNetwork.value.toUpperCase()})`
          : "Credit Card (Visa/Mastercard)",
      date: new Date().toISOString(),
    };

    // Save to LocalStorage
    if (typeof window !== "undefined") {
      try {
        const existingOrders = JSON.parse(localStorage.getItem("365_orders") || "[]");
        existingOrders.unshift(orderRecord);
        localStorage.setItem("365_orders", JSON.stringify(existingOrders));
        localStorage.setItem("last_order", JSON.stringify(orderRecord));
      } catch (e) {
        console.error("Storage error:", e);
      }
    }

    // Clear cart if items matched
    clearCart();

    // Close modal and navigate to Order Receipt
    setTimeout(() => {
      closeQrPayment();
      navigateTo(`/Order/${orderId}`);
    }, 1200);
  }, 3200);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(183, 243, 74, 0.3);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(183, 243, 74, 0.6);
}
</style>
