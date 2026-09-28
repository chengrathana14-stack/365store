<template>
  <div class="relative text-white min-h-screen pb-20">
    <!-- Ambient Background Glows -->
    <div class="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-lime-400/10 blur-[130px]"></div>
    <div class="pointer-events-none absolute top-72 right-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]"></div>

    <!-- ================= HERO SECTION ================= -->
    <section class="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden text-center">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
        <div class="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-lime-400 shadow-[0_0_15px_rgba(183,243,74,0.2)]">
          <span class="h-2 w-2 rounded-full bg-lime-400 animate-ping"></span>
          24/7 ATHLETE SUPPORT HUB
        </div>

        <h1 class="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight">
          We're Here To Keep You <br class="hidden sm:inline" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-cyan-400 drop-shadow-[0_0_20px_rgba(183,243,74,0.3)]">
            Moving Forward.
          </span>
        </h1>

        <p class="mx-auto max-w-2xl text-xs sm:text-base text-gray-300 leading-relaxed">
          Questions about football boot sizing, delivery times in Phnom Penh & provinces, or payment verification? Reach out via Telegram, Phone, or direct message below.
        </p>
      </div>
    </section>

    <!-- ================= QUICK REACH CARDS ================= -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Telegram (Most Popular in Cambodia) -->
        <a
          href="https://t.me"
          target="_blank"
          class="group relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-[#0d1017]/85 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
        >
          <div class="flex items-center justify-between">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-400 text-2xl font-black shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              ✈️
            </span>
            <span class="rounded-full bg-cyan-400/10 border border-cyan-400/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-400">
              Fastest
            </span>
          </div>
          <h3 class="mt-4 text-base font-black text-white uppercase tracking-wide group-hover:text-cyan-400 transition">
            Telegram Direct
          </h3>
          <p class="mt-1 text-xs text-gray-400">Response under 5 minutes</p>
          <p class="mt-3 text-sm font-bold text-cyan-300 font-mono">@sport365kh &rarr;</p>
        </a>

        <!-- Card 2: Phone Hotline -->
        <a
          href="tel:+85512345678"
          class="group relative overflow-hidden rounded-3xl border border-lime-400/30 bg-[#0d1017]/85 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-lime-400 hover:shadow-[0_0_30px_rgba(183,243,74,0.2)]"
        >
          <div class="flex items-center justify-between">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/20 text-lime-400 text-2xl font-black shadow-[0_0_15px_rgba(183,243,74,0.3)]">
              📞
            </span>
            <span class="rounded-full bg-lime-400/10 border border-lime-400/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-lime-400">
              Hotline
            </span>
          </div>
          <h3 class="mt-4 text-base font-black text-white uppercase tracking-wide group-hover:text-lime-400 transition">
            Customer Call
          </h3>
          <p class="mt-1 text-xs text-gray-400">Mon - Sun: 8am - 9pm</p>
          <p class="mt-3 text-sm font-bold text-lime-300 font-mono">+855 12 345 678 &rarr;</p>
        </a>

        <!-- Card 3: Email Support -->
        <a
          href="mailto:support@365sport.com"
          class="group relative overflow-hidden rounded-3xl border border-white/15 bg-[#0d1017]/85 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
        >
          <div class="flex items-center justify-between">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/20 text-purple-400 text-2xl font-black shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              ✉️
            </span>
            <span class="rounded-full bg-purple-400/10 border border-purple-400/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-400">
              Official
            </span>
          </div>
          <h3 class="mt-4 text-base font-black text-white uppercase tracking-wide group-hover:text-purple-400 transition">
            Email Support
          </h3>
          <p class="mt-1 text-xs text-gray-400">Orders, receipts, warranties</p>
          <p class="mt-3 text-sm font-bold text-purple-300 font-mono">support@365sport.com &rarr;</p>
        </a>

        <!-- Card 4: Showroom -->
        <a
          href="#map-section"
          class="group relative overflow-hidden rounded-3xl border border-white/15 bg-[#0d1017]/85 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]"
        >
          <div class="flex items-center justify-between">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 text-2xl font-black shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              📍
            </span>
            <span class="rounded-full bg-red-500/10 border border-red-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-400">
              In Person
            </span>
          </div>
          <h3 class="mt-4 text-base font-black text-white uppercase tracking-wide group-hover:text-red-400 transition">
            Flagship Hub
          </h3>
          <p class="mt-1 text-xs text-gray-400">ETEC Center, Street 271</p>
          <p class="mt-3 text-sm font-bold text-red-300 font-mono">Phnom Penh &rarr;</p>
        </a>
      </div>
    </section>

    <!-- ================= MAIN FORM & SIDEBAR SECTION ================= -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- LEFT: Support Overview (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <div class="rounded-3xl border border-white/10 bg-[#0d1017]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
            <!-- Active Status Badge -->
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <div class="flex items-center gap-2.5">
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span class="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Live Support Online
                </span>
              </div>
              <span class="text-[11px] text-gray-400">Avg. Reply: 12 mins</span>
            </div>

            <div>
              <h2 class="text-2xl font-black uppercase text-white tracking-tight">
                Get In Touch With Our Specialists
              </h2>
              <p class="mt-2 text-xs text-gray-300 leading-relaxed">
                Whether you want recommendation on FG/AG studs for artificial turf in Cambodia, size conversion (US/UK/EU), or KHQR payment confirmation, our local team is available every single day.
              </p>
            </div>

            <!-- Quick Action Shortcuts -->
            <div class="space-y-3 pt-2">
              <NuxtLink
                to="/Cart"
                class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs font-bold transition hover:bg-white/10 hover:border-lime-400/40"
              >
                <div class="flex items-center gap-2.5">
                  <span class="text-lime-400 text-base">🛒</span>
                  <span>View Your Active Shopping Bag</span>
                </div>
                <span class="text-lime-400">&rarr;</span>
              </NuxtLink>

              <NuxtLink
                to="/Product"
                class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs font-bold transition hover:bg-white/10 hover:border-cyan-400/40"
              >
                <div class="flex items-center gap-2.5">
                  <span class="text-cyan-400 text-base">⚡</span>
                  <span>Browse Latest Performance Gear</span>
                </div>
                <span class="text-cyan-400">&rarr;</span>
              </NuxtLink>
            </div>

            <!-- Operating Hours -->
            <div class="rounded-2xl border border-white/10 bg-neutral-950 p-4 text-xs space-y-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-lime-400 block">
                Showroom & Courier Schedule
              </span>
              <div class="flex justify-between text-gray-300">
                <span>Monday – Saturday</span>
                <span class="font-bold text-white">8:00 AM – 8:30 PM</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Sunday</span>
                <span class="font-bold text-white">9:00 AM – 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Interactive Cyber Form (7 cols) -->
        <div class="lg:col-span-7">
          <div class="rounded-3xl border border-white/15 bg-[#0d1017]/90 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
            <div class="border-b border-white/10 pb-5">
              <span class="text-[10px] font-black uppercase tracking-widest text-lime-400">
                Send Direct Message
              </span>
              <h2 class="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
                How Can We Help You?
              </h2>
              <p class="text-xs text-gray-400 mt-1">
                Fill in your details below and our team will get back to you promptly.
              </p>
            </div>

            <!-- Success Alert Banner -->
            <div
              v-if="submitted"
              class="mt-6 rounded-2xl border border-emerald-400 bg-emerald-500/15 p-5 text-white"
            >
              <div class="flex items-start gap-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-black font-black text-sm shrink-0">
                  ✓
                </span>
                <div>
                  <h4 class="font-black text-sm text-emerald-300">Message Received!</h4>
                  <p class="text-xs text-gray-200 mt-0.5">
                    Thank you, <strong>{{ lastSubmittedName }}</strong>. Our team has received your message regarding "{{ lastSubmittedSubject }}" and will reach out via {{ lastSubmittedPhone || 'email' }} shortly.
                  </p>
                  <span class="inline-block mt-2 font-mono text-[10px] text-emerald-400 bg-black/40 px-2 py-1 rounded">
                    Ref Ticket: #TICKET-{{ ticketId }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contact Form -->
            <form @submit.prevent="submitForm" class="mt-6 space-y-4 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Name -->
                <div>
                  <label class="block font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="e.g. Rothana Cheng"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="e.g. rothana@example.com"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Phone -->
                <div>
                  <label class="block font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-1.5">
                    Phone / Telegram *
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="e.g. 012 345 678"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                  />
                </div>

                <!-- Subject -->
                <div>
                  <label class="block font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-1.5">
                    Inquiry Subject *
                  </label>
                  <select
                    v-model="form.subject"
                    class="w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                  >
                    <option value="" disabled>Select inquiry type</option>
                    <option value="Product Sizing & Football Boots">Football Boots & Sizing Consultation</option>
                    <option value="Order Tracking & Delivery">Order Status & Delivery Check</option>
                    <option value="KHQR & Payment Support">Bakong KHQR / Card Payment Verification</option>
                    <option value="Exchange & Returns">7-Day Size Exchange Request</option>
                    <option value="Wholesale & Team Kits">Team Kits & Bulk Sports Order</option>
                    <option value="Other Inquiries">General Question</option>
                  </select>
                </div>
              </div>

              <!-- Message -->
              <div>
                <label class="block font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-1.5">
                  Your Message *
                </label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  placeholder="Tell us what product you're looking for or your order reference number..."
                  class="w-full resize-none rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex items-center justify-center gap-2 rounded-2xl bg-lime-400 px-6 py-4 font-black uppercase tracking-wider text-black transition hover:bg-lime-300 hover:shadow-[0_0_25px_rgba(183,243,74,0.4)] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg v-if="loading" class="h-5 w-5 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ loading ? 'Transmitting Message...' : 'Send Message To 365 Team' }}</span>
                <span v-if="!loading">&rarr;</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= MAP SECTION ================= -->
    <section id="map-section" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      <div class="rounded-3xl border border-white/15 bg-[#0d1017]/90 overflow-hidden shadow-2xl">
        <div class="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2">
              <span class="h-4 w-1.5 rounded-full bg-lime-400 shadow-[0_0_10px_#b7f34a]"></span>
              <span class="text-xs font-black uppercase tracking-widest text-lime-400">Store Location</span>
            </div>
            <h2 class="text-2xl font-black uppercase text-white tracking-tight mt-1">
              Phnom Penh Showroom
            </h2>
            <p class="text-xs text-gray-400">
              #14, Street 271, ETEC Center, Sangkat Boeng Tumpun, Phnom Penh
            </p>
          </div>

          <div class="flex items-center gap-2">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              class="rounded-xl bg-lime-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-lime-300"
            >
              Open in Google Maps &rarr;
            </a>
          </div>
        </div>

        <div class="h-[360px] sm:h-[440px] w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4667.214145069196!2d104.88799717573434!3d11.562217244207105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951adb4d4041d%3A0x8a90e729f62ad800!2sETEC%20Center!5e1!3m2!1sen!2skh!4v1788167345842!5m2!1sen!2skh"
            class="h-full w-full border-0"
            style="filter: invert(90%) hue-rotate(180deg) contrast(1.1);"
            allowfullscreen
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </section>

    <!-- ================= INTERACTIVE FAQ ACCORDION ================= -->
    <section class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 border-t border-white/10">
      <div class="text-center mb-10">
        <span class="text-[10px] font-black uppercase tracking-widest text-lime-400 block mb-1">Got Questions?</span>
        <h2 class="text-3xl font-black uppercase tracking-tight text-white">
          Frequently Asked Questions
        </h2>
        <p class="text-xs text-gray-400 mt-1">Everything you need to know about purchasing with 365 Sport.</p>
      </div>

      <div class="space-y-3">
        <details
          v-for="(faq, idx) in faqs"
          :key="idx"
          class="group rounded-2xl border border-white/10 bg-[#0d1017]/85 p-5 backdrop-blur-xl transition hover:border-lime-400/40"
        >
          <summary class="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-white select-none">
            <span class="flex items-center gap-3">
              <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400 text-xs font-black">
                Q{{ idx + 1 }}
              </span>
              <span>{{ faq.question }}</span>
            </span>
            <span class="text-base font-black text-lime-400 transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <p class="mt-3.5 text-xs text-gray-300 leading-relaxed border-t border-white/10 pt-3.5 pl-9">
            {{ faq.answer }}
          </p>
        </details>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "~/composables/useToast";

