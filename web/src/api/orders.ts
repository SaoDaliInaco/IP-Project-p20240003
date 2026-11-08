import { request, jsonBody } from './http'
import type { NewOrderInput, Order, OrderItem, OrderStatus } from '../types'

const SORT = '_sort=scheduledTime&_order=asc&_embed=orderItems'

export const ordersApi = {
  listForUser: (userId: number) => request<Order[]>(`/orders?userId=${userId}&${SORT}`),
  listAll: () => request<Order[]>(`/orders?${SORT}`),
  create: (input: NewOrderInput) =>
    request<Order>('/orders', {
      method: 'POST',
      ...jsonBody({ ...input, status: 'PENDING', createdAt: new Date().toISOString() }),
    }),
  createItem: (item: Omit<OrderItem, 'id'>) =>
    request<OrderItem>('/orderItems', { method: 'POST', ...jsonBody(item) }),
  setStatus: (id: number, status: OrderStatus) =>
    request<Order>(`/orders/${id}`, { method: 'PATCH', ...jsonBody({ status }) }),
}
