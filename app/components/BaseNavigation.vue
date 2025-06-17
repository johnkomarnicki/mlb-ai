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
  <header class="py-4 px-8">
    <nav class="container mx-auto flex flex-col md:flex-row gap-4 items-center">
      <NuxtLink to="/" class="flex gap-1 items-center">
        <span class="text-abbey-900 text-2xl font-bold">
          Edge AI Sports Model
        </span>
      </NuxtLink>
      <ul
        class="text-abbey-900 flex items-center gap-6 md:ml-auto text-xl font-bold capitalize"
      >
        <li class="text-base">
          <NuxtLink to="/">Home</NuxtLink>
        </li>
        <li class="text-base">
          <NuxtLink to="/mlb">MLB Scores Model</NuxtLink>
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
