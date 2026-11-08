<script setup lang="ts">
import type { LoadStatus } from '../types'

defineProps<{
  status: LoadStatus
  error: string | null
  isEmpty: boolean
  emptyText?: string
}>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="status === 'idle' || status === 'loading'" class="state" role="status">
    <span class="spinner" aria-hidden="true"></span> Loading…
  </div>
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