definePageMeta({
  layout: "user",
});

const { success, error } = useToast();

const form = ref({
  name: "",
  email: "",
  phone: "",
  subject: "Product Sizing & Football Boots",
  message: "",
});

const submitted = ref(false);
const loading = ref(false);
const ticketId = ref("");
const lastSubmittedName = ref("");
const lastSubmittedPhone = ref("");
const lastSubmittedSubject = ref("");

const submitForm = () => {
  if (!form.value.name.trim()) {
    error("Name Required", "Please enter your full name.");
    return;
  }
  if (!form.value.email.trim() && !form.value.phone.trim()) {
    error("Contact Method Required", "Please enter your email or phone number.");
    return;
  }
  if (!form.value.message.trim()) {
    error("Message Required", "Please type your message before submitting.");
    return;
  }

  loading.value = true;

  setTimeout(() => {
    loading.value = false;
    submitted.value = true;
    ticketId.value = Math.random().toString(36).substring(2, 7).toUpperCase();
    lastSubmittedName.value = form.value.name;
    lastSubmittedPhone.value = form.value.phone;
    lastSubmittedSubject.value = form.value.subject;

    success("Message Transmitted!", "Our athlete support team will contact you shortly.");

    form.value = {
      name: "",
      email: "",
      phone: "",
      subject: "Product Sizing & Football Boots",
      message: "",
    };
  }, 1200);
};

