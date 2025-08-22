<script setup lang="ts">
import type { DropdownMenuItem } from "#ui/types";

const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const toast = useToast();
const route = useRoute();

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Check if we're on the home page
const isHomePage = computed(() => route.path === "/");

const items: DropdownMenuItem[][] = [
  [
    {
      label: user.value?.email || "",
      slot: "account",
      disabled: true,
    },
    // {
    //   label: "My Profile",
    //   click: toProfile,
    // },
    // {
    //   label: "Profile Settings",
    //   to: "/profile/settings",
    // },
  ],
  [
    {
      label: "Sign out",
      icon: "i-mdi-logout",
      onSelect: logout,
    },
  ],
];

// function toProfile() {
//   navigateTo(`/profile/${user.value?.id}`);
// }

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

async function logout() {
  console.log("hello");
  try {
    const { error } = await auth.signOut();
    if (error) throw error;
    navigateTo("/login");
  } catch (error: any) {
    toast.add({
      color: "error",
      title: error.message,
    });
  }
}
</script>

<template>
  <header
    :class="
      isHomePage
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900'
        : 'bg-white border-b border-gray-200'
    "
  >
    <nav class="container mx-auto flex items-center justify-between py-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2" @click="closeMobileMenu">
        <div
          class="w-8 h-8 bg-white rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-gray-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
            />
          </svg>
        </div>
        <span
          class="text-xl font-bold"
          :class="isHomePage ? 'text-white' : 'text-gray-900'"
          >Edge AI Bets</span
        >
      </NuxtLink>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex items-center space-x-8">
        <NuxtLink
          to="/dashboard/mlb"
          class="transition-colors"
          :class="
            isHomePage
              ? 'text-gray-300 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          "
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/mlb"
          class="transition-colors"
          :class="
            isHomePage
              ? 'text-gray-300 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          "
        >
          MLB Predictions
        </NuxtLink>
        <!-- <NuxtLink to="#features" class="transition-colors" :class="isHomePage ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'"> How It Works </NuxtLink> -->
      </div>

      <!-- CTA Buttons -->
      <div class="flex items-center space-x-4">
        <UDropdownMenu
          v-if="user"
          :items="items"
          :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8,
          }"
        >
          <UAvatar size="lg" :alt="user?.email" />
          <template #account="{ item }">
            <div class="truncate text-left">
              <p class="text-sm text-gray-500">Signed in as</p>
              <p class="truncate font-medium text-gray-900">
                {{ item.label }}
              </p>
            </div>
          </template>
        </UDropdownMenu>

        <UButton
          v-else
          color="primary"
          size="md"
          to="/login"
          class="hidden sm:block"
        >
          Get Started
        </UButton>

        <!-- Mobile menu button -->
        <UButton
          variant="ghost"
          color="primary"
          size="md"
          class="lg:hidden"
          :class="isHomePage ? 'text-white' : 'text-gray-900'"
          :icon="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
          @click="toggleMobileMenu"
        />
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-48 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="max-h-48 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-if="isMobileMenuOpen" class="lg:hidden overflow-hidden">
        <div class="container mx-auto px-4 pt-4 pb-4 space-y-4">
          <NuxtLink
            to="/"
            class="block transition-colors py-2"
            :class="
              isHomePage
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            "
            @click="closeMobileMenu"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/mlb"
            class="block transition-colors py-2"
            :class="
              isHomePage
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            "
            @click="closeMobileMenu"
          >
            MLB Predictions
          </NuxtLink>
          <div
            v-if="!user"
            class="pt-2"
            :class="
              isHomePage
                ? 'border-t border-gray-700'
                : 'border-t border-gray-300'
            "
          >
            <UButton
              :color="isHomePage ? 'white' : 'gray'"
              size="sm"
              to="/login"
              class="w-full"
              @click="closeMobileMenu"
            >
              Get Started
            </UButton>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
