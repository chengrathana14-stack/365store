<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAdminStore } from "~/composables/useAdminStore";
import { useToast } from "~/composables/useToast";
import type { User } from "~/type/product";

definePageMeta({
  layout: "admin",
});

const { addUser } = useAdminStore();
const { success, error } = useToast();

const showPassword = ref(false);

const user = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "Customer",
  status: "Active",
  address: "",
  city: "Phnom Penh",
  country: "Cambodia",
});

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
});

const validateForm = () => {
  errors.firstName = "";
  errors.lastName = "";
  errors.email = "";
  errors.phone = "";
  errors.password = "";

  let valid = true;

  if (!user.firstName.trim()) {
    errors.firstName = "First name is required.";
    valid = false;
  }

  if (!user.lastName.trim()) {
    errors.lastName = "Last name is required.";
    valid = false;
  }

  if (!user.email.trim()) {
    errors.email = "Email is required.";
    valid = false;
  }

  if (!user.phone.trim()) {
    errors.phone = "Phone number is required.";
    valid = false;
  }

  if (!user.password.trim()) {
    errors.password = "Password is required.";
    valid = false;
  }

  return valid;
};

const createUser = () => {
  if (!validateForm()) {
    error("Validation Error", "Please fill in all required user fields.");
    return;
  }

  const fullName = `${user.firstName.trim()} ${user.lastName.trim()}`;

  const newUser: User = {
    id: Math.floor(Math.random() * 9000) + 1000,
    name: fullName,
    email: user.email.trim(),
    phone: user.phone.trim(),
    role: user.role as any,
    status: user.status as any,
    orders: 0,
    spent: 0,
    lastOrder: "None",
    joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
  };

  addUser(newUser);
  success("User Created Successfully!", `Account for ${fullName} (${user.role}) has been activated.`);
  navigateTo("/admin/users");
};

const cancel = () => {
  navigateTo("/admin/users");
};
</script>

<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <NuxtLink
        to="/admin/users"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition mb-2"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Users</span>
      </NuxtLink>

      <div class="mt-1">
        <h1 class="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
          Create User
        </h1>
        <p class="text-xs text-gray-400 mt-0.5">
          Add a new customer account or store administrator to the platform
        </p>
      </div>
    </div>

    <!-- Form Grid -->
    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Main Form Columns -->
      <div class="space-y-4 lg:col-span-2">
        <!-- Personal Information -->
        <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs">
          <div class="mb-4 border-b border-gray-100 pb-3">
            <h2 class="text-sm font-bold text-gray-900">
              Personal Information
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">
              Contact credentials and primary account details
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <!-- First Name -->
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                First Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="user.firstName"
                type="text"
                placeholder="e.g. Dara"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.firstName }"
              />
              <p v-if="errors.firstName" class="mt-1 text-[11px] text-red-500">
                {{ errors.firstName }}
              </p>
            </div>

            <!-- Last Name -->
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Last Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="user.lastName"
                type="text"
                placeholder="e.g. Sok"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.lastName }"
              />
              <p v-if="errors.lastName" class="mt-1 text-[11px] text-red-500">
                {{ errors.lastName }}
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                v-model="user.email"
                type="email"
                placeholder="dara@example.com"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-[11px] text-red-500">
                {{ errors.email }}
              </p>
            </div>

            <!-- Phone -->
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Phone Number <span class="text-red-500">*</span>
              </label>
              <input
                v-model="user.phone"
                type="tel"
                placeholder="+855 12 345 678"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.phone }"
              />
              <p v-if="errors.phone" class="mt-1 text-[11px] text-red-500">
                {{ errors.phone }}
              </p>
            </div>
          </div>
        </div>

        <!-- Account Security & Permissions -->
        <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs">
          <div class="mb-4 border-b border-gray-100 pb-3">
            <h2 class="text-sm font-bold text-gray-900">
              Account Security & Role
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">
              Access permissions and login password setup
            </p>
          </div>

          <div class="space-y-4">
            <!-- Password -->
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Temporary Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="user.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter secure password"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 pr-16 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  :class="{ 'border-red-500': errors.password }"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-700"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? "Hide" : "Show" }}
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-[11px] text-red-500">
                {{ errors.password }}
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <!-- Role -->
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Role Permission
                </label>
                <select
                  v-model="user.role"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Customer">Customer</option>
                  <option value="Admin">Administrator (Full Access)</option>
                </select>
              </div>

              <!-- Status -->
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Initial Status
                </label>
                <select
                  v-model="user.status"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Blocked">Suspended / Blocked</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs">
          <div class="mb-4 border-b border-gray-100 pb-3">
            <h2 class="text-sm font-bold text-gray-900">
              Address Information
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">
              Default shipping and billing address
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                Street Address
              </label>
              <textarea
                v-model="user.address"
                rows="2"
                placeholder="Street address, apartment, or suite..."
                class="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  City
                </label>
                <input
                  v-model="user.city"
                  type="text"
                  placeholder="Phnom Penh"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                  Country
                </label>
                <input
                  v-model="user.country"
                  type="text"
                  placeholder="Cambodia"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (Live Account Preview & Submit) -->
      <div class="space-y-4">
        <!-- Account Preview -->
        <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs">
          <h3 class="font-bold text-gray-900 text-sm">Account Preview</h3>
          <p class="text-xs text-gray-400 mt-0.5">How this user profile displays in admin</p>

          <div class="mt-4 flex flex-col items-center text-center rounded-lg bg-gray-50/60 p-4 border border-gray-100">
            <!-- Avatar initial box -->
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-lg font-black text-white shadow-2xs">
              {{
                user.firstName || user.lastName
                  ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                  : "?"
              }}
            </div>

            <h4 class="mt-3 font-bold text-xs text-gray-900">
              {{ user.firstName || user.lastName
                ? `${user.firstName} ${user.lastName}`
                : "New Account"
              }}
            </h4>

            <p class="text-[11px] text-gray-400 break-all mt-0.5">
              {{ user.email || "user@email.com" }}
            </p>

            <div class="mt-3 flex gap-2">
              <span
                class="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                :class="user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'"
              >
                {{ user.role }}
              </span>

              <span
                class="rounded-md px-2 py-0.5 text-[10px] font-semibold"
                :class="user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'"
              >
                {{ user.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Submit Actions -->
        <div class="rounded-md border border-gray-100 bg-white p-5 shadow-xs">
          <h3 class="font-bold text-gray-900 text-sm">Save Changes</h3>
          <p class="text-xs text-gray-400 mt-0.5">Publish new user to the system</p>

          <div class="mt-4 space-y-2">
            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
              @click="createUser"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create User Account</span>
            </button>

            <button
              type="button"
              class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
              @click="cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>