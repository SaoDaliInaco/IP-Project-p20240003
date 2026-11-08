import { ref, computed, type Ref } from 'vue'
import type { Category, Product } from '../types'

export function useProductFilters(products: Ref<Product[]>) {
  const search = ref('')
  const category = ref<Category | 'all'>('all')

  const visible = computed(() => {
    const q = search.value.trim().toLowerCase()
    return products.value.filter(
      (p) =>
        (category.value === 'all' || p.category === category.value) &&
        (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    )
  })

  return { search, category, visible }
}
