import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { productsApi } from '../api/products'
import type { LoadStatus, Product } from '../types'

export const useProductsStore = defineStore('products', () => {
  const items = ref<Product[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref<string | null>(null)

  const byId = computed(() => (id: number) => items.value.find((p) => p.id === id))

  async function fetchAll() {
    status.value = 'loading'
    error.value = null
    try {
      items.value = await productsApi.list()
      status.value = 'success'
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Something went wrong.'
      status.value = 'error'
    }
  }

  return { items, status, error, byId, fetchAll }
})
