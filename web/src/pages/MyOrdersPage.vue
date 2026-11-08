<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrdersStore } from '../stores/orders'
import { useProductsStore } from '../stores/products'
import { useSessionStore } from '../stores/session'
import AsyncState from '../components/AsyncState.vue'
import OrderCard from '../components/OrderCard.vue'

const store = useOrdersStore()
const products = useProductsStore()
const session = useSessionStore()
const { orders, status, error } = storeToRefs(store)

const nameOf = (id: number) => products.byId(id)?.name ?? `Product #${id}`

function load() {
  if (session.user) void store.fetchMine(session.user.id)
  if (products.status !== 'success') void products.fetchAll()
}
onMounted(load)
</script>

<template>
  <h1>My orders</h1>
  <AsyncState
    :status="status"
    :error="error"
    :is-empty="orders.length === 0"
    empty-text="You have no orders yet."
    @retry="load"
  >
    <template #empty>
      <RouterLink :to="{ name: 'products' }" class="btn btn-primary">Start shopping</RouterLink>
    </template>
    <div class="list">
      <OrderCard v-for="o in orders" :key="o.id" :order="o" :name-of="nameOf" />
    </div>
  </AsyncState>
</template>
