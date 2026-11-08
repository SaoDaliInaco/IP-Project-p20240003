import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProductsStore } from '../stores/products'

const sample = [
  {
    id: 1,
    name: 'Rose',
    description: '',
    price: 3,
    category: 'SINGLE_STEM',
    imageUrl: '',
    materials: [],
    isAvailable: true,
  },
]

describe('products store', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => vi.unstubAllGlobals())

  it('loads products and finds one by id', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(sample) }),
    )
    const store = useProductsStore()
    await store.fetchAll()
    expect(store.status).toBe('success')
    expect(store.byId(1)?.name).toBe('Rose')
    expect(store.byId(99)).toBeUndefined()
  })

  it('sets the error state when the server is down', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('failed')))
    const store = useProductsStore()
    await store.fetchAll()
    expect(store.status).toBe('error')
    expect(store.error).toContain('npm run api')
  })
})
