import { NOTE_MAX, type DeliveryMethod } from './types'

export type Errors<T> = Partial<Record<keyof T, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface AuthForm {
  fullName: string
  email: string
  password: string
}

export function validateAuth(form: AuthForm, mode: 'login' | 'register'): Errors<AuthForm> {
  const errors: Errors<AuthForm> = {}
  if (mode === 'register' && form.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name (at least 2 characters).'
  }
  if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  return errors
}

export interface CheckoutForm {
  deliveryMethod: DeliveryMethod
  scheduledTime: string
  address: string
}

export function validateCheckout(form: CheckoutForm, now = new Date()): Errors<CheckoutForm> {
  const errors: Errors<CheckoutForm> = {}
  if (!form.scheduledTime) {
    errors.scheduledTime = 'Choose a pickup or delivery time.'
  } else {
    const when = new Date(form.scheduledTime)
    if (Number.isNaN(when.getTime()) || when.getTime() <= now.getTime()) {
      errors.scheduledTime = 'The time must be in the future.'
    }
  }
  if (form.deliveryMethod === 'DELIVERY' && form.address.trim().length < 5) {
    errors.address = 'Enter a delivery address (at least 5 characters).'
  }
  return errors
}

export function validateNote(note: string): string | undefined {
  if (note.length > NOTE_MAX) return `Keep the note under ${NOTE_MAX} characters.`
  return undefined
}
