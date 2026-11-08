import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import { useSessionStore } from '../stores/session'

describe('router guards', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    localStorage.clear()
    await router.push('/')
  })

  it('sends anonymous users from /cart to login', async () => {
    await router.push('/cart')
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('blocks customers from the admin page', async () => {
    const session = useSessionStore()
    session.user = { id: 1, email: 'c@x.co', fullName: 'C', role: 'CUSTOMER', createdAt: '' }
    await router.push('/admin/orders')
    expect(router.currentRoute.value.name).toBe('home')
    expect(router.currentRoute.value.query.denied).toBe('1')
  })

  it('lets admins in', async () => {
    const session = useSessionStore()
    session.user = { id: 2, email: 'a@x.co', fullName: 'A', role: 'ADMIN', createdAt: '' }
    await router.push('/admin/orders')
    expect(router.currentRoute.value.name).toBe('admin-orders')
  })

  it('only matches digits for the detail route', async () => {
    await router.push('/products/abc')
    expect(router.currentRoute.value.name).toBe('not-found')
    await router.push('/products/3')
    expect(router.currentRoute.value.name).toBe('product-detail')
  })
})
