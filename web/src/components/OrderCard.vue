<script setup lang="ts">
import type { Order } from '../types'

defineProps<{ order: Order; nameOf: (productId: number) => string }>()
</script>

<template>
  <article class="card order">
    <header class="row">
      <h3>Order #{{ order.id }}</h3>
      <span class="badge" :class="`badge-${order.status}`">{{ order.status }}</span>
    </header>
    <p class="muted small">
      {{ order.deliveryMethod === 'PICKUP' ? 'Pickup' : 'Delivery' }} ·
      {{ new Date(order.scheduledTime).toLocaleString() }}
    </p>
    <ul class="items">
      <li v-for="item in order.orderItems ?? []" :key="item.id">
        {{ nameOf(item.productId) }} × {{ item.quantity }}
        <span v-if="item.customNote" class="muted small"> — “{{ item.customNote }}”</span>
      </li>
    </ul>
    <p class="price">${{ order.totalPrice.toFixed(2) }}</p>
    <slot />
  </article>
</template>
