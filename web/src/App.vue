<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
</script>

<template>
  <AppHeader />
  <p v-if="route.query.denied" class="banner" role="alert">
    You do not have access to that page. Sign in with an admin account.
  </p>
  <main class="container">
    <RouterView />
  </main>
  <footer class="site-footer">
    Lacey Studio · handmade flowers for Cambodian markets · M1 frontend prototype
  </footer>
</template>
