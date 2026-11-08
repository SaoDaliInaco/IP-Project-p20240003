export type Role = 'CUSTOMER' | 'ADMIN'
export type Category = 'BOUQUET' | 'SINGLE_STEM' | 'ADD_ON'
export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
export type DeliveryMethod = 'PICKUP' | 'DELIVERY'
export type CardType = 'NONE' | 'STANDARD' | 'PREMIUM'
export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export interface User {
  id: number
  email: string
  fullName: string
  role: Role
  createdAt: string
}

/** Mock API only: json-server stores a plain password. The real NestJS API (week 7) hashes it with Argon2. */
export interface DbUser extends User {
  password: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: Category
  imageUrl: string
  materials: string[]
  isAvailable: boolean
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  unitPrice: number
  wrappingColor: string
  ribbonColor: string
  cardType: CardType
  customNote: string
}

export interface Order {
  id: number
  userId: number
  status: OrderStatus
  deliveryMethod: DeliveryMethod
  scheduledTime: string
  totalPrice: number
  createdAt: string
  orderItems?: OrderItem[]
}

export interface CartLine {
  productId: number
  quantity: number
  unitPrice: number
  wrappingColor: string
  ribbonColor: string
  cardType: CardType
  customNote: string
}

export type NewOrderInput = Pick<
  Order,
  'userId' | 'deliveryMethod' | 'scheduledTime' | 'totalPrice'
>

export const CATEGORY_LABELS: Record<Category, string> = {
  BOUQUET: 'Bouquets',
  SINGLE_STEM: 'Single stems',
  ADD_ON: 'Add-ons',
}
export const WRAPPING_COLORS = ['Blush', 'Cream', 'Kraft', 'Lavender'] as const
export const RIBBON_COLORS = ['None', 'Pink', 'White', 'Navy'] as const
export const CARD_PRICES: Record<CardType, number> = { NONE: 0, STANDARD: 1, PREMIUM: 2.5 }
export const RIBBON_PRICE = 1.5
export const NOTE_MAX = 250
