<template>
  <UButton
    v-if="!isPending"
    @click="$emit('select')"
    :variant="isSelected ? 'solid' : 'ghost'"
    :color="isSelected ? 'primary' : 'neutral'"
    class="team-slot"
    :class="[
      sizeClasses,
      isSelected && 'ring-2 ring-primary ring-offset-2'
    ]"
    :disabled="!team"
  >
    <div class="flex items-center gap-2">
      <span class="seed-badge">{{ team?.seed }}</span>
      <UAvatar
        :src="`https://www.mlbstatic.com/team-logos/${team?.id}.svg`"
        :alt="team?.name"
        :size="avatarSize"
        :ui="{ root: 'bg-white/75 p-1' }"
      />
      <span class="font-semibold">{{ team?.name }}</span>
    </div>
  </UButton>
  <div
    v-else
    class="pending-slot"
    :class="sizeClasses"
  >
    <div class="flex items-center gap-2">
      <span class="seed-badge opacity-50">?</span>
      <div class="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
      <span class="text-gray-400">TBD</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Team {
  id: number
  name: string
  seed: number
  abbreviation?: string
}

interface Props {
  team?: Team
  isSelected?: boolean
  isPending?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isPending: false,
  size: 'md'
})

defineEmits<{
  select: []
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
    xl: 'px-5 py-4 text-xl'
  }
  return sizes[props.size]
})

const avatarSize = computed(() => {
  const sizes = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
    xl: 'lg' as const
  }
  return sizes[props.size]
})
</script>

<style scoped>
.team-slot {
  width: 100%;
  justify-content: flex-start;
  transition: all 200ms;
}

.team-slot:hover:not(:disabled) {
  transform: scale(1.05);
}

.pending-slot {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px dashed #d1d5db;
  border-radius: 0.375rem;
}

.seed-badge {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #f3f4f6;
  font-size: 0.75rem;
  font-weight: bold;
}

.team-slot:hover .seed-badge {
  background-color: rgb(var(--color-primary-500));
  color: white;
}
</style>