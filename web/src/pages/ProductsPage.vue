<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '../stores/products'
import { useProductFilters } from '../composables/useProductFilters'
import { CATEGORY_LABELS } from '../types'
import AsyncState from '../components/AsyncState.vue'
import ProductCard from '../components/ProductCard.vue'

const store = useProductsStore()
const { items, status, error } = storeToRefs(store)
const { search, category, visible } = useProductFilters(items)

onMounted(() => void store.fetchAll())
</script>

<template>
  <h1>Shop</h1>
  <div class="filters">
    <input
      v-model="search"
      type="search"
      placeholder="Search flowers…"
      aria-label="Search products"
    />
    <select v-model="category" aria-label="Filter by category">
      <option value="all">All categories</option>
      <option v-for="(label, key) in CATEGORY_LABELS" :key="key" :value="key">{{ label }}</option>
    </select>
  </div>
  <AsyncState
    :status="status"
    :error="error"
    :is-empty="visible.length === 0"
    empty-text="No flowers match your search."
    @retry="store.fetchAll()"
  >
    <p class="muted">{{ visible.length }} of {{ items.length }} products</p>
    <div class="grid">
      <ProductCard v-for="p in visible" :key="p.id" :product="p" />
    </div>
  </AsyncState>
</template>
