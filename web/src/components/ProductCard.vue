<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Product } from '../types'

const props = defineProps<{ product: Product }>()

const emoji = computed(() =>
  props.product.category === 'BOUQUET'
    ? '💐'
    : props.product.category === 'SINGLE_STEM'
      ? '🌹'
      : '🎀',
)
</script>

<template>
  <RouterLink
    :to="{ name: 'product-detail', params: { id: product.id } }"
    class="card product-card"
  >
    <div class="thumb" :class="`thumb-${product.category}`" aria-hidden="true">{{ emoji }}</div>
    <div class="card-body">
      <h3>{{ product.name }}</h3>
      <p class="muted clamp">{{ product.description }}</p>
      <p class="price">${{ product.price.toFixed(2) }}</p>
    </div>
  </RouterLink>
</template>
