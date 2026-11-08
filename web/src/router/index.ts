import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '../stores/session'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    adminOnly?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
      meta: { title: 'Home' },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../pages/ProductsPage.vue'),
      meta: { title: 'Shop' },
    },
    {
      path: '/products/:id(\\d+)',
      name: 'product-detail',
      component: () => import('../pages/ProductDetailPage.vue'),
      props: true,
      meta: { title: 'Bouquet details' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
      meta: { title: 'Sign in' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../pages/CartPage.vue'),
      meta: { requiresAuth: true, title: 'Cart & checkout' },
    },
    {
      path: '/my-orders',
      name: 'my-orders',
      component: () => import('../pages/MyOrdersPage.vue'),
      meta: { requiresAuth: true, title: 'My orders' },
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('../pages/AdminOrdersPage.vue'),
      meta: { requiresAuth: true, adminOnly: true, title: 'Manage orders' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFoundPage.vue'),
      meta: { title: 'Not found' },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const session = useSessionStore()
  if (to.meta.requiresAuth && !session.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.adminOnly && !session.isAdmin) {
    return { name: 'home', query: { denied: '1' } }
  }
  return true
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'Lacey Studio'} · Handmade Flower Shop`
})

export default router
