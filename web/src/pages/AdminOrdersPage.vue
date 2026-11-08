<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrdersStore } from '../stores/orders'
import { useProductsStore } from '../stores/products'
import AsyncState from '../components/AsyncState.vue'
import OrderCard from '../components/OrderCard.vue'
import type { OrderStatus } from '../types'

const store = useOrdersStore()
const products = useProductsStore()
const { orders, status, error } = storeToRefs(store)
const actionError = ref<string | null>(null)

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'PREPARING',
  PREPARING: 'READY',
  READY: 'COMPLETED',
}
const nameOf = (id: number) => products.byId(id)?.name ?? `Product #${id}`

function load() {
  void store.fetchAll()
  if (products.status !== 'success') void products.fetchAll()
}
onMounted(load)

async function advance(id: number, next: OrderStatus) {
  actionError.value = null
  try {
    await store.setStatus(id, next)
  } catch (e) {
    actionError.value = e instanceof Error ? e.message : 'Could not update the order.'
  }
}
</script>

<template>
  <h1>Manage orders</h1>
  <p v-if="actionError" class="error" role="alert">{{ actionError }}</p>
  <AsyncState
    :status="status"
    :error="error"
    :is-empty="orders.length === 0"
    empty-text="No orders yet."
    @retry="load"
  >
    <div class="list">
      <OrderCard v-for="o in orders" :key="o.id" :order="o" :name-of="nameOf">
        <button
          v-if="NEXT[o.status]"
          class="btn btn-primary"
          type="button"
          @click="advance(o.id, NEXT[o.status]!)"
        >
          Mark as {{ NEXT[o.status] }}
        </button>
      </OrderCard>
    </div>
  </AsyncState>
</template>
