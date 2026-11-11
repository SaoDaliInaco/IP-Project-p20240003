<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'cards' | 'list' | 'none'
  rows?: number
}>()

// "cards" shows rows of 4 product placeholders, "list" shows order-row placeholders,
// "none" shows only the message.
const count = computed(() => {
  if (props.variant === 'list') return props.rows ?? 3
  if (props.variant === 'none') return 0
  return (props.rows ?? 2) * 4
})
</script>

<template>
  <section class="loading" role="status" aria-live="polite">
    <p class="loading-title">Loading fresh blooms…</p>
    <p class="loading-sub">Just a moment while we set up the shop.</p>

    <div v-if="variant === 'list'" class="sk-list" aria-hidden="true">
      <div v-for="n in count" :key="n" class="card sk-row" :style="{ animationDelay: `${n * 0.12}s` }">
        <div class="sk-bar sk-w-40"></div>
        <div class="sk-bar sk-light sk-w-60"></div>
        <div class="sk-bar sk-w-20"></div>
      </div>
    </div>

    <div v-else-if="variant !== 'none'" class="grid sk-grid" aria-hidden="true">
      <div
        v-for="n in count"
        :key="n"
        class="card sk-card"
        :style="{ animationDelay: `${(n % 4) * 0.12}s` }"
      >
        <div class="sk-img"></div>
        <div class="sk-body">
          <div class="sk-bar sk-w-70"></div>
          <div class="sk-bar sk-light sk-w-90"></div>
          <div class="sk-bar sk-w-30"></div>
        </div>
      </div>
    </div>
  </section>
</template>
