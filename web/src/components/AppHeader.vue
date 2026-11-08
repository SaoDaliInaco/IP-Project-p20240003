<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useSessionStore } from '../stores/session'
import { useCartStore } from '../stores/cart'

const session = useSessionStore()
const cart = useCartStore()
const router = useRouter()

function logout() {
  session.logout()
  void router.push({ name: 'home' })
}
</script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="brand">Lacey Studio</RouterLink>
    <nav aria-label="Main">
      <RouterLink :to="{ name: 'products' }">Shop</RouterLink>
      <RouterLink v-if="session.isLoggedIn" :to="{ name: 'my-orders' }">My orders</RouterLink>
      <RouterLink v-if="session.isAdmin" :to="{ name: 'admin-orders' }">Manage orders</RouterLink>
    </nav>
    <div class="header-actions">
      <RouterLink :to="{ name: 'cart' }" class="cart-link">Cart ({{ cart.count }})</RouterLink>
      <template v-if="session.user">
        <span class="muted hide-sm">{{ session.user.fullName }}</span>
        <button class="btn btn-ghost" type="button" @click="logout">Log out</button>
      </template>
      <RouterLink v-else :to="{ name: 'login' }" class="btn btn-primary">Sign in</RouterLink>
    </div>
  </header>
</template>
