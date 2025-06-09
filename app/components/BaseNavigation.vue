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
  <header class="py-4 px-8 border-b">
    <nav class="container mx-auto flex items-center">
      <NuxtLink to="/" class="flex gap-1 items-center">
        <span class="text-3xl font-bold">MLB AI</span>
      </NuxtLink>
      <ul class="flex items-center gap-6 ml-auto text-xl font-bold capitalize">
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>
        <li v-if="!user">
          <NuxtLink to="/login">Login</NuxtLink>
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
          <UAvatar size="md" :alt="user?.email" />
          <template #account="{ item }">
            <div class="truncate text-left">
              <p>Signed in as</p>
              <p class="truncate font-medium">
                {{ item.label }}
              </p>
            </div>
          </template>
        </UDropdownMenu>
      </ul>
    </nav>
  </header>
</template>