const faqs = [
  {
    question: "How fast is delivery across Phnom Penh and provinces?",
    answer: "Orders placed before 2:00 PM are dispatched on the same day. Delivery takes 1–2 business days within Phnom Penh, and 2–3 business days for all 24 provinces across Cambodia via reliable courier networks (Virak Buntham, J&T, Kerry Express).",
  },
  {
    question: "How does the Bakong KHQR payment work?",
    answer: "When clicking Buy Now or checking out with KHQR, a dynamic QR code appears with the exact determined product cost. Open your Bakong app, ABA Mobile, ACLEDA, Wing, or any Cambodian banking app and scan to pay with 0% extra fees and instant verification.",
  },
  {
    question: "Can I exchange sizes if my sneakers or boots don't fit?",
    answer: "Yes! We offer a 7-day hassle-free size exchange guarantee. You can bring the unworn product with original tags and packaging to our Phnom Penh showroom at ETEC Center or coordinate an exchange via courier.",
  },
  {
    question: "Are all products 100% genuine and original?",
    answer: "Absolutely. All footwear, cleats, and sportswear sold on 365 Sport are 100% verified authentic, sourced directly from authorized regional distributors for Nike, Adidas, Puma, and Under Armour.",
  },
  {
    question: "Can I try on shoes before purchasing?",
    answer: "Yes, you are warmly invited to visit our flagship showroom at ETEC Center, Street 271 in Phnom Penh. Our sports footwear specialists will help you test turf grip, sprint cushioning, and size fit.",
  },
];
</script>