import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ordersApi } from '../api/orders'
import type { CartLine, LoadStatus, NewOrderInput, Order, OrderStatus } from '../types'

function messageOf(e: unknown) {
  return e instanceof Error ? e.message : 'Something went wrong.'
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref<string | null>(null)

  async function load(fetcher: () => Promise<Order[]>) {
    status.value = 'loading'
    error.value = null
    try {
      orders.value = await fetcher()
      status.value = 'success'
    } catch (e) {
      error.value = messageOf(e)
      status.value = 'error'
    }
  }

  // Mock API: the client filters by userId. The real API must check ownership on the server (week 7).
  const fetchMine = (userId: number) => load(() => ordersApi.listForUser(userId))
  const fetchAll = () => load(() => ordersApi.listAll())

  async function place(input: NewOrderInput, lines: CartLine[]) {
    const order = await ordersApi.create(input)
    for (const line of lines) {
      await ordersApi.createItem({ ...line, orderId: order.id })
    }
    return order
  }

  async function setStatus(id: number, next: OrderStatus) {
    const updated = await ordersApi.setStatus(id, next)
    const target = orders.value.find((o) => o.id === id)
    if (target) target.status = updated.status
  }

  return { orders, status, error, fetchMine, fetchAll, place, setStatus }
})
