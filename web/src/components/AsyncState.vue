<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import type { LoadStatus } from '../types'
import LoadingState from './LoadingState.vue'

const props = defineProps<{
  status: LoadStatus
  error: string | null
  isEmpty: boolean
  emptyText?: string
  skeleton?: 'cards' | 'list' | 'none'
  skeletonRows?: number
}>()
defineEmits<{ retry: [] }>()

// Show the loading page only when loading is slow. A fast response never flashes it.
const SLOW_MS = 250
const slow = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.status,
  (status) => {
    clearTimeout(timer)
    slow.value = false
    if (status === 'idle' || status === 'loading') {
      timer = setTimeout(() => {
        slow.value = true
      }, SLOW_MS)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <template v-if="status === 'idle' || status === 'loading'">
    <div v-if="!slow" class="loading-wait" aria-hidden="true"></div>
    <LoadingState v-else :variant="skeleton ?? 'cards'" :rows="skeletonRows" />
  </template>
  <div v-else-if="status === 'error'" class="state state-error" role="alert">
    <p>{{ error }}</p>
    <button class="btn btn-ghost" type="button" @click="$emit('retry')">Try again</button>
  </div>
  <div v-else-if="isEmpty" class="state">
    <p>{{ emptyText ?? 'Nothing here yet.' }}</p>
    <slot name="empty" />
  </div>
  <slot v-else />
</template>
