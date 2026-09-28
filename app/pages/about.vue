<template>
  <div class="relative text-white min-h-screen pb-20">
    <!-- ================= HERO SECTION ================= -->
    <section class="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      <!-- Ambient Glow Behind Hero -->
      <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-lime-400/15 blur-[120px]"></div>
      <div class="pointer-events-none absolute top-40 right-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]"></div>

      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Hero Text (7 cols) -->
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-lime-400 shadow-[0_0_15px_rgba(183,243,74,0.2)]">
              <span class="h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
              BEYOND LIMITS · 365 SPORT BRAND STORY
            </div>

            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05]">
              Engineered For The
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-cyan-400 drop-shadow-[0_0_25px_rgba(183,243,74,0.3)]">
                Unstoppable.
              </span>
            </h1>

            <p class="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Welcome to <strong class="text-white">365 Sport</strong> — Cambodia’s premier powerhouse for authentic high-performance footwear, sportswear, and championship gear. Born in Phnom Penh, crafted for athletes who push boundaries 365 days a year.
            </p>

            <!-- Dual Action CTAs -->
            <div class="pt-2 flex flex-col sm:flex-row gap-4">
              <NuxtLink
                to="/Product"
                class="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-lime-400 px-8 py-4 font-black uppercase tracking-wider text-black shadow-lg shadow-lime-400/25 transition hover:bg-lime-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(183,243,74,0.5)] active:scale-95"
              >
                <span>Explore Gear</span>
                <span class="text-lg">&rarr;</span>
              </NuxtLink>

              <NuxtLink
                to="/contact"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20 hover:border-lime-400/50 active:scale-95"
              >
                <span>Contact Team</span>
              </NuxtLink>
            </div>

            <!-- Quick Trust Badges -->
            <div class="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-400 border-t border-white/10">
              <div class="flex items-center gap-2">
                <span class="text-lime-400 font-black text-sm">✓</span>
                <span>100% Genuine Brands</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-cyan-400 font-black text-sm">⚡</span>
                <span>Bakong KHQR & Card Pay</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-400 font-black text-sm">🚚</span>
                <span>Express Nationwide Shipping</span>
              </div>
            </div>
          </div>

          <!-- Hero Visual Collage (5 cols) -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              <!-- Main Athletic Visual -->
              <div class="relative overflow-hidden rounded-3xl border border-white/20 bg-[#0d1017]/80 p-2 shadow-2xl backdrop-blur-xl">
                <img
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000&auto=format&fit=crop"
                  alt="365 Sport Champion Athlete"
                  class="h-[460px] w-full rounded-2xl object-cover transition-transform duration-700 hover:scale-105"
                />
                <div class="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <!-- Floating Trophy Tag Inside Image -->
                <div class="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-black/80 p-4 backdrop-blur-xl shadow-xl">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-[10px] font-black uppercase tracking-widest text-lime-400">Headquarters</span>
                      <h4 class="text-sm font-black text-white">Phnom Penh Flagship</h4>
                      <p class="text-[11px] text-gray-400">ETEC Center, Street 271</p>
                    </div>
                    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black text-xl font-black shadow-[0_0_15px_rgba(183,243,74,0.4)]">
                      365
                    </span>
                  </div>
                </div>
              </div>

              <!-- Orbiting Cyber Badge -->
              <div class="absolute -top-5 -right-5 hidden sm:flex items-center gap-3 rounded-2xl border border-white/20 bg-[#0d1017]/90 px-4 py-3 backdrop-blur-xl shadow-2xl animate-bounce" style="animation-duration: 4s;">
                <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-400 text-base">
                  ⚡
                </span>
                <div>
                  <p class="text-xs font-black text-white">Speed & Passion</p>
                  <p class="text-[10px] text-gray-400">Since Day One</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= HIGH-VOLTAGE STATS STRIP ================= -->
    <section class="border-y border-white/10 bg-black/60 backdrop-blur-xl">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div class="p-4 rounded-2xl border border-white/5 bg-white/5 transition hover:border-lime-400/40 hover:-translate-y-1">
            <h3 class="text-3xl sm:text-5xl font-black text-lime-400 drop-shadow-[0_0_15px_rgba(183,243,74,0.3)]">
              500+
            </h3>
            <p class="mt-1.5 text-xs font-bold uppercase tracking-wider text-white">Authentic Products</p>
            <p class="text-[11px] text-gray-400 mt-0.5">Nike, Adidas, Puma, Under Armour</p>
          </div>

          <div class="p-4 rounded-2xl border border-white/5 bg-white/5 transition hover:border-cyan-400/40 hover:-translate-y-1">
            <h3 class="text-3xl sm:text-5xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              10K+
            </h3>
            <p class="mt-1.5 text-xs font-bold uppercase tracking-wider text-white">Athletes Powered</p>
            <p class="text-[11px] text-gray-400 mt-0.5">Active across Cambodia</p>
          </div>

          <div class="p-4 rounded-2xl border border-white/5 bg-white/5 transition hover:border-purple-400/40 hover:-translate-y-1">
            <h3 class="text-3xl sm:text-5xl font-black text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              1-2 Days
            </h3>
            <p class="mt-1.5 text-xs font-bold uppercase tracking-wider text-white">Express Delivery</p>
            <p class="text-[11px] text-gray-400 mt-0.5">Phnom Penh & 24 Provinces</p>
          </div>

          <div class="p-4 rounded-2xl border border-white/5 bg-white/5 transition hover:border-red-500/40 hover:-translate-y-1">
            <h3 class="text-3xl sm:text-5xl font-black text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              100%
            </h3>
            <p class="mt-1.5 text-xs font-bold uppercase tracking-wider text-white">Genuine Guarantee</p>
            <p class="text-[11px] text-gray-400 mt-0.5">Direct official distribution</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= WHO WE ARE / BRAND MISSION ================= -->
    <section class="py-20 sm:py-28 relative">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <!-- Visual Left -->
          <div class="relative">
            <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1017] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop"
                alt="365 Running Track"
                class="h-[440px] w-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-transparent to-transparent"></div>
            </div>

            <!-- Floating Accent Badge -->
            <div class="absolute -bottom-6 -right-2 sm:right-6 rounded-2xl border border-white/20 bg-[#0d1017]/95 p-5 shadow-2xl backdrop-blur-xl">
              <div class="flex items-center gap-3">
                <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400 text-black text-2xl font-black shadow-[0_0_15px_rgba(183,243,74,0.4)]">
                  ⚡
                </span>
                <div>
                  <p class="text-xs font-black uppercase tracking-wider text-lime-400">Our DNA</p>
                  <p class="text-base font-black text-white">Built for Champions</p>
                  <p class="text-[11px] text-gray-400">365 Days a Year</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Mission Right Content -->
          <div class="space-y-6">
            <div class="flex items-center gap-2">
              <span class="h-5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_10px_#b7f34a]"></span>
              <span class="text-xs font-black uppercase tracking-widest text-lime-400">Our Mission</span>
            </div>

            <h2 class="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Empowering Athletes, <br />
              <span class="text-lime-400">Elevating Game.</span>
            </h2>

            <div class="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                At 365 Sport, we believe athletic drive is more than winning games — it is discipline, health, endurance, and camaraderie. Whether you are sprint training at Morodok Techo Stadium, scoring goals on local turf, or pursuing fitness at the gym, the right gear makes all the difference.
              </p>
              <p>
                We bridge international sportswear excellence with seamless local purchasing in Cambodia. From instant Bakong KHQR payments to rapid door-to-door delivery, we make world-class gear accessible to everyone.
              </p>
            </div>

            <!-- Core Pillars Checklist -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-lime-400 text-black text-xs font-black">✓</span>
                <div>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wide">100% Authentic</h4>
                  <p class="text-[11px] text-gray-400 mt-0.5">Strict quality & brand origin verification.</p>
                </div>
              </div>

              <div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-lime-400 text-black text-xs font-black">⚡</span>
                <div>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wide">Instant Checkout</h4>
                  <p class="text-[11px] text-gray-400 mt-0.5">Scan KHQR or swipe Card in seconds.</p>
                </div>
              </div>

              <div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-lime-400 text-black text-xs font-black">🚚</span>
                <div>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wide">Rapid Shipping</h4>
                  <p class="text-[11px] text-gray-400 mt-0.5">Same-day packaging across Cambodia.</p>
                </div>
              </div>

              <div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-lime-400 text-black text-xs font-black">🤝</span>
                <div>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wide">Athlete Guidance</h4>
                  <p class="text-[11px] text-gray-400 mt-0.5">Tailored size & turf boot consultations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= WHY CHOOSE 365 SPORT ================= -->
    <section class="py-20 bg-neutral-950/60 border-t border-white/10 relative">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-black uppercase tracking-widest text-lime-400 block mb-2">The 365 Standard</span>
          <h2 class="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Why Athletes Trust Us
          </h2>
          <p class="mt-2 text-xs sm:text-sm text-gray-400">
            Engineered with high standards for speed, precision, and authentic sports lifestyle.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Card 1 -->
          <div class="group rounded-3xl border border-white/10 bg-[#0d1017]/85 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-lime-400/50 hover:shadow-[0_0_30px_rgba(183,243,74,0.15)]">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 border border-lime-400/30 text-lime-400 text-2xl font-black transition group-hover:bg-lime-400 group-hover:text-black">
              🏆
            </div>
            <h3 class="mt-6 text-base font-bold text-white uppercase tracking-wide">Elite Curation</h3>
            <p class="mt-2 text-xs text-gray-400 leading-relaxed">
              Every sneaker, cleat, and apparel piece is selected for championship-grade durability, breathability, and grip.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="group rounded-3xl border border-white/10 bg-[#0d1017]/85 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-2xl font-black transition group-hover:bg-cyan-400 group-hover:text-black">
              ⚡
            </div>
            <h3 class="mt-6 text-base font-bold text-white uppercase tracking-wide">Bakong KHQR Integrated</h3>
            <p class="mt-2 text-xs text-gray-400 leading-relaxed">
              Seamlessly scan with ABA, ACLEDA, Wing, or Bakong. Exact determined product cost with 0 transaction fees.
            </p>
          </div>

          <!-- Card 3 -->
          <div class="group rounded-3xl border border-white/10 bg-[#0d1017]/85 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 border border-purple-400/30 text-purple-400 text-2xl font-black transition group-hover:bg-purple-400 group-hover:text-black">
              🚚
            </div>
            <h3 class="mt-6 text-base font-bold text-white uppercase tracking-wide">Fast Track Logistics</h3>
            <p class="mt-2 text-xs text-gray-400 leading-relaxed">
              Live order tracking timeline from packing to door delivery. 1-2 days across Phnom Penh, 2-3 days nationwide.
            </p>
          </div>

          <!-- Card 4 -->
          <div class="group rounded-3xl border border-white/10 bg-[#0d1017]/85 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-2xl font-black transition group-hover:bg-red-500 group-hover:text-white">
              🔄
            </div>
            <h3 class="mt-6 text-base font-bold text-white uppercase tracking-wide">Size Exchange Guarantee</h3>
            <p class="mt-2 text-xs text-gray-400 leading-relaxed">
              Boot doesn't fit? We offer smooth size exchanges within 7 days at our showroom or via courier service.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= BRAND PARTNERS CAROUSEL / GRID ================= -->
    <section class="py-16 border-t border-white/10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <span class="text-[11px] font-black uppercase tracking-widest text-gray-400 block mb-6">
          Authorized Distribution & Iconic Brands
        </span>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div class="rounded-2xl border border-white/10 bg-white/5 py-4 px-6 flex items-center justify-center font-black tracking-widest text-gray-300 transition hover:border-lime-400 hover:text-white hover:bg-white/10">
            NIKE
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 py-4 px-6 flex items-center justify-center font-black tracking-widest text-gray-300 transition hover:border-lime-400 hover:text-white hover:bg-white/10">
            ADIDAS
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 py-4 px-6 flex items-center justify-center font-black tracking-widest text-gray-300 transition hover:border-lime-400 hover:text-white hover:bg-white/10">
            PUMA
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 py-4 px-6 flex items-center justify-center font-black tracking-widest text-gray-300 transition hover:border-lime-400 hover:text-white hover:bg-white/10">
            UNDER ARMOUR
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 py-4 px-6 flex items-center justify-center font-black tracking-widest text-gray-300 transition hover:border-lime-400 hover:text-white hover:bg-white/10">
            JORDAN
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 py-4 px-6 flex items-center justify-center font-black tracking-widest text-gray-300 transition hover:border-lime-400 hover:text-white hover:bg-white/10">
            NEW BALANCE
          </div>
        </div>
      </div>
    </section>

    <!-- ================= VISIT SHOWROOM MAP ================= -->
    <section class="py-16 border-t border-white/10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="h-5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]"></span>
              <span class="text-xs font-black uppercase tracking-widest text-cyan-400">Physical Store</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              Visit Our Flagship Store
            </h2>
            <p class="text-xs sm:text-sm text-gray-400 mt-1">
              Experience the gear in person at our Phnom Penh center.
            </p>
          </div>

          <div class="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-gray-200">
            <span class="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Open Today: 8:00 AM – 9:00 PM</span>
          </div>
        </div>

        <!-- Map Container -->
        <div class="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0d1017] shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4667.214145069196!2d104.88799717573434!3d11.562217244207105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951adb4d4041d%3A0x8a90e729f62ad800!2sETEC%20Center!5e1!3m2!1sen!2skh!4v1788167345842!5m2!1sen!2skh"
            class="h-[360px] sm:h-[460px] w-full"
            style="border: 0; filter: invert(90%) hue-rotate(180deg) contrast(1.1);"
            allowfullscreen
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>

          <!-- Location Details Float Card -->
          <div class="sm:absolute bottom-6 left-6 m-4 sm:m-0 rounded-2xl border border-white/20 bg-black/90 p-5 backdrop-blur-xl shadow-2xl max-w-sm">
            <h4 class="text-sm font-black text-white uppercase">365 Sport Flagship Store</h4>
            <p class="text-xs text-gray-300 mt-1">
              #14, Street 271 (Near ETEC Center), Sangkat Boeng Tumpun, Khan Mean Chey, Phnom Penh, Cambodia.
            </p>
            <div class="mt-3 flex items-center gap-3 text-xs">
              <a
                href="https://maps.google.com"
                target="_blank"
                class="rounded-xl bg-lime-400 px-4 py-2 font-black text-black transition hover:bg-lime-300 uppercase tracking-wider text-[11px]"
              >
                Get Directions &rarr;
              </a>
              <a
                href="tel:+85512345678"
                class="rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-bold text-white transition hover:bg-white/20 text-[11px]"
              >
                📞 Call Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= HIGH-VOLTAGE CALL TO ACTION ================= -->
    <section class="mt-12 mx-4 sm:mx-8">
      <div class="mx-auto max-w-7xl relative overflow-hidden rounded-3xl border border-lime-400/40 bg-gradient-to-r from-[#0d1017] via-neutral-900 to-[#121c10] p-8 sm:p-14 text-center shadow-[0_0_50px_rgba(183,243,74,0.15)]">
        <div class="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-lime-400/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"></div>

        <div class="relative max-w-2xl mx-auto space-y-4">
          <span class="inline-block rounded-full bg-lime-400/10 border border-lime-400/30 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-lime-400">
            Start Your Journey
          </span>
          <h2 class="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Ready to Play at Your <span class="text-lime-400">Peak?</span>
          </h2>
          <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Upgrade your sports gear today with fast delivery, authentic warranties, and instant KHQR or Card checkout.
          </p>

          <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <NuxtLink
              to="/Product"
              class="w-full sm:w-auto rounded-2xl bg-lime-400 px-8 py-4 font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:scale-105 active:scale-95 shadow-lg shadow-lime-400/30"
            >
              Shop All Products &rarr;
            </NuxtLink>

            <NuxtLink
              to="/contact"
              class="w-full sm:w-auto rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            >
              Contact Support
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "user",
});
</script>