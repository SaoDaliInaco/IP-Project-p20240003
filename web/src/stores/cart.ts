import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CartLine } from '../types'

const KEY = 'flower-cart'

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const lines = ref<CartLine[]>(load())
  const count = computed(() => lines.value.reduce((n, l) => n + l.quantity, 0))
  const total = computed(() => lines.value.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0))

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines.value))
    } catch {
      /* ignore */
    }
  }
  function add(line: CartLine) {
    lines.value.push(line)
    save()
  }
  function remove(index: number) {
    lines.value.splice(index, 1)
    save()
  }
  function clear() {
    lines.value = []
    save()
  }

  return { lines, count, total, add, remove, clear }
})
