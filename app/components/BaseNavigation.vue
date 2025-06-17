<script setup lang="ts">
import type { DropdownMenuItem } from "#ui/types";

const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const toast = useToast();

console.log(user.value);

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
  <header class="py-4 px-8 border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
    <nav class="container mx-auto flex items-center">
      <NuxtLink to="/" class="flex gap-2 items-center">
        <div class="w-10 h-10 bg-gradient-to-br from-dodgeroll-gold-500 to-dodgeroll-gold-600 rounded-lg flex items-center justify-center">
          <UIcon name="i-mdi-brain" class="text-white text-xl" />
        </div>
        <span class="text-2xl font-bold text-dire-wolf">Edge AI Sports</span>
      </NuxtLink>
      <ul class="flex items-center gap-6 ml-auto text-lg font-semibold">
        <li>
          <NuxtLink 
            to="/" 
            class="text-dire-wolf hover:text-dodgeroll-gold-600 transition-colors duration-200"
          >
            Home
          </NuxtLink>
        </li>
        <li v-if="!user">
          <UButton 
            to="/login" 
            color="primary" 
            class="bg-dodgeroll-gold-500 hover:bg-dodgeroll-gold-600 text-white font-semibold"
          >
            Login
          </UButton>
        </li>

        <UDropdownMenu
          v-if="user"
          :items="items"
          :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8,
          }"
        >
          <UAvatar size="md" :alt="user?.email" class="ring-2 ring-dodgeroll-gold-500" />
          <template #account="{ item }">
            <div class="truncate text-left">
              <p class="text-sm text-gray-500">Signed in as</p>
              <p class="truncate font-medium text-dire-wolf">
                {{ item.label }}
              </p>
            </div>
          </template>
        </UDropdownMenu>
      </ul>
    </nav>
  </header>
</template>