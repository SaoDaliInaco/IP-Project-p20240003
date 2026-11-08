import { describe, expect, it } from 'vitest'
import { validateAuth, validateCheckout, validateNote } from '../validation'

describe('validateAuth', () => {
  it('accepts a valid login', () => {
    expect(
      validateAuth({ fullName: '', email: 'a@b.co', password: 'longenough' }, 'login'),
    ).toEqual({})
  })
  it('rejects a bad email and short password', () => {
    const e = validateAuth({ fullName: '', email: 'nope', password: 'short' }, 'login')
    expect(e.email).toBeDefined()
    expect(e.password).toBeDefined()
  })
  it('requires a name when registering', () => {
    expect(
      validateAuth({ fullName: '', email: 'a@b.co', password: 'longenough' }, 'register').fullName,
    ).toBeDefined()
  })
})

describe('validateCheckout', () => {
  const now = new Date('2026-11-01T10:00')
  it('requires a future time', () => {
    expect(
      validateCheckout(
        { deliveryMethod: 'PICKUP', scheduledTime: '2026-10-01T10:00', address: '' },
        now,
      ).scheduledTime,
    ).toBeDefined()
  })
  it('requires an address for delivery only', () => {
    const base = { scheduledTime: '2026-11-02T10:00', address: '' }
    expect(validateCheckout({ ...base, deliveryMethod: 'PICKUP' }, now)).toEqual({})
    expect(validateCheckout({ ...base, deliveryMethod: 'DELIVERY' }, now).address).toBeDefined()
  })
})

describe('validateNote', () => {
  it('limits the note to 250 characters', () => {
    expect(validateNote('x'.repeat(250))).toBeUndefined()
    expect(validateNote('x'.repeat(251))).toBeDefined()
  })
})
